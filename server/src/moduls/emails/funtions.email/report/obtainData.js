const { formatDate } = require("../../../../../services/functions/helpers");
const { emailSend, sendNotificationEmail } = require("../../../../../services/email/emailService");
const { generarReportePDF, generarResumenPDF } = require("./generatepdf");
const pool = require("../../../../../connectionBD/db");
const { json } = require("express");
const { formatPesos } = require("../../../../../services/functions/helpers");

const obtainData = async (query) => {

  try {
    const [results] = query
    if (results.length > 0) {
      var actualDate = new Date();
      const formattedResults = results.map((result) => ({
        ...result,
        fecpago: formatDate(result.fecpago),
        total: formatPesos(result.total),
        retencion: formatPesos(result.retencion),
        tot: formatPesos(result.tot),
        pagfac: formatPesos(result.pagfac),
        pagtot: formatPesos(result.pagtot),
        fecemi: formatDate(actualDate),
      }));

      const groupedResults = formattedResults.reduce((acc, current) => {
        if (!acc[current.nit]) acc[current.nit] = [];
        acc[current.nit].push(current);
        return acc;
      }, {});

      const emailsSent = [];

      await Promise.all(
        Object.keys(groupedResults).map(async (nit) => {
          const data = groupedResults[nit];
          try {
          const pdfPath = await generarReportePDF(data);
          await emailSend(data, pdfPath);
          emailsSent.push(...data);
          await addStatusEmails(nit);
          console.debug("Correo enviado con éxito.");
          } catch (error) {
            console.error(`Error al enviar correo para NIT ${nit}:`, error);
          }
        })
      );

      if (emailsSent.length > 0) {
      const summaryPdfBuffer = await generarResumenPDF(emailsSent);
      await sendNotificationEmail(emailsSent.length, summaryPdfBuffer);
      }
    } else {
      return json({ message: "No hay datos para el reporte." });
    }
  } catch (error) {
    return json({ message: "Error al obtener los datos." }, error);
  }
};

function addStatusEmails (nit)  {
  const query = `UPDATE pagopro SET send_email = true WHERE nit = ?`;
  const result = pool.query(query, [nit]);
  if (result.affectedRows === 0) {
      return json({menssage: "No se actualizó el estado de los correos pendientes."});
  } else {
      return json({menssage: "Correos pendientes actualizados con éxito."});
  }

}

module.exports = { obtainData };

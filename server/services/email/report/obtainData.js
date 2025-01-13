const { formatDate, formatPesos } = require("../../functions/helpers");
const { emailSend, sendNotificationEmail } = require("../emailService");
const { generarReportePDF, generarResumenPDF } = require("./generatepdf");
const pool = require("../../../connectionBD/db");

async function obtainData (query) {
  try {
    const [rows] = query;
    if (rows.length > 0) {
      const actualDate = new Date();
      const formattedResults = rows.map((result) => ({
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
      const emailPromises = Object.keys(groupedResults).map(async (nit) => {
        const data = groupedResults[nit];
        try {
          const pdfPath = await generarReportePDF(data);
          await emailSend(data, pdfPath);
          emailsSent.push(...data);
          await addStatusEmails(nit, data.map(record => record.fechas));
          console.log('Datos de la consulta: ', data);
        } catch (error) {
          throw new Error("Error al enviar correo para NIT " + nit);
        }
      });

      await Promise.all(emailPromises);

      if (emailsSent.length > 0) {
        const summaryPdfBuffer = await generarResumenPDF(emailsSent);
        await sendNotificationEmail(emailsSent.length, summaryPdfBuffer);
      }
    }
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    throw new Error("Error al obtener los datos.");
  }
}

async function addStatusEmails(nit, fecha) {
  const query = `UPDATE pagopro SET send_email = true WHERE nit = ? AND fecpago IN (?)`;
  try {
    await pool.query(query, [nit, fecha]);
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error);
    throw new Error("Hubo un error al actualizar el estado de los correos.");
  }
}

module.exports = { obtainData };

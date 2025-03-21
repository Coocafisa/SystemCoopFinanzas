const { formatDate } = require("../../../../functions/helpers");
const { generarReportePDF, generarResumenPDF } = require("./generatepdf");
const { addStatusEmails } = require("../../../generalService/index");
const { emailSend, sendNotificationEmail } = require("../emailService")

const obtainData = async (query) => {
  try {
    const results = query;
    if (!results || results.length === 0) {
      console.warn("No hay datos para procesar el reporte.");
      return;
    }

    const actualDate = formatDate(new Date());
    const formattedResults = results.map((result) => ({
      ...result,
      fecemi: actualDate,
    }));

    const groupedResults = formattedResults.reduce((acc, { nit, ...rest }) => {
      (acc[nit] = acc[nit] || []).push(rest);
      return acc;
    }, {});

    const emailsSent = [];
    let status = {};
    for (const nit of Object.keys(groupedResults)) {
      const data = groupedResults[nit];
      try {
        const pdfPath = await generarReportePDF(data);
        await emailSend(data, pdfPath);
        emailsSent.push(...data);
        const facturas = data.map(d => d.factura);
        if (facturas.length > 0) {
          status = await addStatusEmails(facturas);
        } else {
          console.warn(`No se encontraron facturas válidas para NIT ${nit}`);
        }
      } catch (error) {
        console.error(`Error procesando NIT ${nit}:`, error);
      } 
    }

    if (emailsSent.length > 0) {
      let countNotification = emailsSent.length;
      const summaryPdfBuffer = await generarResumenPDF(emailsSent);
      await sendNotificationEmail(countNotification, summaryPdfBuffer);
    }

  } catch (error) {
    console.error(`Error general en obtainData: ${error.message}`);
  } finally {
    console.warn(`Envio de correos finalizado.`);
  }
};

module.exports = { obtainData };

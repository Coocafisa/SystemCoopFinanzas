const { emailSend, sendNotificationEmail } = require("../emailService");
const { generarReportePDF, generarResumenPDF } = require("../report/generatepdf");
const { formatDate } = require("../../../../functions/helpers");
const { addStatusEmails } = require("../../../generalService");

const obtainData = async (query) => {
  try {
    const results = query;
    if (!results || results.length === 0) {
      return { message: "No hay datos para procesar el reporte.", status: 400 };
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
      const pdfPath = await generarReportePDF(data);
      await emailSend(data, pdfPath);
      emailsSent.push(...data);
      status = await addStatusEmails(nit, data[0].factura);
    }

    if (emailsSent.length > 0) {
      let countNotification = 0;
      countNotification += emailsSent.length;
      const summaryPdfBuffer = await generarResumenPDF(emailsSent);
      await sendNotificationEmail(countNotification, summaryPdfBuffer);
      return { message: `Correos enviados con éxito y ${status.message} correos`, status: 200};
    }

  } catch (error) {
    return { message: `Error al enviar correo: ${error.message}`, status: 500 };
  }
};

module.exports = { obtainData };
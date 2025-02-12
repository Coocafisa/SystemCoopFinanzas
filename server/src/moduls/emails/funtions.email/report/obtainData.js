const { emailSend, sendNotificationEmail } = require("../emailService");
const { generarReportePDF, generarResumenPDF } = require("../report/generatepdf");
const { formatPesos, formatDate } = require("../../../../functions/helpers");
const { addStatusEmails } = require("../../../generalService");
const request = require("../../../../red/request");

const obtainData = async (req, res, query) => {
  try {
    const results = query;

    if (!results || results.length === 0) {
      return request.error(req, res, {message: "No hay datos para procesar el reporte."}, 400);
    }
    const actualDate = new Date();
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

    const groupedResults = formattedResults.reduce((acc, { nit, ...rest }) => {
      (acc[nit] = acc[nit] || []).push(rest);
      return acc;
    }, {});

    const emailsSent = [];
    let status;
    for (const nit of Object.keys(groupedResults)) {
      const data = groupedResults[nit];
      const pdfPath = await generarReportePDF(data);
      await emailSend(data, pdfPath);
      emailsSent.push(...data);
      status = await addStatusEmails(nit, data[0].factura);
    }

    if (emailsSent.length > 0) {
      const summaryPdfBuffer = await generarResumenPDF(emailsSent);
      await sendNotificationEmail(emailsSent, summaryPdfBuffer);
      return request.success(req, res, { message: "Correos enviados con éxito.", " ": status.message }, 200);
    }

    return request.error(req, res, {message: "Error en el envío del informe."}, 400);
  } catch (error) {
    return request.error(req, res, { message: "Error al enviar correo.", error }, 500);
  }
};

module.exports = { obtainData };
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const dotenv  = require("dotenv");
dotenv.config();

const transporter = async () => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
  });

  try {
    const accessToken = await oauth2Client.getAccessToken();

    const accountTransport = {
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    };
    return nodemailer.createTransport(accountTransport);
  } catch (error) {
    throw error;
  }
};

const emailSend = async (data, pdfBuffer) => {
  try {
    const transport = await transporter();
    const { nit, razonsoc, fecpago, correo } = data[0];

    const mailOptions = {
      from: "contacto@coocafisa.com",
      to: correo,
      subject: "Informe diario",
      text: "El presente correo contiene un informe PDF de sus registros que tienen por fecha de pago el día de hoy.",
      attachments: [
        {
          filename: `${nit}_${razonsoc}_${fecpago}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    };

    await transport.sendMail(mailOptions);
  } catch (error) {
    return error;
  }
};

const sendNotificationEmail = async (count, pdfBuffer) => {
  try {
    const transport = await transporter();
    const notificationOptions = {
      from: "contacto@coocafisa.com",
      to: "contacto@coocafisa.com",
      subject: "Notificación: Correos Enviados",
      text: `Se han enviado un total de ${count} correos con informes exitosamente. Adjuntamos la lista completa de destinatarios.`,
      attachments: [
        {
          filename: "Resumen_Destinatarios.pdf",
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    };

    await transport.sendMail(notificationOptions);

  } catch (error) {
    return error;
  }
};

module.exports = { emailSend, sendNotificationEmail, transporter};


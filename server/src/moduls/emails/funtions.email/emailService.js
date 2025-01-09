const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { request } = require("@/red/request");

const transporter = async (next) => {
    const emailConfig = app.get("emailConfig");
    const oauth2Client = new google.auth.OAuth2(
        emailConfig.client,
        emailConfig.client_secret,
        "https://developers.google.com/oauthplayground"
    );
    oauth2Client.setCredentials({
        refresh_token: config.apiEmail.refresh_token,
    });
    try {
        const accessToken = await oauth2Client.getAccessToken();
        const accountTransport = {
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: emailConfig.email_user,
                clientId: emailConfig.client,
                clientSecret: emailConfig.client_secret,
                refreshToken: emailConfig.refresh_token,
                accessToken: accessToken.token,
            },
        };
        return nodemailer.createTransport(accountTransport);
    } catch (error) {
        next(error);
    }
};

const emailSend = async (data, pdfBuffer, next) => {
    try {
        const transport = await transporter();
        const { identificacion, nombre, fecpago, correo } = data[0];
        const mailOptions = {
            from: "contacto@coocafisa.com",
            to: correo,
            subject: "Informe diario",
            text: "El presente correo contiene un informe PDF de sus registros que tienen por fecha de pago el día de hoy.",
            attachments: [
                {
                    filename: `${identificacion}_${nombre}_${fecpago}.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf',
                },
            ],
        };
        await transport.sendMail(mailOptions);
    } catch (error) {
        request.error(req, res, error, 500);
        next(error);
    }
};

const sendNotificationEmail = async (count, pdfBuffer, next) => {
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
        next(error);
    }
};

module.exports = {
    transporter,
    emailSend,
    sendNotificationEmail,
};
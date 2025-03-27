const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { request } = require("../../../red/request");
const config = require("../../../config");

const transporter = async () => {
    const oauth2Client = new google.auth.OAuth2(
        config.apiEmail.client,
        config.apiEmail.client_secret,
        "https://developers.google.com/oauthplayground"
    );
    oauth2Client.setCredentials({
        refresh_token: config.apiEmail.refresh_token
    });
    try {
        const accessToken = await oauth2Client.getAccessToken();
        const accountTransport = {
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: config.apiEmail.email_user,
                clientId: config.apiEmail.client,
                clientSecret: config.apiEmail.client_secret,
                refreshToken: config.apiEmail.refresh_token,
                accessToken: accessToken.token,
            },
        };
        return nodemailer.createTransport(accountTransport);
    } catch (error) {
        throw error;
    }
};

const emailSend = async (data, pdfBuffer, next) => {
    try {
        const transport = await transporter();
        const { identificacion, nombre, fecpago, correo } = data[0];
        const mailOptions = {
            from: "contacto@coocafisa.com",
            to: correo,
            subject: "Compendio de Pagos Realizados por la Cooperativa de Caficultores de Salgar",
            text: `Estimad@ ${nombre}, 
      Por medio del presente correo, se le comparte un compendio detallado de todos
      los pagos efectuados por la Cooperativa hasta la fecha actual. Este documento ha
      sido elaborado con el propósito de proporcionar un resumen claro y transparente de
      las transacciones realizadas, facilitando su consulta y análisis. 
      Quedamos atentos a cualquier duda o información adicional que puedan requerir.`,
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
        request.faultRequest(req, res, error, 500);
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

const resetEmail = async ( email, enlace) => {
    const transport = await transporter();
    try {
        const mailOptions = {
            from: 'contacto@coocafisa.com',
            to: email,
            subject: 'Restablecimiento de Contraseña',
            html: `<p>Hola, <br /> para completar el restablecimiento de tu contraseña, haz click en el siguiente enlace: <a href="${enlace}">${enlace}</a></p>`,
        };

        await transport.sendMail(mailOptions);
    } catch (error) {
        throw error;
    }
};

module.exports = {
    transporter,
    emailSend,
    sendNotificationEmail,
    resetEmail,
};
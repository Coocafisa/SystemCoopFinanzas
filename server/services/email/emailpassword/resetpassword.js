const express = require('express');
const router = express.Router();
const pool = require('../../../connectionBD/db');
const {transporter} = require('../emailService');
const bcrypt = require('bcrypt');
const { generarToken } = require('../../functions/helpers');
require('dotenv').config();

const resetMail = async (email, enlace) => {
    const transport = await transporter();
    try {
        const mailOptions = {
            from: 'contacto@coocafisa.com',
            to: email,
            subject: 'Restablecimiento de Contraseña',
            html: `<p>Hola, <br /> para completar el restablecimiento de tu contraseña, haz click en el siguiente enlace: <a href="${enlace}">${enlace}</a></p>`,
        };

        await transport.sendMail(mailOptions);
        return true;
    } catch (error) {
        return false;
    }
};

router.post('/emailresetpass', async (req, res) => {
    const user = req.body.nit;
    const token = generarToken();
    if (!user) {
        return res.status(400).json({
            message: "Las credenciales ingresadas no son correctas.",
        });
    }

    try {
        const [users] = await pool.query('SELECT nit, correo, proveedor_id FROM proveedor WHERE nit = ?', [user]);
        if (users.length === 0) {
            return res.status(404).json({
                message: "Usuario no encontrado.",
            });
        }
        
        if (users.length > 0) {
            const gmail = users[0].correo;
            const expiracionToken = new Date(Date.now() + 3600000);
            const userId = users[0].proveedor_id;
            await pool.query('UPDATE usuario SET token_pass = ?, token_expiracion_pass = ? WHERE proveedor_id = ?', [token, expiracionToken, userId]);
            const baseUrl = process.env.URL_CLIENT;
            const enlace = `${baseUrl}/users/resetpassword/formpass?token=${token}`
            const emailSent = await resetMail(gmail, enlace);
            if (emailSent) {
                return res.status(200).json({
                    message: "Correo enviado exitosamente. Revisa tu bandeja de entrada.",
                    redirect: "/"
                });
            } else {
                return res.status(400).json({
                    message: "Error al enviar el correo.",
                });
            }
        } else {
            return res.status(400).json({
                message: "Una de las credenciales no es correcta.",
            });
        }
    } catch (error) {
        return res.status(400).json({
            message: "Ocurrió un error interno. Inténtalo más tarde.",
        });
    }
});

router.post('/resetpass', async (req, res) => {
    const validatepass = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d{2})(?!.*\s)[\w!@#$%^&*(),.?":{}|<>]{8,16}$/;
    const { newpass, confpass, token } = req.body;

    try {
        if (!validatepass.test(newpass)) {
            return res.status(400).json({ errors: "La contraseña no es segura. Debe contener al menos una mayúscula, dos números, y no puede tener espacios." });
        }

        if (newpass !== confpass) {
            return res.status(400).json({ errors: "Las contraseñas no coinciden. Por favor, intenta nuevamente." });
        }

        const tokenQuery = 'SELECT token_pass FROM usuario WHERE token_pass = ?';
        const [tokenResult] = await pool.query(tokenQuery, [token]);

        if (!tokenResult || tokenResult.length === 0) {
            return res.status(400).json({ errors: "Token no válido o no encontrado." });
        }

        const now = new Date();
        const tokenExpiration = new Date(tokenResult[0].token_expiracion);
        if (now > tokenExpiration) {
            return res.status(400).json({ errors: "El token ha expirado. Solicita uno nuevo para restablecer la contraseña." });
        }

        const hashedPassword = await bcrypt.hash(newpass, 10);

        const updateQuery = `UPDATE usuario SET clave = ?, intentos_fallidos = 0,
        cambiar_password = FALSE, fecha_pass = CURRENT_TIMESTAMP,
        token_pass = 0, token_expiracion_pass = 0 WHERE token_pass = ?`;
        const [result] = await pool.query(updateQuery, [hashedPassword, token]);

        if (result.affectedRows === 0) {
            return res.status(400).json({ errors: "No se encontró un usuario asociado con el token proporcionado." });
        }

        return res.status(201).json({
            message: "Tu contraseña ha sido restablecida exitosamente. Inicia sesión con tus nuevas credenciales.",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Hubo un problema al restablecer tu contraseña. Intenta más tarde.",
        });
    }
});

router.get('/getToken', async (req, res) => {
    const reqToken  = req.query.token;

    if (!reqToken) {
        return res.status(400).json({
            message: "Token no proporcionado."});
    }
    try {
        const validateTokenQuery = (`SELECT token_pass, token_expiracion_pass,
            TIMESTAMPDIFF(MINUTE, token_expiracion_pass, CURRENT_TIMESTAMP)
            AS minutos_transcurridos FROM usuario WHERE token_pass = ?`);
        const [result] = await pool.query(validateTokenQuery, [reqToken])

        if (result.length === 0) {
            return res.status(400).json({message: "El token no existe o ha expirado."});
        }

        if (result[0].token_pass) {
            const { minutos_transcurridos } = result[0];
            if (minutos_transcurridos >= 60) {
                return res.status(400).json({message: "El token ha expirado. Por favor, solicite uno nuevo."});
            } else {
                return res.status(200).json({
                    message: "Validación correcta.", 
                });
            }
        }
    } catch (error) {
        return res.status(500).json({
            message: "Ocurrió un error en la solicitud. Inténtalo de nuevo más tarde.",
        });
    }
});

module.exports = router;
const bcrypt = require('bcrypt');
const moment = require('moment');
const jwt = require('jsonwebtoken');

const request = require('../../red/request');
const config = require('../../config');

module.exports = function(dbInsert) {
    let db = dbInsert;
    if (!db) {
        db = require('../../db/mysql');
    }

    function tokenAuth(usuario) {
        const payload = {
                name: usuario.identificacion || usuario.usuario,
                role: usuario.rol,
            };
        
            const token = jwt.sign(payload, config.jwt.secret, {
                expiresIn: config.jwt.expiresIn
            });
            return token;
            
        }

    async function auth (req, res, data) {
            const table = `entities INNER JOIN users ON entities.entidad_id = users.entidad_id 
            INNER JOIN auth ON auth.usuario_id = users.usuario_id `;
            const fields = '*';
            const params = `identificacion = ${data.user} OR usuario = ${data.user}`;
            try {
                const [usuario] = await db.query(table, fields, params);
                if (!usuario) {
                    return request.error(req, res, 'Credenciales incorrectas.', 401);
                }

                const dateRegister = moment(usuario.fech_pass);
                const dateLimit = moment().subtract(30, 'days');
                if (dateRegister.isBefore(dateLimit)) {
                    return request.error(req, res, 'Tu contraseña expiro. Debes cambiar tu contraseña.', 403);
                }

                if (usuario.intentos_fallidos >= 3) {
                    return request.error(req, res, 'Ha alcanzado el límite de intentos fallidos. Debe cambiar su contraseña.', 403);
                }

                const isMatch = await bcrypt.compare(data.password, usuario.pasword);
                if (!isMatch) {
                    const updatedIntentos = usuario.intentos_fallidos + 1;
                    await db.update('auth', `intentos_fallidos = ${updatedIntentos}`, ` usuario_id = '${usuario.usuario_id}'`);
                    return request.error(req, res, 'Credenciales incorrectas.', 400);
                }

                await db.update('auth', `intentos_fallidos = 0, actividad = CURRENT_TIMESTAMP`, ` usuario_id = '${usuario.usuario_id}'`);	
                const token = tokenAuth(usuario);
                const redirectPath = usuario.rol === 'Administrador' 
                ? '/home' : '/home/user/suppliers/invoices';
                if (!token) {
                    return request.error(req, res, 'No se econtró el token.', 500);
                }
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 1000 * 60 * 10,
                });
                return request.success(req, res, { token, redirect: redirectPath }, 200);
                } catch (error) {
                     return request.error(req, res, `Error en el servidor. Inténtalo de nuevo más tarde.${error}`, 500);
            }
    }

    return {
        auth,
        tokenAuth,
    }

}
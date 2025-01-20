const bcrypt = require("bcrypt");
const moment = require("moment");
const jwt = require("jsonwebtoken");

const request = require("../../red/request");
const config = require("../../config");
const { generarToken } = require("../../functions/helpers");
const { resetEmail } = require("../emails/funtions.email/emailService");

module.exports = function (dbInsert) {
  let db = dbInsert || require("../../db/mysql");

  function tokenAuth(usuario) {
    const payload = {
      name: usuario.identificacion,
      role: usuario.rol,
    };

    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });
  }

  async function auth(req, res, data) {
    if (!data.user || !data.password) {
      return request.error(req, res, "Usuario y contraseña son obligatorios.", 400);
    }

    const table = `
      entities 
      INNER JOIN users ON entities.entidad_id = users.entidad_id 
      INNER JOIN auth ON auth.usuario_id = users.usuario_id
    `;
    const fields = "*";
    const params = "(identificacion = ? OR usuario = ?)";

    try {
      const [usuario] = await db.query(table, fields, params, [data.user, data.user]);

      if (!usuario) {
        const [newUser] = await db.query(
          "entities",
          fields,
          "identificacion = ?",
          [data.user]
        );

        if (!newUser || String(newUser.identificacion).substring(0, 4) !== String(data.password)) {
          return request.error(req, res, "Credenciales incorrectas.", 401);
        }

        const credentials = { rol: "Usuario", identificacion: data.user };
        const token = tokenAuth(credentials);

        return request.success(req, res, {
          message: "Iniciando registro",
          redirect: `/resetpassword/formpass/autoregister?token=${token}`,
        }, 200);
      }

      const dateRegister = moment(usuario.fech_pass);
      const dateLimit = moment().subtract(30, "days");
      if (dateRegister.isBefore(dateLimit)) {
        return request.error(req, res, "Tu contraseña expiró. Debes cambiarla.", 403);
      }

      if (usuario.intentos_fallidos >= 3) {
        return request.error(
          req,
          res,
          "Ha alcanzado el límite de intentos fallidos. Debe cambiar su contraseña.",
          403
        );
      }

      const isMatch = await bcrypt.compare(String(data.password), usuario.pasword);
      if (!isMatch) {
        const updatedIntentos = usuario.intentos_fallidos + 1;
        await db.update('auth', `intentos_fallidos = ${updatedIntentos}`, ` usuario_id = '${usuario.usuario_id}'`);
        return request.error(req, res, "Credenciales incorrectas.", 400);
      }

      await db.update('auth', `intentos_fallidos = 0, actividad = CURRENT_TIMESTAMP`, ` usuario_id = '${usuario.usuario_id}'`);
      const token = tokenAuth(usuario);
      const redirectPath =
        usuario.rol === "Administrador"
          ? "/home"
          : "/home/user/entities/invoices";

      if (!token) {
        return request.error(req, res, "No se encontró el token.", 500);
      }

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1000 * 60 * 10,
      });

      return request.success(req, res, { token, redirect: redirectPath }, 200);
    } catch (error) {
      console.error("Error en autenticación:", error);
      return request.error(
        req,
        res,
        "Error en el servidor. Inténtalo de nuevo más tarde.",
        500
      );
    }
  }

  async function emailresetpass (req, res, data) {
  const token = generarToken();
  if (!data) {
    return request.error(req, res, "Las credenciales son incorrectas.", 400);
  }

  try {
    const table = `entities INNER JOIN users ON entities.entidad_id = users.entidad_id
    INNER JOIN auth ON users.usuario_id = auth.usuario_id`;
    const fields =  'identificacion, correo, usuario_id';
    const params = 'identificacion = ?'
    const [userResult] = await db.query(table, fields, params, [data]);
    if(!userResult) {
      return request.error(req, res, "Usuario no encontrado.")
    }
    const gmail = userResult.correo;
    const expirationToken = new Date(Date.now() + 3600000);
    const registerToken = await db.update('auth', `token_pass = ${token}, expiracion_token_pass = ${expirationToken},
      usuario_id = ${userResult.usuario_id}`);
    const baseUrl = config.app.origin;
    const enlace = `${baseUrl}/resetpassword/formpass?token=${token}`;
    const emailSent = await resetEmail(gmail, enlace);
    if (!emailSent) {
      return request.error(req, res, "Error al enviar el correo.", 400);
    }
    return request.success(req, res, { message: "Correo enviado con éxito." }, 200);
  } catch (error) {
    return request.error(
      req,
      res,
      "Error al enviar el correo. Inténtalo de nuevo más tarde.",
      500
    );
  }
  }

  async function resetpass (req, res, data) {
    const { newpass, token } = data;
    const validatepass = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d{2})(?!.*\s)[\w!@#$%^&*(),.?":{}|<>]{8,16}$/;
    try {
      if (!validatepass.test(newpass)) {
        return request.error(req, res, 
          { errors: "La contraseña no es segura. Debe contener al menos una mayúscula, dos números, y no puede tener espacios." },
          400);
      }
      const [tokenQuery] = await db.query('auth', 'token_pass, expiracion_token_pass', 'token_pass = ?', [token]);
      if(!tokenQuery){
        return request.error(req, res, 'Token no válido o no encontrado.');
      }
      const now = new Date();
      const tokenExpiration = new Date(tokenQuery.expiracion_token_pass);
      if(now > tokenExpiration) {
        return request.error(req, res, 'El token ha expirado. Solicita uno nuevo para restablecer la contraseña.', 403);
      }
      const hashedPassword = await bcrypt.hash(newpass, 10);
      const updateQuery = db.update('auth', `intentos_fallidos = 0, fech_pass = CURRENT_TIMESTAMP,
        token_pass = 0, token_expiracion_pass = 0, pasword = ${hashedPassword}`, ` token_pass = ${token}`);
        if (!updateQuery){
          return request.error(req, res, 'Error al actualizar la contraseña.', 403);
        }
        return request.success(req, res, { message: "Tu contraseña ha sido restablecida exitosamente. Inicia sesión con tus nuevas credenciales." }, 200);
      } catch (error) {
        return request.error(req, res, 'Error al restablecer la contraseña.', 500);
      }
    };

    async function getToken(req, res, data) {
      const { token } = data;
      if (!token) {
        return request.error(req, res, "Token no proporcionado.", 400);
      }
      try {
        const [validateTokenQuery] = await db.query('auth',
          'token_pass, expiracion_token_pass, TIMESTAMPDIFF(MINUTE, token_expiracion_pass, CURRENT_TIMESTAMP) AS minutos_transcurridos',
          'token_pass = ?', [token]);
          if(!validateTokenQuery){
            return request.error(req, res, 'Token no válido o no encontrado.', 400);
          }
          const { minutos_transcurridos } = validateTokenQuery;
          if (minutos_transcurridos >= 60) {
            return request.error(req, res, 'El token ha expirado. Por favor, solicite uno nuevo.', 400);
          }
          return request.success(req, res, { message: "Validación correcta.", }, 200);
        } catch (error) {
          return request.error(req, res, "Ocurrió un error en la solicitud. Inténtalo de nuevo más tarde.", 500);
        }
    }

  return {
    auth,
    tokenAuth,
    emailresetpass,
    resetpass,
    getToken,
  };
};
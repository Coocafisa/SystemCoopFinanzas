const bcrypt = require("bcrypt");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const request = require("../../red/request");
const config = require("../../config");
const { generarToken } = require("../../functions/helpers");
const { resetEmail } = require("../emails/funtions.email/emailService");
const { validateUser } = require("../users/index");

module.exports = function (dbInsert) {
  let db = dbInsert || require("../../db/mysql");

  function tokenAuth(usuario) {
    const payload = {
      sessionId: usuario.session,
      name: usuario.identificacion,
      role: usuario.rol,
    };

    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });
  }

  async function auth(req, res, data) {
    if (!data.user || !data.password) {
      return request.faultRequest(
        req,
        res,
        { message: "Usuario y contraseña son obligatorios." },
        400
      );
    }

    const table = `
      entities 
      LEFT JOIN users ON entities.entidad_id = users.entidad_id 
      LEFT JOIN auth ON auth.usuario_id = users.usuario_id
    `;
    const fields = "*";
    const params = "(identificacion = ? OR usuario = ?)";

    try {
      const [usuario] = await db.query(table, fields, params, [
        data.user,
        data.user,
      ]);
      if (!usuario?.actividad && !usuario?.password) {
        const [newUser] = await db.query(
          "entities",
          fields,
          "identificacion = ?",
          [data.user]
        );

        if (
          !newUser ||
          String(newUser.identificacion).substring(0, 4) !==
            String(data.password)
        ) {
          return request.faultRequest(
            req,
            res,
            { message: "Credenciales incorrectas." },
            400
          );
        }

        const credentials = { rol: "Usuario", identificacion: data.user };
        const token = tokenAuth(credentials);

        return request.successRequest(
          req,
          res,
          {
            redirect: `/resetpassword/formpass/autoregister?token=${token}`,
          },
          200
        );
      }

      const tiempoInactividad =
        Date.now() - new Date(usuario.actividad).getTime();
      const validarInactividad = tiempoInactividad < 2 * 60 * 1000;

      if (usuario?.sessionId !== "0" && validarInactividad) {
        return request.faultRequest(
          req,
          res,
          {
            message:
              "Ya tienes una sesión activa. Para continuar debes cerrar la anterior.",
            resetSession: usuario.sessionId,
          },
          403
        );
      }

      const dateRegister = moment(usuario.fech_pass);
      const dateLimit = moment().subtract(30, "days");
      if (dateRegister.isBefore(dateLimit)) {
        return request.faultRequest(
          req,
          res,
          { message: "Tu contraseña expiró. Debes cambiarla." },
          403
        );
      }

      if (usuario.intentos_fallidos >= 3) {
        return request.faultRequest(
          req,
          res,
          {
            message:
              "Ha alcanzado el límite de intentos fallidos. Debe cambiar su contraseña.",
          },
          403
        );
      }

      const isMatch = await bcrypt.compare(
        String(data.password),
        usuario.password
      );
      if (!isMatch) {
        const updatedIntentos = usuario.intentos_fallidos + 1;
        await db.update(
          "auth",
          `intentos_fallidos = ${updatedIntentos}`,
          ` usuario_id = '${usuario.usuario_id}'`
        );
        return request.faultRequest(
          req,
          res,
          { message: "Credenciales incorrectas." },
          400
        );
      }

      const session = uuidv4();
      const updateAuth = await db.update(
        "auth",
        `intentos_fallidos = 0, actividad = CURRENT_TIMESTAMP, sessionId = '${session}'`,
        ` usuario_id = '${usuario?.usuario_id}'`
      );
      if (updateAuth.affectedRows === 0) {
        return request.faultRequest(
          req,
          res,
          { message: "Error al actualizar la autenticación" },
          400
        );
      }

      const dataToken = {
        identificacion: usuario?.identificacion,
        rol: usuario?.rol,
        session,
      };
      const token = tokenAuth(dataToken);
      const redirectPath =
        usuario?.rol === "Administrador"
          ? "/home"
          : "/home/user/entities/invoices";

      if (!token) {
        return request.faultRequest(
          req,
          res,
          { message: "No se encontró el token." },
          500
        );
      }
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 4 * 60 * 1000,
      });

      return request.successRequest(req, res, { token, redirect: redirectPath }, 200);
    } catch (error) {
      return request.faultRequest(
        req,
        res,
        { message: "Error en el servidor. Inténtalo de nuevo más tarde." },
        500
      );
    }
  }

  async function emailresetpass(req, res, data) {
    const token = generarToken();
    if (!data?.nit) {
      return request.faultRequest(
        req,
        res,
        { message: "Las credenciales son incorrectas." },
        400
      );
    }
    try {
      const table = `entities INNER JOIN users ON entities.entidad_id = users.entidad_id
    INNER JOIN auth ON users.usuario_id = auth.usuario_id`;
      const fields = "identificacion, correo, users.usuario_id";
      const params = "identificacion = ?";
      const [userResult] = await db.query(table, fields, params, [data.nit]);
      if (!userResult) {
        return request.faultRequest(req, res, { message: "Usuario no encontrado." });
      }
      const gmail = userResult.correo;
      const registerToken = await db.update(
        "auth",
        `token_pass = '${token}', expiracion_token_pass = CURRENT_TIMESTAMP`,
        `usuario_id = '${userResult.usuario_id}'`
      );
      if (!registerToken) {
        return request.faultRequest(
          req,
          res,
          { message: "Error al actualizar el token." },
          501
        );
      }
      const baseUrl = config.app.origin;
      const enlace = `${baseUrl}/resetpassword/formpass?token=${token}`;
      await resetEmail(gmail, enlace);
      return request.successRequest(
        req,
        res,
        { message: "Correo enviado con éxito.", redirect: "/" },
        200
      );
    } catch (error) {
      return request.faultRequest(
        req,
        res,
        {
          message: "Error al enviar el correo. Inténtalo de nuevo más tarde.",
          error,
        },
        500
      );
    }
  }

  async function resetpass(req, res, data) {
    const { newpass, token } = data;
    const validatepass =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d{2})(?!.*\s)[\w!@#$%^&*(),.?":{}|<>]{8,16}$/;
    try {
      if (!validatepass.test(newpass)) {
        return request.faultRequest(
          req,
          res,
          {
            message:
              "La contraseña no es segura. Debe contener al menos una mayúscula, dos números, y no puede tener espacios.",
          },
          400
        );
      }
      const [tokenQuery] = await db.query(
        "auth",
        "token_pass, expiracion_token_pass",
        "token_pass = ?",
        [token]
      );
      if (!tokenQuery) {
        return request.faultRequest(
          req,
          res,
          { message: "Token no válido o no encontrado.", redirect: "/" },
          400
        );
      }
      const now = new Date();
      const tokenExpiration = new Date(tokenQuery.expiracion_token_pass);
      if (!now > tokenExpiration) {
        return request.faultRequest(
          req,
          res,
          {
            message:
              "El token ha expirado. Solicita uno nuevo para restablecer la contraseña.",
          },
          403
        );
      }
      const hashedPassword = await bcrypt.hash(newpass, 10);
      const updateQuery = await db.update(
        "auth",
        `intentos_fallidos = 0, fech_pass = CURRENT_TIMESTAMP,
        token_pass = 0, expiracion_token_pass = 0, password = '${hashedPassword}'`,
        ` token_pass = '${token}'`
      );
      if (!updateQuery) {
        return request.faultRequest(
          req,
          res,
          { message: "Error al actualizar la contraseña." },
          501
        );
      }
      return request.successRequest(
        req,
        res,
        {
          message:
            "Tu contraseña ha sido restablecida exitosamente. Inicia sesión con tus nuevas credenciales.",
          redirect: "/",
        },
        200
      );
    } catch (error) {
      return request.faultRequest(
        req,
        res,
        { message: "Error al restablecer la contraseña." },
        501
      );
    }
  }

  async function getToken(req, res, data) {
    const { token } = data;
    if (!token) {
      return request.faultRequest(
        req,
        res,
        { message: "Token no proporcionado." },
        400
      );
    }
    try {
      const [validateTokenQuery] = await db.query(
        "auth",
        "token_pass, expiracion_token_pass, TIMESTAMPDIFF(MINUTE, expiracion_token_pass, CURRENT_TIMESTAMP) AS minutos_transcurridos",
        "token_pass = ?",
        [token]
      );
      if (!validateTokenQuery) {
        return request.faultRequest(
          req,
          res,
          { message: "Token no válido o no encontrado.", redirect: "/" },
          400
        );
      }
      const { minutos_transcurridos } = validateTokenQuery;
      if (minutos_transcurridos >= 60) {
        return request.faultRequest(
          req,
          res,
          {
            message: "El token ha expirado. Por favor, solicite uno nuevo.",
            redirect: "/",
          },
          400
        );
      }
      return request.successRequest(
        req,
        res,
        { message: "Validación correcta." },
        200
      );
    } catch (error) {
      return request.faultRequest(
        req,
        res,
        { message: `Ocurrió un error en la solicitud. ${error.message}` },
        500
      );
    }
  }

  const refreshToken = async (req, res) => {
    const refreshSession = uuidv4();
    const { name, role } = req.auth;
    const user = { identificacion: name, rol: role, session: refreshSession };
    const newToken = tokenAuth(user);

    try {
      const userData = await validateUser(name);
      if (!userData) {
        return request.faultRequest(
          req,
          res,
          { message: "Usuario no encontrado." },
          404
        );
      }

      const { usuario_id } = userData;
      const updateAuth = await db.update(
        "auth",
        `sessionId = '${refreshSession}', actividad = CURRENT_TIMESTAMP`,
        `usuario_id = '${usuario_id}'`
      );

      if (updateAuth.affectedRows === 0) {
        return request.faultRequest(
          req,
          res,
          { message: "Error al actualizar la sesión." },
          500
        );
      }

      res.cookie("token", newToken, { httpOnly: true, sameSite: "Strict" });
      return request.successRequest(req, res, { token: newToken }, 200);
    } catch (error) {
      return request.faultRequest(
        req,
        res,
        { message: "Error al refrescar sesión." },
        400
      );
    }
  };

  return {
    auth,
    tokenAuth,
    emailresetpass,
    resetpass,
    getToken,
    refreshToken,
  };
};

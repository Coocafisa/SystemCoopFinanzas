const request = require("../../red/request.js");
const { validateUser } = require("../users/index.js");
const { createUserId, confirmToken } = require("../../functions/utils.js");
const { verifyToken } = require("../../middleware/authMiddleware.js");

const table = "users";

module.exports = function (dbInsert) {
  let db = dbInsert || require("../../db/mysql");

  async function addUsers(data) {
    const { identificacion, usuario, password, ter_cond, rol } = data;

    if (!identificacion || !ter_cond || !password || !rol) {
      return {
        status: 400,
        message: "Todos los campos obligatorios deben ser proporcionados.",
      };
    }

    try {
      const validate = await validateUser(identificacion);
      if (validate > 0) {
        return { status: 400, message: "La entidad ya está registrada." };
      }

      const [queryEntities] = await db.query(
        "entities",
        "*",
        `identificacion = ${identificacion}`
      );
      if (!queryEntities) {
        return {
          status: 404,
          message: "La entidad no está disponible para registrarse.",
        };
      }
      const usuario_id = await createUserId(rol, identificacion);

      const userResult = await db.insert(table, {
        usuario_id,
        entidad_id: queryEntities.entidad_id,
        usuario,
        rol
      });

      if (userResult.affectedRows > 0) {
        await db.insert("auth", {
          usuario_id,
          pasword: password,
          ter_cond,
        });

        return { status: 200, message: "Registro exitoso." };
      } else {
        return { status: 400, message: "Registro fallido." };
      }
    } catch (error) {
      return {
        status: 500,
        message: `Error al registrar usuario: ${error.message}`,
      };
    }
  }

  async function automaticRegistration(req, res, data) {
    const { password, ter_cond } = data;
    const token = req

    if (!token || !password || !ter_cond) {
      return request.error(
        req,
        res,
        {message: "Información requerida no proporcionada.", data},
        400
      );
    }

    try {
      const uncryptInformation = jwt.verify(token, config.jwt.secret);
        if(!uncryptInformation) {
          return uncryptInformation;
        }
      const dataUser = {
        identificacion: uncryptInformation.name,
        rol: uncryptInformation.role,
        password,
        ter_cond,
      };

     const register = await addUsers(dataUser);
      return register.status === 200
        ? request.success(req, res, register.message, register.status)
        : request.error(req, res, register.message, register.status);
    } catch (error) {
      return request.error(
        req,
        res,
        `Error al procesar registro automático: ${error.message}`,
        500
      );
    }
  }

  async function verifyTokenAutoregister(req, res) {
    const token = req.query.token;
    
    if (!token) {
      return request.error(req, res, "Token no proporcionado.", 400);
    }
    
    try {
      const dataUser = await confirmToken(token);
      
      if (dataUser.status === 401) {
        return request.error(req, res, dataUser.message, dataUser.status);
      }

      const { name, role } = dataUser;
      return request.success(req, res, { identificacion: name, rol: role });
    } catch (error) {
      return request.error(req, res, "Error al validar el token.", 500);
    }
  }
  

  return {
    addUsers,
    automaticRegistration,
    verifyTokenAutoregister,
  };
};

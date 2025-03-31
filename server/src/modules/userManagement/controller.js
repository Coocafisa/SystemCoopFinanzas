const bcrypt = require("bcrypt")
const request = require("../../red/request.js");
const { validateUser } = require("../users/index.js");
const { createUserId, confirmToken } = require("../../functions/utils.js");

module.exports = function (dbInsert) {
  let db = dbInsert || require("../../db/mysql");

    async function addUsers(data) {
      const { identificacion, password, ter_cond, rol } = data;
  
      if (!identificacion || !rol) {
          return { status: 400, message: "Todos los campos obligatorios deben ser proporcionados." };
      }
  
      try {
          const validate = await validateUser(identificacion);
          
          if (validate?.actividad || validate?.usuario_id && !password) {
              return { status: 400, message: "El usuario tiene ya una cuenta activa." };
          }
  
          const [queryEntities] = await db.query("entities", "*", "identificacion = ?", [identificacion]);
          if (!queryEntities) {
              return { status: 404, message: "Registro denegado, contacte con el administrador." };
          }
  
          let usuario_id = validate?.usuario_id;
          
          if (!usuario_id) {
              usuario_id = await createUserId(rol, identificacion);
              const userResult = await db.insert("users", {
                  usuario_id,
                  entidad_id: queryEntities.entidad_id,
                  rol,
                  ter_cond: ter_cond || false
              });
  
              if (userResult.affectedRows === 0) {
                  return { status: 400, message: "Creación de usuario fallida." };
              }
          } else {
              if (ter_cond !== undefined) {
                  await db.update("users", `ter_cond = ${ter_cond}`, `usuario_id = '${usuario_id}'`);
              }
          }

          if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await db.insert("auth", {
              usuario_id,
              password: hashedPassword,
              actividad: new Date(),
          });
        }
        return { status: 200, message: "Registro exitoso." };
      } catch (error) {
          return { status: 500, message: `Error al registrar usuario: ${error.message}` };
      }
  }

  const addEntity = async (data) => {
    const { identificacion, nombre, correo } = data;
    if (!identificacion || !nombre || !correo) {
      return { status: 400, message: "Todos los campos obligatorios deben ser proporcionados." };
    }
    try {
      const [queryEntities] = await db.query("entities", "identificacion, nombre", "identificacion = ?", [identificacion]);
      if (queryEntities) {
        return { status: 400, message: "La entidad ya está registrada." };
      }
      const userResult = await db.insert("entities", {
        identificacion,
        nombre,
        correo,
      });
      if (userResult.affectedRows === 0) {
        return { status: 400, message: "Creación de entidad fallida." };
      }
      return { status: 200, message: "Registro exitoso." };
    } catch (error) {
      return { status: 500, message: `Error al registrar entidad: ${error.message}` };
    }
  };

  async function automaticRegistration(req, res, data) {
    const { identificacion, rol, password, ter_cond } = data;

    if (!identificacion || !rol || !password || !ter_cond) {
      return request.faultRequest(
        req,
        res,
        {message: "Información requerida no proporcionada.", data},
        400
      );
    }

    const verifyExistUser = await validateUser(identificacion);
    if (verifyExistUser.actividad) {
      return request.faultRequest(req, res, { message: "La entidad ya está registrada.", redirect: "/"}, 400);
    }
    try {
      const dataUser = {
        identificacion,
        rol,
        password,
        ter_cond,
      };
     const register = await addUsers(dataUser);
      return register.status === 200
        ? request.successRequest(req, res, { message: register.message, redirect: "/"}, register.status)
        : request.faultRequest(req, res, { message: register.message, redirect: "/"}, register.status);
    } catch (error) {
      return request.faultRequest(
        req,
        res,
        {message: `Error al procesar registro automático: ${error.message}`},
        500
      );
    }
  }

  async function verifyTokenAutoregister(req, res) {
    const token = req.query.token;
    
    if (!token) {
      return request.faultRequest(req, res, {message: "Token no proporcionado."}, 400);
    }
    
    try {
      const dataUser = await confirmToken(token);
      
      if (dataUser.status === 401) {
        return request.faultRequest(req, res, {message: dataUser.message,  redirect: dataUser.redirect}, dataUser.status);
      }

      const { name, role } = dataUser;
      return request.successRequest(req, res, { identificacion: name, rol: role });
    } catch (error) {
      return request.faultRequest(req, res, {message: "Error al validar el token."}, 500);
    }
  }
  

  return {
    addUsers,
    addEntity,
    automaticRegistration,
    verifyTokenAutoregister,
  };
};
const request = require("../../red/request.js");

const table = "users";

module.exports = function (dbInsert) {
  let db = dbInsert;
  if (!db) {
    db = require("../../db/mysql.js");
  }

  async function validateUser(user) {
    const SelectTable = `entities LEFT JOIN ${table} ON entities.entidad_id = ${table}.entidad_id
         LEFT JOIN auth ON auth.usuario_id = ${table}.usuario_id`;
    const fields = "nombre, entities.entidad_id, users.usuario_id, identificacion, usuario, rol, activo, correo, telefono, direcc, sessionId, actividad ";
    const params = `identificacion = ${user} OR usuario = ${user}`;
    try {
      const [usuario] = await db.query(SelectTable, fields, params);
      return usuario;
    } catch (error) {
      throw new Error("Error en la consulta: ", error);
    }
  }

  async function perfilUser(req, res) {
    if (req.auth && req.auth.name) {
      const dateUser = await validateUser(req.auth.name);
      return res.json({
        nombre: dateUser.nombre || "Nombre",
        nit: req.auth.name || "Nit",
        user: dateUser.usuario || "Usuario",
        rol: req.auth.role || "Rol",
        estado: dateUser.activo || "N/A",
        correo: dateUser.correo || "Correo",
        telefono: dateUser.telefono || "Telefono",
        direccion: dateUser.direcc || "Dirección",
      });
    } else {
      return res.json({ isAuthenticated: false, user: null });
    }
  }

  async function queryUsers(req, res) {
    const table =
      `entities INNER JOIN users ON entities.entidad_id = users.entidad_id LEFT JOIN authorizations ON
      authorizations.usuario_id = users.usuario_id GROUP BY identificacion`;
    const fields = "identificacion, rol, nombre, correo, activo, entities.fech_reg, users.usuario_id";
    try {
      const data = await db.query(table, fields);
      request.success(req, res, data, 200);
    } catch (error) {
      request.error(req, res, error, 404);
    }
  }

  async function queryEntities(req, res) {
    const fields =
      "identificacion, nombre, direcc, correo, telefono, fech_reg";
    try {
      const data = await db.query("entities", fields);
      request.success(req, res, data, 200);
    } catch (error) {
      request.error(req, res, error, 404);
    }
  }

  async function queryPermits(req, res) {
    const table = "authorizations LEFT JOIN permits ON authorizations.permits_id = permits.permits_id";
    const fields = "usuario_id, authorizations.permits_id, estado, fech_auth, consec_permit";
    try {
    const data = await db.query(table, fields);
    return request.success(req, res, data, 200);
    } catch (error) {
      return request.error(req, res, error, 404);
    }
  }

  return {
    validateUser,
    perfilUser,
    queryUsers,
    queryEntities,
    queryPermits,
  };
};   
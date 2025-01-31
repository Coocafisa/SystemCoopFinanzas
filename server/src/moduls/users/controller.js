const { formatDate } = require("../../functions/helpers.js");
const request = require("../../red/request.js");

const table = "users";

module.exports = function (dbInsert) {
  let db = dbInsert;
  if (!db) {
    db = require("../../db/mysql.js");
  }

  async function validateUser(user) {
    const SelectTable = `entities INNER JOIN ${table} ON entities.entidad_id = ${table}.entidad_id
         INNER JOIN auth ON auth.usuario_id = ${table}.usuario_id`;
    const fields = "nombre, tipo_entidad, users.usuario_id, identificacion, usuario, rol, activo";
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
        nombre: dateUser.nombre,
        nit: req.auth.name,
        user: dateUser.usuario,
        rol: req.auth.role,
        estado: dateUser.activo,
        entidad: dateUser.tipo_entidad,
      });
    } else {
      return res.json({ isAuthenticated: false, user: null });
    }
  }

  async function queryUsers(req, res) {
    const table =
      "entities INNER JOIN users ON entities.entidad_id = users.entidad_id";
    const fields = "identificacion, rol, nombre, entities.fech_reg, correo";
    try {
      const data = await db.query(table, fields);
      const formatedData = data.map((user) => {
        return {
          ...user,
          fech_reg: formatDate(user.fech_reg)
        };
      });
      request.success(req, res, formatedData, 200);
    } catch (error) {
      request.error(req, res, error, 404);
    }
  }

  async function queryEntities(req, res) {
    const fields =
      "identificacion, nombre, tipo_entidad, direcc, correo, telefono, fech_reg";
    try {
      const data = await db.query("entities", fields);
      const formatedData = data.map((entity) => {
        return {
          ...entity,
          fech_reg: formatDate(entity.fech_reg)
        };
      });
      request.success(req, res, formatedData, 200);
    } catch (error) {
      request.error(req, res, error, 404);
    }
  }

  return {
    validateUser,
    perfilUser,
    queryUsers,
    queryEntities,
  };
};
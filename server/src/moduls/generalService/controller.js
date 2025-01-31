const { validateFields } = require("../../functions/helpers.js");
const request = require("../../red/request");

module.exports = function (dbInsert) {
  let db = dbInsert;
  if (!db) {
    db = require("../../db/mysql.js");
  }

  async function addStatusEmails(nit, factura) {
    try {
      const table = "pagopro";
      const fields = "send_email = true";
      const params = `nit = ${nit} AND factura = '${factura}'`;
      const result = await db.update(table, fields, params);
      if (result.affectedRows === 0) {
        throw new Error(
          "No se encontró el registro para actualizar el estado de correo."
        );
      }
      return { message: "Correo actualizado con éxito." };
    } catch (error) {
      return { message: error.message };
    }
  }

  async function updateRegister(req, res) {
    const { nit, fields } = req.body;
    const { role } = req.auth;

    if (!fields) {
      return request.error(
        req,
        res,
        { message: "Campos requeridos no proporcionados." },
        400
      );
    }

    const updateForAdmin = new Set([
      "tipo_entidad",
      "identificacion",
      "correo",
      "direccion",
      "telefono",
      "estado",
    ]);

    const updateForUser = new Set(["usuario", "nombre", "telefono"]);

    let allowedFields;
    if (role === "Administrador") {
      allowedFields = updateForAdmin;
    } else if (role === "Usuario") {
      allowedFields = updateForUser;
    } else {
      return request.error(
        req,
        res,
        { message: "Rol no autorizado para realizar la operación." },
        400
      );
    }

    try {
      const dataValues = fields[0];
      const dataFields = validateFields(dataValues, allowedFields);
      if (!dataFields) {
        return request.error(
          req,
          res,
          { message: "No estás autorizado para actualizar estos campos." },
          400
        );
      }
      const selectTable = `entities INNER JOIN users ON entities.entidad_id = users.entidad_id
                        INNER JOIN auth ON auth.usuario_id = users.usuario_id`;
      const params = `identificacion = ${nit}`;
      const executionUpdate = await db.update(selectTable, dataFields, params);
      if (executionUpdate.affectedRows === 0) {
        return request.error(
          req,
          res,
          { message: "No se encontró el registro para actualizar." },
          400
        );
      }
      return request.success(
        req,
        res,
        { message: "Registro actualizado con éxito." },
        200
      );
    } catch (error) {
      return request.error(
        req,
        res,
        {
          message: "Ocurrió un error al actualizar el registro.",
          Error: error,
        },
        500
      );
    }
  }

  return {
    addStatusEmails,
    updateRegister,
  };
};
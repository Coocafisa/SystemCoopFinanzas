const { validateFields } = require("../../functions/helpers.js");
const { validateUser } = require("../users/index.js");
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

    if (!fields || !nit || !role) {
      return request.error( req, res, { message: "Campos requeridos no proporcionados." }, 400 );
    }

    const updateForAdmin = new Set([
      "tipo_entidad",
      "identificacion",
      "correo",
      "estado",
      "telefono",
      "direcc",
      "nombre",
      "usuario",
      "accesos"
    ]);

    const updateForUser = new Set(["usuario", "nombre", "telefono", "direcc", "telefono"]);
    let allowedFields;
    if (role === "Administrador") {
      allowedFields = updateForAdmin;
    } else if (role === "Usuario") {
      allowedFields = updateForUser;
    } else {
      return request.error( req, res, { message: "Rol no autorizado para realizar la operación." }, 400 );
    }

    try {
      const dataFields = validateFields(fields, allowedFields);
      if (!dataFields) {
        return request.error( req, res, { message: "No estás autorizado para actualizar estos campos." }, 400 );
      }
      
      const {usuario_id} = await validateUser(nit);
      const selectTable = `authorizations
      INNER JOIN users ON authorizations.usuario_id = users.usuario_id
      INNER JOIN entities ON users.entidad_id = entities.entidad_id
      INNER JOIN auth ON users.usuario_id = auth.usuario_id`;
      const params = `users.usuario_id = '${usuario_id}'`;
      const executionUpdate = await db.update(selectTable, dataFields, params);
      if (executionUpdate.affectedRows === 0) {
        return request.error( req, res, { message: "No se encontró el registro para actualizar." }, 400 );
      }
      return request.success( req, res, { message: "Registro actualizado con éxito."}, 200 );
    } catch (error) {
      return request.error( req, res, { message: "Ocurrió un error al actualizar el registro." }, 500 );
    }
  };

  async function deleteRegister(req, res) {
        const { nit, selectTable } = req.body;
        const { role } = req.auth;

        if (!role) {
            return request.error(req, res, { message: "No autorizado." }, 403);
        }

        if (role !== "Administrador") {
            return request.error(req, res, { message: "No estás autorizado para realizar esta operación." }, 403);
        }

        if (!nit || !selectTable) {
            return request.error(req, res, { message: "Campos requeridos no proporcionados." }, 400);
        }

        const { usuario_id, entidad_id } = await validateUser(nit);
        console.log("Usuario_id: ", usuario_id, "entidad_id: ", entidad_id);
        if (!usuario_id && !entidad_id) {
            return request.error(req, res, { message: "Usuario no encontrado." }, 404);
        }
        try {
        const params = selectTable === "entities" ? `entidad_id = ${entidad_id}` : `usuario_id = '${usuario_id}'`;
        const executionUpdate = await db.remove(selectTable, params);

        if (!executionUpdate || executionUpdate.affectedRows === 0) {
            return request.error(req, res, { message: "No se encontró el registro para eliminar." }, 404);
        }

        return request.success(req, res, { message: "Registro eliminado con éxito." }, 200);
    } catch (error) {
        console.error("Error al eliminar registro:", error);
        return request.error(req, res, { message: "Ocurrió un error al eliminar el registro." }, 500);
    }
};
  return {
    addStatusEmails,
    updateRegister,
    deleteRegister
  };
};
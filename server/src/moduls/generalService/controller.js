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

    const updateForAdmin = ({
    entities: [
      "tipo_entidad",
      "identificacion",
      "nombre",
      "telefono",
      "direcc",
      "correo",
    ],
    users: [
      "rol",
      "activo",
    ],
    auth: [
      "pasword",
      "sesion",
    ],
    authorization: [
      "accesos",
      "estado"
    ]
  });

    const updateForUser = new Set({
      entities: [
        "nombre",
        "telefono",
        "direcc",
        "correo",
      ],
      auth: [
        "pasword",
      ]
    });
    let allowedFields;
    if (role === "Administrador") {
      allowedFields = updateForAdmin;
      console.log("Update for admin", allowedFields);
    } else if (role === "Usuario") {
      allowedFields = updateForUser;
    } else {
      return request.error( req, res, { message: "Rol no autorizado para realizar la operación." }, 400 );
    }

    /* try {
      const dataFields = validateFields(fields, allowedFields);
      if (!dataFields) {
        return request.error( req, res, { message: "No estás autorizado para actualizar estos campos." }, 400 );
      }
      
      const {usuario_id} = await validateUser(nit);
      console.log("Usuario ID: ", usuario_id);
      console.log("Data Fields: ", dataFields);
      0
      const executionUpdate = await db.update(selectTable, dataFields, params);
      console.log("Resultado de la actualizacion de usuario: ", executionUpdate);
      if (executionUpdate.affectedRows === 0) {
        return request.error( req, res, { message: "No se encontró el registro para actualizar." }, 400 );
      }
      return request.success( req, res, { message: "Registro actualizado con éxito."}, 200 );
    } catch (error) {
      return request.error( req, res, { message: "Ocurrió un error al actualizar el registro." }, 500 );
    } */
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
        return request.error(req, res, { message: "Ocurrió un error al eliminar el registro." }, 500);
    }
};
  return {
    addStatusEmails,
    updateRegister,
    deleteRegister
  };
};
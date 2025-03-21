const { validateFields } = require("../../functions/helpers.js");
const { validateUser } = require("../users/index.js");
const { validatePermissions } = require("../admin/index.js");
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

    if (fields.length === 0 || !nit || !role) {
      return request.error( req, res, { message: "Campos requeridos no proporcionados." }, 400 );
    }

    const updateForAdmin = {
    entities: [
      "identificacion",
      "nombre",
      "telefono",
      "direcc",
      "correo",
    ],
    users: [
      "usuario",
      "rol",
      "activo",
    ],
    auth: [
      "sessionId",
    ],
    authorizations: [
      "permits_id",
      "estado"
    ]
  };

    const updateForUser = {
      entities: [
        "nombre",
        "telefono",
        "direcc",
        "correo",
      ],

      users: [
        "usuario",
      ]
    };
    
    let allowedFields
    if (role === "Administrador") {
      allowedFields = updateForAdmin;
    } else if (role === "Usuario") {
      allowedFields = updateForUser;
    } else {
      return request.error( req, res, { message: "Rol no autorizado para realizar la operación." }, 400 );
    } 

    const dataFields = validateFields(allowedFields, fields);
    if (dataFields.error) {
      return request.error( req, res, { message: dataFields.message }, 401);
    }

  try {      
      let camposActualizados = 0;
      for (const table of Object.keys(dataFields)) {
        const updateFields = dataFields[table];
        if (updateFields && Object.keys(updateFields).length > 0) {
          let selectParams
          if (table === "entities") {
            selectParams = `identificacion = ${nit}`
          } else if (table === "authorizations") {
            const data = { consec_permit: nit, permiso: fields.permits_id };
            const validatePermit = await validatePermissions(data);
            if (validatePermit) {
              return request.error(req, res, { message: validatePermit.message }, validatePermit.status);
            }
            selectParams = `consec_permit = ${nit}`
          } else {
            const {usuario_id} = await validateUser(nit);
            if (!usuario_id) {
              return request.error(req, res, { message: "Usuario no encontrado." }, 404);
              }
              selectParams = `usuario_id = '${usuario_id}'`
          }
          const executionUpdate = await db.update(table, updateFields, selectParams);
          if (executionUpdate.affectedRows > 0) {
            camposActualizados++;
          }
        }
      }
      if (camposActualizados === 0) {
        return request.error( req, res, { message: "No se encontró el registro para actualizar." }, 400 );
      }
      return request.success( req, res, { message: "Registro actualizado con éxito."}, 200 );     
    } catch (error) {
      console.log("error: ", error);
      return request.error( req, res, { message: "Ocurrió un error al actualizar el registro." }, 500 );
    }
  };

  async function deleteRegister(req, res) {
    try {
        const { nit, selectTable } = req.body;
        const { role } = req.auth;

        if (!role || role !== "Administrador") {
          return request.error(req, res, { message: "No autorizado para realizar esta operación." }, 403);
      }

        if (!nit || !selectTable) {
            return request.error(req, res, { message: "Campos requeridos no proporcionados." }, 400);
        }

        const userData = await validateUser(nit);
        if (!userData) {
            return request.error(req, res, { message: "Error al validar el usuario." }, 500);
        }

        const { usuario_id, entidad_id } = userData;
        if (!usuario_id && !entidad_id) {
            return request.error(req, res, { message: "Usuario no encontrado." }, 404);
        }

        let params;
        if (selectTable === "entities") {
          params = `entidad_id = ${entidad_id}`;
        } else {
          params = `usuario_id = '${usuario_id}'`;
        }
        const executionUpdate = await db.remove(selectTable, params);
        if (executionUpdate.affectedRows === 0) {
          return request.error(req, res, { message: "No se encontró el registro para eliminar." }, 404);
      }
        return request.success(req, res, { message: 'Registro eliminado con éxito.' }, 200);
    } catch (error) {
        return request.error(req, res, { message: "Ocurrió un error al eliminar el registro." }, 500);
    }
};

async function deletePermits (req, res) {
  const { consec_permit } = req.body;
  const { role } = req.auth;

  if (!consec_permit || !role) {
    return request.error(req, res, { message: "Campos requeridos no proporcionados." }, 400);
  }

  if (role !== "Administrador") {
    return request.error(req, res, { message: "No autorizado para realizar esta operación." }, 403);
  }

  try {
    const table = "authorizations";
    const params = `consec_permit = ${consec_permit}`;
    const executionUpdate = await db.remove(table, params);
    if (executionUpdate.affectedRows === 0) {
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
    deleteRegister,
    deletePermits
  };
};
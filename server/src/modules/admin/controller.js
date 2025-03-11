const { validateFields } = require('../../functions/helpers');
const request  = require('../../red/request');
const { validateUser } = require('../users');
const table =  'pagopro'

module.exports = function(dbInsert) {
    let db = dbInsert;
    if (!db) {
        db = require('../../db/mysql');
    }
    async function queryInvoices(req, res) {
        const fields = [`nit, factura, fecfac, fecvcto, total, retencion, tot,
	        fecpago, pagfac, pagtot`];
        const params = `fecpago IS NOT NULL`;
        try {
            const results = await db.query(table, fields, params);
            return request.success(req, res, results, 200);
        } catch (error) {
            return request.error(req, res, error, 404);
        }
    };
    
    async function assignPermission(req, res) {
        const { identificacion, permiso } = req.body;
        const { role } = req.auth;

        if (!identificacion || !permiso || !role) {
            return request.error(req, res, { message: "Campos requeridos no proporcionados." }, 400);
        }

        let allowedPermissions
        if (role === "Administrador") {
            allowedPermissions = {
                authorizations: [
                    "usuario_id",
                    "permits_id",
                    "estado"
                ]
            }
        } else {
            return request.error(req, res, { message: "No estas autorizado para realizar esta operación." }, 403);
        }
        const { usuario_id, actividad } = await validateUser(identificacion);
        if (!usuario_id) {
            return request.error(req, res, { message: "Usuario no encontrado." }, 404);
        }

        if (!actividad) {
            return request.error(req, res, { message: "El usuario no esta disponible para asignarle permisos. Debe haber ingresar almenos una vez al sistema para adquirir permisos." }, 400);
        }

        
        
        const validatePermissions = { usuario_id: usuario_id, permits_id: permiso};
        const newPermission = await validateFields(allowedPermissions, validatePermissions);
        if (newPermission.error) {
            return request.error(req, res, { message: newPermission.message }, 401);
        }

        try {
            const assignPermission = await db.insert("authorizations", {usuario_id, permits_id: permiso});
        if (!assignPermission || assignPermission.affectedRows === 0) {
            return request.error(req, res, { message: "No se asignó permisos correctamente." }, 400);
        }
        return request.success(req, res, { message: "Permisos asignados con éxito." }, 200);
        } catch (error) {
            return request.error(req, res, { message: "Ocurrió un error al asignar permisos." }, 500);
        }
}

    return {
        queryInvoices,
        assignPermission
    }
}
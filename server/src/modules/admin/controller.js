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
            return request.successRequest(req, res, results, 200);
        } catch (error) {
            return request.faultRequest(req, res, error, 404);
        }
    };
    
    async function assignPermission(req, res) {
        const { identificacion, permiso } = req.body;
        const { role } = req.auth;

        if (!identificacion || !permiso || !role) {
            return request.faultRequest(req, res, { message: "Campos requeridos no proporcionados." }, 400);
        }

        let allowedPermissions;
        if (role === "Administrador") {
            allowedPermissions = {
                authorizations: [
                    "usuario_id",
                    "permits_id",
                    "estado"
                ]
            };
        } else {
            return request.faultRequest(req, res, { message: "No estas autorizado para realizar esta operación." }, 403);
        }

        try {
            
        const { usuario_id, actividad, rol } = await validateUser(identificacion);
        if (!usuario_id) {
            return request.faultRequest(req, res, { message: "Usuario no encontrado." }, 404);
        }

        if (!actividad) {
            return request.faultRequest(req, res, { message: "El usuario no esta disponible para asignarle permisos. Debe ingresar almenos una vez al sistema para adquirir permisos." }, 400);
        }

        if(rol === "Administrador") {
            return request.faultRequest(req, res, { message: "No puedes asignar permisos a un administrador." }, 400);
        }

        const existingPermission = await validatePermissions({ consec_permit: usuario_id, permiso });
        if (existingPermission) {
            return request.faultRequest(req, res, { message: existingPermission.message }, existingPermission.status);
        }

        const validatePermits = { usuario_id: usuario_id, permits_id: permiso };
        const newPermission = await validateFields(allowedPermissions, validatePermits);
        if (newPermission.error) {
            return request.faultRequest(req, res, { message: newPermission.message }, 401);
        }

            const assignPermission = await db.insert("authorizations", { usuario_id, permits_id: permiso });
            if (!assignPermission || assignPermission.affectedRows === 0) {
                return request.faultRequest(req, res, { message: "No se asignó permisos correctamente." }, 400);
            }
            return request.successRequest(req, res, { message: "Permisos asignados con éxito." }, 200);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return request.faultRequest(req, res, { message: "El permiso ya está asignado a este usuario." }, 400);
            }
            return request.faultRequest(req, res, { message: "Ocurrió un error al asignar permisos." }, 500);
        }
    };

    async function validatePermissions (data) {
        const { consec_permit, permiso } = data;
        const table = "authorizations";
        const fields = "permits_id";
        const params = `usuario_id IN (SELECT usuario_id FROM authorizations WHERE (consec_permit = '${consec_permit}' OR usuario_id = '${consec_permit}'))`;
        try {
            const results = await db.query(table, fields, params);
            const validate = results.some(item => String(item.permits_id) === String(permiso));
            if (validate) {
                return { message: "No se puede asignar el permiso ya asignado.", status: 400 };
            }
            return false;
    } catch (error) {
        return { message: "Ocurrió un error al validar los permisos.", status: 500 };
    }
};

    return {
        queryInvoices,
        assignPermission,
        validatePermissions
    }
}
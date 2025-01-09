var table = 'usuario';

module.exports = function (dbInsert) {
    let db = dbInsert;
    if (!db) {
        db = require('../../db/mysql.js');
    }

    async function consultUser() {
        const selecTable = table + ' INNER JOIN usuario ON proveedor.proveedor_id = usuario.proveedor_id';
        const fields = 'rol, proveedor.nit, razonsoc, correo';
        const params = 'nit = 1033646987';
        return await db.query(selecTable, fields, params);
    }

    async function validateUser(user) {
        const table = `entities INNER JOIN users ON entities.entidad_id = users.entidad_id
         INNER JOIN auth ON auth.usuario_id = users.usuario_id`;
         const fields = 'nombre, tipo_entidad, identificacion, usuario, rol, activo';
         const params = `identificacion = ${user} OR usuario = ${user}`;
        try {
            const [usuario] = await db.query(table, fields, params);
            return usuario;
        } catch (error) {
            return error;
        }
    }

    async function user (req, res) {
        if (req.auth && req.auth.name) {
            const dateUser = await validateUser(req.auth.name);
            return res.json({ 
                nombre: dateUser.nombre,
                user: req.auth.name,
                rol: req.auth.role,
                estado: dateUser.activo,
                entidad: dateUser.tipo_entidad,
            });
        } else {
            return res.json({ isAuthenticated: false, user: null });
        }
    }

    return {
        validateUser,
        user,
    }
};
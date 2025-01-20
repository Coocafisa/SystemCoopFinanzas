const request = require("../../red/request.js");

module.exports = function (dbInsert) {
  let db = dbInsert;
  if (!db) {
    db = require("../../db/mysql.js");
  }

  async function addStatusEmails (nit) {
    const table = "pagopro";
    const fields = "send_email = true";
    const params = `nit = ${nit}`;
    const result = await db.update(table, fields, params);
    if (result.affectedRows === 0) {
        return json({menssage: "No se actualizó el estado de los correos pendientes."});
    } else {
        return json({menssage: "Correos pendientes actualizados con éxito."});
    }
  };

  return {
    addStatusEmails,
  };
};
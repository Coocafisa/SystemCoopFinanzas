const express = require("express");
const fs = require("fs");
const schedule = require("node-schedule");
const pool = require("../../../connectionBD/db");
const { obtainData } = require("../../email/report/obtainData");

const router = express.Router();
let job;

router.post("/schedulEmailings", (req, res) => {
  const { hour, minute } = req.body;

  if (!hour || !minute || isNaN(hour) || isNaN(minute)) {
    return res.status(400).json({ message: "La hora o los minutos no son válidos." });
  }

  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return res.status(400).json({
      message: "La hora o los minutos están fuera del rango permitido.",
    });
  }

  const data = { selectHour: `${hour}:${minute}`, hour, minute };

  try {
    fs.writeFileSync("./services/email/report/hourprogram.json", JSON.stringify(data));
    res.status(200).json({ message: "La hora se ha guardado correctamente." });
    scheduleJob();
  } catch (error) {
    res.status(500).json({ message: "Error al guardar la hora." });
  }
});

async function queryDatabase(query, params = []) {
  try {
    const results = await pool.query(query, params);
    return results;
  } catch (error) {
    console.error("Error en la consulta a la base de datos:", error);
    throw new Error("Error en la base de datos.");
  }
}

async function processAndSendEmails(query, params = []) {
  const results = await queryDatabase(query, params);

  if (results.length > 0) {
    await obtainData(results);
    console.log("Correos enviados con éxito.");
  } else {
    console.log("No hay registros para enviar correos.");
  }
}

async function resendEmails() {
  const query = `
    SELECT pagopro.nit, razonsoc, factura, fecfac, fecvcto, total, retencion, tot,
           fecpago, pagfac, pagtot, str_to_date(fecpago, '%e-%b-%y') AS fecpago, fecpago AS fechas, correo
    FROM proveedor
    INNER JOIN pagopro ON proveedor.nit = pagopro.nit
    WHERE send_email = false`;
  await processAndSendEmails(query);
}

async function dailyMail() {
  const query = `
    SELECT pagopro.nit, razonsoc, factura, fecfac, fecvcto, total, retencion, tot,
    fecpago, pagfac, pagtot, str_to_date(fecpago, '%e-%b-%y') AS fecpago, fecpago AS fechas, correo
    FROM proveedor
    INNER JOIN pagopro ON proveedor.nit = pagopro.nit
    WHERE str_to_date(fecpago, '%e-%b-%y') = CURDATE() AND send_email = false`;
  await processAndSendEmails(query);
}

function scheduleJob() {
  try {
    const data = JSON.parse(
      fs.readFileSync("./services/email/report/hourprogram.json", "utf8")
    );
    const { hour, minute } = data;

    if (!hour || !minute) {
      console.log("No se encontró la hora programada.");
      return;
    }

    if (job) {
      job.cancel();
    }

    job = schedule.scheduleJob(`${minute} ${hour} * * *`, async () => {
      console.log("Ejecutando tarea programada.");
      await dailyMail();
      await resendEmails();
    });

    console.log(`Tarea programada para las ${hour}:${minute}.`);
  } catch (error) {
    console.error("Error al programar la tarea:", error);
  }
}

router.post("/resendEmails", async (req, res) => {
  try {
    await resendEmails();
    res.status(200).json({ message: "Correos pendientes enviados con éxito." });
  } catch (error) {
    console.error("Error al enviar correos pendientes:", error);
    res.status(500).json({ message: "Error al enviar correos pendientes." });
  }
});

module.exports = { router, scheduleJob };

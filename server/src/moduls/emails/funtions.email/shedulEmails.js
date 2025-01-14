const router = require("express").Router();
const fs = require("fs");
const schedule = require("node-schedule");
const { resendEmails } = require("../../../../services/email/emailsPending");
const controller = require("../index");
  
  let job;
  
  function scheduleJob() {
    try {
      const data = fs.readFileSync(
        "./services/email/report/hourprogram.json",
        "utf8"
      );
      const { hour, minute } = JSON.parse(data);
  
      if (hour === undefined || minute === undefined) {
        return "No se encontró la hora o los minutos para la programación.";
      }
  
      if (job) {
        job.cancel();
      }
  
      const { obtainData } = require("../../email/report/obtainData");


      job = schedule.scheduleJob(`${minute} ${hour} * * *`, async() => {
        try {
          const results = await controller.Emails();
          if (results.length > 0) {
            await obtainData(results);
          } else {
            return "No hay registros para el reporte.";
          }
        } catch (error) {
          return "Error al enviar el reporte.";
        }
      });
  
    } catch (error) {
      return "Error con el envio del correo.";
    }
  }

  router.post('/resendEmails', async (req, res) => {
    try {
      const results = await resendEmails();
      return res.status(200).json({ message: results });
    } catch (error) {
      return res.status(500).json({ message: "Error al enviar correos." });
    }
  });

module.exports = { scheduleJob };
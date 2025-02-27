const fs = require("fs");
const schedule = require("node-schedule");
const {Emails, pendingEmails} = require("../index");
const path = require("path");
const { obtainData }= require("./report/obtainData");
  
  let job;
  
  function scheduleJob() {
    try {
      const filePath = path.join(__dirname, "report/hourprogram.json");
      const data = fs.readFileSync(
        filePath,
        "utf8"
      );
      const { hour, minute } = JSON.parse(data);
  
      if (hour === undefined || minute === undefined) {
        throw new Error ("No se encontró el horario de envío del reporte.");
      }
  
      if (job) {
        job.cancel();
      }

      job = schedule.scheduleJob(`${minute} ${hour} * * *`, async() => {
        try {
          let data = [];
          const invoices = await Emails();
          const pendingInvoices = await pendingEmails();
          if (invoices.length > 0 || pendingInvoices.length > 0) {
            data = [...invoices, ...pendingInvoices];
          }
          if (data.length > 0) {
            await obtainData(data)
          }
        } catch (error) {
          throw new Error(`Error en el envio del reporte: ${error}`);
        }
      });
  
    } catch (error) {
      throw new Error(`Error en el envio del reporte: ${error}`);
    }
  }

module.exports = { scheduleJob };
const fs = require("fs");
const schedule = require("node-schedule");
const path = require("path");
const { Emails, pendingEmails } = require("../index");
const { obtainData } = require("./report/obtainData");

let job = null;

function loadScheduleConfig() {
    try {
        const filePath = path.join(__dirname, "report/hourprogram.json");
        const data = fs.readFileSync(filePath, "utf8");
        const { hour, minute } = JSON.parse(data);

        if (hour === undefined || minute === undefined) {
            throw new Error("No se encontró el horario de envío del reporte.");
        }
        return { hour, minute };
    } catch (error) {
        console.error(`Error al leer el horario de programación: ${error.message}`);
        return null;
    }
}

async function fetchPendingAndEmails() {
    try {
        const [invoices, pendingInvoices] = await Promise.all([
            Emails(),
            pendingEmails()
        ]);

        return [...invoices, ...pendingInvoices];
    } catch (error) {
        console.error(`Error obteniendo los emails: ${error.message}`);
        return [];
    }
}

function scheduleJob() {
    console.warn("Programando envío de correos...");
    const scheduleConfig = loadScheduleConfig();
    if (!scheduleConfig) return;

    const { hour, minute } = scheduleConfig;

    if (job) {
        job.cancel();
    }

    job = schedule.scheduleJob(`${minute} ${hour} * * *`, async () => {
        try {
            const data = await fetchPendingAndEmails();
            if (data.length > 0) {
                await obtainData(data);
                console.warn("Envio de correos iniciado.");
            }
        } catch (error) {
            console.error(`Error en el envío del reporte: ${error.message}`);
        }
    });
}

module.exports = { scheduleJob };

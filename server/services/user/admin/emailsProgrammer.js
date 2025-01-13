const express = require("express");
const router = express.Router();
const obtainTimer = require("../../email/report/hourprogram.json");
const { resendEmails } = require("./shedulEmails");

router.get("/timer", async (req, res) => {
    try {
        const { hour, minute } = obtainTimer;
        return res.status(200).json ({ hour, minute });
    } catch (error) {
        return res.status(500).json({ message: "Error en solicitud al servidor.", error });
    }
});

router.post('/resendEmails', async (req, res) => {
    try {
      await resendEmails();
      return res.status(200).json({ message: 'Correos pendientes enviados con exito.' });
    } catch (error) {
      return res.status(500).json({ message: "Error al enviar correos." });
    }
  });

module.exports = router;
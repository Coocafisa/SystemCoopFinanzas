const express = require('express');

const request = require('../../red/request');
const controller = require('./index');
const { verifyToken } = require('../../middleware/authMiddleware');

const router = express.Router();

router.post('/addUsers', verifyToken, async (req, res) => {
  try {
    const data = req.body;
    const register = await controller.addUsers(data);
    return register.status === 200
            ? request.success(req, res, {message: register.message}, register.status)
            : request.error(req, res, {message: register.message}, register.status);
  } catch (error) {
    return request.error(req, res, {message: `Error al procesar la solicitud: ${error.message}`}, 500);
  }
});

router.post('/addEntity', verifyToken, async (req, res) => {
  try {
    const data = req.body;
    const register = await controller.addEntity(data);
    return register.status === 200
            ? request.success(req, res, {message: register.message}, register.status)
            : request.error(req, res, {message: register.message}, register.status);
  } catch (error) {
    return request.error(req, res, {message: `Error al procesar la solicitud: ${error.message}`}, 500);
  }
});

router.post('/automaticRegistration', async (req, res) => {
  try {
    const data = req.body;
    await controller.automaticRegistration(req, res, data);
  } catch (error) {
    return request.error(req, res, {message: `Error al procesar la solicitud: ${error.message}`}, 500);
  }
});

router.get('/verifyTokenAutoregister', controller.verifyTokenAutoregister);

module.exports = router;

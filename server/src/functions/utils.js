const jwt = require("jsonwebtoken");
const config = require("../config");

async function createUserId(rol, identificacion) {
    let consec;
    if (rol === "Administrador") {
      consec = "-1A";
    } else {
      consec = "-2U";
    }
    const dataIdentificacion = rol.substring(0, 5)+String(identificacion)+consec;
    return dataIdentificacion;
  }

  async function confirmToken(token) {
    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      const now = Math.floor(Date.now() / 1000);
      const exp = decoded.exp;
      const remainingTime = exp - now;
      if (remainingTime > 0) {
        return decoded;
      }
    } catch (error) {
      return { status: 401, message: "Token invalido o expirado.", redirect: "/" };
    }
  }
  module.exports = { 
    createUserId,
    confirmToken,
};
const crypto = require("crypto");

function formatDate(dateString) {
    if (!dateString || isNaN(new Date(dateString))) {
        return "Sin fecha";
    }

    const options = { day: '2-digit', month: 'numeric', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', options);
}

function generarToken () {
    return crypto.randomBytes(32).toString('hex');
};

function formatPesos (number) {
    return new Intl.NumberFormat('es-Co', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
        currencyDisplay: 'symbol',
        useGrouping: true
    }).format(number);
}

  function validateFields(dataFields, data) {
    const clausesByCategory = {};
    let unauthorizedFields = [];
    const allAuthorizedFields = Object.values(dataFields).flat();

    for (let [category, fields] of Object.entries(dataFields)) {
      const validFields = fields.filter((field) => data.hasOwnProperty(field));
      const unauthorized = Object.keys(data).filter((field) => !allAuthorizedFields.includes(field));
      unauthorizedFields = [...unauthorizedFields, ...unauthorized]; 

    if (validFields.length > 0) {
      const setClause = validFields.map((field) => `${field} = '${data[field]}'`).join(", ");
      clausesByCategory[category] = setClause;
    }
  }
  if (unauthorizedFields.length > 0) {
    return { error: true, message: "Actualización no autorizada."};
  }
  return clausesByCategory
  }


module.exports = { formatDate, generarToken, formatPesos, validateFields };

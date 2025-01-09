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

module.exports = { formatDate, generarToken, formatPesos };

const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const generarReportePDF = async (data) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const imgTag = `<img src="data:image/png;base64,${fs
    .readFileSync(path.resolve("public/images/Logo.cooperativa.png"))
    .toString("base64")}" alt="Logo" />`;

  const htmlContent = `
  <!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reporte de Pagos</title>
    <style>
      body {
        font-family: "Arial", sans-serif;
        margin: 0;
        padding: 20px;
        background-color: #f4f7f6;
        color: #333;
      }
      .header {
        text-align: center;
        margin-bottom: 20px;
      }
      .header img {
        width: 150px;
        margin-right: 50px;
      }
      .text-title {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
      }
      .header h1 {
        color: #35653d;
        font-size: 50px;
        margin-top: -50px;
      }
      .header h2 {
        color: #0f3e22;
        font-size: 95px;
        margin-top: -130px;
      }
      .header h3 {
        color: #ffffff;
        font-size: 28px;
        margin-right: 200px;
      }
      .circle-de {
        background: #0f3e22;
        width: 45px;
        border-radius: 20px;
        margin-top: -45px;
      }
      .description {
        text-align: center;
        color: #333;
        font-size: 20px;
        margin-top: -40px;
        margin-bottom: 20px;
      }
      .table-container {
        max-width: 100%;
        margin: 0 auto;
        background: linear-gradient(145deg, #f5f5f5, #e0e0e0);
        border-radius: 12px;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        padding: 20px;
      }
      .table-header-info {
        background-color: #4caf50;
        color: white;
        padding: 12px 20px;
        font-size: 16px;
        border-bottom: 2px solid #2c6d2f;
        display: flex;
        justify-content: space-between;
        font-family: "Roboto", sans-serif;
        letter-spacing: 1px;
      }
      .table {
        width: 100%;
        border-collapse: collapse;
        margin: 0;
        font-size: 14px;
        font-family: "Roboto", sans-serif;
        color: #333;
      }
      .table thead {
        background-color: #4caf50;
        color: white;
      }
      .table thead th {
        padding: 12px;
        text-align: center;
        font-size: 14px;
        letter-spacing: 0.5px;
      }
      .factura-container {
        margin: 20px 0;
        padding: 20px;
        background-color: #fff;
        border: 1px solid #e0e0e0;
        border-radius: 12px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
      }
      .factura-container:hover {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        transform: translateY(-5px);
      }
      .factura-header {
        background-color: #4caf50;
        color: white;
        padding: 12px;
        font-weight: bold;
        text-align: center;
        font-size: 12px;
        border-radius: 10px;
        margin-bottom: 8px;
        text-transform: uppercase;
      }
      .factura-details {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
        padding: 0 20px;
        font-size: 14px;
      }
      .factura-details div {
        padding: 15px;
        background-color: #f5f5f5;
        border-radius: 8px;
        border: 1px solid #ddd;
        transition: all 0.3s ease;
      }
      .factura-details div:hover {
        background-color: #e0e0e0;
      }
      .factura-details strong {
        color: #4caf50;
        font-weight: bold;
      }
      .factura-details div span {
        color: #333;
        font-size: 14px;
      }
      .footer {
        margin-top: 30px;
        text-align: center;
        color: #777;
        font-size: 12px;
        font-family: "Roboto", sans-serif;
        padding: 10px;
        background-color: #f5f5f5;
        border-radius: 8px;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <div class="text-title">
        ${imgTag}
        <h1>
          Reporte
          <h3 class="circle-de">de</h3>
        </h1>
      </div>
      <h2><em>Pagos</em></h2>
    </div>

    <div class="description">
      A continuación, encontrarás un resumen detallado de los pagos que se han
      realizado durante el periodo actual.
    </div>

    <div class="table-container">
      <div class="table-header-info">
        <div>NIT: ${data[0].nit}</div>
        <div>Razón Social: ${data[0].razonsoc}</div>
        <div>Fecha Emisión: ${data[0].fecemi}</div>
      </div>

      <!-- Generación de facturas con su propia sección -->
      ${data .map( (item) => `
      <div class="factura-container">
        <div class="factura-header">
          <h3>Factura: ${item.factura}</h3>
        </div>
        <div class="factura-details">
          <div>
            <strong>Fecha Factura:</strong><br />
            <span>${item.fecfac}</span>
          </div>
          <div>
            <strong>Fecha Vencimiento:</strong><br />
            <span>${item.fecvcto}</span>
          </div>
          <div>
            <strong>Total:</strong><br />
            <span>${item.total}</span>
          </div>
          <div>
            <strong>Retención:</strong><br />
            <span>${item.retencion}</span>
          </div>
          <div>
            <strong>Neto:</strong><br />
            <span>${item.tot}</span>
          </div>
          <div>
            <strong>Fecha Pago:</strong><br />
            <span>${item.fecpago}</span>
          </div>
          <div>
            <strong>Pago Factura:</strong><br />
            <span>${item.pagfac}</span>
          </div>
          <div>
            <strong>Valor Pago:</strong><br />
            <span>${item.pagtot}</span>
          </div>
        </div>
      </div>
      ` ) .join("")}
    </div>

    <div class="footer">
      Este informe es generado automáticamente y es confidencial. Por favor, no
      lo comparta sin autorización.
    </div>
  </body>
</html>`;

  await page.setContent(htmlContent, {
    waitUntil: "load",
  });
  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "20px",
      bottom: "20px",
      left: "20px",
      right: "20px",
    },
    scale: 0.8,
  });

  await browser.close();
  return pdfBuffer;
};

const generarResumenPDF = async (data) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const imgTag = `<img src="data:image/png;base64,${fs
    .readFileSync(path.resolve("public/images/Logo.cooperativa.png"))
    .toString("base64")}" alt="Logo" />`;

  const htmlContent = `
  <!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reporte de Pagos a Proveedores</title>
    <style>
      body {
        font-family: "Arial", sans-serif;
        margin: 0;
        padding: 20px;
        background-color: #f4f7f6;
        color: #333;
      }
      .header {
        text-align: center;
        margin-bottom: 20px;
      }
      .header img {
        width: 150px;
        margin-right: 50px;
      }
      .text-title {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
      }
      .header h1 {
        color: #35653d;
        font-size: 50px;
        margin-top: -50px;
      }
      .header h2 {
        color: #0f3e22;
        font-size: 95px;
        margin-top: -130px;
      }
      .header h3 {
        color: #ffffff;
        font-size: 28px;
        margin-right: 200px;
      }
      .circle-de {
        background: #0f3e22;
        width: 45px;
        border-radius: 20px;
        margin-top: -45px;
      }
      .description {
        text-align: center;
        color: #333;
        font-size: 20px;
        margin-top: -40px;
        margin-bottom: 20px;
      }
      .table-container {
        max-width: 1200px;
        margin: 0 auto;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }
      .table-header-info {
        background-color: #4caf50;
        color: white;
        padding: 12px 20px;
        font-size: 16px;
        border-bottom: 2px solid #2c6d2f;
        display: flex;
        justify-content: space-between;
        font-family: "Roboto", sans-serif;
        letter-spacing: 1px;
      }
      .table {
        width: 100%;
        border-collapse: collapse;
        margin: 0;
      }
      .table thead {
        background-color: #35653d;
        color: white;
      }
      .table thead th {
        padding: 12px 15px;
        font-size: 16px;
        text-transform: uppercase;
      }
      .table tbody tr {
        transition: background-color 0.3s ease;
      }
      .table tbody tr:nth-child(even) {
        background-color: #f4f7f6;
      }
      .table tbody tr:hover {
        background-color: #e1f3e0;
      }
      .table tbody td {
        padding: 12px 15px;
        font-size: 14px;
        text-align: center;
        border-bottom: 1px solid #ddd;
      }
      .table tbody td.highlight {
        font-weight: bold;
        color: #35653d;
      }
      .footer {
        margin-top: 30px;
        text-align: center;
        color: #777;
        font-size: 12px;
        font-family: "Roboto", sans-serif;
        padding: 10px;
        background-color: #f5f5f5;
        border-radius: 8px;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <div class="text-title">
        ${imgTag}
        <h1>
          Reporte
          <h3 class="circle-de">de</h3>
        </h1>
      </div>
      <h2><em>Pagos</em></h2>
    </div>

    <div class="description">
      A continuación, encontrarás un resumen detallado de los proveedores
      notificados por pagos realizados durante el periodo actual.
    </div>

    <div class="table-container">
      <div class="table-header-info">
        <div>Fecha Emisión: ${data[0].fecemi}</div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>Nit</th>
            <th>Razón Social</th>
            <th>Factura</th>
            <th>Fecha Factura</th>
            <th>Fecha Pago</th>
            <th>Correo</th>
          </tr>
        </thead>
        <tbody>
          ${data .map( (item) => `
          <tr>
            <td>${item.nit}</td>
            <td>${item.razonsoc}</td>
            <td>${item.factura}</td>
            <td>${item.fecfac}</td>
            <td>${item.fecpago}</td>
            <td>${item.correo}</td>
          </tr>
          ` ) .join("")}
        </tbody>
      </table>
    </div>

    <div class="footer">Este informe es generado automáticamente.</div>
  </body>
</html>`;

  await page.setContent(htmlContent, {
    waitUntil: "load",
  });
  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "20px",
      bottom: "20px",
      left: "20px",
      right: "20px",
    },
    scale: 0.8,
  });

  await browser.close();
  return pdfBuffer;
};
module.exports = { generarReportePDF, generarResumenPDF };
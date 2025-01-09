"use client";
import React, { useEffect, useState } from "react";
import Table from "@/components/common/table";
import { queryInvoices } from "@/api/authenticated/invoiceService";
import { ProtectedRoute } from "@/components/middleware";
export default function Invoices() {
  const [data, setInvoices] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      const invoices = await queryInvoices(setError);
      setInvoices(invoices);
    };
    fetchInvoices();
  }, []);

  const title = "Tus Facturas";
  const headers = [
    "Factura", "Fecha Factura", "Fecha Vencimiento", "Total", "Retencion"
  ];

  const fields = [
    'factura' || "Sin factura",
    'fecfac' || "Sin fecha",
    'fecvcto' || "Sin fecha",
    'total' || "0",
    'retencion' || "0",
  ];

  const expandedData = [
    { label: "Neto", value: data[0]?.tot || "0", },
    { label: "Fecha Pago", value: data[0]?.fecpago || "0",},
    { label: "Pago Factura", value: data[0]?.pagfac || "0",},
    { label: "Valor Pago", value: data[0]?.pagtot || "0", }
  ];

  return (
    <>
    <ProtectedRoute allowedRoles={["Proveedor"]}/>
    <Table
      data={data}
      title={title}
      fields={fields}
      headers={headers}
      expandedData={expandedData}
      error={error}
      keysToSearch={['factura', 'fecfac', 'fecvcto']}
    />
    </>
  );
}

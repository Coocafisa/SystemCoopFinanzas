"use client"
import React, { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/middleware/protecte-route";
import TableInvoices from "@/components/common/table_invoices";
import { queryinvoicepending } from "@/api/requestUsers/invoiceService";

export default function InvoicePending() {
    const [data, setInvoicesPending] = useState([]);

    useEffect(() => {
        const fetchInvoices = async () => {
            const invoices = await queryinvoicepending();
            setInvoicesPending(invoices);
        };
        fetchInvoices();
    }, []);

    const title = "Tus Facturas Pendientes";
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
        <TableInvoices
      data={data}
      title={title}
      fields={fields}
      headers={headers}
      expandedData={expandedData}
      keysToSearch={['factura', 'fecfac', 'fecvcto']}
    />
        </>
    );  
};
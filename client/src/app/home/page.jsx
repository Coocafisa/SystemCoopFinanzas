"use client";
import ResultTable from "@/components/common/result_table";
import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/middleware/middleware";
import { consultPaymentEntities } from "@/api/requestAdmin/querysAdmin";
export default function Homepage() {
    const [payments, setPayments] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const paymentsData = await consultPaymentEntities();
            console.log("Consulta de pagos: ", paymentsData);
            setPayments(paymentsData);
        }
        fetchData();
        console.log("Consulta de pagos: ", payments);
    }, []);
    return (
        <>
        <ProtectedRoute allowedRoles={["Administrador"]}/>
        <ResultTable data={payments} keysToSearch={['nit', 'factura', 'fecpago', 'fecfac']} title="Pagos Realizados"
         headers={["Nit", "Factura", "Fecha Factura", "Fecha Vencimiento", "Total", "Retención",
                "Neto", "Fecha Pago", "Pago Factura", "Valor Pago",]}
                fields={['nit', 'factura', 'fecfac', 'fecvcto', 'total', 'retencion', 'tot',
                    'fecpago', 'pagfac', 'pagtot']} 
        />
        </>

    );
}

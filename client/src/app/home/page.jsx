"use client";
import { ProtectedRoute } from "../../components/middleware/middleware";
import ResultTable from "@/components/common/result_table";
import { useState, useEffect } from "react";
import { consultPaymentEntities } from "../../api/requestAdmin/querysAdmin";
export default function Homepage() {
    const [payments, setPayments] = useState([]);
    const [alert, setAlert] = useState("");
    useEffect(() => {
        const fetchData = async () => {
            const paymentsData = await consultPaymentEntities(setAlert);
            setPayments(paymentsData);
        }
        fetchData();
    }, []);
    return (
        <>
        <ProtectedRoute allowedRoles={["Administrador"]}/>
        <ResultTable data={payments} keysToSearch={['nit', 'factura', 'fecpago', 'fecfac']} title="Pagos Realizados"
         headers={["Nit", "Factura", "Fecha Factura", "Fecha Vencimiento", "Total", "Retención",
                "Neto", "Fecha Pago", "Pago Factura", "Valor Pago",]}
                fields={['nit', 'factura', 'fecfac', 'fecvcto', 'total', 'retencion', 'tot',
                    'fecpago', 'pagfac', 'pagtot']} error={alert}
        />
        </>

    );
}

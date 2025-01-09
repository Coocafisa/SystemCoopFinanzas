"use client";
import { ProtectedRoute } from "../../components/middleware";
import ResultTable from "@/components/common/result_table";
import { useState, useEffect } from "react";
import { getPaymentsSuppliers } from "../../api/requestAdmin/querysAdmin";
export default function Homepage() {
    const [paymentsSuppliers, setPaymentsSuppliers] = useState([]);
    const [alert, setAlert] = useState("");
    useEffect(() => {
        const fetchData = async () => {
            const paymentsSuppliersData = await getPaymentsSuppliers(setAlert);
            setPaymentsSuppliers(paymentsSuppliersData);
        }
        fetchData();
    }, []);
    return (
        <>
        <ProtectedRoute allowedRoles={["Administrador"]}/>
        <ResultTable data={paymentsSuppliers} keysToSearch={['nit', 'factura', 'fecpago', 'fecfac']} title="Pagos Realizados a Provedores"
         headers={["Nit", "Factura", "Fecha Factura", "Fecha Vencimiento", "Total", "Retención",
                "Neto", "Fecha Pago", "Pago Factura", "Valor Pago",]}
                fields={['nit', 'factura', 'fecfac', 'fecvcto', 'total', 'retencion', 'tot',
                    'fecpago', 'pagfac', 'pagtot']} error={alert}
        />
        </>

    );
}

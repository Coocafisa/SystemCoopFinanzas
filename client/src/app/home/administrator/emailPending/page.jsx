"use client";
import ResultTable from "@/components/common/result_table";
import { useState, useEffect } from "react";
import { queryEmailsPending } from "@/api/requestAdmin/querysAdmin";
import HoraForm from "@/components/layout/form_hour_email";
import { ProtectedRoute } from "@/components/middleware/protecte-route";

export default function PendingEmails() {
    const [pendingEmails, setPendingEmails] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const pendingEmailsData = await queryEmailsPending();
            setPendingEmails(pendingEmailsData);
        }
        fetchData();
    }, []);

    const title = "Correos Pendientes";
    const headers = [
        "NIT",
        "Factura",
        "Fecha Pago",
        "Razón Social",
        "Correo Electrónico"
    ];

    const fields = [
        "nit",
        "factura",
        "fecpago",
        "razonsoc",
        "correo"
    ];

    return (
        <>
        <ProtectedRoute allowedRoles={["Administrador"]}/>
        <HoraForm btnEmails={true}/>
        <ResultTable data={pendingEmails} title={title} headers={headers} fields={fields}/>
        </>
    );
}
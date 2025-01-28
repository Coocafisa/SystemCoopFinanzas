"use client";
import ResultTable from "@/components/common/result_table";
import { useState, useEffect } from "react";
import { queryEmailsPending } from "@/api/requestAdmin/querysAdmin";
import HoraForm from "@/components/layout/formhouremail";
import { ProtectedRoute } from "../../../../components/middleware/middleware";
import { resendEmails } from "@/api/requestAdmin/servicesAdmin";

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

    const handleSubmit = async (event) => {
        event.preventDefault();
        await resendEmails();
    }

    return (
        <>
        <ProtectedRoute allowedRoles={["Administrador"]}/>
        <button onClick={handleSubmit} className="btn-resend"> Enviar Emails </button>
        <HoraForm/>
        <ResultTable data={pendingEmails} title={title} headers={headers} fields={fields}/>
        </>
    );
}
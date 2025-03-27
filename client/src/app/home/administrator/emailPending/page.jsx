"use client";
import ResultTable from "@/components/common/result_table";
import { useState, useEffect } from "react";
import { queryEmailsPending } from "@/api/requestAdmin/querysAdmin";
import HoraForm from "@/components/layout/form_hour_email";

export default function PendingEmails() {
    const [pendingEmails, setPendingEmails] = useState([]);
    const [resendEmails, setResendEmails] = useState(false);
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
        "nombre",
        "correo"
    ];

    if (pendingEmails.length > 0) {
        setResendEmails(true);
    }

    return (
        <>
        <HoraForm btnEmails={true} ofAction={resendEmails}/>
        <ResultTable data={pendingEmails} title={title} headers={headers} fields={fields} keysToSearch={["nit", "factura", "nombre"]}/>
        </>
    );
}
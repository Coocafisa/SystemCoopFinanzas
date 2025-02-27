"use client";
import { useState, useEffect } from "react";
import ResultTable from "@/components/common/result_table";
import { queryEmails } from "@/api/requestAdmin/querysAdmin";
import HoraForm from "@/components/layout/form_hour_email";
import { ProtectedRoute } from "../../../../components/middleware/protecte-route";

export default function Emails() {
    const [email, setEmail] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const email = await queryEmails();
            setEmail(email)
        }
        fetchData();
    }, []);

    const title = "Correos Programados";
    const headers = [
        "NIT",
        "Factura",
        "Fecha Pago",
        "Razón Social",
        "Correo Electrónico"
    ];

    const fields = [
        "identificacion",
        "factura",
        "fecpago",
        "nombre",
        "correo"
    ];

    return (
        <>
        <ProtectedRoute allowedRoles={["Administrador"]}/>
        <ResultTable data={email} title={title} headers={headers} fields={fields}/>
        <HoraForm/>
        </>
    )
}
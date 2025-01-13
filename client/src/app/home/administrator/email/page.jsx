"use client";
import { useState, useEffect } from "react";
import ResultTable from "@/components/common/result_table";
import { queryEmails } from "@/api/requestAdmin/querysAdmin";
import HoraForm from "@/components/layout/formhouremail";
import { ProtectedRoute } from "../../../../components/middleware";

export default function Emails() {
    const [email, setEmail] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const email = await queryEmails(setError);
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
        "nit",
        "factura",
        "fecpago",
        "razonsoc",
        "correo"
    ];

    return (
        <>
        <ProtectedRoute allowedRoles={["Administrador"]}/>
        <ResultTable data={email} title={title} headers={headers} fields={fields} error={error} />
        <HoraForm />
        </>
    )
}
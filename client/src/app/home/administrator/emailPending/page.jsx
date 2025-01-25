"use client";
import ResultTable from "@/components/common/result_table";
import { useState, useEffect } from "react";
import { queryEmailsPending } from "@/api/requestAdmin/querysAdmin";
import HoraForm from "@/components/layout/formhouremail";
import { ProtectedRoute } from "../../../../components/middleware/middleware";
import { resendEmails } from "@/api/authenticated/adminService";
import { Loader } from "@/components/common/preloader";
import { useAlertState } from "@/components/utils/alertState";

export default function PendingEmails() {
    const [pendingEmails, setPendingEmails] = useState([]);
    const { alert, setAlert, type, setType, loading, setLoading } = useAlertState();
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const pendingEmailsData = await queryEmailsPending(setAlert);
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
        setLoading(true);
        await resendEmails(setMessage, setType, setLoading);
    }

    return (
        <>
        <ProtectedRoute allowedRoles={["Administrador"]}/>
        <button onClick={handleSubmit} className="btn-resend"> Enviar Emails </button>
        <HoraForm/>
        <ResultTable data={pendingEmails} title={title} headers={headers} fields={fields} error={alert} />
        {loading && <Loader alert={message} type={type}/>}
        </>
    );
}
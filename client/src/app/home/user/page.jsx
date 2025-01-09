"use client";
import IndexLayout from "../layout";
import { useState, useEffect } from "react";
import ResultTable from "@/components/common/result_table";
import { queryUsers } from "@/api/authenticated/queryService";
import { ProtectedRoute } from "../../../components/middleware";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const usersData = await queryUsers(setError)
            setUsers(usersData)
            }
        fetchData();
    }, []);

    const title = "Usuarios";
    const headers = [
        "#",
        "NIT",
        "Rol",
        "Razón Social",
        "Correo",
        "Fecha de Registro",
    ];

    const fields = [
        "num",
        "nit",
        "rol",
        "razonsoc",
        "correo",
        "fecha_reg"
    ];
    return (
        <IndexLayout>
            if (error) return <p style={{ color: "red" }}>{error}</p>;
            <ProtectedRoute/>
                <ResultTable
                    title={title}
                    headers={headers}
                    data={users}
                    keysToSearch={['nit', 'rol', 'razonsoc', 'correo', 'fecha_reg']}
                    fields={fields}
                    error={error}
                />
        </IndexLayout>
    );
}

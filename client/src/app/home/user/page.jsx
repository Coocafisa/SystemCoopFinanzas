"use client";
import { useState, useEffect } from "react";
import ResultTable from "@/components/common/result_table";
import { queryUsers } from "@/api/authenticated/queryService";
import { ProtectedRoute } from "../../../components/middleware/middleware";

export default function Users() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const usersData = await queryUsers();
            console.log("Consulta de usuarios34: ", usersData);
            setUsers(usersData)
            console.log("Consulta de usuarios: ", users);
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
    <>
    <ProtectedRoute allowedRoles={["Administrador"]}/>
    <ResultTable
        title={title}
        headers={headers}
        data={users}
        keysToSearch={['nit', 'rol', 'razonsoc', 'correo', 'fecha_reg']}
        fields={fields} />
        </>
    );
}

"use client";
import { useState, useEffect } from "react";
import ResultTable from "@/components/common/result_table";
import { queryPermits, queryUsers } from "@/api/requestUsers/queryUsers";
import { ProtectedRoute } from "../../../components/middleware/protecte-route";
import { getSession } from "@/api/requestServices/sessionService";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [rol, setRol] = useState("");
    const [permissions, setPermissions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const usersData = await queryUsers();
            const {role, user} = await getSession();
            const permits = await queryPermits();
            setPermissions(permits);
            const filteredUsers = usersData.filter((data => data.identificacion !== user));
            setUsers(filteredUsers);
            setRol(role);
            }
        fetchData();
    }, []);
    const title = "Usuarios";
    const headers = [
        "#",
        "NIT",
        "Rol",
        "Nombre",
        "Correo",
        "Fecha de Registro",
        "Acciones"
    ];

    const fields = [
        "num",
        "identificacion",
        "rol",
        "nombre",
        "correo",
        "fech_reg"
    ];
    return (
    <>
    <ProtectedRoute allowedRoles={["Administrador"]}/>
    <ResultTable
    title={title}
    headers={headers}
    data={users}
    keysToSearch={['identificacion', 'rol', 'nombre', 'correo', 'fech_reg']}
    fields={fields}
    isAction={true}
    rol={rol}
    editTitle={"Edicción de Usuario"}
    selectTable={"users"}
    aditionalData={permissions}
    isPermit={true}
    />
        </>
    );
}

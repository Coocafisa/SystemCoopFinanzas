"use client";
import { useState, useEffect } from "react";
import ResultTable from "@/components/common/result_table";
import { queryUsers } from "@/api/requestUsers/queryUsers";
import { ProtectedRoute } from "../../../components/middleware/middleware";
import { getSession } from "@/api/requestServices/sessionService";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [rol, setRol] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const usersData = await queryUsers();
            setUsers(usersData)
            const {role} = await getSession();
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
        keysToSearch={['nit', 'rol', 'razonsoc', 'correo', 'fecha_reg']}
        fields={fields}
        isAction={true}
        rol={rol}
        editTitle={"Edicción de Usuario"}
        />
        </>
    );
}

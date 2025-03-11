"use client";
import { useState, useEffect } from "react";
import ResultTable from "@/components/common/result_table";
import { ProtectedRoute } from "@/components/middleware/protecte-route";
import { queryEntities } from "@/api/requestUsers/queryUsers";
import { getSession } from "@/api/requestServices/sessionService";

export default function Entities() {
    const [entities, setEntities] = useState([]);
    const [rol, setRol] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const entitiesData = await queryEntities();
            const {role, user} = await getSession();
            const filteredEntities = entitiesData.filter((data => data.identificacion !== user));
            setEntities(filteredEntities);
            setRol(role);
            }
        fetchData();
    }, []);

    const title = "Entidades Registradas";
    const headers = [
        "#",
        "NIT",
        "Nombre",
        "Correo",
        "Direccion",
        "Telefono",
        "Fecha de Registro",
        "Acciones"
    ];

    const fields = [
        "num",
        "identificacion",
        "nombre",
        "correo",
        "direcc",
        "telefono",
        "fech_reg"
    ];
    return (
    <>
    <ProtectedRoute allowedRoles={["Administrador"]}/>
    <ResultTable
        title={title}
        headers={headers}
        data={entities}
        keysToSearch={['identificacion', 'nombre', 'correo', 'fech_reg']}
        fields={fields}
        isAction={true}
        rol={rol}
        editTitle={"Edicción de Entidad"}
        selectTable={"entities"}
        isNewRegister={true}
        />
        </>
    );
}

"use client";
import { useState, useEffect } from "react";
import ResultTable from "@/components/common/result_table";
import { ProtectedRoute } from "@/components/middleware/middleware";
import { queryEntities } from "@/api/requestUsers/queryUsers";
import { getSession } from "@/api/requestServices/sessionService";

export default function Entities() {
    const [entities, setEntities] = useState([]);
    const [rol, setRol] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const entitiesData = await queryEntities();
            setEntities(entitiesData);
            const {role} = await getSession();
            setRol(role);
            }
        fetchData();
    }, []);

    const title = "Entidades Registradas";
    const headers = [
        "#",
        "NIT",
        "Tipo de Entidad",
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
        "tipo_entidad",
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
        keysToSearch={['identificacion', 'tipo_entidad', 'nombre', 'correo', 'fech_reg']}
        fields={fields}
        isAction={true}
        rol={rol}
        editTitle={"Edicción de Entidad"}
        />
        </>
    );
}

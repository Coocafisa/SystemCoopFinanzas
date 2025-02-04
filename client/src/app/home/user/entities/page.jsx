"use client";
import { useState, useEffect } from "react";
import ResultTable from "@/components/common/result_table";
import { ProtectedRoute } from "@/components/middleware/middleware";
import { queryEntities } from "@/api/requestUsers/queryUsers";

export default function Entities() {
    const [entities, setEntities] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const entitiesData = await queryEntities();
            setEntities(entitiesData);
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
        fields={fields} />
        </>
    );
}

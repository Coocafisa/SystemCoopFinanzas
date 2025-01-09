"use client";   
import { useEffect, useState } from "react";
import ResultTable from "@/components/common/result_table";
import { getSuppliers } from "@/api/authenticated/adminService";
import { ProtectedRoute } from "@/components/middleware";

export default function Suppliers() {
    const [suppliers, setSuppliers] = useState([]);
    const [alert, setAlert] = useState("");

    useEffect(() => {
        const getSuppliersData = async () => {
            const data = await getSuppliers(setAlert);
            setSuppliers(data);
        };
        getSuppliersData();
    }, []);

    const title = "Proveedores";
    const headers = [
        "#",
        "NIT",
        "Razón Social",
        "Dirección",
        "Correo Electrónico",
        "Celular",
        "Teléfono",
        "Fecha de Registro",
    ];

    const fields = [
        "num",
        "nit",
        "razonsoc",
        "direcc",
        "correo",
        "celular",
        "telefono",
        "fecha_registro"
    ];
    return (
        <>
            <ProtectedRoute allowedRoles={["Administrador"]}/>
                <ResultTable
                    title={title}
                    headers={headers}
                    data={suppliers}
                    fields={fields}
                    error={alert}
                    keysToSearch={['nit', 'razonsoc', 'correo', 'fecha_registro']}
                />
        </>
    );
}
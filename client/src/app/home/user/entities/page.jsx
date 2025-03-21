"use client";
import { useState, useEffect } from "react";
import ResultTable from "@/components/common/result_table";
import { queryEntities } from "@/api/requestUsers/queryUsers";
import { ProtectedRoute } from "@/components/middleware/protecte-route";
import { getSession } from "@/api/requestServices/sessionService";

export default function Entities() {
  const [entities, setEntities] = useState([]);
  const [rol, setRol] = useState("");

  const fetchData = async () => {
    const [usersData, session] = await Promise.all([
      queryEntities(),
      getSession()
    ]);
    const { role, user } = session;

    const filteredUsers = usersData.filter(
      (data) => data.identificacion !== user
    );
    setEntities(filteredUsers);
    setRol(role);
  };

  useEffect(() => {
    fetchData();
  }, []);
  const title = "Entidades Registradas";
  const headers = [
    "#",
    "Nit",
    "Nombre",
    "Direccion",
    "Telefono",
    "Correo",
    "Fecha de Registro",
    "Acciones",
  ];

  const fields = [
    "num",
    "identificacion",
    "nombre",
    "direcc",
    "telefono",
    "correo",
    "fech_reg",
  ];
  return (
    <>
      <ProtectedRoute allowedRoles={["Administrador"]} />
      <ResultTable
        title={title}
        headers={headers}
        data={entities}
        resfreshData={fetchData}
        keysToSearch={["identificacion", "nombre", "correo", "fech_reg"]}
        fields={fields}
        isAction={true}
        rol={rol}
        editTitle={"Edicción de Entidades"}
        selectTable={"entities"}
        isNewRegister={true}
      />
    </>
  );
}
"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "./Header";

export default function Navigations() {
  const pathname = usePathname();
  const [opciones, setOpciones] = useState([]);

  useEffect(() => {
    const assignMenu = assignOptions(pathname);
    setOpciones(assignMenu);
  }, [pathname]);

  const assignOptions = (ruta) => {
    const indices = routeToIndices[ruta] || indiceDefault();
    return indices.map(index => menuOptions[index])
  };

  const indiceDefault = () => {
    return [0]
  }

  return <Header menuOptions={opciones} />;
}

const routeToIndices = {
    "/home": [ 1, 2, 3, 7, 8],
    "/home/user": [0, 2, 3, 7, 8],
    "home/user/entities": [0, 1, 2, 3, 7],
    "/home/user/entities/invoices": [0, 5, 6],
    "/home/user/entities/invoices/payments": [0, 4, 6],
    "/home/user/entities/invoices/pending": [0, 4, 5],
    "/home/administrator/email": [0, 1, 2, 7, 8],
    "/home/administrator/emailPending": [0, 1, 2, 3, 8],
    "/pruebas": [0, 5, 6, 7],
}

const menuOptions = [
  { id: 0, label: "Inicio", link: "/home", icon: "bi bi-house-door" },
  { id: 1, label: "Usuarios", link: "/home/user", icon: "bi bi-person-fill" },
  { id: 2, label: "Registrar Usuario", link: "/home/administrator/register", icon: "bi bi-person-plus-fill" },
  { id: 3, label: "Gestion de Correos", link: "/home/administrator/email", icon: "bi bi-envelope-paper-fill" },
  { id: 4, label: "Facturas", link: "/home/user/entities/invoices", icon: "bi bi-receipt" },
  { id: 5, label: "Facturas Pagas", link: "/home/user/entities/invoices/payments", icon: "bi bi-cash-stack"},
  { id: 6, label: "Facturas Pendientes", link: "/home/user/entities/invoices/pending", icon: "bi bi-wallet2"},
  { id: 7, label: "Correos Pendientes", link: "/home/administrator/emailPending", icon: "bi bi-envelope-paper-fill"},
  { id: 8, label: "Entidades", link: "/home/user/entities", icon: "bi bi-building-fill"},
];



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
    return [0,3]
  }

  return <Header menuOptions={opciones} />;
}

const routeToIndices = {
    "/home": [0, 1, 2, 3],
    "/home/suppliers": [0, 1, 2, 3],
    "/home/suppliers/invoices": [4, 5, 6],
    "/home/suppliers/invoices/payments": [4, 5, 6],
    "/home/suppliers/invoices/pending": [4, 5, 6],
    "/home/user": [0, 1, 2, 3, 7],
    "/home/administrator/email": [0, 1, 2, 3, 7, 8],
    "/pruebas": [5, 6, 7, 8],
}

const menuOptions = [
  { id: 1, label: "Inicio", link: "/home", icon: "bi bi-house-door" },
  { id: 2, label: "Usuarios", link: "/home/user", icon: "bi bi-person-fill" },
  { id: 3, label: "Registrar Usuario", link: "/home/administrator/register", icon: "bi bi-person-plus-fill" },
  { id: 4, label: "Gestion de Correos", link: "/home/administrator/email", icon: "bi bi-envelope-paper-fill" },
  { id: 5, label: "Facturas", link: "/home/suppliers/invoices", icon: "bi bi-receipt" },
  { id: 6, label: "Facturas Pagas", link: "/home/suppliers/invoices/payments", icon: "bi bi-cash-stack"},
  { id: 7, label: "Facturas Pendientes", link: "/home/suppliers/invoices/pending", icon: "bi bi-wallet2"},
  { id: 8, label: "Proveedores", link: "/home/suppliers", icon: "bi bi-building"},
  { id: 9, label: "Correos Pendientes", link: "/home/administrator/emailPending", icon: "bi bi-envelope-paper-fill"},
];



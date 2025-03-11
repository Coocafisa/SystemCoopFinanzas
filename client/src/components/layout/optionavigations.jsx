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
    "/home": [ 1, 2, 6, 7],
    "/home/user": [0, 2, 6, 7],
    "/home/user/entities": [0, 1, 2, 6],
    "/home/user/entities/invoices": [4, 5],
    "/home/user/entities/invoices/payments": [3, 5],
    "/home/user/entities/invoices/pending": [3, 4],
    "/home/administrator/email": [0, 1, 6, 7],
    "/home/administrator/emailPending": [0, 1, 2, 7]
}

const menuOptions = [
  { id: 0, label: "Inicio", link: "/home", icon: "bi bi-house-door" },
  { id: 1, label: "Usuarios", link: "/home/user", icon: "bi bi-person-fill" },
  { id: 2, label: "Gestion de Correos", link: "/home/administrator/email", icon: "bi bi-envelope-plus-fill" },
  { id: 3, label: "Facturas", link: "/home/user/entities/invoices", icon: "bi bi-receipt" },
  { id: 4, label: "Facturas Pagas", link: "/home/user/entities/invoices/payments", icon: "bi bi-cash-stack"},
  { id: 5, label: "Facturas Pendientes", link: "/home/user/entities/invoices/pending", icon: "bi bi-wallet2"},
  { id: 6, label: "Correos Pendientes", link: "/home/administrator/emailPending", icon: "bi bi-envelope-slash-fill"},
  { id: 7, label: "Entidades", link: "/home/user/entities", icon: "bi bi-building-fill"},
];



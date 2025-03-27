"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "./Header";
import { getSession } from "@/api/requestServices/sessionService";

export default function Navigations() {
  const pathname = usePathname();
  const router = useRouter();
  const [opciones, setOpciones] = useState([]);
  const [userRoles, setUserRoles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const session = await getSession();
      if (session?.role) {
        const rolesArray = session.role.split(",").map(role => role.trim());
        setUserRoles(rolesArray);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (userRoles.length > 0) {
      const filteredMenu = getMenuByRoles(userRoles).filter(option => option.link !== pathname);
      
      if (filteredMenu.length === 0) {
        handleUnauthorizedAccess();
      } else {
        setOpciones(filteredMenu);
        sessionStorage.setItem("lastValidPath", pathname);
      }
    }
  }, [pathname, userRoles]);

  const getMenuByRoles = (roles) => {
    return menuOptions.filter(option => 
      option.roles.some(role => roles.includes(role))
    );
  };

  const handleUnauthorizedAccess = () => {
    const lastValidPath = sessionStorage.getItem("lastValidPath") || "/";
    router.push(lastValidPath);
  };

  return <Header menuOptions={opciones} />;
}

const menuOptions = [
  { id: 0, label: "Inicio", link: "/home", icon: "bi bi-house-door", roles: ["Administrador", "Supervisor"] },
  { id: 1, label: "Usuarios", link: "/home/user", icon: "bi bi-person-fill", roles: ["Administrador", "Supervisor", "Estandar"] },
  { id: 2, label: "Gestión de Correos", link: "/home/administrator/email", icon: "bi bi-envelope-plus-fill", roles: ["Administrador", "Supervisor"] },
  { id: 3, label: "Facturas", link: "/home/user/entities/invoices", icon: "bi bi-receipt", roles: ["Administrador", "Supervisor"] },
  { id: 4, label: "Facturas Pagas", link: "/home/user/entities/invoices/payments", icon: "bi bi-cash-stack", roles: ["Administrador", "Supervisor", "Usuario"] },
  { id: 5, label: "Facturas Pendientes", link: "/home/user/entities/invoices/pending", icon: "bi bi-wallet2", roles: ["Administrador", "Supervisor", "Usuario"] },
  { id: 6, label: "Correos Pendientes", link: "/home/administrator/emailPending", icon: "bi bi-envelope-slash-fill", roles: ["Administrador", "Supervisor"] },
  { id: 7, label: "Entidades", link: "/home/user/entities", icon: "bi bi-building-fill", roles: ["Administrador", "Supervisor", "Estandar"] },
  { id: 8, label: "About", link: "/", icon: "bi bi-info-circle-fill", roles: ["Administrador", "Supervisor", "Usuario"] }
];
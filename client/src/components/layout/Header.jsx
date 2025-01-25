"use client";
import { useState, useEffect, use } from "react";
import Menu from "./navigationmenu";
import { getSession, dateUser } from "@/api/requestServices/sessionService";
import "@public/styles/header.css"

export default function Header({ menuOptions }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [user, setUser] = useState({'usuario': 'Sin Asignar', 'rol': 'Sin Asignar', 'estado': 'Activo'});

  const handleScroll = () => {
    const scrollY = window.scrollY;
    setIsScrolled(scrollY > 4);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const { nombre, user, rol, estado  } = await dateUser();
      let estadoUser = 'Activo';
      if (estado === '0') {
        estadoUser = 'Inactivo';
      }
      setUser({
        'nombre': nombre, 'usuario': user, 'rol': rol, 
        'estado': estadoUser});
    };
    fetchData();
  }, []);

  const handleClick = async() => {
    var { role } = await getSession();
    if (role === "Administrador") {
        window.location.href = "/home";
    } else {
        window.location.href = "/home/suppliers";
    }
  };

  const toogleDetalles = () => {
    setIsVisible(!isVisible);
  } 
  return (
    <>
    <header className={`principal ${isScrolled ? "scrolled" : ""}`}>
        <img
          src="/images/Logo.cooperativa.png"
          alt="logo"
          className="imglogoindex"
          onClick={handleClick}
        />
      <h1 className="text-header">CoopFinanzas</h1>
      
      <div className="perfil">
        <div className="info">
          <p className="text_user" onClick={toogleDetalles}>Bienvenido, {user.nombre}</p>
        </div>
        <div className={`detalle-perfil ${isVisible ? 'visible': ''}`}>
          <p className="title-perfil">Perfil</p>
          <p>Usuario: {user.usuario}</p>
          <p>Rol: {user.rol}</p>
          <p>Estado: {user.estado}</p>
          <button className="btn-perfil">Editar Perfil</button>
        </div>
        </div> 
      </header>
      <Menu menuOptions={menuOptions}/>

    </>
  );
}
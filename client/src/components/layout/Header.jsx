"use client";
import { useState, useEffect, use } from "react";
import Menu from "./navigationmenu";
import { getSession, dateUser } from "@/api/requestServices/sessionService";
import "@styles/header.css"
import { Message, ValidateInput } from "../utils/helpers";
import { updateRegister } from "@/api/requestServices/generalServices";

export default function Header({ menuOptions }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [user, setUser] = useState({});
  const [message, setMessage] = useState({ nit: "", nombre: "", correo: "", rol: "", estado: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });

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
      const { nit, nombre, user, rol, estado, correo, telefono, direccion } = await dateUser();
      let estadoUser = 'Activo';
      if (estado === '0') {
        estadoUser = 'Inactivo';
      }
      setUser({
        'nit': nit, 'nombre': nombre, 'usuario': user, 'rol': rol, 
        'estado': estadoUser, 'correo': correo, 'telefono': telefono, 'direccion': direccion});
    };
    fetchData();
  }, []);

  useEffect(() => {
    setFormData({ ...user });
  }, [user]);

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

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setFormData({ ...user });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
    ValidateInput(e, setMessage, formData);
  };

  const handleSaveClick = async (event) => {
    const updateFields = Object.keys(formData).reduce((acc, key) => {
      if (formData[key] !== user[key]) {
        acc[key] = formData[key];
      }
      return acc;
    }, {});
    if (Object.keys(updateFields).length === 0) {
      console.log("No hay cambios");
      setIsEditing(false);
      return;
    }
    await updateRegister(event, updateFields, user.nit);
    console.log("guardando datos: ", updateFields);
  };

  const getFields = () => {
    return isEditing ? ["nit", "nombre", "usuario", "rol", "estado", "correo", "telefono", "direccion"]:
    ["nit", "nombre", "rol", "estado"];
  };
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
        <div className={`modal-overlay ${isEditing ? 'editing' : ''}`}>
        <div className={`detalle-perfil ${isVisible ? 'visible': ''} ${isEditing ? 'editing' : ''}`}>
          <div className="modal-header">
          <div className="modal-title">
          <i className="bi bi-file-person-fill person-perfil"/>
          <h2>Perfil</h2>
          </div>
          </div>
          <div className={`modal-content ${isEditing ? 'editing': ''}` }>
            { getFields().map((item) => (
              <div className={`profile-card ${isEditing ? 'editing': ''}` } key={item}>
                <span className="label">{item.charAt(0).toUpperCase() + item.slice(1)}:</span>
                {isEditing ? (
                  <>
                  <input type="text" name={item} value={formData[item]}
                  onChange={handleChange} className="input-field"/>
                  <Message text={message[item]} type="error-message"/>
                  </>
                ): (
                  <span className="data">{user[item]}</span>
                )}
                </div>
            ))}
          </div>
          <div className="modal-footer">
            {isEditing ? (
              <>
              <button className="save-button" onClick={handleSaveClick}>Guardar</button>
              <button className="cancel-button" onClick={handleCancelClick} >Cancelar</button>
              </>
            ) : (
              <button className="edit-button" onClick={handleEditClick}>Editar Perfil</button>
            )}
          </div>
        </div>
        </div>
        </div> 
      </header>
      <Menu menuOptions={menuOptions}/>
    </>
  );
}
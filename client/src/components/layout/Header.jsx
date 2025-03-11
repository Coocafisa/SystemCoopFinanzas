"use client";
import { useState, useEffect } from "react";
import Menu from "./navigation_menu";
import { getSession, dateUser } from "@/api/requestServices/sessionService";
import "@styles/header.css";
import { updateRegister } from "@/api/requestServices/generalServices";
import { CircleUser, X } from "lucide-react";
import useForm from "@/hooks/useForm";
import ErrorMessage from "@/components/common/ErrorMessage";

export default function Header({ menuOptions }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [restrictedFields, setRestrictedFields] = useState([]);

  const { formValues, message, handleChange, isValid, setFormValues } = useForm({
    nit: "",
    nombre: "",
    usuario: "",
    rol: "",
    estado: "",
    correo: "",
    telefono: "",
    direccion: "",
  });

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
      setFormValues({
        nit, nombre, usuario: user, rol, estado: estadoUser, correo, telefono, direccion
      });
    };
    fetchData();
  }, [setFormValues]);

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

  const rolePermissions = {
    Administrador: ["rol", "estado"],
    Supervisor: ["rol", "estado"],
    Usuario: ["nit", "rol", "correo", "estado"]
  }

  const handleEditClick = () => {
    const fields = rolePermissions[user.rol] || []
    setRestrictedFields(fields);
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setFormValues({ ...user });
  };

  const updateFields = Object.keys(formValues).reduce((acc, key) => {
    if (String(formValues[key]) !== String(user[key])) {
      acc[key] = formValues[key];
    }
    return acc;
  }, {});

  const handleSaveClick = async () => {
    const res = await updateRegister(updateFields, user.nit);
    if (res.data?.status === 200) {
      const updatedUser = { ...user, ...updateFields };
      updatedUser.estado = updatedUser.estado === '0' ? 'Inactivo' : 'Activo';
      setUser(updatedUser);
      setFormValues(updatedUser);
      setIsEditing(false);
    }
  };

  const getFields = () => {
    return isEditing ? [
    "nit", "nombre", "usuario", "rol", "estado", "correo", "telefono", "direccion"] :
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
          <p className="text_user" onClick={toogleDetalles}>Bienvenid@, {user.nombre}
          <CircleUser className="icono-perfil"/></p>
        </div>
        <div className={`modal-overlay ${isVisible ? 'active' : ''} ${isEditing ? 'editing' : ''}`}>
        <div className={`detalle-perfil ${isVisible ? 'visible': ''} ${isEditing ? 'editing' : ''}`}>
          <div className="modal-header-perfil">
          <i className="bi bi-file-person-fill person-perfil"/>
          <h2>Perfil</h2>
          <X onClick={toogleDetalles} className={`close-button-perfil ${isEditing ? 'editing': ''}`}/>
          </div>
          <div className={`modal-content-perfil ${isEditing ? 'editing': ''}` }>
            { getFields().map((item) => (
              <div className={`profile-card ${isEditing ? 'editing': ''}` } key={item}>
                <span className="label">{item.charAt(0).toUpperCase() + item.slice(1)}:</span>
                {isEditing ? (
                  <>
                  <input type="text" name={item} value={formValues[item]}
                  onChange={handleChange} disabled={restrictedFields.includes(item)} className={`input-field-perfil ${isEditing ? 'editing': ''}`}/>
                  <ErrorMessage message={message[item]} />
                  </>
                ): (
                  <span className="data">{user[item]}</span>
                )}
                </div>
            ))}
          </div>
          <div className={`modal-footer-perfil ${isEditing ? 'editing': ''}`}>
            {isEditing ? (
              <>
              <button className={`save-button ${isEditing ? 'editing': ''}`} onClick={handleSaveClick}
              disabled={ Object.keys(updateFields).length === 0 || !isValid}>Guardar</button>
              <button className={`cancel-button ${isEditing ? 'editing': ''}`} onClick={handleCancelClick} >Cancelar</button>
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
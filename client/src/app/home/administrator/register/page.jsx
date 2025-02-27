"use client"
import { adduser } from "@/api/requestAdmin/registerService";
import "@styles/formusers.css";
import { useState } from "react";
import { ProtectedRoute } from "@/components/middleware/protecte-route";
import { Message, ValidateInput } from "@/components/utils/helpers";

export default function Registerusers() {
  const [message, setMessage] = useState({});
  const [formValues, setFormValues] = useState({
    nit: "",
    rol: "",
    newpass: "",
    confpass: "",
    ter_cond: false,
  });

  const isValid = 
  Object.entries(formValues).every(([key, value]) => {
    if (key === "rol") {
      return value !== "" && value !== "Select" && key !== "ter_cond" && !message[key];
    }
    return value !== "" && !message[key];
  });

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    setFormValues({ 
      ...formValues,
       [name]: type === "checkbox" ? checked : value,
    });
    ValidateInput(event, setMessage, formValues);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await adduser(event);
  };

  return (
    <>
    <ProtectedRoute allowedRoles={["Administrador"]}/>
    <div className="content_register">
      <header>
        <img
          src="/images/Logo.cooperativa.png"
          alt="logo"
          className="w-24 h-24 mb-4 object-contain logoReg"
        />
        <h1 className="text-2xl font-bold">Nuevo Usuario</h1>
      </header>

      <form onSubmit={handleSubmit} noValidate>
        <div className="options">
        <div className="stlvar">
            <label htmlFor="rol">Rol*</label>
            <select 
              name="rol" 
              id="rol"
              value={formValues.rol} 
              onChange={handleChange}
            >
              <option value="Select">Seleccionar</option>
              <option value="Usuario">Usuario</option>
              <option value="Administrador">Administrador</option>
            </select>
            <Message type={"error-message"} text={message.rol} />
          </div>
          
          <div className="stlvar">
            <label htmlFor="nit">Identificación*</label>
            <input 
              type="number" 
              name="nit" 
              id="identificacion"
              value={formValues.nit}
              onChange={handleChange}
              aria-required="true"              
            />
            <Message type={"error-message"} text={message.nit} />
          </div>

          <div className="stlvar">
            <label htmlFor="newpass">Contraseña*</label>
            <input 
              type="password" 
              name="newpass" 
              id="pass"
              value={formValues.newpass} 
              onChange={handleChange}
              aria-required="true"
            />
            <Message type={"error-message"} text={message.newpass} />
          </div>

          <div className="stlvar">
            <label htmlFor="confpass">Confirmar Contraseña*</label>
            <input 
              type="password" 
              name="confpass" 
              id="passcon"
              value={formValues.confpass} 
              onChange={handleChange}
              aria-required="true"
            />
            <Message type={"error-message"} text={message.confpass} />
          </div>
        </div>
        <div className="stlvar">
              <label>
                <input
                  type="checkbox"
                  id="ter_cond"
                  name="ter_cond"
                  checked={formValues.ter_cond}
                  onChange={handleChange}
                  aria-required="true"
                />
                Acepto los
                <a href="/terminos-y-condiciones" target="_blank">
                  términos y condiciones
                </a>
              </label>
              <Message type={"error-message"} text={message.ter_cond} />
            </div>
        <div className="btn_butones">
          <a href="/home">
            <button type="button" className="btn_cancelar">
              Regresar
            </button>
          </a>
          <button type="submit" className="btn_registrar" disabled={!isValid}>
            Registrar
          </button>
        </div>
      </form>
    </div>
    </>
  );
}
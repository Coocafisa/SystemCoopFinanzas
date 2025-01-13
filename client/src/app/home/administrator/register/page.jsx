"use client"
import { adduser } from "@/api/auth/registerService";
import "@public/styles/formusers.css";
import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/middleware";
import { Loader } from "@/components/common/preloader";
import AlertPopup from "@/components/common/alert";
import Link from "next/link";

export default function Registerusers() {
  const [showAlert, setShowAlert] = useState(true);
  const [type, setType] = useState("");
  const [alert, setAlert] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    nit: "",
    rol: "",
    pass: "",
    passcon: ""
  });

  const isValid = 
  Object.entries(formValues).every(([key, value]) => {
    if (key === "rol") {
      return value !== "" && value !== "Select" && !errors[key];
    }
    return value !== "" && !errors[key];
  });


  const validateField = (name, value) => {
    let error = "";
    if (value.trim() === "" && ["nit", "rol", "pass", "passcon"].includes(name)) {
      error = "Este campo es obligatorio";
    } else if (name === "pass" && value.length < 8) {
      error = "La contraseña debe ser mínimo de 8 caracteres";
    } else if (name === "pass" && value.length > 16) {
      error = "La contraseña debe ser máximo de 16 caracteres";
    }
    return error;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });

    if (value || ["nit", "rol", "pass", "passcon"].includes(name)) {
      setErrors({ ...errors, [name]: validateField(name, value) });
    } else {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleFocus = () => {
    const newErrors = {};
    Object.keys(formValues).forEach((key) => {
      const value = formValues[key];
      newErrors[key] = validateField(key, value);
    });
    setErrors(newErrors);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    await adduser(event, setAlert, setType, setLoading);
  };

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  return (
    <>
    <ProtectedRoute/>
    {showAlert && <AlertPopup message={`La contraseña debe ser mínimo de 8 caracteres
     y máximo de 16. Debe contener al menos una mayúscula, un número y un carácter especial.`}
      type={"alertMessage"} />}
          <div className="content_register">
      <header>
        <img
          src="/images/Logo.cooperativa.png"
          alt="logo"
          className="w-24 h-24 mb-4 object-contain logoReg"
        />
        <h1 className="text-2xl font-bold">Registro de Usuarios</h1>
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
              onFocus={handleFocus}
              className={errors.rol}
            >
              <option value="Select">Seleccionar</option>
              <option value="Proveedor">Proveedor</option>
              <option value="Administrador">Administrador</option>
            </select>
          </div>
          
          <div className="stlvar">
            <label htmlFor="nit">Nit*</label>
            <input 
              type="number" 
              name="nit" 
              id="nit" 
              value={formValues.nit}
              onChange={handleChange}
              onFocus={handleFocus}
              className={errors.nit}
            />
          </div>

          <div className="stlvar">
            <label htmlFor="pass">Contraseña*</label>
            <input 
              type="password" 
              name="pass" 
              id="pass"
              value={formValues.pass} 
              onChange={handleChange}
              onFocus={handleFocus}
              className={errors.pass}
            />
          </div>

          <div className="stlvar">
            <label htmlFor="passcon">Confirmar Contraseña*</label>
            <input 
              type="password" 
              name="passcon" 
              id="passcon"
              value={formValues.passcon} 
              onChange={handleChange}
              onFocus={handleFocus}
              className={errors.passcon}
            />
          </div>
        </div>
        {loading && <Loader alert={alert} type={type} />}
        {Object.keys(errors).some((key) => errors[key]) && (
  <div className="general-error-message">
    <p>Los campos con * son obligatorios.</p>
  </div>
)}
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
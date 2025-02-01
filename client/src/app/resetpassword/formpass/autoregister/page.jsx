"use client";
import "@styles/formusers.css";
import { useEffect, useState } from "react";
import { automaticRegistration, verifyTokenAutoregister } from "@/api/requestServices/passwordService";
import AlertPopup from "@/components/common/alert";
import { Loader } from "@/components/common/preloader";
import { Message, ValidateInput } from "@/components/utils/helpers";
import { useAlertState } from "@/components/utils/alertState";

export default function AutoRegister() {
  const [data, setData] = useState(null);
  const [formData, setFormData] = useState({
    newpass: "",
    confpass: "",
    ter_cond: false,
  });

  const [message, setMessage] = useState({
    newpass: "",
    confpass: "",
    ter_cond: "",
  });

  const handleChange = (event) => {
    const { name, value, checked, type} = event.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    ValidateInput(event, setMessage, formData);
  };

  const isValid = Object.keys(formData).every((key) => {
    return (
      message[key] === "" &&
      (key !== "ter_cond" || formData[key] === true) &&
      formData[key] !== ""
    );
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      identificacion: data.identificacion,
      rol: data.rol,
      password: formData.newpass,
      ter_cond: formData.ter_cond
    }
    await automaticRegistration(event, payload)
  };

  useEffect(() => {
    const validateToken = async () => {
      await verifyTokenAutoregister(setData);
    };
    validateToken();
  }, []);

  return (
    <>
        <div className="content">
          <header className="flex flex-col items-center">
          <img
            src="/images/Logo.cooperativa.png"
            alt="logo"
            className="w-24 h-24 mb-4 object-contain logo item"
          />
          <h1 className="text-2xl font-bold text-foreground item">
            Registro de Credenciales
          </h1>
        </header>
          <form onSubmit={handleSubmit}>
            <div className="stlvar">
              <label htmlFor="newpass">Contraseña</label>
              <input
                type="password"
                name="newpass"
                id="newpass"
                value={formData.newpass}
                onChange={handleChange}
                aria-required="true"
              />
              <Message type={"error-message"} text={message.newpass}/>
            </div>
            <div className="stlvar">
              <label htmlFor="confpass">Confirmar Contraseña</label>
              <input
                type="password"
                name="confpass"
                id="confpass"
                value={formData.confpass}
                onChange={handleChange}
              />
              <Message type="error-message" text={message.confpass} />
            </div>
            <div className="stlvar">
              <label>
                <input
                  type="checkbox"
                  id="ter_cond"
                  name="ter_cond"
                  checked={formData.ter_cond}
                  onChange={handleChange}
                />
                Acepto los
                <a href="/terminos-y-condiciones" target="_blank">
                  términos y condiciones
                </a>
              </label>
              <Message type={"error-message"} text={message.ter_cond} />
            </div>
            <div className="btn">
              <button
                className="btn_registrar"
                type="submit"
                disabled={!isValid}
              >
                Enviar
              </button>
            </div>
          </form>
        </div>
    </>
  );
}

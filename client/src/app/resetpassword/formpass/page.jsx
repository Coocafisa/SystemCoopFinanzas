"use client";
import "@styles/formusers.css";
import { useEffect, useState } from "react";
import { resetpass } from "@/api/requestServices/passwordService";
import { getToken } from "@/api/requestServices/passwordService";
import { Message, ValidateInput } from "@/components/utils/helpers";

export default function Formresetpass() {
  const [formData, setFormData] = useState({
    newpass: "",
    confpass: ""
  });

  const [message, setMessage] = useState({
    newpass: "",
    confpass: ""
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => {
      return {
        ...prevData,
        [name]: value,
      };
    });

    ValidateInput(event, setMessage, formData);
  }


  const isValid = Object.keys(formData).every((key) => {
    return (
      message[key] === "" &&
      (formData[key].trim() !== "")
    );
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    await resetpass(event);
  };

  useEffect(() => {
    const validateToken = async () => {
      await getToken();
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
            <h1 className="text-2xl font-bold text-foreground item">Restablecer Contraseña</h1>
          </header>
          <div className="form-container">
            <form onSubmit={handleSubmit} noValidate>
              <div className="stlvar">
                <label htmlFor="newpass">Nueva Contraseña</label>
                <input type="password" name="newpass" id="newpass" value={formData.newpass}
                onChange={handleChange} aria-required="true"/>
                <Message type={"error-message"} text={message.newpass}/>
              </div>
              <div className="stlvar">
                <label htmlFor="confpass">Confirmar Contraseña</label>
                <input type="password" name="confpass" id="confpass" value={formData.confpass}
                onChange={handleChange}/>
                <Message type="error-message" text={message.confpass}/> 
              </div>
              <div className="btn">
                <button type="submit" disabled={!isValid}>Restablecer</button> 
              </div>
            </form>
          </div>
        </div>
    </>
  );
}
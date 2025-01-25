"use client";
import "@public/styles/formusers.css";
import { useEffect, useState } from "react";
import { resetpass } from "@/api/requestServices/passwordService";
import { getToken } from "@/api/requestServices/passwordService";
import { Loader } from "@/components/common/preloader";
import { Message, ValidateInput } from "@/components/utils/helpers";
import { useAlertState } from "@/components/utils/alertState";

export default function Formresetpass() {
  const { alert, setAlert, type, setType, loading, setLoading } = useAlertState();
  const [tokenValid, setTokenValid] = useState(false);
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
    setFormData({
      ...formData,
      [name]: value,
    });

    ValidateInput(event, setMessage, formData);
  };

  const isValid = Object.keys(formData).every((key) => {
    return (
      message[key] === "" &&
      ( formData[key] === true) &&
      formData[key] !== ""
    );
  });

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    await resetpass(event, setAlert, setLoading, setType);
  };

  useEffect(() => {
    const validateToken = async () => {
      setLoading(true);
      const isValid = await getToken(setAlert, setType, setLoading);
      setTokenValid(isValid);
    };
    validateToken();
  }, []);

  return (
    <>
      {tokenValid ? (
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
            {loading && <Loader alert={alert} type={type}/>}
          </div>
        </div>
      ) : (
        <>
        {loading && <Loader alert={alert} type={type}/>}
        </>
      )}
    </>
  );
}
"use client"
import { useState } from "react";
import { emailValidate } from "@/api/requestServices/passwordService";
import "@styles/formusers.css"
import { Message, ValidateInput } from "@/components/utils/helpers";
export default function Formvalidatemail() {
    const [formValues, setValues] = useState({ nit:"" });
    const [message, setMessage] = useState({
        nit: ""
    });

    const handleSubmit =  async (event) => {
        event.preventDefault();
        await emailValidate(event);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
        ValidateInput(event, setMessage, formValues);
    };

    const isValid = Object.keys(formValues).every((key) => {
        return (
            message[key] === "" && formValues[key].trim() !== ""
        );
        });
    return (
        <div className="content">
            <header className="flex flex-col items-center">
          <img
            src="/images/Logo.cooperativa.png"
            alt="logo"
            className="w-24 h-24 mb-4 object-contain logo item"
          />
          <h1 className="text-2xl font-bold text-foreground item">Restablecer Contraseña</h1>
        </header>
        <form onSubmit={handleSubmit}> 
                    <div className="stlvar">
                        <label htmlFor="nit">Nit o Identificación*</label>
                        <input type="number" name="nit" id="nit" onChange={handleChange} value={formValues.nit}/>
                    </div>    
                    <Message text={message.nit} type="error-message"/>          
                    <div className="btn_butones">
                    <div className="btn">
                        <a href="/"><button type="button" className="btn_regresar">Regresar</button></a>
                    </div>
                    <div className="btn">
                        <button type="submit" className="btn_enviar" disabled={!isValid}>Enviar Correo</button>
                    </div>
                    </div>                  
                </form>
        </div>
    );
}
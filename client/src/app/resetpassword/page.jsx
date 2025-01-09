"use client"
import { useEffect, useState } from "react";
import { emailValidate } from "@/api/auth/passwordService";
import "@public/styles/formusers.css"
import AlertPopup from "@/components/common/alert";
import { Loader } from "@/components/common/preloader";
export default function Formvalidatemail() {
    const [alert, setAlert] = useState(null);
    const [showAlert, setShowAlert] = useState(true);
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState(null);

    const handleSubmit =  async (event) => {
        event.preventDefault();
        setLoading(true);
        await emailValidate(event, setAlert, setType, setLoading);
    };

    useEffect(() => {
        if (showAlert) {
            const timer = setTimeout(() => {
                setShowAlert(false);
            }, 6000);
            return () => clearTimeout(timer);
        }
    }, [showAlert]);

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
                        <label htmlFor="nit">Nit*</label>
                        <input type="number" name="nit" id="nit"/>
                    </div>              
                    <div className="btn_butones">
                    <div className="btn">
                        <a href="/"><button type="button" className="btn_regresar">Regresar</button></a>
                    </div>
                    <div className="btn">
                        <button type="submit" className="btn_enviar">Enviar Correo</button>
                    </div>
                    </div>                  
                </form>
                {loading && <Loader alert={alert} type={type}/>}
                {showAlert && <AlertPopup message={`Ingresa el nit correspondiente a tu cuenta.`} type="alertMessage"/>}
        </div>
    );
}
"use client";
import { useState } from "react";
import "@public/styles/formusers.css";
import { auth } from "@/api/auth/authService";
import {Loader} from "@/components/common/preloader";
import { useRouter } from "next/navigation";

export default function Login() {
    const [type, setType] = useState(false);
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [errores, setErrores] = useState({
        user: false,
        password: false,
    });
    const [formData, setFormData] = useState({
        user: "",
        password: "",
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({...prevData, [name]: value}));
    };

    const handleSubmit = async (event) => {
        setLoading(true);
        event.preventDefault();
        let formularioValido = true;
    let newErrors = { user: false, password: false };

    if (formData.user.trim() === "") {
        formularioValido = false;
        newErrors.user = true;
    }

    if (formData.password.trim() === "") {
        formularioValido = false;
        newErrors.password = true;
    }

    setErrores(newErrors);

    if (!formularioValido) {
        const error = Object.keys(newErrors).find((camp) => newErrors[camp]);
        document.getElementById(error).focus();
    }

    if (formularioValido) {
        await auth(event, setAlert, setLoading, setType, router);
    } else {
        setLoading(false);
    }
};
    return (
        <div className="content">
            <header>
                <img
                    src="/images/Logo.cooperativa.png"
                    alt="logo"
                    className="w-1 h-1 mb-4 object-contain logo"
                />
                <h1 className="text-2xl font-bold text-ini">Inicio de Sesión</h1>
            </header>
            <form onSubmit={handleSubmit} className="space-y-4 mt-6" noValidate>
                <div className="flex flex-col stlvar">
                    <label htmlFor="user" className="text-sm font-medium text-gray-700">
                        Usuario
                    </label>
                    <input
                    
                        type="text"
                        id="user"
                        name="user"
                        value={formData.user}
                        onChange={handleChange}
                        required
                        className="mt-1 p-2 border rounded-md focus:ring-foreground focus:border-foreground"
                        style={{borderColor: errores.user ? 'red' : ''}}
                    />
                </div>

                <div className="flex flex-col stlvar">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Contraseña
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="mt-1 p-2 border rounded-md focus:ring-foreground focus:border-foreground"
                        style={{borderColor: errores.password ? 'red' : ''}}
                    />
                </div>
                <div className="btn">
                    <button type="submit" className="btn_ingresar w-full">
                        Ingresar
                    </button>

                    <div className="text-center mt-4">
                        <a
                            href="/resetpassword"
                            className="text-sm text-foreground hover:underline"
                        >
                            ¿Restablecer Contraseña?
                        </a>
                    </div>
                </div>
               </form>
               {loading && <Loader alert={alert} type={type}/>}
        </div>
    );
}
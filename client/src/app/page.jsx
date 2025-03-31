"use client";
import { useState } from "react";
import "@styles/formusers.css";
import { auth } from "@/api/requestAuth/authService";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
    const [formData, setFormData] = useState({
        user: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({...prevData, [name]: value}));
    };

    const handleSubmit = async (event) => {
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

    if (!formularioValido) {
        const error = Object.keys(newErrors).find((camp) => newErrors[camp]);
        document.getElementById(error).focus();
    }

    if (formularioValido) {
        await auth(event);
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
                    />
                </div>

                <div className="relative flex flex-col stlvar">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Contraseña
                    </label>
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="mt-1 p-2 border rounded-md focus:ring-foreground focus:border-foreground"
                    />
                    {formData.password.length > 0 && <i className="eye-password" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <Eye size={15} cursor={"pointer"}/> : <EyeOff size={15} cursor={"pointer"}/>}</i>}
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
        </div>
    );
}
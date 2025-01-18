function ValidateInput(event, setMessage, formData) {
    const { name, value, checked } = event.target;
    let message = "";
    if (value.trim() === "") {
        message = "Este campo es obligatorio";
    }

    if (name === "email" && value) {
        if (!/\S+@\S+\.\S+/.test(value)) {
            message = "El formato del correo electrónico no es válido";
        }
    }

    if (name === "newpass" && value) {
        if (value.length < 6) {
            message = "La contraseña debe tener al menos 6 caracteres";
        } else if (!/[a-zA-Z]/.test(value) || !/[0-9]/.test(value)) {
            message = "La contraseña debe contener al menos una letra y un número";
        }
    }

    if (name === "confpass" && value) {
        if (value !== formData.newpass) {
            message = "Las contraseñas no coinciden";
        }
    }

    if (name === "ter_cond" && !checked) {
        message = "Debes aceptar los términos y condiciones";
    }

    setMessage(prevState => ({
        ...prevState,
        [name]: message
    }));

    const hasErrors = Object.values(formData).some(val => val.trim() === "" || val !== message);
    if (hasErrors) {
        return false;
    }

    return true; 
}

const Message = ({ type, text }) => {
    return (
      <div className={`message ${type}`}>
        <p>{text}</p>
      </div>
    );
  };

module.exports = { 
    ValidateInput,
    Message
};

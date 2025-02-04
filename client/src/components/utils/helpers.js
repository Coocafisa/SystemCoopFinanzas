function ValidateInput(event, setMessage, formData) {
    let { name, value, checked } = event.target;
    let message = "";
    name = String(name);
    value = value !== undefined && value !== null ? String(value) : "";

  
    if (value.trim() === "" && !message) {
      message = "Este campo es obligatorio";
    }
  
    if (name === "nit" && value) {
      if (value.toString().length < 6 || value.toString().length > 10) {
        const text = value.toString().length < 6 ? ' al menos 6 ' : ' máximo 10 ';
        message = `La credencial debe tener${text}caracteres.`;
      } else if (!/^\d+$/.test(value)) {
        message = "Solo se admiten números"
      }
    }
  
    if (name === "rol" && value) {
      if (value === "Select") {
        message = "Debes seleccionar un rol";
      }
    }
  
    if (name === "email" && value || name === "correo" && value) {
      if (!/\S+@\S+\.\S+/.test(value)) {
        message = "El formato del correo electrónico no es válido";
      }
    }
  
    if (name === "newpass" && value) {
      const validations = [
        { test: /[A-Z]/, text: "al menos una mayúscula" },
        { test: /\d.*\d/, text: "al menos dos números" },
        { test: /[!@#$%^&*(),.?":{}|<>]/, text: "al menos un carácter especial" },
      ];
      if (value.toString().length < 8 || value.toString().length > 16) {
        let text = value.toString().length < 8 ? 'al menos 8 ' : 'máximo 16 ';
        message = `La contraseña debe tener ${text}caracteres.`;
      } else {
        const failedValidations = validations.find((validation) => !validation.test.test(value));
        if (failedValidations) {
        message = `La contraseña debe tener ${failedValidations.text}.`;
        } else {
            let updateConfpass = "";
            if (formData.confpass && formData.confpass !== value) {
                updateConfpass = "Las contraseñas no coinciden";
            }
            setMessage((prevState) => ({
                ...prevState,
                confpass: updateConfpass
            }));
        }
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

    if (name === "usuario" && value) {
      if (value.toString().length < 4 || value.toString().length > 15) {
        const text = value.toString().length < 4 ? ' al menos 4 ' : ' máximo 15';
        message = `La credencial debe tener${text}caracteres.`;
      } else if (!/^[a-zA-Z0-9]+$/.test(value)) {
        message = "Caracter invalido para este campo";
      }
    }

    if (name === "nombre" && value) {
      if (value.toString().length < 3 || value.toString().length > 30) {
        const text = value.toString().length < 3 ? ' al menos 3 ' : ' máximo 30';
        message = `Debe tener${text}caracteres.`;
      } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(value)) {!/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/
        message = "Caracter invalido para este campo";
      }
    }

    if (name === "telefono" && value) {
      if (value.toString().length < 7 || value.toString().length > 10) {
        const text = value.toString().length < 7 ? ' al menos 7 ' : ' máximo 15';
        message = `Debe tener ${text}caracteres.`;
      } else if (!/^\d+$/.test(value)) {
        message = "Caracter invalido para este campo";
      }
    }

    if (name === "direccion" && value) {
      if (value.toString().length < 6 || value.toString().length > 30) {
        const text = value.toString().length < 6 ? ' al menos 6 ' : ' máximo 40';
        message = `Debe tener${text}caracteres.`;
      } else if (!/^[a-zA-Z0-9-\s]+$/.test(value)) {
        message = "Caracter invalido para este campo";
      }
    }
  
    setMessage((prevState) => ({
      ...prevState,
      [name]: message,
    }));
  
    const hasErrors = Object.values(formData).some((val) => {
      return typeof val === "string" && val.trim() === "" || val !== message;
    });
  
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
    Message,
  };
  
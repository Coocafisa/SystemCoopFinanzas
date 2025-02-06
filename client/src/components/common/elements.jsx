import "@styles/elements.css"
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Message, ValidateInput } from "../utils/helpers";
import { updateRegister } from "@/api/requestServices/generalServices";

export function EditRecord ({data, role, state, closeModal, editTitle}) {
    const [formData, setFormData] = useState({...data});
    const [restrictedFields, setRestrictedFields] = useState([]);
    const [message, setMessage] = useState({});

    const getFields = (fields) => {
        if (!fields) return [];
        const cardFields = Object.keys(fields).filter((key) => String(fields[key]));
        return cardFields.length === 0 ? [] : cardFields;
    };
    const rolePermissions = {
        Administrador: ["fech_reg", ],
        Supervisor: ["fech_reg" ],
        Usuario: ["nit", "rol", "nombre", "correo", "estado"]
    }
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => {
            const updatedFormData = { ...prev, [name]: value };
            ValidateInput(event, setMessage, updatedFormData);
            return updatedFormData;
        });
    };

    const updateFields = Object.keys(formData).reduce((acc, key) => {
        if (String(formData[key]) !== String(data[key])) {
          acc[key] = formData[key];
        }
        return acc;
      }, {});
    
      const isValid = Object.keys(updateFields).every((key) => {
        return (
          message[key] === ""
        )
        });

    useEffect(() => {
        setFormData({...data});
        setRestrictedFields(rolePermissions[role] || []);
    }, [data, role]);

    const handleSave = async (event) => {
        event.preventDefault();
        const res = await updateRegister(event, updateFields, formData.identificacion);
        if (res.status === 200) {
          setIsEditing(false);
          setCurrentRecord(null);
      }
    }
    
    return (
        <div className={`modal-overlay ${ state ? 'isEditing' : ''}`}>
        <div className="modal-container">
          <div className="modal-header">
          <div className="modal-title">
          <h2>{editTitle}</h2>
          <X className="close-button-modal" onClick={closeModal}/>
          </div>
          </div>
          <div className="modal-content">
            { getFields(formData).map((item) => (
              <div className="card" key={item}>
                <span className="label">{item.charAt(0).toUpperCase() + item.slice(1)}:</span>
                  <input type="text" name={item} value={formData[item]}
                  onChange={handleChange} disabled={restrictedFields.includes(item)} className="input-field"/>
                  <Message text={message[item]} type="error-message"/>
                </div>
            ))}
          </div>
          <div className="modal-footer">
            <button className="save-button" disabled={ Object.keys(updateFields).length === 0 || !isValid}
            onClick={handleSave}>Guardar</button>
            <button className="cancel-button" onClick={closeModal}>Cancelar</button>
          </div>
        </div>
        </div>
    )
}

export function deleteRecord () {
    return (
        <div>
            <h1>Borrar Registro</h1>
        </div>
    )
}
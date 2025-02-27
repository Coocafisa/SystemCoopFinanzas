import "@styles/elements.css";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { Message, ValidateInput } from "../utils/helpers";
import { updateRegister } from "@/api/requestServices/generalServices";
import { selectOptions, rolePermissions, selectFields, renamedLabels } from "@/components/utils/validationData";
import { addPermit } from "@/api/requestAdmin/servicesAdmin";
export function AddRecord({ data, role, state, closeModal}) {
  const [formData, setFormData] = useState([]);
  const [message, setMessage] = useState({});
  const [newRegister, setNewRegister] = useState(false);

  useEffect(() => {
      setFormData(data);
  }, [data]);

  const handleChange = (event, index) => {
    const { name, value } = event.target;
    setFormData((prev) => {
      const updatedFormData = [...prev];
      updatedFormData[index] = { ...updatedFormData[index], [name]: value };
      ValidateInput(event, setMessage, updatedFormData[index]);
      return updatedFormData;
    });
  };

  const isEmptyObject = (obj) =>
    Object.values(obj).every((value) => value === "" || value === null || value === undefined);
  const isFormDataEmpty = formData.length === 0 || formData[0].acceso === "" || formData.every(isEmptyObject);

  const updateFields = formData.map((item, index) =>
    data[index]
    ? Object.keys(item).reduce((acc, key) => {
      if (String(item[key]) !== String(data[index]?.[key] || "")) {
        acc[key] = item[key];
      }
      return acc;
    }, {})
    : {}
  );

  const isValid = updateFields.every((fields) =>
    Object.keys(fields).every((key) => message[key] === "" || !message[key]),
  );

  const handleSave = async () => {
    if (newRegister) {
      const data = { acceso: updateFields[0].acceso, identificacion: formData[0].identificacion}
      const res = await addPermit(data);
      if (res.status === 200) {
        closeModal();
      }
    }
    const res = await updateRegister(event, updateFields, formData[0]?.usuario_id);
    if (res.status === 200) {
      closeModal();
    }
  };

  const handleAddPermits = async () => {
    setNewRegister(true);
    const data = [{ identificacion: formData[0].identificacion, acceso: ""}];
    setFormData(data);
    }


  const handleCancel = async (event) => {
    event.preventDefault();
    if (newRegister) {
      setNewRegister(false);
    } else {
      closeModal();
    }
    setMessage("");
  };

  return (
    <div className={`modal-overlay ${state ? "isEditing" : ""}`}>
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-title">
            <h2>Gestion Permisos de Usuario</h2>
            <X className="close-button-modal" onClick={closeModal} />
          </div>
        </div>
        <div className="modal-content-edit">
          {isFormDataEmpty && !newRegister ? (
            <div className="card">No hay registros</div>
          ) : (
            formData.map((item, index) => (
              <div className="card" key={index}>
                {Object.keys(item).map((field) => (
                  <div key={field} className="input-group">
                    <span className="label">
                      {renamedLabels[field] || field.charAt(0).toUpperCase() + field.slice(1)}
                    </span>
                    {(selectFields.includes(field)) ? (
                      <select
                        name={field}
                        value={item[field] || "Select"}
                        onChange={(e) => handleChange(e, index)}
                        disabled={(rolePermissions[role] && rolePermissions[role].includes(field))}
                        className="input-field"
                      >
                    {selectOptions[field]?.map((option) => (
                      <option key={option.value} value={option.value || "N/A"}>
                        {option.label}
                      </option>
                    ))}
                    </select>
                    ) : (
                    <input
                      type="text"
                      name={field}
                      value={item[field] || ""}
                      onChange={(e) => handleChange(e, index)}
                      disabled={(rolePermissions[role] && rolePermissions[role].includes(field)) || "identificacion"}
                      className="input-field"
                    />)}
                    <Message text={message[field]} type="error-message" />
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
        <div className="modal-footer">
          {!newRegister ? (
            <>
            <button className="btn-crear" onClick={handleAddPermits}>
                Crear
              </button>
              {!isFormDataEmpty && <button className="btn-edit"
              disabled={formData.length === 0 || updateFields.every((fields) => Object.keys(fields).length === 0) || !isValid}
              onClick={handleSave}>
              Editar
            </button>}
            </>
          ) : (
              <button
                className="save-button"
                disabled={formData.length === 0 || updateFields.every((fields) => Object.keys(fields).length === 0) || !isValid}
                onClick={handleSave}
              >
                Guardar
              </button>
          )}
          <button className="cancel-button" onClick={handleCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
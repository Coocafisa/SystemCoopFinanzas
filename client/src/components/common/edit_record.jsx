import "@styles/elements.css";
import { useEffect, useState } from "react";
import { Message } from "../utils/helpers";
import { updateRegister } from "@/api/requestServices/generalServices";
import {
  selectOptions,
  rolePermissions,
  selectFields,
  renamedLabels,
} from "@/components/utils/validationData";
import ModalContent from "./modal-content";
import { isEqual, set } from "lodash";
import useForm from "@/hooks/useForm";

export default function EditRecord({
  data,
  role,
  state,
  closeModal,
  editTitle,
  onUpdateRecord,
}) {
  const { formValues, message, handleChange, isValid, setFormValues } = useForm({});
  const [restrictedFields, setRestrictedFields] = useState([]);

  useEffect(() => {
    if (!role) return;
  
    setFormValues({ ...data });
  
    // Convertir `role` en array si es necesario
    const rolesArray = Array.isArray(role)
      ? role
      : typeof role === "string"
      ? role.split(",").map((r) => r.trim())
      : [];
  
    // Obtener las restricciones de cada rol
    const roleRestrictions = rolesArray
      .map((currentRole) => rolePermissions[currentRole] || [])
      .filter((fields) => fields.length > 0); // Filtrar roles sin restricciones
  
    // Si no hay restricciones, no se bloquea nada
    if (roleRestrictions.length === 0) {
      setRestrictedFields([]);
      return;
    }
  
    // Encontrar los campos que están bloqueados en **todos** los roles (intersección)
    const commonRestrictedFields = roleRestrictions.reduce((acc, fields) => 
      acc.filter((field) => fields.includes(field))
    );
  
    setRestrictedFields(commonRestrictedFields);
  }, [data, role, rolePermissions]);
  

  const getFields = (fields) => {
    if (!fields) return [];
    const cardFields = Object.keys(fields).filter((key) => String(fields[key]));
    return cardFields.length === 0
      ? []
      : cardFields.filter((item) => !restrictedFields.includes(item));
  };

  const updateFields = Object.keys(formValues).reduce((acc, key) => {
    if (!isEqual(String(formValues[key]), String(data[key]))) {
      acc[key] = formValues[key];
    }
    return acc;
  }, {});

  const handleSave = async () => {
    const res = await updateRegister(updateFields, data.identificacion);
    if (res) {
        const updatedData = {
            ...data,
            ...updateFields,
        };
        setFormValues(updatedData);
        onUpdateRecord();
        closeModal();
    }
  };

  return (
    <ModalContent modalTitle={editTitle} state={state} closeModal={closeModal}>
      <div className="edit-container">
        {getFields(formValues).map((item) => (
          <div className="card" key={item}>
            <div className="list-item">
              <span className="label">
                {renamedLabels[item] ||
                  item.charAt(0).toUpperCase() + item.slice(1)}
                :
              </span>
              {selectFields.includes(item) ? (
                <select
                  name={item}
                  value={
                    selectOptions[item]?.some(
                      ({ value }) => value === formValues[item]
                    )
                      ? formValues[item]
                      : data[item] || "Seleccionar"
                  }
                  onChange={(e) => {
                    const selectedValue = e.target.value;
                    const parsedValue = isNaN(selectedValue) ? selectedValue : Number(selectedValue);
                    handleChange({ target: { name: item, value: parsedValue } });
                  }}
                  className="input-field"
                >
                  {!selectOptions[item]?.some(
                    ({ value }) => value === data[item]
                  ) &&
                    data[item] && (
                      <option key={`original-${data[item]}`} value={data[item]}>
                        {data[item]}
                      </option>
                    )}

                  {selectOptions[item]?.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  name={item}
                  value={formValues[item] || ""}
                  onChange={handleChange}
                  className="input-field"
                />
              )}
              <Message text={message[item]} type="error-message" />
            </div>
          </div>
        ))}
        <div className="modal-footer">
          <button
            className="save-button"
            disabled={Object.keys(updateFields).length === 0 || !isValid}
            onClick={handleSave}
          >
            Guardar
          </button>
          <button className="cancel-button" onClick={closeModal}>
            Cancelar
          </button>
        </div>
      </div>
    </ModalContent>
  );
}

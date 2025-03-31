"use client";
import { adduser } from "@/api/requestAdmin/registerService";
import { queryUsers } from "@/api/requestUsers/queryUsers";
import ModalContent from "@/components/common/modal-content";
import useForm from "@/hooks/useForm";
import ErrorMessage from "@/components/common/ErrorMessage";

export default function RegisterUser({ isOpen, closeOpen, onAddRecord }) {
  const { formValues, message, handleChange, isValid } = useForm({
    nit: "",
    rol: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const res = await adduser(formValues);
    if (res.status === 200) {
      onAddRecord();
      closeOpen(false);
    }
  };

  return (
    <ModalContent modalTitle={"Registro de Usuarios"} state={isOpen} closeModal={closeOpen}>
      <form onSubmit={handleSubmit} noValidate>
        <div className="options">
          <div className="card">
            <label htmlFor="rol">Rol:</label>
            <select
              name="rol"
              id="rol"
              value={formValues.rol}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Seleccionar</option>
              <option value="Usuario">Usuario</option>
              <option value="Administrador">Administrador</option>
              <option value="Supervisor">Supervisor</option>
            </select>
            <ErrorMessage message={message.rol} />
          </div>

          <div className="card">
            <label htmlFor="nit">Identificación:</label>
            <input
              type="number"
              name="nit"
              id="nit"
              value={formValues.nit}
              onChange={handleChange}
              aria-required="true"
              className="input-field"
            />
            <ErrorMessage message={message.nit} />
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="cancel-button" onClick={() => closeOpen(false)}>
            Regresar
          </button>
          <button type="submit" className="save-button" disabled={!isValid}>
            Registrar
          </button>
        </div>
      </form>
    </ModalContent>
  );
}
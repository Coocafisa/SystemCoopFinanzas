"use client";
import { useAxiosWithLoader } from "@/api/apiRest";
import { Loader } from "../common/preloader";
import { useAlertState } from "../utils/alertState";
import AlertPopup from "../common/alert";
import { useState } from "react";
import { deleteSession } from "@/api/requestServices/logout";

export default function LoaderWithMessage() {
  const { alert, setAlert, type, setType, loading, setLoading, initAlert, setInitAlert } = useAlertState();
  const [data, setData] = useState(false);
  useAxiosWithLoader(setLoading, setAlert, setType, setInitAlert, setData);
  const handleDeleteSession = async () => {
    setData(false);
    await deleteSession(data);
  }

  return (
    <>
    {initAlert && <Loader type={type} message={alert} isLoading={loading}/>}
    {data && initAlert === false && 
    <div className={`alert-container ${data ? 'overlay-session' : ''}`}>
      <AlertPopup message={"¿Deseas cerrar la sesión anterior. ?"}>
      <div className="alert-buttons">
        <button onClick={handleDeleteSession}>Si</button>
        <button onClick={() => setData(false)}>No</button>
      </div>
      </AlertPopup>
    </div> }
    </>
  )
};
"use client";
import { useAxiosWithLoader } from "@/api/apiRest";
import { Loader } from "../common/preloader";
import { useAlertState } from "../utils/alertState";

export default function LoaderWithMessage() {
  const { alert, setAlert, type, setType, loading, setLoading, initAlert, setInitAlert } = useAlertState();
  useAxiosWithLoader(setLoading, setAlert, setType, setInitAlert);
  return (
    <>
    {initAlert && <Loader type={type} message={alert} isLoading={loading}/>}
    </>
  )
};
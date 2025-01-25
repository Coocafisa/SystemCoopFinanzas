import { useState } from "react";

export const useAlertState = () => {
  const [alert, setAlert] = useState(null);
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const [initAlert, setInitAlert] = useState(false);
  return { alert, setAlert, type, setType, loading, setLoading, initAlert, setInitAlert };
};

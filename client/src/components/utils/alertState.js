import { useState } from "react";

export const useAlertState = () => {
  const [alert, setAlert] = useState(null);
  const [type, setType] = useState(false);
  const [loading, setLoading] = useState(true);

  return { alert, setAlert, type, setType, loading, setLoading };
};

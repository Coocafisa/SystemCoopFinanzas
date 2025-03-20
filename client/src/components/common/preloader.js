import { useEffect, useState } from "react";
import "@styles/preloader.css";

export const Loader = ({ type, message, isLoading }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
      setVisible(true);
  }, []);

  useEffect(() => {
    return () => setVisible(false);
  }, []);


  if (!visible) return null;

  return (
    <div className={`overlay-loader ${visible ? "active" : "fade-out"}`}>
      <div className={`loader-container ${!isLoading ? "out-content" : ""}`}>
        {isLoading ? (
          <div className="circle-container">
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="circle"></div>
          </div>
        ) : (
          <div className={`alert-loader ${type}`}>
            <span className="icon">
              {type === "success" && <i className="bi bi-check-circle-fill text-green-500"></i>}
              {type === "error" && <i className="bi bi-exclamation-triangle-fill text-red-500"></i>}
              {type === "info" && <i className="bi bi-info-circle-fill text-blue-500"></i>}
            </span>
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

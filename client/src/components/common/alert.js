import "@styles/alert.css";

export default function AlertPopup({ children, message, type = "info"}) {
  return (
    <div className={`alert-popup ${type}`} role="alert">
      <div className="alert-content">
        <span className="icon">
          {type === "success" && <i className="bi bi-check-circle-fill text-green-500"></i>}
          {type === "error" && <i className="bi bi-exclamation-triangle-fill text-red-500"></i>}
          {type === "info" && <i className="bi bi-info-circle-fill text-blue-500"></i>}
        </span>
        <span className="alert-message">{message}</span>
        {children}
      </div>
    </div>
  );
}

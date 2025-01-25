import React, { useState, useEffect } from "react";
import '@public/styles/preloader.css';

export const Loader = ({ type, message, isLoading }) => {

  return (
    <div className="loader-container" style={{
        boxShadow: isLoading ? "0 4px 12px rgba(0, 0, 0, 0.2)": "none",
        background: isLoading ? "rgba(255, 255, 255, 0.85)": "none",
    }}>
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
            {type === "success" && "✔️"}
            {type === "error" && "⚠️"}
            {type === "info" && "ℹ️"}
          </span>
          <p>{message}</p>
        </div>
      )}
    </div>
  );
};
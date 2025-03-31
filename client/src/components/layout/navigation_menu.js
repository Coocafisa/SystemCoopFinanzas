"use client";
import PropTypes from "prop-types";
import "@styles/menu.css";
import { logout } from "@/api/requestServices/logout";
import Link from "next/link";

export default function Menu({ menuOptions }) {
  const handleSubmit = async (event) => {
    event.preventDefault();
    await logout(event);
  };

  return (
    <>
    <div className="menu">
        <nav className='menu-container'>
          <ul className="menu-list">
            {menuOptions.map((option) => (
              <li key={option.id} className="menu-item">
                <Link href={option.link} className="menu-link">
                  <i className={`menu-icon ${option.icon}`}></i>
                  <span className="menu-label">{option.label}</span>
                </Link>
              </li>
            ))}
             <li className="menu-item menu-link">
                <i className="menu-icon bi bi-box-arrow-right"></i>
                <span className="menu-label logout" onClick={handleSubmit}>Cerrar Sesión</span>
            </li>
          </ul>
        </nav>
    </div>
    </>
  );
}

Menu.propTypes = {
  menuOptions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
    })
  ).isRequired,
};

import React from "react";
import "./Sidebar.css";

const Sidebar = ({
  activeView,
  setActiveView,
  onAddProduct,
  onLogout,
  user,
}) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Noon Store</h2>
        <p className="admin-email">{user?.email}</p>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li>
            <button
              className={`nav-item ${
                activeView === "products" ? "active" : ""
              }`}
              onClick={() => setActiveView("products")}
            >
              <span className="nav-icon">📦</span>
              Products
            </button>
          </li>
          <li>
            <button className="nav-item" onClick={onAddProduct}>
              <span className="nav-icon">➕</span>
              Add Product
            </button>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-button" onClick={onLogout}>
          <span className="nav-icon">🚪</span>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

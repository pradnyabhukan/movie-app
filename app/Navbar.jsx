import React, { useState } from "react";

export default function Navbar() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="p-5 navbar">
      <h1>Logo</h1>
      <div className={`dropdown${isDropdownOpen ? " show" : ""}`}>
        <button
          className="btn btn-secondary dropdown-toggle"
          type="button"
          onClick={toggleDropdown}
        >
          Dropdown link
        </button>
        <div className={`dropdown-menu${isDropdownOpen ? " show" : ""}`}>
          <a className="dropdown-item" href="#">
            Action
          </a>
          <a className="dropdown-item" href="#">
            Another action
          </a>
          <a className="dropdown-item" href="#">
            Something else here
          </a>
        </div>
      </div>
    </div>
  );
}

import React from "react";

const Navbar = () => {
  return (
    <nav className="flex justify-between bg-blue-600 text-white p-2">
      <div className="logo flex">
        <span className="font-bold text-xl ml-8">Expence Manager</span>
      </div>
    </nav>
  );
};

export default Navbar;

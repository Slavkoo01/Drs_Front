import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <>
      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full z-10 bg-transparent md:flex-row md:flex-nowrap md:justify-start flex items-center p-4">
        <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4">
          {/* Brand */}
          <Link
            to="/"
            className="text-red text-lg uppercase hidden lg:inline-block font-semibold"
          >
            Home
          </Link>



          
          <ul className="flex-col md:flex-row list-none items-center hidden md:flex">
          </ul>
        </div>
      </nav>
      {/* End Navbar */}
    </>
  );
}

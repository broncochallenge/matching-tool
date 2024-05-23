import React from "react";
import Logo from "../assets/android-chrome-512x512.png";

export default function Navbar() {
  return (
    <div>
      <nav className="bg-white border-gray-200 dark:bg-wmu_brown">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a
            href="#"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img src={Logo} className="h-8" alt="Flowbite Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Matching Tool
            </span>
          </a>

          <div className="w-auto" id="navbar-default">
            <ul className="font-medium flex dark:bg-wmu_brown md:space-x-8 space-x-4">
              <li>
                <a href="#" className="dark:text-white " aria-current="page">
                  Apply
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

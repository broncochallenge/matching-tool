import Logo from "../assets/android-chrome-512x512.png";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div>
      <nav className="bg-white border-gray-200 dark:bg-wmu_brown">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          {/* <Link to={`contacts/1`}>Your Name</Link> */}
          <Link
            to="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img
              src={Logo}
              className="h-8"
              alt="BRONCO CHALLENGE FOR SUSTAINABLE IMPACT Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Matching Tool
            </span>
          </Link>

          <div className="w-auto" id="navbar-default">
            <ul className="font-medium flex dark:bg-wmu_brown md:space-x-8 space-x-4">
              <li>
                <Link
                  to="/apply"
                  className="dark:text-white "
                  aria-current="page"
                >
                  Apply
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

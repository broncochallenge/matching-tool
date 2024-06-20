import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800">
      <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2024{" "}
          <a
            href="https://wmich.edu/sustainability"
            className="hover:underline"
          >
            WMU Office for Sustainability
          </a>
          . All Rights Reserved.
        </span>
        <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
          <li>
            <a
              href="https://wmich.edu/sustainability/initiatives/broncochallenge"
              className="hover:underline me-4 md:me-6"
            >
              Back to Bronco Challenge
            </a>
          </li>
          <li>
            <a
              href="https://wmich.edu/sustainability/initiatives/broncochallenge#:~:text=College%20of%20Business-,CONTACT,-Contact%20Professor%20Neil"
              className="hover:underline"
            >
              Contact
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}

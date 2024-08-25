import React from "react";
import Navbar from "../Components/Navbar";
import { Link } from "react-router-dom";
import SitemapImage from "../assets/Bronco matching tool sitemap.svg";
import Footer from "../Components/Footer";

export default function SiteMap() {
  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white ">
      <Navbar />
      <div className="py-8 px-4 mx-auto max-w-screen-xl">
        {" "}
        <section className="my-8" id="Sitemap">
          <Link to="/instruction#Sitemap">
            <h2 className="text-2xl font-semibold mb-2">Sitemap</h2>
          </Link>
        </section>
        <img src={SitemapImage} alt="SitemapImage" />
      </div>
      <Footer />
    </div>
  );
}

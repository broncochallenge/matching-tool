import React from "react";
import Navbar from "../Components/Navbar";
import SitemapImage from "../assets/Bronco matching tool sitemap.svg";
import { Link } from "react-router-dom";
import Footer from "../Components/Footer";

const MatchingToolInstructions = () => {
  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white ">
      <Navbar />
      <div className="py-8 px-4 mx-auto max-w-screen-xl">
        <h1 className="text-3xl font-bold mb-4">
          Getting Started with the Matching Tool
        </h1>

        {/* Section for Teams Looking for New Members */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">
            For Teams Looking for New Members
          </h2>
          <p className="mb-4">
            If your team is looking for more members, click the{" "}
            <strong className="text-blue-500">"Find Team Members"</strong>{" "}
            button on the homepage. This will take you to a page listing
            students who have submitted their profiles. Each profile includes
            the student's contact information, major, SDGs of interest, and
            skillsets. You can contact the students directly via email.
          </p>
          <p className="mb-4">
            On this page, you can also click the{" "}
            <strong className="text-blue-500">"Add Team Member Request"</strong>{" "}
            button to submit a request for new team members.
          </p>

          {/* Subsection for Adding a Team Member Request */}
          <div className="ml-4">
            <h3 className="text-xl font-medium mb-2">
              How to Add a Team Member Request
            </h3>
            <p className="mb-4">
              Fill out the form with the following details, then click the{" "}
              <strong className="text-blue-500">"Find Teammate"</strong> button:
            </p>
            <ul className="list-disc list-inside mb-4">
              <li>
                <strong>Your Name</strong>
              </li>
              <li>
                <strong>Your Email</strong>
              </li>
              <li>
                <strong>Your Team Name</strong>
              </li>
              <li>
                <strong>A Message to Potential Team Members</strong>
              </li>
              <li>
                <strong>The Majors of Your Current Team Members</strong>
              </li>
              <li>
                <strong>The Skills You’re Looking for in a New Teammate</strong>
              </li>
              <li>
                <strong>
                  The Sustainable Development Goals Relevant to Your Project
                </strong>
              </li>
            </ul>
            <p>
              Your request will be made public, and students can contact you via
              email.
            </p>
          </div>
        </section>

        {/* Section for Students Looking to Join a Team */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">
            For Students Looking to Join a Team
          </h2>
          <p className="mb-4">
            If you are a student looking to join a team, click the{" "}
            <strong className="text-blue-500">"Join a Team"</strong> button on
            the homepage. This will take you to a page listing team requests.
            Each request includes the team's contact information and the skills
            they need. You can contact the teams directly via email.
          </p>
          <p className="mb-4">
            On this page, you can also click the{" "}
            <strong className="text-blue-500">
              "Advertise Your Interests and Skills"
            </strong>{" "}
            button to submit your information.
          </p>

          {/* Subsection for Submitting Interests and Skills */}
          <div className="ml-4">
            <h3 className="text-xl font-medium mb-2">
              How to Submit Your Interests and Skills
            </h3>
            <p className="mb-4">
              Fill out the form with the following details, then click the{" "}
              <strong className="text-blue-500">
                "Advertise My Interests and Skills"
              </strong>{" "}
              button:
            </p>
            <ul className="list-disc list-inside mb-4">
              <li>
                <strong>Your Name</strong>
              </li>
              <li>
                <strong>Your Email</strong>
              </li>
              <li>
                <strong>Your Major</strong>
              </li>
              <li>
                <strong>Your Academic Level</strong>
              </li>
              <li>
                <strong>Your Skillsets</strong>
              </li>
              <li>
                <strong>
                  The Sustainable Development Goals You’re Interested In
                </strong>
              </li>
            </ul>
          </div>
        </section>

        <p className="mt-4">
          If you need assistance, contact Neil Drobny at{" "}
          <a
            href="mailto:neil.drobny@wmich.edu"
            className="text-blue-500 underline"
          >
            neil.drobny@wmich.edu
          </a>
          .
        </p>
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
};

export default MatchingToolInstructions;

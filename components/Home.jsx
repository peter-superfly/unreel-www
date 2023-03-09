import React from "react";
import Head from "next/head";
import Typical from "react-typical";
import { FaExternalLinkAlt, FaPaperPlane } from "react-icons/fa";

export default (props) => {
  return (
    <>
      <Head>
        <title>Vertex » AI and More</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="w-full">
        <div className="banner-section">
          <div className="grid">
            <div className="grid grid-cols-1">
              <Typical
                className="hidden sm:flex"
                steps={[
                  "Vertex »  Create beautify Personal Profiles based on Notion",
                  2000,
                ]}
                loop={Infinity}
                wrapper="h2"
              />
              <Typical
                className="flex sm:hidden"
                steps={[
                  "Vertex - AI Catalog",
                  4000
                ]}
                loop={Infinity}
                wrapper="h5"
              />
            </div>
          </div>
          <div className="mt-5 flex">
            <a
              href="mailto:team@vertext.pub?subject=Vertex » Hello from Landing Page"
              className="banner-button gradient-button mr-5"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaPaperPlane size={30} />{" "}
              <span className="mr-2 ml-2">Get In Touch</span>
              <FaExternalLinkAlt />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

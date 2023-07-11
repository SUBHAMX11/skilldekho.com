import { useState, useEffect } from "react";
import Link from "next/link";

const InstructorNav = () => {
  const [current, setCurrent] = useState("");
  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  const linkStyle = {
    textDecoration: "none",
    padding: "9px",
    borderRadius: "5px",
    margin: "3px",
  };

  return (
    <div  className="container-fluid nav flex-column nav-pills mt-2">
      <Link href="/instructor" legacyBehavior>
        <a
          className={`nav-link ${current === "/instructor" ? "active" : ""}`}
          style={linkStyle}
        >
          Dashboard
        </a>
      </Link>

      <Link href="/instructor/course/create" legacyBehavior>
        <a
          className={`nav-link ${
            current === "/instructor/course/create" ? "active" : ""
          }`}
          style={linkStyle}
        >
          Create
        </a>
      </Link>

      <Link href="/instructor/revenue" legacyBehavior>
        <a
          className={`nav-link ${
            current === "/instructor/revenue" ? "active" : ""
          }`}
          style={linkStyle}
        >
          Revenue
        </a>
      </Link>
    </div>
  );
};

export default InstructorNav;

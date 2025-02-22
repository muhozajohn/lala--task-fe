import React from "react";
import { Link } from "react-router-dom";

const Notfound = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404 - Page Not Found</h1>
      <p style={styles.message}>
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link to="/" style={styles.link}>
        Go Back Home
      </Link>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "20px",
  },
  message: {
    fontSize: "1rem",
    marginBottom: "30px",
  },
  link: {
    fontSize: "1rem",
    color: "#007bff",
    textDecoration: "none",
  },
};

export default Notfound;

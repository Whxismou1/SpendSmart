import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <nav>
        <ul>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </ul>
      </nav>
    </div>
  );
};

export default Home;

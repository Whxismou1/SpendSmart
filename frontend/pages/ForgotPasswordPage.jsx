import React, { useState } from "react";

import { forgotPassword } from "../services/authService";
import { Link } from "react-router-dom";
function ForgotPasswordPage() {
  const [email, setEmail] = useState();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await forgotPassword(email);
    setIsSubmitted(true);
  };
  return (
    <div>
      <h2>Forgot password</h2>

      {!isSubmitted ? (
        <div>
          <form onSubmit={handleSubmit}>
            <p>
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
            <label htmlFor="email">Email: </label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input type="submit" value="Send reset link" />
          </form>
          <Link to="/login">Go back to login</Link>
        </div>
      ) : (
        <div>
          <p>
            If an account exists for {email}, you will receive a password reset
            link shortly.
          </p>
          <Link to="/login">Go back to login</Link>
        </div>
      )}
    </div>
  );
}

export default ForgotPasswordPage;

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyEmail } from "../services/authService";
import { toast } from "react-hot-toast";
const MAX_DIGITS = 5;

const EmailVerificationPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");

    try {
      await verifyEmail(verificationCode);
      toast.success("Email verified successfully");
      navigate("/login");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleOnChange = (index, value) => {
    const newCode = [...code];
    if (value.length > 1) {
      const codePasted = value.slice(0, 6).split("");

      for (let i = 0; i < 6; i++) {
        newCode[i] = codePasted[i] || "";
      }

      setCode(newCode);

      const lastFilledInput = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex =
        lastFilledInput < MAX_DIGITS ? lastFilledInput + 1 : MAX_DIGITS;

      inputRefs.current[focusIndex].focus();
    } else {
      newCode[index] = value;
      setCode(newCode);

      if (index < MAX_DIGITS && value) {
        inputRefs.current[index + 1].focus();
      }
    }
  };
  const handleOnKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  useEffect(() => {
    if (code.every((digit) => digit != "")) {
      handleSubmit(new Event("submit"));
    }
  }, [code]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength="6"
              value={digit}
              onChange={(e) => handleOnChange(index, e.target.value)}
              onKeyDown={(e) => handleOnKeyDown(index, e)}
            />
          ))}
        </div>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default EmailVerificationPage;

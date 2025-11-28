import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "./api/axios";

export default function ProtectedRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setValid(false);
      setChecking(false);
      return;
    }

    // Ask backend if token is valid
    api
      .get("/auth/verify")
      .then(() => {
        setValid(true);
      })
      .catch(() => {
        // invalid / expired / dummy token
        localStorage.removeItem("token");
        setValid(false);
      })
      .finally(() => {
        setChecking(false);
      });
  }, []);

  if (checking) {
    // You can return a spinner / skeleton here
    return <div className="text-center mt-10">Checking authentication...</div>;
  }

  if (!valid) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

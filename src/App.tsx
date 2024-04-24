import { IconArrowLeft, IconLogout } from "@tabler/icons-react";
import { useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";

export function App() {
  const navigate = useNavigate();

  const [accessToken, setAccessToken] = useState(() => {
    const key = "accessToken=";
    const cookies = window.document.cookie.split("; ");
    const cookie = cookies.find((value) => value.startsWith(key));
    return cookie ? cookie.slice(key.length) : "";
  });

  const handleLogin = (newAccessToken: string) => {
    const key = "accessToken=";
    let value = `${key}${newAccessToken};path=/;samesite=strict`;
    if (window.location.protocol === "https:") value += ";secure";
    window.document.cookie = value;
    setAccessToken(newAccessToken);
    navigate("/app");
  };

  if (!accessToken) {
    return (
      <Routes>
        <Route element={<Login onLogin={handleLogin} />} path="/app/login" />
        <Route element={<Navigate to="/app/login" />} path="*" />
      </Routes>
    );
  }

  return (
    <div>
      <div className="flex h-12 items-center gap-4 bg-yellow-50 px-4">
        <button className="btn btn-black btn-sm btn-outlined" type="button">
          <IconArrowLeft className="size-4" />
        </button>
        <div className="text-lg font-bold underline decoration-yellow-400">
          EduFit
        </div>
        <button
          className="btn btn-black btn-sm btn-outlined ml-auto"
          type="button"
        >
          <IconLogout className="size-4" />
        </button>
      </div>
      <div>
        <Routes>
          <Route element={<Navigate to="/app" />} path="/" />
          <Route element={<Home />} path="/app" />
          <Route element="404 - Página não encontrada" path="*" />
        </Routes>
      </div>
    </div>
  );
}

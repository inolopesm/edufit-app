import { Navigate, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";

export function App() {
  return (
    <Routes>
      <Route element={<Navigate to="/app" />} path="/" />
      <Route element={<Home />} path="/app" />
      <Route element={<Login />} path="/app/login" />
    </Routes>
  );
}

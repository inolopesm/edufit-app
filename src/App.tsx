import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";

export function App() {
  return (
    <Routes>
      <Route element={<Navigate to="/app" />} path="/" />
      <Route element={<Home />} path="/app" />
    </Routes>
  );
}

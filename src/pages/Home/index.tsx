import Cookies from "js-cookie";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!Cookies.get("accessToken")) {
      navigate("/app/login");
    }
  }, [navigate]);

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="flex h-16 items-center border-b border-b-gray-900 bg-yellow-400 px-6 shadow-lg">
        <div className="text-lg font-medium underline decoration-white">
          Edufit
        </div>
      </div>
      <div className="flex-grow"></div>
    </div>
  );
}

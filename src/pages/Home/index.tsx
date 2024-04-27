import { IconLogout, IconUser, IconX } from "@tabler/icons-react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { UxWingBoyWithCapIcon } from "../../components/ux-wing/BoyWithCapIcon";

const UserSchema = z.object({
  cargo: z.string(),
  cref: z.string(),
  id: z.string(),
  nome: z.string(),
  telefone: z.string(),
});

export function Home() {
  const navigate = useNavigate();
  const [userDrawerOpen, setUserDrawerOpen] = useState(false);

  const [accessToken, setAccessToken] = useState(Cookies.get("accessToken"));

  const user = useMemo(() => {
    if (!accessToken) return null;
    const payload = jwtDecode(accessToken);
    const result = UserSchema.safeParse(payload);
    if (!result.success) return null;
    return result.data;
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) {
      navigate("/app/login");
    }
  }, [accessToken, navigate]);

  const handleLogout = () => {
    const secure = window.location.protocol === "https:";
    const options = { path: "/", sameSite: "strict" as const, secure };
    Cookies.remove("accessToken", options);
    setAccessToken(undefined);
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="flex h-16 items-center border-b border-b-gray-900 px-6 shadow-lg">
        <div className="text-2xl font-medium underline decoration-yellow-400">
          Edufit
        </div>
        <button
          className="btn btn-black btn-icon btn-outlined ml-auto border-none"
          onClick={() => setUserDrawerOpen(true)}
          type="button"
        >
          <IconUser className="size-6" />
        </button>
        {userDrawerOpen &&
          createPortal(
            <div className="absolute inset-0 flex flex-col bg-white p-6">
              <div className="flex justify-end">
                <button
                  className="btn btn-black btn-icon btn-outlined border-none"
                  onClick={() => setUserDrawerOpen(false)}
                  type="button"
                >
                  <IconX className="size-6" />
                </button>
              </div>
              <div className="flex flex-grow flex-col gap-4 py-4">
                <div className="flex justify-center py-4">
                  <div className="size-32 overflow-hidden rounded-full border border-yellow-400 bg-gray-100">
                    <UxWingBoyWithCapIcon className="text-yellow-400" />
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="font-medium">Nome</div>
                  <div>{user?.nome}</div>
                </div>
                <div className="flex justify-between">
                  <div className="font-medium">CREF</div>
                  <div>{user?.cref}</div>
                </div>
                <div className="flex justify-between">
                  <div className="font-medium">Telefone</div>
                  <div>{user?.telefone}</div>
                </div>
                <div className="flex justify-between">
                  <div className="font-medium">Cargo</div>
                  <div>{user?.cargo.replaceAll("_", " ")}</div>
                </div>
              </div>
              <div className="flex flex-col">
                <button
                  className="btn btn-black btn-lg btn-outlined justify-start border-none"
                  onClick={handleLogout}
                  type="button"
                >
                  <IconLogout className="-mt-0.5 size-5 text-red-600" />
                  <span className="text-red-600">Sair</span>
                </button>
              </div>
            </div>,
            window.document.body,
          )}
      </div>
      <div className="flex-grow bg-gray-100"></div>
    </div>
  );
}

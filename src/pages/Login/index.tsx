import { useMutation } from "@tanstack/react-query";
import { clsx } from "clsx";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { IMaskInput } from "react-imask";
import { useNavigate } from "react-router-dom";
import { Exception } from "../../services/api";
import { LoginParameters, login } from "../../services/api/auth";

export function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState<Error | null>(null);
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [cargo, setCargo] = useState<string>("");

  const loginMutation = useMutation({
    mutationFn: (parameters: LoginParameters) => login(parameters),
  });

  useEffect(() => {
    if (Cookies.get("accessToken")) {
      navigate("/app");
    }
  }, [navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const parameters = { cargo, senha, telefone };
      const result = await loginMutation.mutateAsync(parameters);
      const secure = window.location.protocol === "https:";
      const options = { path: "/", sameSite: "strict" as const, secure };
      Cookies.set("accessToken", result.accessToken, options);
      navigate("/app");
    } catch (error_) {
      setError(error_);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-yellow-400 px-6">
      <form
        className="flex w-full max-w-sm flex-col gap-8 rounded bg-white p-4 shadow-lg"
        onSubmit={handleSubmit}
      >
        <div className="pt-8 text-center text-3xl font-medium underline decoration-yellow-400">
          EduFit
        </div>
        {error !== null && (
          <div
            className={clsx(
              "alert",
              error instanceof Exception ? "alert-warning" : "alert-danger",
            )}
          >
            <div className="alert-title">{error.message}</div>
          </div>
        )}
        <div className="flex flex-col gap-6">
          <div>
            <label className="mb-2 inline-block text-sm" htmlFor="telefone">
              Telefone
            </label>
            <IMaskInput
              autoComplete="tel-national"
              autoFocus
              className="input"
              id="telefone"
              inputMode="numeric"
              lazy={false}
              mask="(00) 0 0000-0000"
              name="telefone"
              onAccept={(value) => setTelefone(value)}
              pattern="\(\d{2}\) \d \d{4}-\d{4}"
              placeholder="(00) 0 0000-0000"
              required
              type="text"
              value={telefone}
            />
          </div>
          <div>
            <label className="mb-2 inline-block text-sm" htmlFor="senha">
              Senha
            </label>
            <input
              autoComplete="new-password"
              className="input"
              id="senha"
              maxLength={16}
              minLength={8}
              name="senha"
              onChange={(event) => setSenha(event.target.value)}
              placeholder="********"
              required
              type="password"
              value={senha}
            />
          </div>
          <div className="flex justify-around">
            <div className="flex items-center gap-2">
              <input
                checked={cargo === "PERSONAL_TRAINER"}
                className="radio"
                id="PERSONAL_TRAINER"
                name="cargo"
                onChange={(event) => setCargo(event.target.value)}
                required
                type="radio"
                value="PERSONAL_TRAINER"
              />
              <label className="text-sm" htmlFor="PERSONAL_TRAINER">
                Personal Trainer
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                checked={cargo === "ALUNO"}
                className="radio"
                id="ALUNO"
                name="cargo"
                onChange={(event) => setCargo(event.target.value)}
                required
                type="radio"
                value="ALUNO"
              />
              <label className="text-sm" htmlFor="ALUNO">
                Aluno
              </label>
            </div>
          </div>
        </div>
        <button className="btn btn-black btn-md btn-filled" type="submit">
          Entrar
        </button>
      </form>
    </div>
  );
}

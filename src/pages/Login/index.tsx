import IMask from "imask";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";

export interface LoginProps {
  onLogin: (accessToken: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [state, setState] = useState({ error: null as Error | null });
  const telefoneRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (telefoneRef.current) {
      IMask(telefoneRef.current, {
        lazy: false,
        mask: "(00) 0 0000-0000",
      });
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/login`,
        {
          body: JSON.stringify(Object.fromEntries(new FormData(form))),
          headers: { "content-type": "application/json" },
          method: "POST",
        },
      );

      if (!response.ok) {
        const { message } = await z
          .object({ message: z.string() })
          .parseAsync(await response.json());

        throw new Error(message);
      }

      const { accessToken } = await z
        .object({ accessToken: z.string() })
        .parseAsync(await response.json());

      onLogin(accessToken);
    } catch (error) {
      if (!(error instanceof Error)) throw error;
      setState({ ...state, error });
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-yellow-400">
      <form
        className="flex w-full max-w-xs flex-col gap-4 rounded border bg-white p-4 shadow"
        method="post"
        onSubmit={handleSubmit}
      >
        <div className="text-center text-2xl font-bold underline decoration-yellow-400">
          EduFit
        </div>
        {state.error && (
          <div className="alert alert-danger">
            <div className="alert-title">{state.error.message}</div>
          </div>
        )}
        <div>
          <label className="mb-2 inline-block text-sm" htmlFor="telefone">
            Telefone
          </label>
          <input
            autoComplete="tel-national"
            autoFocus
            className="input"
            id="telefone"
            inputMode="numeric"
            name="telefone"
            pattern="\(\d{2}\) \d \d{4}-\d{4}"
            placeholder="(00) 0 0000-0000"
            ref={telefoneRef}
            required
            type="text"
          />
        </div>
        <div>
          <label className="mb-2 inline-block text-sm" htmlFor="senha">
            Senha
          </label>
          <input
            className="input"
            id="senha"
            maxLength={16}
            minLength={8}
            name="senha"
            placeholder="********"
            required
            type="password"
          />
        </div>
        <div className="flex justify-around">
          <label className="flex items-center gap-2 text-sm" htmlFor="aluno">
            <input
              className="radio"
              id="aluno"
              name="cargo"
              required
              type="radio"
              value="ALUNO"
            />
            Aluno
          </label>
          <label className="flex items-center gap-2 text-sm" htmlFor="personal">
            <input
              className="radio"
              id="personal"
              name="cargo"
              required
              type="radio"
              value="PERSONAL_TRAINER"
            />
            Personal Trainer
          </label>
        </div>
        <button className="btn btn-black btn-md btn-filled" type="submit">
          Entrar
        </button>
      </form>
    </div>
  );
}

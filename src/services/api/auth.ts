import { z } from "zod";
import { api } from "./index";

export interface LoginParameters {
  telefone: string;
  senha: string;
  cargo: string;
}

export const LoginResultSchema = z.object({
  accessToken: z.string(),
});

export type LoginResult = z.infer<typeof LoginResultSchema>;

export async function login(parameters: LoginParameters) {
  const response = await api.post("/api/v1/auth/login", parameters);
  return await LoginResultSchema.parseAsync(response.data);
}

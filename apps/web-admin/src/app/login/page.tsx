"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { login } from "../../features/auth/api";
import {
  getAuthToken,
  removeAuthToken,
  setAuthCliente,
  setAuthToken,
  setAuthUser,
} from "../../lib/auth-storage";
import {
  Badge,
  ErrorBox,
  Form,
  Hint,
  LoginCard,
  PageContainer,
  Subtitle,
  Title,
} from "./page.styles";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("dudumacen@gmail.com");
  const [senha, setSenha] = useState("123456");
  const [isLoading, setIsLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const token = getAuthToken();

    if (token) {
      router.replace("/clientes");
    }
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErro(null);
    setIsLoading(true);

    try {
      const response = await login({
        email,
        senha,
      });

      if (response.usuario.role !== "SUPER_ADMIN") {
        removeAuthToken();
        setErro("Acesso permitido apenas para super administradores");
        return;
      }

      setAuthToken(response.token);
      setAuthUser(response.usuario);
      setAuthCliente(response.cliente);

      router.replace("/clientes");
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao fazer login"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <PageContainer>
      <LoginCard>
        <Badge>Imóvel Prático Admin</Badge>

        <Title>Entrar no painel</Title>

        <Subtitle>
          Acesse o painel administrativo para gerenciar clientes e usuários do
          SaaS.
        </Subtitle>

        <Form onSubmit={handleSubmit}>
          <Input
            label="E-mail"
            type="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
            required
          />

          <Input
            label="Senha"
            type="password"
            value={senha}
            onChange={event => setSenha(event.target.value)}
            required
          />

          {erro && <ErrorBox>{erro}</ErrorBox>}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </Form>

        <Hint>
          Super admin inicial:
          <br />
          <strong>E-mail:</strong> dudumacen@gmail.com
          <br />
          <strong>Senha:</strong> 123456
        </Hint>
      </LoginCard>
    </PageContainer>
  );
}

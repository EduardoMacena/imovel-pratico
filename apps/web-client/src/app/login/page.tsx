"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { login } from "../../features/auth/api";
import {
  getAuthToken,
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

  const [email, setEmail] = useState("admin@twa.com.br");
  const [senha, setSenha] = useState("123456");
  const [isLoading, setIsLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const token = getAuthToken();

    if (token) {
      router.replace("/");
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

      setAuthToken(response.token);
      setAuthUser(response.usuario);
      setAuthCliente(response.cliente);

      router.replace("/");
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
        <Badge>Imóvel Prático</Badge>

        <Title>Entrar no sistema</Title>

        <Subtitle>
          Acesse sua conta para iniciar buscas, acompanhar tarefas e consultar o
          histórico da sua imobiliária.
        </Subtitle>

        <Form onSubmit={handleSubmit}>
          <Input
            label="E-mail"
            type="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
            placeholder="seu@email.com"
            required
          />

          <Input
            label="Senha"
            type="password"
            value={senha}
            onChange={event => setSenha(event.target.value)}
            placeholder="Sua senha"
            required
          />

          {erro && <ErrorBox>{erro}</ErrorBox>}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </Form>

        <Hint>
          Acesso inicial de teste:
          <br />
          <strong>E-mail:</strong> admin@twa.com.br
          <br />
          <strong>Senha:</strong> 123456
        </Hint>
      </LoginCard>
    </PageContainer>
  );
}

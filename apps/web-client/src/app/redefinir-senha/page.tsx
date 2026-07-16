"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { redefinirSenha } from "../../features/auth/api";
import { removeAuthToken } from "../../lib/auth-storage";
import {
  Badge,
  ErrorBox,
  FooterText,
  Form,
  Hero,
  HeroContent,
  HeroText,
  HeroTitle,
  LoginArea,
  LoginCard,
  LoginSubtitle,
  LoginTitle,
  Page,
  SuccessBox,
} from "./page.styles";

function RedefinirSenhaFallback() {
  return (
    <Page>
      <Hero>
        <HeroContent>
          <Badge>Nova senha</Badge>

          <HeroTitle>Preparando redefinição de senha.</HeroTitle>

          <HeroText>
            Estamos carregando as informações necessárias para redefinir sua
            senha.
          </HeroText>
        </HeroContent>
      </Hero>

      <LoginArea>
        <LoginCard>
          <LoginTitle>Carregando...</LoginTitle>

          <LoginSubtitle>
            Aguarde um instante enquanto validamos a tela de redefinição.
          </LoginSubtitle>
        </LoginCard>
      </LoginArea>
    </Page>
  );
}

function RedefinirSenhaContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(
    token ? null : "Token de redefinição não informado."
  );
  const [sucesso, setSucesso] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErro(null);
    setSucesso(null);

    if (!token) {
      setErro("Token de redefinição não informado.");
      return;
    }

    if (novaSenha !== confirmarNovaSenha) {
      setErro("As senhas não conferem.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await redefinirSenha({
        token,
        novaSenha,
        confirmarNovaSenha,
      });

      removeAuthToken();

      setNovaSenha("");
      setConfirmarNovaSenha("");
      setSucesso(response.message);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao redefinir senha"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Page>
      <Hero>
        <HeroContent>
          <Badge>Nova senha</Badge>

          <HeroTitle>Defina uma nova senha segura.</HeroTitle>

          <HeroText>
            Após redefinir sua senha, volte ao login e acesse a plataforma com
            as novas credenciais.
          </HeroText>
        </HeroContent>
      </Hero>

      <LoginArea>
        <LoginCard>
          <LoginTitle>Redefinir senha</LoginTitle>

          <LoginSubtitle>
            Crie uma nova senha para recuperar o acesso à plataforma.
          </LoginSubtitle>

          <Form onSubmit={handleSubmit}>
            <Input
              label="Nova senha"
              type="password"
              value={novaSenha}
              onChange={event => setNovaSenha(event.target.value)}
              placeholder="Digite a nova senha"
              autoComplete="new-password"
              required
            />

            <Input
              label="Confirmar nova senha"
              type="password"
              value={confirmarNovaSenha}
              onChange={event => setConfirmarNovaSenha(event.target.value)}
              placeholder="Repita a nova senha"
              autoComplete="new-password"
              required
            />

            {erro && <ErrorBox>{erro}</ErrorBox>}
            {sucesso && <SuccessBox>{sucesso}</SuccessBox>}

            <Button type="submit" fullWidth disabled={isLoading || !token}>
              {isLoading ? "Salvando..." : "Redefinir senha"}
            </Button>

            <FooterText>
              <Link href="/login">Voltar para o login</Link>
            </FooterText>
          </Form>
        </LoginCard>
      </LoginArea>
    </Page>
  );
}

export default function RedefinirSenhaPage() {
  return (
    <Suspense fallback={<RedefinirSenhaFallback />}>
      <RedefinirSenhaContent />
    </Suspense>
  );
}
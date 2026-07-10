"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { solicitarRedefinicaoSenha } from "../../features/auth/api";
import {
  Badge,
  DevLink,
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

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("");
  const [resetUrl, setResetUrl] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErro(null);
    setSucesso(null);
    setResetUrl(null);
    setIsLoading(true);

    try {
      const response = await solicitarRedefinicaoSenha({
        email,
      });

      setSucesso(response.message);

      if (response.resetUrl) {
        setResetUrl(response.resetUrl);
      }
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao solicitar redefinição de senha"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Page>
      <Hero>
        <HeroContent>
          <Badge>Recuperação de acesso</Badge>

          <HeroTitle>Recupere o acesso da sua imobiliária.</HeroTitle>

          <HeroText>
            Informe o e-mail cadastrado para receber as instruções de
            redefinição da senha.
          </HeroText>
        </HeroContent>
      </Hero>

      <LoginArea>
        <LoginCard>
          <LoginTitle>Esqueci minha senha</LoginTitle>

          <LoginSubtitle>
            Digite seu e-mail de acesso. Se ele existir na plataforma,
            enviaremos as instruções para redefinir sua senha.
          </LoginSubtitle>

          <Form onSubmit={handleSubmit}>
            <Input
              label="E-mail"
              type="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
              placeholder="seu@email.com"
              autoComplete="email"
              required
            />

            {erro && <ErrorBox>{erro}</ErrorBox>}
            {sucesso && <SuccessBox>{sucesso}</SuccessBox>}

            <Button type="submit" fullWidth disabled={isLoading}>
              {isLoading ? "Enviando..." : "Enviar instruções"}
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
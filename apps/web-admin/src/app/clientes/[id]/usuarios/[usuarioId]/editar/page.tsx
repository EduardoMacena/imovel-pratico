"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppHeader } from "../../../../../../components/AppHeader";
import { Button } from "../../../../../../components/Button";
import { Card } from "../../../../../../components/Card";
import { Input } from "../../../../../../components/Input";
import { Select } from "../../../../../../components/Select";
import { StatusBadge } from "../../../../../../components/StatusBadge";
import {
  atualizarUsuario,
  buscarUsuario,
} from "../../../../../../features/admin/api";
import type { UsuarioRole } from "../../../../../../features/admin/types";
import { useRequireSuperAdmin } from "../../../../../../hooks/useRequireSuperAdmin";
import {
  Actions,
  BackLink,
  EmptyState,
  EmptyStateTitle,
  ErrorBox,
  Form,
  FormGrid,
  FormHeader,
  FormSection,
  FormSectionTitle,
  Header,
  HeaderContent,
  HeaderEyebrow,
  HeaderGrid,
  HeaderPanel,
  HeaderPanelItem,
  HeaderPanelLabel,
  HeaderPanelValue,
  PageContainer,
  Subtitle,
  SuccessBox,
  Title,
} from "./page.styles";

type UsuarioRoleCliente = Exclude<UsuarioRole, "SUPER_ADMIN">;

export default function EditarUsuarioPage() {
  const { isCheckingAuth } = useRequireSuperAdmin();
  const params = useParams<{ id: string; usuarioId: string }>();
  const router = useRouter();

  const clienteId = params.id;
  const usuarioId = params.usuarioId;

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [role, setRole] = useState<UsuarioRoleCliente>("OPERADOR");
  const [ativo, setAtivo] = useState("true");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  async function carregarUsuario() {
    try {
      setErro(null);

      const data = await buscarUsuario(usuarioId);

      setNome(data.usuario.nome);
      setEmail(data.usuario.email);
      setRole(
        data.usuario.role === "SUPER_ADMIN"
          ? "ADMIN"
          : (data.usuario.role as UsuarioRoleCliente)
      );
      setAtivo(data.usuario.ativo ? "true" : "false");
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao carregar usuário"
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErro(null);
    setSucesso(null);
    setIsSaving(true);

    try {
      await atualizarUsuario(usuarioId, {
        nome,
        email,
        senha: senha.trim() || undefined,
        role,
        ativo: ativo === "true",
      });

      setSenha("");
      setSucesso("Usuário atualizado com sucesso.");
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao atualizar usuário"
      );
    } finally {
      setIsSaving(false);
    }
  }

  useEffect(() => {
    if (!isCheckingAuth) {
      carregarUsuario();
    }
  }, [isCheckingAuth]);

  if (isCheckingAuth) {
    return null;
  }

  return (
    <>
      <AppHeader />

      <PageContainer>
        <BackLink href={`/clientes/${clienteId}/usuarios`}>
          ← Voltar para usuários
        </BackLink>

        <Header>
          <HeaderGrid>
            <HeaderContent>
              <HeaderEyebrow>Gestão de acesso</HeaderEyebrow>

              <Title>Editar usuário</Title>

              <Subtitle>
                Atualize dados de acesso, perfil operacional, status do usuário
                e defina uma nova senha quando necessário.
              </Subtitle>
            </HeaderContent>

            <HeaderPanel>
              <HeaderPanelItem>
                <HeaderPanelLabel>Perfil atual</HeaderPanelLabel>
                <HeaderPanelValue>
                  <StatusBadge status={role} />
                </HeaderPanelValue>
              </HeaderPanelItem>

              <HeaderPanelItem>
                <HeaderPanelLabel>Status</HeaderPanelLabel>
                <HeaderPanelValue>
                  <StatusBadge status={ativo === "true" ? "ATIVO" : "INATIVO"} />
                </HeaderPanelValue>
              </HeaderPanelItem>

              <HeaderPanelItem>
                <HeaderPanelLabel>Usuário</HeaderPanelLabel>
                <HeaderPanelValue>{nome || "-"}</HeaderPanelValue>
              </HeaderPanelItem>
            </HeaderPanel>
          </HeaderGrid>
        </Header>

        {isLoading && (
          <EmptyState>
            <EmptyStateTitle>Carregando usuário...</EmptyStateTitle>
            Estamos buscando os dados do usuário selecionado.
          </EmptyState>
        )}

        {!isLoading && (
          <Card>
            <FormHeader>
              <FormSectionTitle>Configurações do usuário</FormSectionTitle>
              <Subtitle>
                Altere as informações principais e salve para aplicar as novas
                permissões de acesso.
              </Subtitle>
            </FormHeader>

            <Form onSubmit={handleSubmit}>
              <FormSection>
                <FormSectionTitle>Identificação</FormSectionTitle>

                <FormGrid>
                  <Input
                    label="Nome"
                    value={nome}
                    onChange={event => setNome(event.target.value)}
                    required
                  />

                  <Input
                    label="E-mail"
                    type="email"
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                    required
                  />
                </FormGrid>
              </FormSection>

              <FormSection>
                <FormSectionTitle>Acesso</FormSectionTitle>

                <FormGrid>
                  <Select
                    label="Perfil"
                    value={role}
                    onChange={event =>
                      setRole(event.target.value as UsuarioRoleCliente)
                    }
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="GERENTE">GERENTE</option>
                    <option value="OPERADOR">OPERADOR</option>
                  </Select>

                  <Select
                    label="Status"
                    value={ativo}
                    onChange={event => setAtivo(event.target.value)}
                  >
                    <option value="true">ATIVO</option>
                    <option value="false">INATIVO</option>
                  </Select>
                </FormGrid>
              </FormSection>

              <FormSection>
                <FormSectionTitle>Senha</FormSectionTitle>

                <Input
                  label="Nova senha"
                  type="text"
                  value={senha}
                  onChange={event => setSenha(event.target.value)}
                  placeholder="Deixe vazio para manter a senha atual"
                />
              </FormSection>

              {erro && <ErrorBox>{erro}</ErrorBox>}
              {sucesso && <SuccessBox>{sucesso}</SuccessBox>}

              <Actions>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Salvando..." : "Salvar alterações"}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.push(`/clientes/${clienteId}/usuarios`)}
                >
                  Voltar para usuários
                </Button>
              </Actions>
            </Form>
          </Card>
        )}
      </PageContainer>
    </>
  );
}
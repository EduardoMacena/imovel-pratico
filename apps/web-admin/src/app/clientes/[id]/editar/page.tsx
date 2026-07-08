"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppHeader } from "../../../../components/AppHeader";
import { Button } from "../../../../components/Button";
import { Card } from "../../../../components/Card";
import { Input } from "../../../../components/Input";
import { Select } from "../../../../components/Select";
import {
  atualizarCliente,
  buscarCliente,
} from "../../../../features/admin/api";
import type { ClienteStatus } from "../../../../features/admin/types";
import { useRequireSuperAdmin } from "../../../../hooks/useRequireSuperAdmin";
import {
  Actions,
  BackLink,
  EmptyState,
  ErrorBox,
  Form,
  Header,
  PageContainer,
  Subtitle,
  SuccessBox,
  Title,
} from "./page.styles";

export default function EditarClientePage() {
  const { isCheckingAuth } = useRequireSuperAdmin();
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const clienteId = params.id;

  const [nome, setNome] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState<ClienteStatus>("ATIVO");
  const [workerUrl, setWorkerUrl] = useState("");
  const [intervaloSegundos, setIntervaloSegundos] = useState(30);
  const [limiteDiario, setLimiteDiario] = useState(300);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  async function carregarCliente() {
    try {
      setErro(null);

      const data = await buscarCliente(clienteId);

      setNome(data.cliente.nome);
      setSlug(data.cliente.slug);
      setStatus(data.cliente.status);
      setWorkerUrl(data.cliente.workerUrl ?? "");
      setIntervaloSegundos(data.cliente.intervaloSegundos);
      setLimiteDiario(data.cliente.limiteDiario);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao carregar cliente"
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
      await atualizarCliente(clienteId, {
        nome,
        slug,
        status,
        workerUrl: workerUrl.trim() || null,
        intervaloSegundos,
        limiteDiario,
      });

      setSucesso("Cliente atualizado com sucesso.");
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao atualizar cliente"
      );
    } finally {
      setIsSaving(false);
    }
  }

  useEffect(() => {
    if (!isCheckingAuth) {
      carregarCliente();
    }
  }, [isCheckingAuth]);

  if (isCheckingAuth) {
    return null;
  }

  return (
    <>
      <AppHeader />

      <PageContainer>
        <BackLink href="/clientes">← Voltar para clientes</BackLink>

        <Header>
          <Title>Editar cliente</Title>
          <Subtitle>
            Atualize os dados, limites e configurações operacionais do cliente.
          </Subtitle>
        </Header>

        {isLoading && <EmptyState>Carregando cliente...</EmptyState>}

        {!isLoading && (
          <Card>
            <Form onSubmit={handleSubmit}>
              <Input
                label="Nome"
                value={nome}
                onChange={event => setNome(event.target.value)}
                required
              />

              <Input
                label="Slug"
                value={slug}
                onChange={event => setSlug(event.target.value)}
                required
              />

              <Select
                label="Status"
                value={status}
                onChange={event =>
                  setStatus(event.target.value as ClienteStatus)
                }
              >
                <option value="ATIVO">ATIVO</option>
                <option value="INATIVO">INATIVO</option>
                <option value="SUSPENSO">SUSPENSO</option>
              </Select>

              <Input
                label="Worker URL"
                value={workerUrl}
                onChange={event => setWorkerUrl(event.target.value)}
                placeholder="Opcional"
              />

              <Input
                label="Intervalo em segundos"
                type="number"
                min={5}
                max={300}
                value={intervaloSegundos}
                onChange={event =>
                  setIntervaloSegundos(Number(event.target.value))
                }
                required
              />

              <Input
                label="Limite diário"
                type="number"
                min={1}
                value={limiteDiario}
                onChange={event => setLimiteDiario(Number(event.target.value))}
                required
              />

              {erro && <ErrorBox>{erro}</ErrorBox>}
              {sucesso && <SuccessBox>{sucesso}</SuccessBox>}

              <Actions>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Salvando..." : "Salvar alterações"}
                </Button>

                <Button
                  type="button"
                  onClick={() => router.push(`/clientes/${clienteId}/usuarios`)}
                >
                  Gerenciar usuários
                </Button>
              </Actions>
            </Form>
          </Card>
        )}
      </PageContainer>
    </>
  );
}

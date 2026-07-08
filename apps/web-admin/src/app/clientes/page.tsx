"use client";

import { FormEvent, useEffect, useState } from "react";
import { AppHeader } from "../../components/AppHeader";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { Input } from "../../components/Input";
import { StatusBadge } from "../../components/StatusBadge";
import { criarCliente, listarClientes } from "../../features/admin/api";
import type { ClienteResumo } from "../../features/admin/types";
import { useRequireSuperAdmin } from "../../hooks/useRequireSuperAdmin";
import {
  Actions,
  ClientItem,
  ClientName,
  ClientTop,
  DetailsLink,
  EmptyState,
  ErrorBox,
  Form,
  Grid,
  Header,
  InfoBox,
  InfoGrid,
  InfoLabel,
  InfoValue,
  List,
  PageContainer,
  Subtitle,
  Title,
} from "./page.styles";

export default function ClientesPage() {
  const { isCheckingAuth } = useRequireSuperAdmin();

  const [clientes, setClientes] = useState<ClienteResumo[]>([]);
  const [nome, setNome] = useState("");
  const [intervaloSegundos, setIntervaloSegundos] = useState(30);
  const [limiteDiario, setLimiteDiario] = useState(300);

  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function carregarClientes() {
    try {
      setErro(null);

      const data = await listarClientes();

      setClientes(data.clientes);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao carregar clientes"
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCriarCliente(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErro(null);
    setIsCreating(true);

    try {
      await criarCliente({
        nome,
        intervaloSegundos,
        limiteDiario,
      });

      setNome("");
      setIntervaloSegundos(30);
      setLimiteDiario(300);

      await carregarClientes();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao criar cliente"
      );
    } finally {
      setIsCreating(false);
    }
  }

  useEffect(() => {
    if (!isCheckingAuth) {
      carregarClientes();
    }
  }, [isCheckingAuth]);

  if (isCheckingAuth) {
    return null;
  }

  return (
    <>
      <AppHeader />

      <PageContainer>
        <Header>
          <Title>Clientes</Title>
          <Subtitle>
            Cadastre imobiliárias, configure limites e gerencie os usuários de
            cada cliente.
          </Subtitle>
        </Header>

        <Grid>
          <Card>
            <Form onSubmit={handleCriarCliente}>
              <Input
                label="Nome do cliente"
                value={nome}
                onChange={event => setNome(event.target.value)}
                placeholder="Ex: TWA Investimentos"
                required
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

              <Button type="submit" disabled={isCreating}>
                {isCreating ? "Criando..." : "Criar cliente"}
              </Button>
            </Form>
          </Card>

          <div>
            {erro && <ErrorBox>{erro}</ErrorBox>}

            {isLoading && <EmptyState>Carregando clientes...</EmptyState>}

            {!isLoading && clientes.length === 0 && (
              <EmptyState>Nenhum cliente cadastrado ainda.</EmptyState>
            )}

            {!isLoading && clientes.length > 0 && (
              <List>
                {clientes.map(cliente => (
                  <ClientItem key={cliente.id}>
                    <ClientTop>
                      <div>
                        <ClientName>{cliente.nome}</ClientName>
                        <div>{cliente.slug}</div>
                      </div>

                      <StatusBadge status={cliente.status} />
                    </ClientTop>

                    <InfoGrid>
                      <InfoBox>
                        <InfoLabel>Usuários</InfoLabel>
                        <InfoValue>{cliente.totalUsuarios}</InfoValue>
                      </InfoBox>

                      <InfoBox>
                        <InfoLabel>Tarefas</InfoLabel>
                        <InfoValue>{cliente.totalTarefas}</InfoValue>
                      </InfoBox>

                      <InfoBox>
                        <InfoLabel>Intervalo</InfoLabel>
                        <InfoValue>{cliente.intervaloSegundos}s</InfoValue>
                      </InfoBox>

                      <InfoBox>
                        <InfoLabel>Limite diário</InfoLabel>
                        <InfoValue>{cliente.limiteDiario}</InfoValue>
                      </InfoBox>
                    </InfoGrid>

                    <Actions>
                      <DetailsLink href={`/clientes/${cliente.id}/usuarios`}>
                        Gerenciar usuários
                      </DetailsLink>
                    </Actions>
                  </ClientItem>
                ))}
              </List>
            )}
          </div>
        </Grid>
      </PageContainer>
    </>
  );
}

"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppHeader } from "../../../../components/AppHeader";
import { Button } from "../../../../components/Button";
import { Card } from "../../../../components/Card";
import { Input } from "../../../../components/Input";
import { Select } from "../../../../components/Select";
import { StatusBadge } from "../../../../components/StatusBadge";
import { atualizarPlano, buscarPlano } from "../../../../features/admin/api";
import type { PlanoStatus } from "../../../../features/admin/types";
import { useRequireSuperAdmin } from "../../../../hooks/useRequireSuperAdmin";
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

function centsToReais(value: number) {
  return String(value / 100);
}

function toCents(value: string) {
  const normalized = value.replace(",", ".");
  return Math.round(Number(normalized || 0) * 100);
}

export default function EditarPlanoPage() {
  const { isCheckingAuth } = useRequireSuperAdmin();
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const planoId = params.id;

  const [nome, setNome] = useState("");
  const [slug, setSlug] = useState("");
  const [descricao, setDescricao] = useState("");
  const [limiteMensalConsultas, setLimiteMensalConsultas] = useState(300);
  const [intervaloSegundos, setIntervaloSegundos] = useState(90);
  const [precoReais, setPrecoReais] = useState("0");
  const [status, setStatus] = useState<PlanoStatus>("ATIVO");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  async function carregarPlano() {
    try {
      setErro(null);

      const data = await buscarPlano(planoId);

      setNome(data.plano.nome);
      setSlug(data.plano.slug);
      setDescricao(data.plano.descricao ?? "");
      setLimiteMensalConsultas(data.plano.limiteMensalConsultas);
      setIntervaloSegundos(data.plano.intervaloSegundos);
      setPrecoReais(centsToReais(data.plano.precoCentavos));
      setStatus(data.plano.status);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao carregar plano"
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
      await atualizarPlano(planoId, {
        nome,
        slug,
        descricao: descricao.trim() || null,
        limiteMensalConsultas,
        intervaloSegundos,
        precoCentavos: toCents(precoReais),
        status,
      });

      setSucesso("Plano atualizado com sucesso.");
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao atualizar plano"
      );
    } finally {
      setIsSaving(false);
    }
  }

  useEffect(() => {
    if (!isCheckingAuth) {
      carregarPlano();
    }
  }, [isCheckingAuth]);

  if (isCheckingAuth) {
    return null;
  }

  return (
    <>
      <AppHeader />

      <PageContainer>
        <BackLink href="/planos">← Voltar para planos</BackLink>

        <Header>
          <HeaderGrid>
            <HeaderContent>
              <HeaderEyebrow>Gestão comercial</HeaderEyebrow>

              <Title>Editar plano</Title>

              <Subtitle>
                Altere nome, slug, limite mensal, intervalo entre consultas,
                preço e status comercial do plano.
              </Subtitle>
            </HeaderContent>

            <HeaderPanel>
              <HeaderPanelItem>
                <HeaderPanelLabel>Status</HeaderPanelLabel>
                <HeaderPanelValue>
                  <StatusBadge status={status} />
                </HeaderPanelValue>
              </HeaderPanelItem>

              <HeaderPanelItem>
                <HeaderPanelLabel>Limite mensal</HeaderPanelLabel>
                <HeaderPanelValue>
                  {limiteMensalConsultas} consultas
                </HeaderPanelValue>
              </HeaderPanelItem>

              <HeaderPanelItem>
                <HeaderPanelLabel>Intervalo</HeaderPanelLabel>
                <HeaderPanelValue>{intervaloSegundos}s</HeaderPanelValue>
              </HeaderPanelItem>
            </HeaderPanel>
          </HeaderGrid>
        </Header>

        {isLoading && (
          <EmptyState>
            <EmptyStateTitle>Carregando plano...</EmptyStateTitle>
            Estamos buscando as configurações comerciais deste plano.
          </EmptyState>
        )}

        {!isLoading && (
          <Card>
            <FormHeader>
              <FormSectionTitle>Configurações do plano</FormSectionTitle>
              <Subtitle>
                Atualize os dados comerciais e salve para aplicar as mudanças
                aos próximos vínculos de clientes.
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
                    label="Slug"
                    value={slug}
                    onChange={event => setSlug(event.target.value)}
                    required
                  />
                </FormGrid>

                <Input
                  label="Descrição"
                  value={descricao}
                  onChange={event => setDescricao(event.target.value)}
                  placeholder="Opcional"
                />
              </FormSection>

              <FormSection>
                <FormSectionTitle>Limites operacionais</FormSectionTitle>

                <FormGrid>
                  <Select
                    label="Limite mensal de consultas"
                    value={limiteMensalConsultas}
                    onChange={event =>
                      setLimiteMensalConsultas(Number(event.target.value))
                    }
                  >
                    <option value={300}>300 consultas/mês</option>
                    <option value={500}>500 consultas/mês</option>
                    <option value={1000}>1000 consultas/mês</option>
                    <option value={2000}>2000 consultas/mês</option>
                  </Select>

                  <Input
                    label="Intervalo entre consultas em segundos"
                    type="number"
                    min={40}
                    max={300}
                    value={intervaloSegundos}
                    onChange={event =>
                      setIntervaloSegundos(Number(event.target.value))
                    }
                    required
                  />
                </FormGrid>
              </FormSection>

              <FormSection>
                <FormSectionTitle>Comercial</FormSectionTitle>

                <FormGrid>
                  <Input
                    label="Preço mensal em reais"
                    type="number"
                    min={0}
                    step="0.01"
                    value={precoReais}
                    onChange={event => setPrecoReais(event.target.value)}
                    required
                  />

                  <Select
                    label="Status"
                    value={status}
                    onChange={event =>
                      setStatus(event.target.value as PlanoStatus)
                    }
                  >
                    <option value="ATIVO">ATIVO</option>
                    <option value="INATIVO">INATIVO</option>
                  </Select>
                </FormGrid>
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
                  onClick={() => router.push("/planos")}
                >
                  Voltar
                </Button>
              </Actions>
            </Form>
          </Card>
        )}
      </PageContainer>
    </>
  );
}
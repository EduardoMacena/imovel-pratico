"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AppHeader } from "../../../../components/AppHeader";
import { Button } from "../../../../components/Button";
import { Input } from "../../../../components/Input";
import { Select } from "../../../../components/Select";
import { StatusBadge } from "../../../../components/StatusBadge";
import { atualizarPlano, buscarPlano } from "../../../../features/admin/api";
import type { AtualizarPlanoRequest } from "../../../../features/admin/types";
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
  FormPanel,
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

type PlanoStatus = NonNullable<AtualizarPlanoRequest["status"]>;

function formatCurrencyFromCents(value?: number | null) {
  if (value === null || value === undefined) {
    return "-";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value / 100);
}

function centsToMoneyInput(value?: number | null) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value / 100).replace(".", ",");
}

function moneyToCents(value: string) {
  const normalized = value
    .replace(/\s/g, "")
    .replace("R$", "")
    .replace(/\./g, "")
    .replace(",", ".");

  const numberValue = Number(normalized);

  if (Number.isNaN(numberValue)) {
    return 0;
  }

  return Math.round(numberValue * 100);
}

export default function EditarPlanoPage() {
  const { isCheckingAuth } = useRequireSuperAdmin();
  const params = useParams<{ id: string }>();

  const planoId = params.id;

  const [nome, setNome] = useState("");
  const [slug, setSlug] = useState("");
  const [descricao, setDescricao] = useState("");
  const [limiteMensalConsultas, setLimiteMensalConsultas] = useState("");
  const [intervaloSegundos, setIntervaloSegundos] = useState("");
  const [precoMensal, setPrecoMensal] = useState("");
  const [valorConsultaAdicional, setValorConsultaAdicional] = useState("");
  const [limiteCorretores, setLimiteCorretores] = useState("");
  const [status, setStatus] = useState<PlanoStatus>("ATIVO");

  const [precoOriginalCentavos, setPrecoOriginalCentavos] = useState(0);

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
      setLimiteMensalConsultas(String(data.plano.limiteMensalConsultas));
      setIntervaloSegundos(String(data.plano.intervaloSegundos));
      setPrecoMensal(centsToMoneyInput(data.plano.precoCentavos));
      setValorConsultaAdicional(
        centsToMoneyInput(data.plano.valorConsultaAdicionalCentavos)
      );
      setLimiteCorretores(String(data.plano.limiteCorretores ?? ""));
      setPrecoOriginalCentavos(data.plano.precoCentavos);
      setStatus(data.plano.status as PlanoStatus);
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
        descricao: descricao.trim() || undefined,
        limiteMensalConsultas: Number(limiteMensalConsultas),
        intervaloSegundos: Number(intervaloSegundos),
        precoCentavos: moneyToCents(precoMensal),
        valorConsultaAdicionalCentavos: moneyToCents(valorConsultaAdicional),
        limiteCorretores: limiteCorretores ? Number(limiteCorretores) : null,
        status,
      });

      setPrecoOriginalCentavos(moneyToCents(precoMensal));
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
              <HeaderEyebrow>Configuração comercial</HeaderEyebrow>

              <Title>Editar plano</Title>

              <Subtitle>
                Ajuste limite mensal, intervalo de processamento, preço e status
                do plano comercial.
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
                <HeaderPanelLabel>Preço atual</HeaderPanelLabel>
                <HeaderPanelValue>
                  {formatCurrencyFromCents(precoOriginalCentavos)}
                </HeaderPanelValue>
              </HeaderPanelItem>

              <HeaderPanelItem>
                <HeaderPanelLabel>Plano</HeaderPanelLabel>
                <HeaderPanelValue>{nome || "-"}</HeaderPanelValue>
              </HeaderPanelItem>
            </HeaderPanel>
          </HeaderGrid>
        </Header>

        {erro && <ErrorBox>{erro}</ErrorBox>}
        {sucesso && <SuccessBox>{sucesso}</SuccessBox>}

        {isLoading && (
          <EmptyState>
            <EmptyStateTitle>Carregando plano...</EmptyStateTitle>
            Estamos buscando as regras comerciais deste plano.
          </EmptyState>
        )}

        {!isLoading && (
          <FormPanel>
            <FormHeader>
              <FormSectionTitle>Dados do plano</FormSectionTitle>
              <Subtitle>
                Altere os campos abaixo e salve para aplicar as novas regras aos
                clientes vinculados.
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
                  placeholder="Descrição comercial do plano"
                />
              </FormSection>

              <FormSection>
                <FormSectionTitle>Limites e operação</FormSectionTitle>

                <FormGrid>
                  <Input
                    label="Limite mensal de consultas"
                    type="number"
                    min={1}
                    value={limiteMensalConsultas}
                    onChange={event => setLimiteMensalConsultas(event.target.value)}
                    required
                  />

                  <Input
                    label="Intervalo entre consultas em segundos"
                    type="number"
                    min={1}
                    value={intervaloSegundos}
                    onChange={event => setIntervaloSegundos(event.target.value)}
                    required
                  />
                </FormGrid>
              </FormSection>

              <FormSection>
                <FormSectionTitle>Preço e status</FormSectionTitle>

                <FormGrid>
                  <Input
                    label="Preço mensal em reais"
                    value={precoMensal}
                    onChange={event => setPrecoMensal(event.target.value)}
                    required
                  />

                  <Input
                    label="Valor da consulta adicional"
                    value={valorConsultaAdicional}
                    onChange={event => setValorConsultaAdicional(event.target.value)}
                    required
                  />

                  <Input
                    label="Quantidade de corretores"
                    type="number"
                    min={1}
                    value={limiteCorretores}
                    onChange={event => setLimiteCorretores(event.target.value)}
                  />

                  <Select
                    label="Status"
                    value={status}
                    onChange={event => setStatus(event.target.value as PlanoStatus)}
                  >
                    <option value="ATIVO">ATIVO</option>
                    <option value="INATIVO">INATIVO</option>
                  </Select>
                </FormGrid>
              </FormSection>

              <Actions>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Salvando..." : "Salvar alterações"}
                </Button>
              </Actions>
            </Form>
          </FormPanel>
        )}
      </PageContainer>
    </>
  );
}

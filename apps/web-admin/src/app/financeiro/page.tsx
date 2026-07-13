"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AppHeader } from "../../components/AppHeader";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Select } from "../../components/Select";
import { StatusBadge } from "../../components/StatusBadge";
import {
  cancelarFatura,
  gerarFatura,
  listarClientes,
  listarFaturas,
  marcarFaturaPaga,
} from "../../features/admin/api";
import type {
  ClienteResumo,
  FaturaResumo,
  FaturaStatus,
} from "../../features/admin/types";
import { useRequireSuperAdmin } from "../../hooks/useRequireSuperAdmin";
import {
  Actions,
  EmptyState,
  EmptyStateTitle,
  ErrorBox,
  FaturaCard,
  FaturaHeader,
  FaturaItem,
  FaturaItems,
  FaturaMeta,
  FaturaTitle,
  FilterGrid,
  Form,
  FormCard,
  FormHeader,
  FormTitle,
  Header,
  HeaderContent,
  HeaderEyebrow,
  HeaderGrid,
  HeaderPanel,
  HeaderPanelLabel,
  HeaderPanelValue,
  InfoBox,
  InfoGrid,
  InfoLabel,
  InfoValue,
  List,
  PageContainer,
  SectionHeader,
  SectionSubtitle,
  SectionTitle,
  StatCard,
  StatGrid,
  StatLabel,
  StatValue,
  Subtitle,
  SuccessBox,
  Title,
} from "./page.styles";

function formatCurrencyFromCents(value?: number | null) {
  if (value === null || value === undefined) {
    return "-";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value / 100);
}

function formatDate(value?: string | null) {
  if (!value) {
    return "-";
  }

  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T12:00:00.000Z`)
    : new Date(value);

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeZone: "UTC",
  }).format(date);
}

function getCurrentMes() {
  return new Date().getMonth() + 1;
}

function getCurrentAno() {
  return new Date().getFullYear();
}

function getDefaultVencimento() {
  const now = new Date();
  const vencimento = new Date(
    Date.UTC(now.getFullYear(), now.getMonth() + 1, 10, 12, 0, 0, 0)
  );

  return vencimento.toISOString().slice(0, 10);
}

export default function FinanceiroPage() {
  const { isCheckingAuth } = useRequireSuperAdmin();

  const [clientes, setClientes] = useState<ClienteResumo[]>([]);
  const [faturas, setFaturas] = useState<FaturaResumo[]>([]);

  const [clienteId, setClienteId] = useState("");
  const [referenciaMes, setReferenciaMes] = useState(String(getCurrentMes()));
  const [referenciaAno, setReferenciaAno] = useState(String(getCurrentAno()));
  const [vencimentoEm, setVencimentoEm] = useState(getDefaultVencimento());
  const [observacao, setObservacao] = useState("");

  const [statusFiltro, setStatusFiltro] = useState<string>("");
  const [clienteFiltro, setClienteFiltro] = useState<string>("");

  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  const resumo = useMemo(() => {
    const totalAberto = faturas
      .filter(fatura => fatura.status !== "PAGA" && fatura.status !== "CANCELADA")
      .reduce((total, fatura) => total + fatura.valorTotalCentavos, 0);

    const totalPago = faturas
      .filter(fatura => fatura.status === "PAGA")
      .reduce((total, fatura) => total + fatura.valorTotalCentavos, 0);

    const totalExcedente = faturas.reduce((total, fatura) => {
      return total + fatura.valorExcedenteCentavos;
    }, 0);

    const abertas = faturas.filter(fatura => fatura.status === "ABERTA").length;

    return {
      totalAberto,
      totalPago,
      totalExcedente,
      abertas,
    };
  }, [faturas]);

  async function carregarClientes() {
    const data = await listarClientes();
    setClientes(data.clientes);

    if (!clienteId && data.clientes[0]) {
      setClienteId(data.clientes[0].id);
    }
  }

  async function carregarFaturas() {
    try {
      setErro(null);

      const data = await listarFaturas({
        clienteId: clienteFiltro || undefined,
        status: statusFiltro || undefined,
      });

      setFaturas(data.faturas);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao carregar faturas"
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGerarFatura(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErro(null);
    setSucesso(null);
    setIsGenerating(true);

    try {
      await gerarFatura({
        clienteId,
        referenciaMes: Number(referenciaMes),
        referenciaAno: Number(referenciaAno),
        vencimentoEm,
        observacao: observacao.trim() || undefined,
      });

      setSucesso("Fatura gerada com sucesso.");

      await carregarFaturas();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao gerar fatura"
      );
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleMarcarPaga(faturaId: string) {
    setErro(null);
    setSucesso(null);

    try {
      await marcarFaturaPaga(faturaId);
      setSucesso("Fatura marcada como paga.");
      await carregarFaturas();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao marcar fatura como paga"
      );
    }
  }

  async function handleCancelar(faturaId: string) {
    setErro(null);
    setSucesso(null);

    try {
      await cancelarFatura(faturaId);
      setSucesso("Fatura cancelada.");
      await carregarFaturas();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao cancelar fatura"
      );
    }
  }

  useEffect(() => {
    if (!isCheckingAuth) {
      carregarClientes();
      carregarFaturas();
    }
  }, [isCheckingAuth]);

  useEffect(() => {
    if (!isCheckingAuth) {
      carregarFaturas();
    }
  }, [statusFiltro, clienteFiltro]);

  if (isCheckingAuth) {
    return null;
  }

  return (
    <>
      <AppHeader />

      <PageContainer>
        <Header>
          <HeaderGrid>
            <HeaderContent>
              <HeaderEyebrow>Controle financeiro</HeaderEyebrow>

              <Title>Faturas</Title>

              <Subtitle>
                Gere faturas mensais com mensalidade, consumo excedente,
                vencimento e controle manual de pagamento.
              </Subtitle>
            </HeaderContent>

            <HeaderPanel>
              <HeaderPanelLabel>Total em aberto</HeaderPanelLabel>
              <HeaderPanelValue>
                {formatCurrencyFromCents(resumo.totalAberto)}
              </HeaderPanelValue>
            </HeaderPanel>
          </HeaderGrid>
        </Header>

        <StatGrid>
          <StatCard>
            <StatLabel>Em aberto</StatLabel>
            <StatValue>{formatCurrencyFromCents(resumo.totalAberto)}</StatValue>
          </StatCard>

          <StatCard>
            <StatLabel>Pago</StatLabel>
            <StatValue>{formatCurrencyFromCents(resumo.totalPago)}</StatValue>
          </StatCard>

          <StatCard>
            <StatLabel>Excedente faturado</StatLabel>
            <StatValue>{formatCurrencyFromCents(resumo.totalExcedente)}</StatValue>
          </StatCard>

          <StatCard>
            <StatLabel>Faturas abertas</StatLabel>
            <StatValue>{resumo.abertas}</StatValue>
          </StatCard>
        </StatGrid>

        {erro && <ErrorBox>{erro}</ErrorBox>}
        {sucesso && <SuccessBox>{sucesso}</SuccessBox>}

        <FormCard>
          <FormHeader>
            <FormTitle>Gerar fatura do mês</FormTitle>
            <Subtitle>
              O sistema recalcula mensalidade e excedente com base no consumo da
              referência selecionada.
            </Subtitle>
          </FormHeader>

          <Form onSubmit={handleGerarFatura}>
            <FilterGrid>
              <Select
                label="Cliente"
                value={clienteId}
                onChange={event => setClienteId(event.target.value)}
                required
              >
                {clientes.map(cliente => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nome}
                  </option>
                ))}
              </Select>

              <Input
                label="Mês"
                type="number"
                min={1}
                max={12}
                value={referenciaMes}
                onChange={event => setReferenciaMes(event.target.value)}
                required
              />

              <Input
                label="Ano"
                type="number"
                min={2024}
                value={referenciaAno}
                onChange={event => setReferenciaAno(event.target.value)}
                required
              />

              <Input
                label="Vencimento"
                type="date"
                value={vencimentoEm}
                onChange={event => setVencimentoEm(event.target.value)}
                required
              />
            </FilterGrid>

            <Input
              label="Observação"
              value={observacao}
              onChange={event => setObservacao(event.target.value)}
              placeholder="Ex: ajuste comercial, negociação ou observação interna"
            />

            <Actions>
              <Button type="submit" disabled={isGenerating}>
                {isGenerating ? "Gerando..." : "Gerar fatura"}
              </Button>
            </Actions>
          </Form>
        </FormCard>

        <SectionHeader>
          <div>
            <SectionTitle>Faturas geradas</SectionTitle>
            <SectionSubtitle>
              Acompanhe status, vencimento, mensalidade, excedente e total
              cobrado.
            </SectionSubtitle>
          </div>
        </SectionHeader>

        <FilterGrid>
          <Select
            label="Filtrar cliente"
            value={clienteFiltro}
            onChange={event => setClienteFiltro(event.target.value)}
          >
            <option value="">Todos os clientes</option>
            {clientes.map(cliente => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nome}
              </option>
            ))}
          </Select>

          <Select
            label="Filtrar status"
            value={statusFiltro}
            onChange={event => setStatusFiltro(event.target.value)}
          >
            <option value="">Todos os status</option>
            <option value="ABERTA">ABERTA</option>
            <option value="FECHADA">FECHADA</option>
            <option value="PAGA">PAGA</option>
            <option value="VENCIDA">VENCIDA</option>
            <option value="CANCELADA">CANCELADA</option>
          </Select>
        </FilterGrid>

        {isLoading && (
          <EmptyState>
            <EmptyStateTitle>Carregando faturas...</EmptyStateTitle>
            Estamos buscando o histórico financeiro.
          </EmptyState>
        )}

        {!isLoading && faturas.length === 0 && (
          <EmptyState>
            <EmptyStateTitle>Nenhuma fatura encontrada.</EmptyStateTitle>
            Gere a primeira fatura para começar o controle financeiro.
          </EmptyState>
        )}

        {!isLoading && faturas.length > 0 && (
          <List>
            {faturas.map(fatura => (
              <FaturaCard key={fatura.id}>
                <FaturaHeader>
                  <div>
                    <FaturaTitle>{fatura.cliente.nome}</FaturaTitle>
                    <FaturaMeta>
                      Referência {fatura.referenciaLabel} · Plano{" "}
                      {fatura.planoNome ?? "-"}
                    </FaturaMeta>
                  </div>

                  <StatusBadge status={fatura.status} />
                </FaturaHeader>

                <InfoGrid>
                  <InfoBox>
                    <InfoLabel>Total</InfoLabel>
                    <InfoValue>
                      {formatCurrencyFromCents(fatura.valorTotalCentavos)}
                    </InfoValue>
                  </InfoBox>

                  <InfoBox>
                    <InfoLabel>Mensalidade</InfoLabel>
                    <InfoValue>
                      {formatCurrencyFromCents(
                        fatura.valorMensalidadeCentavos
                      )}
                    </InfoValue>
                  </InfoBox>

                  <InfoBox>
                    <InfoLabel>Excedente</InfoLabel>
                    <InfoValue>
                      {formatCurrencyFromCents(fatura.valorExcedenteCentavos)}
                    </InfoValue>
                  </InfoBox>

                  <InfoBox>
                    <InfoLabel>Consultas usadas</InfoLabel>
                    <InfoValue>{fatura.consultasUsadas}</InfoValue>
                  </InfoBox>

                  <InfoBox>
                    <InfoLabel>Excedentes</InfoLabel>
                    <InfoValue>{fatura.consultasExcedentes}</InfoValue>
                  </InfoBox>

                  <InfoBox>
                    <InfoLabel>Vencimento</InfoLabel>
                    <InfoValue>{formatDate(fatura.vencimentoEm)}</InfoValue>
                  </InfoBox>
                </InfoGrid>

                <FaturaItems>
                  {fatura.itens.map(item => (
                    <FaturaItem key={item.id}>
                      <span>{item.descricao}</span>
                      <strong>
                        {formatCurrencyFromCents(item.valorTotalCentavos)}
                      </strong>
                    </FaturaItem>
                  ))}
                </FaturaItems>

                <Actions>
                  {fatura.status !== "PAGA" && fatura.status !== "CANCELADA" && (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => handleMarcarPaga(fatura.id)}
                    >
                      Marcar como paga
                    </Button>
                  )}

                  {fatura.status !== "PAGA" && fatura.status !== "CANCELADA" && (
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() => handleCancelar(fatura.id)}
                    >
                      Cancelar
                    </Button>
                  )}
                </Actions>
              </FaturaCard>
            ))}
          </List>
        )}
      </PageContainer>
    </>
  );
}

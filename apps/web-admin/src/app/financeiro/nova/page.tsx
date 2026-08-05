"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "../../../components/AppHeader";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { Select } from "../../../components/Select";
import {
  gerarFatura,
  listarClientes,
} from "../../../features/admin/api";
import type { ClienteResumo } from "../../../features/admin/types";
import { useRequireSuperAdmin } from "../../../hooks/useRequireSuperAdmin";
import {
  Actions,
  BackLink,
  ErrorBox,
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
  PageContainer,
  Subtitle,
  SuccessBox,
  Title,
} from "../page.styles";

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

function getReferenciaLabel(mes: string, ano: string) {
  return `${String(mes).padStart(2, "0")}/${ano}`;
}

export default function NovaFaturaPage() {
  const router = useRouter();
  const { isCheckingAuth } = useRequireSuperAdmin();

  const [clientes, setClientes] = useState<ClienteResumo[]>([]);
  const [clienteId, setClienteId] = useState("");

  const [referenciaMes, setReferenciaMes] = useState(String(getCurrentMes()));
  const [referenciaAno, setReferenciaAno] = useState(String(getCurrentAno()));
  const [vencimentoEm, setVencimentoEm] = useState(getDefaultVencimento());
  const [observacao, setObservacao] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  async function carregarClientes() {
    try {
      setErro(null);

      const data = await listarClientes();

      setClientes(data.clientes);

      if (!clienteId && data.clientes[0]) {
        setClienteId(data.clientes[0].id);
      }
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

      setSucesso("Fatura gerada com sucesso. Redirecionando para a lista...");

      window.setTimeout(() => {
        router.push("/financeiro");
      }, 650);
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
          <HeaderGrid>
            <HeaderContent>
              <HeaderEyebrow>Nova fatura</HeaderEyebrow>

              <Title>Gerar fatura mensal</Title>

              <Subtitle>
                Selecione o cliente, a referência e o vencimento. O sistema
                calcula automaticamente a mensalidade, as consultas usadas e o
                mensalidade fixa do plano.
              </Subtitle>

              <Actions>
                <Link href="/financeiro" passHref legacyBehavior>
                  <BackLink>Voltar para faturas</BackLink>
                </Link>
              </Actions>
            </HeaderContent>

            <HeaderPanel>
              <HeaderPanelLabel>Referência</HeaderPanelLabel>
              <HeaderPanelValue>
                {getReferenciaLabel(referenciaMes, referenciaAno)}
              </HeaderPanelValue>
            </HeaderPanel>
          </HeaderGrid>
        </Header>

        {erro && <ErrorBox>{erro}</ErrorBox>}
        {sucesso && <SuccessBox>{sucesso}</SuccessBox>}

        <FormCard>
          <FormHeader>
            <FormTitle>Dados da fatura</FormTitle>

            <Subtitle>
              Ao gerar uma fatura já existente e ainda não paga, o sistema
              recalcula os itens e atualiza o valor total.
            </Subtitle>
          </FormHeader>

          <Form onSubmit={handleGerarFatura}>
            <FilterGrid>
              <Select
                label="Cliente"
                value={clienteId}
                onChange={event => setClienteId(event.target.value)}
                required
                disabled={isLoading}
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
              <Link href="/financeiro" passHref legacyBehavior>
                <BackLink>Cancelar</BackLink>
              </Link>

              <Button
                type="submit"
                disabled={isGenerating || isLoading || !clienteId}
              >
                {isGenerating ? "Gerando..." : "Gerar fatura"}
              </Button>
            </Actions>
          </Form>
        </FormCard>
      </PageContainer>
    </>
  );
}

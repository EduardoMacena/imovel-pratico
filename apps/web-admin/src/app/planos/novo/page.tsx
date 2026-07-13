"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "../../../components/AppHeader";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { Select } from "../../../components/Select";
import { criarPlano } from "../../../features/admin/api";
import type { CriarPlanoRequest } from "../../../features/admin/types";
import { useRequireSuperAdmin } from "../../../hooks/useRequireSuperAdmin";
import {
  Actions,
  BackLink,
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

type PlanoStatus = CriarPlanoRequest["status"];

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

export default function NovoPlanoPage() {
  const { isCheckingAuth } = useRequireSuperAdmin();
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [limiteMensalConsultas, setLimiteMensalConsultas] = useState("1000");
  const [intervaloSegundos, setIntervaloSegundos] = useState("60");
  const [precoMensal, setPrecoMensal] = useState("1497");
  const [valorConsultaAdicional, setValorConsultaAdicional] = useState("1,80");
  const [limiteCorretores, setLimiteCorretores] = useState("26");
  const [status, setStatus] = useState<PlanoStatus>("ATIVO");

  const [isCreating, setIsCreating] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErro(null);
    setSucesso(null);
    setIsCreating(true);

    try {
      await criarPlano({
        nome,
        descricao: descricao.trim() || undefined,
        limiteMensalConsultas: Number(limiteMensalConsultas),
        intervaloSegundos: Number(intervaloSegundos),
        precoCentavos: moneyToCents(precoMensal),
        valorConsultaAdicionalCentavos: moneyToCents(valorConsultaAdicional),
        limiteCorretores: Number(limiteCorretores),
        status,
      });

      setSucesso("Plano criado com sucesso.");

      window.setTimeout(() => {
        router.push("/planos");
      }, 650);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao criar plano"
      );
    } finally {
      setIsCreating(false);
    }
  }

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
              <HeaderEyebrow>Novo plano comercial</HeaderEyebrow>

              <Title>Cadastrar plano</Title>

              <Subtitle>
                Defina o valor fixo mensal, consultas inclusas, consulta
                adicional e quantidade de corretores recomendada.
              </Subtitle>
            </HeaderContent>

            <HeaderPanel>
              <HeaderPanelItem>
                <HeaderPanelLabel>Regra comercial</HeaderPanelLabel>
                <HeaderPanelValue>Mensalidade + excedente</HeaderPanelValue>
              </HeaderPanelItem>

              <HeaderPanelItem>
                <HeaderPanelLabel>Proteção comercial</HeaderPanelLabel>
                <HeaderPanelValue>
                  O cliente será avisado antes de autorizar excedente.
                </HeaderPanelValue>
              </HeaderPanelItem>
            </HeaderPanel>
          </HeaderGrid>
        </Header>

        {erro && <ErrorBox>{erro}</ErrorBox>}
        {sucesso && <SuccessBox>{sucesso}</SuccessBox>}

        <FormPanel>
          <FormHeader>
            <FormSectionTitle>Dados do novo plano</FormSectionTitle>
            <Subtitle>
              Depois de criado, o plano poderá ser vinculado aos clientes e
              editado quando necessário.
            </Subtitle>
          </FormHeader>

          <Form onSubmit={handleSubmit}>
            <FormSection>
              <FormSectionTitle>Identificação</FormSectionTitle>

              <FormGrid>
                <Input
                  label="Nome do plano"
                  value={nome}
                  onChange={event => setNome(event.target.value)}
                  placeholder="Ex: Premium"
                  required
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

              <Input
                label="Descrição"
                value={descricao}
                onChange={event => setDescricao(event.target.value)}
                placeholder="Ex: Plano avançado para imobiliárias com alta demanda"
              />
            </FormSection>

            <FormSection>
              <FormSectionTitle>Limites operacionais</FormSectionTitle>

              <FormGrid>
                <Input
                  label="Consultas inclusas por mês"
                  type="number"
                  min={1}
                  value={limiteMensalConsultas}
                  onChange={event => setLimiteMensalConsultas(event.target.value)}
                  required
                />

                <Input
                  label="Intervalo entre consultas em segundos"
                  type="number"
                  min={40}
                  value={intervaloSegundos}
                  onChange={event => setIntervaloSegundos(event.target.value)}
                  required
                />

                <Input
                  label="Quantidade de corretores"
                  type="number"
                  min={1}
                  value={limiteCorretores}
                  onChange={event => setLimiteCorretores(event.target.value)}
                  required
                />
              </FormGrid>
            </FormSection>

            <FormSection>
              <FormSectionTitle>Preço e excedente</FormSectionTitle>

              <FormGrid>
                <Input
                  label="Preço mensal em reais"
                  value={precoMensal}
                  onChange={event => setPrecoMensal(event.target.value)}
                  placeholder="1497"
                  required
                />

                <Input
                  label="Valor da consulta adicional"
                  value={valorConsultaAdicional}
                  onChange={event => setValorConsultaAdicional(event.target.value)}
                  placeholder="1,80"
                  required
                />
              </FormGrid>
            </FormSection>

            <Actions>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? "Criando..." : "Criar plano"}
              </Button>
            </Actions>
          </Form>
        </FormPanel>
      </PageContainer>
    </>
  );
}

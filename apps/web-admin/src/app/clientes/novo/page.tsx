"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AppHeader } from "../../../components/AppHeader";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { Select } from "../../../components/Select";
import {
  criarClienteOnboarding,
  listarMunicipiosElegiveis,
  listarPlanos,
} from "../../../features/admin/api";
import type {
  ClienteModoProcessamento,
  ClienteStatus,
  CriarClienteOnboardingResponse,
  MunicipioElegivel,
  PagamentoStatus,
  PlanoResumo,
} from "../../../features/admin/types";
import { useRequireSuperAdmin } from "../../../hooks/useRequireSuperAdmin";
import { formatCurrencyFromCents } from "../../../lib/formatters";
import {
  ActionLink,
  Actions,
  BackLink,
  EmptyState,
  ErrorBox,
  Eyebrow,
  FormGrid,
  Full,
  Hero,
  HeroMain,
  HeroSide,
  Hint,
  Layout,
  Notice,
  PageContainer,
  Panel,
  PanelHeader,
  Progress,
  ProgressValue,
  ReviewCard,
  ReviewGrid,
  SelectionCard,
  SelectionGrid,
  SideItem,
  SideLabel,
  SideValue,
  StepButton,
  StepNumber,
  Steps,
  StepText,
  Subtitle,
  Success,
  SuccessActions,
  SuccessGrid,
  SuccessItem,
  Title,
} from "./page.styles";

const ETAPAS = [
  ["Identificação", "Empresa e operação"],
  ["Plano", "Contrato e pagamento"],
  ["Município", "Operação principal"],
  ["Administrador", "Primeiro acesso"],
  ["Revisão", "Conferir e criar"],
] as const;

const MENSAGENS: Record<string, string> = {
  "O plano selecionado não está ativo":
    "O plano selecionado deixou de estar ativo. Escolha outro plano.",
  "O município selecionado ainda não está disponível":
    "O município selecionado não está mais disponível. Escolha outro.",
  "Já existe um cliente com esse slug":
    "Esse slug já pertence a outro cliente. Informe outro ou deixe vazio.",
  "Já existe um usuário com esse e-mail":
    "Esse e-mail já está associado a outro usuário.",
  "O slug deve conter letras ou números":
    "O slug precisa conter pelo menos uma letra ou número.",
  "A data de vencimento informada não existe":
    "Informe uma data de vencimento válida.",
};

function slugNormalizado(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function emailValido(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function dataValida(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const [year, month, day] = match.slice(1).map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function mensagemErro(error: unknown) {
  if (!(error instanceof Error)) {
    return "Não foi possível concluir o cadastro.";
  }
  return MENSAGENS[error.message] ?? error.message;
}

export default function NovoClientePage() {
  const { isCheckingAuth } = useRequireSuperAdmin();

  const [etapa, setEtapa] = useState(1);
  const [planos, setPlanos] = useState<PlanoResumo[]>([]);
  const [municipios, setMunicipios] = useState<MunicipioElegivel[]>([]);

  const [nome, setNome] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState<ClienteStatus>("ATIVO");
  const [modo, setModo] = useState<ClienteModoProcessamento>("AGENT");
  const [workerUrl, setWorkerUrl] = useState("");
  const [limiteDiario, setLimiteDiario] = useState("300");

  const [planoId, setPlanoId] = useState("");
  const [pagamento, setPagamento] = useState<PagamentoStatus>("PENDENTE");
  const [vencimento, setVencimento] = useState("");

  const [municipioId, setMunicipioId] = useState("");
  const [adminNome, setAdminNome] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminSenha, setAdminSenha] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submissionLockRef = useRef(false);
  const [erro, setErro] = useState<string | null>(null);
  const [resultado, setResultado] =
    useState<CriarClienteOnboardingResponse | null>(null);

  const plano = useMemo(
    () => planos.find((item) => item.id === planoId) ?? null,
    [planoId, planos],
  );
  const municipio = useMemo(
    () => municipios.find((item) => item.id === municipioId) ?? null,
    [municipioId, municipios],
  );

  async function carregarOpcoes() {
    try {
      setErro(null);
      setIsLoading(true);
      const [planosData, municipiosData] = await Promise.all([
        listarPlanos(),
        listarMunicipiosElegiveis(),
      ]);
      const ativos = planosData.planos.filter(
        (item) => item.status === "ATIVO",
      );
      setPlanos(ativos);
      setMunicipios(municipiosData.municipios);
      setPlanoId((current) => current || ativos[0]?.id || "");
      setMunicipioId(
        (current) => current || municipiosData.municipios[0]?.id || "",
      );
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao carregar planos e municípios",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function validar(numero: number) {
    if (numero === 1) {
      if (nome.trim().length < 2) return "Informe o nome do cliente.";
      if (slug.trim() && (slug.trim().length < 2 || !slugNormalizado(slug))) {
        return "Informe um slug válido ou deixe o campo vazio.";
      }
      if (Number(limiteDiario) < 1 || !Number.isInteger(Number(limiteDiario))) {
        return "Informe um limite diário válido.";
      }
      if (workerUrl.trim()) {
        try {
          new URL(workerUrl.trim());
        } catch {
          return "Informe uma Worker URL válida ou deixe o campo vazio.";
        }
      }
    }

    if (numero === 2) {
      if (!planoId) return "Selecione um plano ativo.";
      if (vencimento && !dataValida(vencimento)) {
        return "Informe uma data de vencimento válida.";
      }
    }

    if (numero === 3 && !municipioId) {
      return "Selecione o município principal.";
    }

    if (numero === 4) {
      if (adminNome.trim().length < 2) {
        return "Informe o nome do administrador.";
      }
      if (!emailValido(adminEmail)) {
        return "Informe um e-mail válido.";
      }
      if (adminSenha.length < 6) {
        return "A senha temporária deve ter no mínimo seis caracteres.";
      }
    }

    return null;
  }

  function avancar() {
    const message = validar(etapa);
    if (message) {
      setErro(message);
      return;
    }
    setErro(null);
    setEtapa((current) => Math.min(current + 1, 5));
  }

  async function concluir() {
    for (const numero of [1, 2, 3, 4]) {
      const message = validar(numero);
      if (message) {
        setEtapa(numero);
        setErro(message);
        return;
      }
    }

    if (submissionLockRef.current) return;

    submissionLockRef.current = true;
    setErro(null);
    setIsSubmitting(true);

    try {
      const response = await criarClienteOnboarding({
        nome: nome.trim(),
        slug: slug.trim() || undefined,
        status,
        modoProcessamento: modo,
        workerUrl: workerUrl.trim() || null,
        limiteDiario: Number(limiteDiario),
        planoId,
        municipioId,
        pagamentoStatus: pagamento,
        pagamentoVenceEm: vencimento || null,
        administradorInicial: {
          nome: adminNome.trim(),
          email: adminEmail.trim().toLowerCase(),
          senha: adminSenha,
        },
      });

      setAdminSenha("");
      setResultado(response);
    } catch (error) {
      setErro(mensagemErro(error));
    } finally {
      submissionLockRef.current = false;
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    if (!isCheckingAuth) void carregarOpcoes();
  }, [isCheckingAuth]);

  if (isCheckingAuth) return null;

  if (resultado) {
    return (
      <>
        <AppHeader />
        <PageContainer>
          <BackLink href="/clientes">← Voltar para clientes</BackLink>
          <Success>
            <Eyebrow>Onboarding concluído</Eyebrow>
            <h2>{resultado.cliente.nome} está pronto para operar.</h2>
            <p>
              Cliente, município principal e administrador foram criados na
              mesma operação. A senha não é exibida nem mantida nesta tela.
            </p>

            {resultado.avisoEmail && (
              <Notice $warning>{resultado.avisoEmail.message}</Notice>
            )}

            <SuccessGrid>
              <SuccessItem>
                <small>Plano</small>
                <strong>{resultado.cliente.plano?.nome ?? "-"}</strong>
              </SuccessItem>
              <SuccessItem>
                <small>Município principal</small>
                <strong>
                  {resultado.cliente.municipioPrincipal
                    ? `${resultado.cliente.municipioPrincipal.nome} — ${resultado.cliente.municipioPrincipal.uf}`
                    : "-"}
                </strong>
              </SuccessItem>
              <SuccessItem>
                <small>Administrador</small>
                <strong>
                  {resultado.administradorInicial.nome}
                  <br />
                  {resultado.administradorInicial.email}
                </strong>
              </SuccessItem>
            </SuccessGrid>

            <SuccessActions>
              <ActionLink
                $primary
                href={`/clientes/${resultado.cliente.id}/editar`}
              >
                Configurar cliente
              </ActionLink>
              <ActionLink href={`/clientes/${resultado.cliente.id}/usuarios`}>
                Gerenciar usuários
              </ActionLink>
              <ActionLink href={`/clientes/${resultado.cliente.id}/instalador`}>
                Preparar instalador
              </ActionLink>
              <ActionLink href="/clientes">Ver todos os clientes</ActionLink>
            </SuccessActions>
          </Success>
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <AppHeader />

      <PageContainer>
        <BackLink href="/clientes">← Voltar para clientes</BackLink>

        <Hero>
          <HeroMain>
            <Eyebrow>Cadastro guiado de clientes</Eyebrow>
            <Title>Configure a operação completa com segurança.</Title>
            <Subtitle>
              Reúna identificação, plano fixo, pagamento, município principal e
              administrador antes de concluir.
            </Subtitle>
          </HeroMain>

          <HeroSide>
            <SideItem>
              <SideLabel>Etapa atual</SideLabel>
              <SideValue>
                {etapa}/5 · {ETAPAS[etapa - 1][0]}
              </SideValue>
            </SideItem>
            <SideItem>
              <SideLabel>Plano</SideLabel>
              <SideValue>{plano?.nome ?? "Aguardando seleção"}</SideValue>
            </SideItem>
            <SideItem>
              <SideLabel>Município</SideLabel>
              <SideValue>
                {municipio
                  ? `${municipio.nome} — ${municipio.uf}`
                  : "Aguardando seleção"}
              </SideValue>
            </SideItem>
          </HeroSide>
        </Hero>

        <Progress aria-label={`Progresso do cadastro: ${etapa * 20}%`}>
          <ProgressValue $value={etapa * 20} />
        </Progress>

        {erro && <ErrorBox role="alert">{erro}</ErrorBox>}

        {isLoading ? (
          <EmptyState>
            <strong>Preparando o onboarding...</strong>
            Estamos carregando planos ativos e municípios disponíveis.
          </EmptyState>
        ) : planos.length === 0 || municipios.length === 0 ? (
          <EmptyState>
            <strong>O cadastro ainda não pode começar.</strong>
            {planos.length === 0 && "Cadastre ou ative um plano. "}
            {municipios.length === 0 && "Disponibilize um município ativo. "}
            <Actions>
              {planos.length === 0 ? (
                <ActionLink $primary href="/planos/novo">
                  Cadastrar plano
                </ActionLink>
              ) : (
                <ActionLink $primary href="/clientes">
                  Voltar
                </ActionLink>
              )}
              <Button type="button" variant="ghost" onClick={carregarOpcoes}>
                Tentar novamente
              </Button>
            </Actions>
          </EmptyState>
        ) : (
          <Layout>
            <Steps aria-label="Etapas do cadastro">
              {ETAPAS.map(([label, hint], index) => {
                const numero = index + 1;
                const complete = numero < etapa;
                const active = numero === etapa;
                return (
                  <StepButton
                    key={label}
                    type="button"
                    $active={active}
                    $complete={complete}
                    disabled={numero > etapa}
                    aria-current={active ? "step" : undefined}
                    onClick={() => {
                      if (numero <= etapa) {
                        setErro(null);
                        setEtapa(numero);
                      }
                    }}
                  >
                    <StepNumber $complete={complete}>
                      {complete ? "✓" : numero}
                    </StepNumber>
                    <StepText>
                      <strong>{label}</strong>
                      <small>{hint}</small>
                    </StepText>
                  </StepButton>
                );
              })}
            </Steps>

            <Panel>
              {etapa === 1 && (
                <>
                  <PanelHeader>
                    <span>Etapa 1 de 5</span>
                    <h2>Identificação e operação</h2>
                    <p>
                      Defina como o cliente será reconhecido e processado. O
                      intervalo será sincronizado pelo plano.
                    </p>
                  </PanelHeader>

                  <FormGrid>
                    <Input
                      label="Nome do cliente"
                      value={nome}
                      onChange={(event) => setNome(event.target.value)}
                      placeholder="Ex: TWA Investimentos"
                      required
                    />
                    <Input
                      label="Slug opcional"
                      value={slug}
                      onChange={(event) => setSlug(event.target.value)}
                      placeholder="Gerado automaticamente quando vazio"
                    />
                    <Select
                      label="Status inicial"
                      value={status}
                      onChange={(event) =>
                        setStatus(event.target.value as ClienteStatus)
                      }
                    >
                      <option value="ATIVO">ATIVO</option>
                      <option value="INATIVO">INATIVO</option>
                      <option value="SUSPENSO">SUSPENSO</option>
                    </Select>
                    <Select
                      label="Modo de processamento"
                      value={modo}
                      onChange={(event) =>
                        setModo(event.target.value as ClienteModoProcessamento)
                      }
                    >
                      <option value="AGENT">AGENT — Máquina do cliente</option>
                      <option value="QUEUE">QUEUE — Nuvem / VPS</option>
                    </Select>
                    <Input
                      label="Limite diário operacional"
                      type="number"
                      min={1}
                      step={1}
                      value={limiteDiario}
                      onChange={(event) => setLimiteDiario(event.target.value)}
                      required
                    />
                    <Input
                      label="Worker URL opcional"
                      type="url"
                      value={workerUrl}
                      onChange={(event) => setWorkerUrl(event.target.value)}
                      placeholder="https://workers.cliente.com"
                    />
                    <Full>
                      <Notice>
                        Limite mensal e intervalo vêm do plano. O limite diário
                        permanece como proteção operacional.
                      </Notice>
                    </Full>
                  </FormGrid>
                </>
              )}

              {etapa === 2 && (
                <>
                  <PanelHeader>
                    <span>Etapa 2 de 5</span>
                    <h2>Plano fixo e pagamento</h2>
                    <p>
                      Selecione somente entre planos ativos. Mensalidade e
                      limite são informativos no frontend.
                    </p>
                  </PanelHeader>

                  <SelectionGrid>
                    {planos.map((item) => (
                      <SelectionCard
                        key={item.id}
                        type="button"
                        $selected={item.id === planoId}
                        aria-pressed={item.id === planoId}
                        onClick={() => setPlanoId(item.id)}
                      >
                        <strong>{item.nome}</strong>
                        <span>
                          {formatCurrencyFromCents(item.precoCentavos)} por mês
                          <br />
                          {item.limiteMensalConsultas.toLocaleString(
                            "pt-BR",
                          )}{" "}
                          consultas · intervalo de {item.intervaloSegundos}s
                        </span>
                      </SelectionCard>
                    ))}
                  </SelectionGrid>

                  <FormGrid>
                    <Select
                      label="Situação do pagamento"
                      value={pagamento}
                      onChange={(event) =>
                        setPagamento(event.target.value as PagamentoStatus)
                      }
                    >
                      <option value="PENDENTE">PENDENTE</option>
                      <option value="PAGO">PAGO</option>
                      <option value="VENCIDO">VENCIDO</option>
                      <option value="CANCELADO">CANCELADO</option>
                    </Select>
                    <div>
                      <Input
                        label="Vencimento opcional"
                        type="date"
                        value={vencimento}
                        onChange={(event) => setVencimento(event.target.value)}
                      />
                      <Hint>Deixe vazio quando não houver vencimento.</Hint>
                    </div>
                  </FormGrid>

                  <Notice>
                    Ao atingir o limite mensal, novas buscas ficam bloqueadas
                    até renovação ou mudança de plano.
                  </Notice>
                </>
              )}

              {etapa === 3 && (
                <>
                  <PanelHeader>
                    <span>Etapa 3 de 5</span>
                    <h2>Município principal</h2>
                    <p>
                      O vínculo municipal principal será criado junto com o
                      cliente na mesma transação.
                    </p>
                  </PanelHeader>

                  <SelectionGrid>
                    {municipios.map((item) => (
                      <SelectionCard
                        key={item.id}
                        type="button"
                        $selected={item.id === municipioId}
                        aria-pressed={item.id === municipioId}
                        onClick={() => setMunicipioId(item.id)}
                      >
                        <strong>
                          {item.nome} — {item.uf}
                        </strong>
                        <span>Código IBGE: {item.codigoIbge}</span>
                      </SelectionCard>
                    ))}
                  </SelectionGrid>
                </>
              )}

              {etapa === 4 && (
                <>
                  <PanelHeader>
                    <span>Etapa 4 de 5</span>
                    <h2>Administrador inicial</h2>
                    <p>
                      Crie o primeiro acesso. A senha será armazenada com hash e
                      deverá ser alterada no primeiro login.
                    </p>
                  </PanelHeader>

                  <FormGrid>
                    <Input
                      label="Nome do administrador"
                      value={adminNome}
                      onChange={(event) => setAdminNome(event.target.value)}
                      required
                    />
                    <Input
                      label="E-mail do administrador"
                      type="email"
                      value={adminEmail}
                      onChange={(event) => setAdminEmail(event.target.value)}
                      required
                    />
                    <Full>
                      <Input
                        label="Senha temporária"
                        type="password"
                        minLength={6}
                        autoComplete="new-password"
                        value={adminSenha}
                        onChange={(event) => setAdminSenha(event.target.value)}
                        required
                      />
                      <Hint>
                        O valor não será exibido na revisão nem na conclusão.
                      </Hint>
                    </Full>
                  </FormGrid>

                  <Notice $warning>
                    O e-mail é enviado após a transação. Uma falha de envio não
                    desfaz o cadastro concluído.
                  </Notice>
                </>
              )}

              {etapa === 5 && (
                <>
                  <PanelHeader>
                    <span>Etapa 5 de 5</span>
                    <h2>Revisão e confirmação</h2>
                    <p>
                      Confira os dados. O envio fica bloqueado enquanto a
                      operação estiver em andamento.
                    </p>
                  </PanelHeader>

                  <ReviewGrid>
                    <ReviewCard>
                      <h3>Empresa e operação</h3>
                      <dl>
                        <dt>Cliente</dt>
                        <dd>{nome.trim()}</dd>
                        <dt>Slug</dt>
                        <dd>
                          {slug.trim()
                            ? slugNormalizado(slug)
                            : "Geração automática"}
                        </dd>
                        <dt>Status</dt>
                        <dd>{status}</dd>
                        <dt>Processamento</dt>
                        <dd>{modo}</dd>
                        <dt>Limite diário</dt>
                        <dd>{Number(limiteDiario).toLocaleString("pt-BR")}</dd>
                      </dl>
                    </ReviewCard>

                    <ReviewCard>
                      <h3>Plano e pagamento</h3>
                      <dl>
                        <dt>Plano</dt>
                        <dd>{plano?.nome ?? "-"}</dd>
                        <dt>Mensalidade</dt>
                        <dd>{formatCurrencyFromCents(plano?.precoCentavos)}</dd>
                        <dt>Limite mensal</dt>
                        <dd>
                          {plano?.limiteMensalConsultas.toLocaleString(
                            "pt-BR",
                          ) ?? "-"}
                        </dd>
                        <dt>Pagamento</dt>
                        <dd>{pagamento}</dd>
                        <dt>Vencimento</dt>
                        <dd>{vencimento || "Não definido"}</dd>
                      </dl>
                    </ReviewCard>

                    <ReviewCard>
                      <h3>Município principal</h3>
                      <dl>
                        <dt>Município</dt>
                        <dd>
                          {municipio
                            ? `${municipio.nome} — ${municipio.uf}`
                            : "-"}
                        </dd>
                        <dt>Código IBGE</dt>
                        <dd>{municipio?.codigoIbge ?? "-"}</dd>
                      </dl>
                    </ReviewCard>

                    <ReviewCard>
                      <h3>Administrador inicial</h3>
                      <dl>
                        <dt>Nome</dt>
                        <dd>{adminNome.trim()}</dd>
                        <dt>E-mail</dt>
                        <dd>{adminEmail.trim().toLowerCase()}</dd>
                        <dt>Perfil</dt>
                        <dd>ADMIN</dd>
                        <dt>Senha</dt>
                        <dd>Temporária e protegida</dd>
                      </dl>
                    </ReviewCard>
                  </ReviewGrid>

                  <Notice $success>
                    Cliente, município e administrador serão criados de forma
                    atômica pela API.
                  </Notice>
                </>
              )}

              <Actions>
                <div>
                  {etapa > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={isSubmitting}
                      onClick={() => {
                        setErro(null);
                        setEtapa((current) => Math.max(1, current - 1));
                      }}
                    >
                      Voltar
                    </Button>
                  )}
                </div>

                <div>
                  {etapa < 5 ? (
                    <Button type="button" onClick={avancar}>
                      Continuar para {ETAPAS[etapa][0]}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      disabled={isSubmitting}
                      onClick={concluir}
                    >
                      {isSubmitting
                        ? "Criando cliente..."
                        : "Confirmar e criar cliente"}
                    </Button>
                  )}
                </div>
              </Actions>
            </Panel>
          </Layout>
        )}
      </PageContainer>
    </>
  );
}

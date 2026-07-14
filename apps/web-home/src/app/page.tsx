"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  AudienceCard,
  AudienceGrid,
  Bar,
  Bars,
  Brand,
  BrandMark,
  ChartPanel,
  ChartTitle,
  CtaActions,
  DashboardBody,
  DashboardChrome,
  DashboardHeader,
  DashboardPanelGrid,
  DashboardShell,
  DashboardTitle,
  DarkPanel,
  FaqGrid,
  FaqItem,
  FeatureCard,
  FeatureGrid,
  FeatureIcon,
  FeatureText,
  FeatureTitle,
  FinalCta,
  FloatingCard,
  FloatingNav,
  GradientText,
  HeroActions,
  HeroContent,
  HeroDescription,
  HeroGrid,
  HeroSection,
  HeroStats,
  HeroTitle,
  HeroVisual,
  KpiCard,
  KpiGrid,
  LiveBadge,
  NavActions,
  NavGhost,
  NavInner,
  NavLinks,
  NavPrimary,
  Overline,
  PageShell,
  PainCard,
  PainCards,
  PainGrid,
  PrimaryButton,
  ProcessCard,
  ProcessGrid,
  ProcessText,
  ProcessTitle,
  ProgressBar,
  ProgressFill,
  PlanBadge,
  PlanCard,
  PlanContent,
  PlanGrid,
  PlanIcon,
  PlanInfo,
  PlanMeta,
  PlanMetaItem,
  PlanPrice,
  PlanSection,
  PlanTitle,
  PopularBadge,
  SecondaryButton,
  SectionBlock,
  SectionDescription,
  SectionEyebrow,
  SectionHeader,
  SectionTitle,
  StatLabel,
  StatPill,
  StatValue,
  StepNumber,
  TaskItem,
  TaskPanel,
  TimelineGlow,
  TrustGrid,
  TrustItem,
  TrustStrip,
  TrustTitle,
  VisualGlow,
  WindowDots,
  Footer,
} from "./page.styles";

const whatsappUrl =
  "https://wa.me/5538999880579?text=Ol%C3%A1%2C%20quero%20conhecer%20o%20Im%C3%B3vel%20Pr%C3%A1tico%20e%20solicitar%20uma%20demonstra%C3%A7%C3%A3o.";

const webClientUrl =
  process.env.NEXT_PUBLIC_WEB_CLIENT_URL ?? "http://localhost:3001";

const webAdminUrl =
  process.env.NEXT_PUBLIC_WEB_ADMIN_URL ?? "http://localhost:3002";

const metrics = [
  {
    value: "88",
    label: "imóveis em uma rotina operacional estruturada",
  },
  {
    value: "50min",
    label: "para organizar uma busca que antes tomava horas",
  },
  {
    value: "1 painel",
    label: "para centralizar busca, histórico, usuários e resultados",
  },
];

const trustItems = [
  ["Automação", "Menos processo manual"],
  ["Operação", "Fila, histórico e status"],
  ["Gestão", "Clientes, usuários e planos"],
  ["Exportação", "CSV e Excel para ação"],
];

const painPoints = [
  {
    icon: "01",
    title: "Captação manual custa caro",
    text: "Pesquisar endereço por endereço, cruzar dados, organizar planilhas e tentar contato consome tempo operacional que poderia estar no comercial.",
  },
  {
    icon: "02",
    title: "Equipe perde velocidade",
    text: "Sem processo, cada pessoa trabalha de um jeito. O resultado é retrabalho, falta de histórico e baixa previsibilidade.",
  },
  {
    icon: "03",
    title: "Oportunidade passa na frente",
    text: "Imobiliárias que demoram para localizar proprietários chegam depois na negociação e perdem vantagem competitiva.",
  },
  {
    icon: "04",
    title: "Preço só parece alto sem contexto",
    text: "Quando a operação entende o ganho de tempo, escala e organização, a plataforma deixa de ser custo e vira estrutura comercial.",
  },
];

const processSteps = [
  {
    title: "Informe o endereço",
    text: "A equipe cadastra logradouro, número e período de consulta em uma interface simples e controlada.",
  },
  {
    title: "A busca entra na fila",
    text: "O sistema organiza a tarefa, respeita intervalos e acompanha o processamento com status em tempo real.",
  },
  {
    title: "Dados são enriquecidos",
    text: "A operação cruza informações para localizar proprietário, documento e possíveis contatos.",
  },
  {
    title: "Resultado vira ação",
    text: "Tudo fica disponível no painel para análise, exportação e abordagem comercial.",
  },
];

const features = [
  {
    icon: "⌁",
    title: "Busca automatizada",
    text: "Transforma uma rotina repetitiva de pesquisa em um fluxo operacional centralizado, rastreável e muito mais rápido.",
  },
  {
    icon: "◷",
    title: "Histórico completo",
    text: "Cada tarefa fica registrada com status, progresso, erros, resultados e datas para auditoria operacional.",
  },
  {
    icon: "↧",
    title: "Exportação comercial",
    text: "Resultados prontos para planilhas, CRM ou abordagem direta da equipe de captação.",
  },
  {
    icon: "◈",
    title: "Painel por cliente",
    text: "Cada imobiliária acessa seu próprio ambiente, com usuários, permissões e consumo controlados.",
  },
  {
    icon: "✦",
    title: "Experiência premium",
    text: "Interface moderna, objetiva e pensada para equipes que precisam de clareza, velocidade e confiança.",
  },
  {
    icon: "▣",
    title: "Gestão SaaS",
    text: "Administração de planos, pagamentos, limites, consumo, usuários e operação em uma base profissional.",
  },
];

const plans = [
  {
    name: "Start",
    description: "Para imobiliárias pequenas que querem iniciar a captação ativa com organização.",
    limit: "250 consultas inclusas",
    brokers: "Até 6 corretores",
    overage: "R$ 2,90 por consulta adicional",
    price: "R$ 597/mês",
    badge: "Entrada estratégica",
    icon: "S",
  },
  {
    name: "Growth",
    description: "Para equipes em crescimento que precisam de mais volume comercial todos os meses.",
    limit: "500 consultas inclusas",
    brokers: "Até 12 corretores",
    overage: "R$ 2,50 por consulta adicional",
    price: "R$ 897/mês",
    badge: "Crescimento",
    icon: "G",
  },
  {
    name: "Business",
    description: "Para operações estruturadas que querem previsibilidade, escala e controle de consumo.",
    limit: "750 consultas inclusas",
    brokers: "Até 18 corretores",
    overage: "R$ 2,10 por consulta adicional",
    price: "R$ 1.197/mês",
    badge: "Mais escolhido",
    icon: "B",
    featured: true,
  },
  {
    name: "Premium",
    description: "Para imobiliárias de alto volume com equipe maior e captação comercial intensa.",
    limit: "1.000 consultas inclusas",
    brokers: "Até 26 corretores",
    overage: "R$ 1,80 por consulta adicional",
    price: "R$ 1.497/mês",
    badge: "Alta performance",
    icon: "P",
  },
]
const audiences = [
  {
    title: "Imobiliárias de alto padrão",
    text: "Operações que precisam encontrar boas oportunidades antes da concorrência e manter um processo comercial forte.",
  },
  {
    title: "Equipes de captação",
    text: "Times que precisam de volume, organização, histórico e velocidade para abordar proprietários com consistência.",
  },
  {
    title: "Gestores comerciais",
    text: "Líderes que querem medir consumo, acompanhar tarefas e transformar captação em processo previsível.",
  },
  {
    title: "Operações em crescimento",
    text: "Empresas que já perceberam que captação manual limita escala, margem e velocidade.",
  },
];

const faqs = [
  {
    question: "O Imóvel Prático substitui minha equipe de captação?",
    answer:
      "Não. Ele fortalece a equipe. O sistema reduz a parte operacional repetitiva para que o time foque em análise, contato e fechamento.",
  },
  {
    question: "Por que o valor mensal não é baixo?",
    answer:
      "Porque a proposta não é vender uma tela simples. É entregar uma estrutura operacional para economizar horas, organizar processos e acelerar oportunidades comerciais.",
  },
  {
    question: "A plataforma tem painel para cliente?",
    answer:
      "Sim. A imobiliária acessa seu ambiente com usuários, histórico de buscas, status de tarefas e resultados exportáveis.",
  },
  {
    question: "Existe implantação?",
    answer:
      "Sim. A implantação orienta a imobiliária sobre acesso, fluxo de uso, limites, boas práticas e rotina operacional.",
  },
];

type RevealProps = {
  children: ReactNode;
  delay?: number;
};

function Reveal({ children, delay = 0 }: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 32 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-90px" }}
      transition={{
        duration: 0.75,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <PageShell>
      <ProgressBar>
        <ProgressFill style={{ scaleX }} />
      </ProgressBar>

      <FloatingNav>
        <NavInner>
          <Brand href="#">
            <BrandMark>IP</BrandMark>
            Imóvel Prático
          </Brand>

          <NavLinks>
            <a href="#produto">Produto</a>
            <a href="#processo">Como funciona</a>
            <a href="#valor">Valor</a>
            <a href="#faq">FAQ</a>
          </NavLinks>

          <NavActions>
            <NavGhost href={webClientUrl}>Acessar sistema</NavGhost>
            <NavPrimary href={whatsappUrl} target="_blank" rel="noreferrer">
              Solicitar demonstração
            </NavPrimary>
          </NavActions>
        </NavInner>
      </FloatingNav>

      <HeroSection>
        <HeroGrid>
          <HeroContent>
            <Overline
              initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              Plataforma premium para captação imobiliária
            </Overline>

            <HeroTitle
              initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.08 }}
            >
              Captação imobiliária com <GradientText>escala, dados e velocidade.</GradientText>
            </HeroTitle>

            <HeroDescription
              initial={shouldReduceMotion ? false : { opacity: 0, y: 26 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.18 }}
            >
              O Imóvel Prático transforma uma rotina manual de pesquisa,
              organização e localização de proprietários em um processo
              profissional para imobiliárias que querem crescer com método.
            </HeroDescription>

            <HeroActions
              initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.28 }}
            >
              <PrimaryButton href={whatsappUrl} target="_blank" rel="noreferrer">
                Solicitar demonstração
              </PrimaryButton>

              <SecondaryButton href="#processo">
                Entender como funciona
              </SecondaryButton>
            </HeroActions>

            <HeroStats
              initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.38 }}
            >
              {metrics.map(metric => (
                <StatPill key={metric.value}>
                  <StatValue>{metric.value}</StatValue>
                  <StatLabel>{metric.label}</StatLabel>
                </StatPill>
              ))}
            </HeroStats>
          </HeroContent>

          <HeroVisual
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96, y: 30 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.22 }}
          >
            <VisualGlow />

            <FloatingCard $position="right">
              <strong>+ velocidade</strong>
              <span>Fila operacional com status, progresso e histórico.</span>
            </FloatingCard>

            <FloatingCard $position="left">
              <strong>Exportação</strong>
              <span>Resultados prontos para abordagem comercial.</span>
            </FloatingCard>

            <DashboardShell>
              <DashboardChrome>
                <WindowDots>
                  <span />
                  <span />
                  <span />
                </WindowDots>
              </DashboardChrome>

              <DashboardBody>
                <DashboardHeader>
                  <DashboardTitle>
                    <strong>Painel de captação</strong>
                    <span>Visão executiva de tarefas, consumo e resultados.</span>
                  </DashboardTitle>

                  <LiveBadge>Operação ativa</LiveBadge>
                </DashboardHeader>

                <KpiGrid>
                  <KpiCard>
                    <span>Tarefas concluídas</span>
                    <strong>342</strong>
                  </KpiCard>

                  <KpiCard>
                    <span>Resultados encontrados</span>
                    <strong>1.284</strong>
                  </KpiCard>

                  <KpiCard>
                    <span>Uso mensal</span>
                    <strong>68%</strong>
                  </KpiCard>
                </KpiGrid>

                <DashboardPanelGrid>
                  <ChartPanel>
                    <ChartTitle>
                      <strong>Volume processado</strong>
                      <span>últimos 7 dias</span>
                    </ChartTitle>

                    <Bars>
                      {[38, 52, 44, 67, 73, 58, 86, 76].map((height, index) => (
                        <Bar key={index} $height={height} $accent={index === 6} />
                      ))}
                    </Bars>
                  </ChartPanel>

                  <TaskPanel>
                    <ChartTitle>
                      <strong>Fila recente</strong>
                      <span>tempo real</span>
                    </ChartTitle>

                    <TaskItem>
                      <strong>Rua XV de Novembro, 1480</strong>
                      <span>Concluída · 18 resultados</span>
                    </TaskItem>

                    <TaskItem>
                      <strong>Av. Brasil, 920</strong>
                      <span>Processando · 64%</span>
                    </TaskItem>

                    <TaskItem>
                      <strong>Rua das Palmeiras, 77</strong>
                      <span>Pendente · aguardando fila</span>
                    </TaskItem>
                  </TaskPanel>
                </DashboardPanelGrid>
              </DashboardBody>
            </DashboardShell>
          </HeroVisual>
        </HeroGrid>
      </HeroSection>

      <TrustStrip>
        <TrustTitle>
          <strong>Construído para vender valor, não preço.</strong>
          <span>O cliente precisa enxergar operação, ganho e estrutura.</span>
        </TrustTitle>

        <TrustGrid>
          {trustItems.map(([title, text]) => (
            <TrustItem key={title}>
              <strong>{title}</strong>
              <span>{text}</span>
            </TrustItem>
          ))}
        </TrustGrid>
      </TrustStrip>

      <SectionBlock id="produto">
        <Reveal>
          <SectionHeader>
            <SectionEyebrow>O problema que custa caro</SectionEyebrow>
            <SectionTitle>
              Captação manual limita a operação antes mesmo da venda começar.
            </SectionTitle>
            <SectionDescription>
              O Imóvel Prático foi pensado para imobiliárias que já entenderam
              que velocidade de prospecção, organização e dados são vantagens
              competitivas.
            </SectionDescription>
          </SectionHeader>
        </Reveal>

        <PainGrid>
          <DarkPanel>
            <TimelineGlow />
            <h3>Da pesquisa manual para uma operação estruturada.</h3>
            <p>
              O sistema organiza o caminho entre endereço, busca, proprietário,
              contato e exportação. A equipe deixa de trabalhar no improviso e
              passa a operar com método.
            </p>
          </DarkPanel>

          <PainCards>
            {painPoints.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.06}>
                <PainCard>
                  <span>{item.icon}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </PainCard>
              </Reveal>
            ))}
          </PainCards>
        </PainGrid>
      </SectionBlock>

      <SectionBlock id="processo">
        <Reveal>
          <SectionHeader>
            <SectionEyebrow>Como funciona</SectionEyebrow>
            <SectionTitle>
              Um fluxo claro para transformar endereço em oportunidade.
            </SectionTitle>
            <SectionDescription>
              A plataforma simplifica a operação em etapas fáceis de entender,
              acompanhar e repetir.
            </SectionDescription>
          </SectionHeader>
        </Reveal>

        <ProcessGrid>
          {processSteps.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.08}>
              <ProcessCard>
                <StepNumber>{String(index + 1).padStart(2, "0")}</StepNumber>
                <ProcessTitle>{step.title}</ProcessTitle>
                <ProcessText>{step.text}</ProcessText>
              </ProcessCard>
            </Reveal>
          ))}
        </ProcessGrid>
      </SectionBlock>

      <SectionBlock>
        <Reveal>
          <SectionHeader>
            <SectionEyebrow>Produto premium</SectionEyebrow>
            <SectionTitle>
              Tudo que a imobiliária precisa para operar captação com mais
              controle.
            </SectionTitle>
            <SectionDescription>
              A home precisa transmitir que existe um produto completo por trás:
              painel, fila, histórico, exportação, usuários, planos e gestão.
            </SectionDescription>
          </SectionHeader>
        </Reveal>

        <FeatureGrid>
          {features.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 0.05}>
              <FeatureCard>
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureText>{feature.text}</FeatureText>
              </FeatureCard>
            </Reveal>
          ))}
        </FeatureGrid>
      </SectionBlock>

      <PlanSection id="valor">
        <PlanGrid>
          <PlanContent>
            <SectionEyebrow>Planos estratégicos</SectionEyebrow>

            <h2>Planos para operações imobiliárias de alto nível.</h2>

            <p>
              Escolha a estrutura ideal para sua equipe. Cada plano combina
              consultas mensais inclusas, quantidade de corretores e cobrança
              transparente por consulta adicional.
            </p>
          </PlanContent>

          <PlanInfo>
            {plans.map((plan, index) => (
              <Reveal key={plan.name} delay={index * 0.08}>
                <PlanCard $featured={plan.featured === true}>
                  <PlanIcon>{plan.icon}</PlanIcon>

                  <PlanTitle>
                    <strong>{plan.name}</strong>
                    <span>{plan.description}</span>
                  </PlanTitle>

                  <PlanMeta>
                    <PlanMetaItem>
                      <span>Limite mensal</span>
                      <strong>{plan.limit}</strong>
                    </PlanMetaItem>

                    <PlanMetaItem>
                      <span>Corretores</span>
                      <strong>{plan.brokers}</strong>
                    </PlanMetaItem>

                    <PlanMetaItem>
                      <span>Adicional</span>
                      <strong>{plan.overage}</strong>
                    </PlanMetaItem>
                  </PlanMeta>

                  <PlanPrice>
                    <span>Mensalidade</span>
                    <strong>{plan.price}</strong>
                  </PlanPrice>

                  <PlanBadge>
                    {plan.featured && <PopularBadge>★</PopularBadge>}
                    {plan.badge}
                  </PlanBadge>
                </PlanCard>
              </Reveal>
            ))}
          </PlanInfo>
        </PlanGrid>
      </PlanSection>

      <SectionBlock>
        <Reveal>
          <SectionHeader>
            <SectionEyebrow>Para quem é</SectionEyebrow>
            <SectionTitle>
              Feito para imobiliárias que querem captação como processo, não
              tentativa.
            </SectionTitle>
          </SectionHeader>
        </Reveal>

        <AudienceGrid>
          {audiences.map((audience, index) => (
            <Reveal key={audience.title} delay={index * 0.06}>
              <AudienceCard>
                <strong>{index + 1}</strong>
                <div>
                  <h3>{audience.title}</h3>
                  <p>{audience.text}</p>
                </div>
              </AudienceCard>
            </Reveal>
          ))}
        </AudienceGrid>
      </SectionBlock>

      <SectionBlock id="faq">
        <Reveal>
          <SectionHeader>
            <SectionEyebrow>FAQ</SectionEyebrow>
            <SectionTitle>Objeções respondidas com clareza.</SectionTitle>
            <SectionDescription>
              A página precisa antecipar dúvidas e reforçar que o produto é
              operação, não apenas software.
            </SectionDescription>
          </SectionHeader>
        </Reveal>

        <FaqGrid>
          {faqs.map((faq, index) => (
            <Reveal key={faq.question} delay={index * 0.05}>
              <FaqItem>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </FaqItem>
            </Reveal>
          ))}
        </FaqGrid>
      </SectionBlock>

      <FinalCta>
        <h2>Leve sua operação de captação para um novo nível.</h2>
        <p>
          Mostre para sua equipe e para seus clientes que a imobiliária está
          usando tecnologia, processo e inteligência para encontrar melhores
          oportunidades.
        </p>

        <CtaActions>
          <PrimaryButton href={whatsappUrl} target="_blank" rel="noreferrer">
            Solicitar demonstração
          </PrimaryButton>

          <SecondaryButton href={webClientUrl}>Acessar sistema</SecondaryButton>

          <SecondaryButton href={webAdminUrl}>Área administrativa</SecondaryButton>
        </CtaActions>
      </FinalCta>

      <Footer>
        <span>© {new Date().getFullYear()} Imóvel Prático. Todos os direitos reservados.</span>
        <span>
          Desenvolvido para operações imobiliárias que querem escala.{" "}
          <Link href={webClientUrl}>Acessar plataforma</Link>
        </span>
      </Footer>
    </PageShell>
  );
}

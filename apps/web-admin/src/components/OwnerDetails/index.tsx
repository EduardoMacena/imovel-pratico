"use client";

import { ReactNode, useState } from "react";
import type { DadosContato } from "../../features/admin/types";
import { formatBirthdayBR, formatCurrencyBRL, formatPhoneBR } from "../../lib/formatters";
import {
  Grid,
  Item,
  Label,
  List,
  ListItem,
  Section,
  SectionButton,
  SectionContent,
  SectionCount,
  SectionTitle,
  Value,
  Wrapper,
} from "./styles";

type OwnerDetailsProps = {
  dadosContato?: DadosContato | null;
  fonteContato?: string | null;
};

type DetailSectionProps = {
  title: string;
  count?: number;
  defaultOpen?: boolean;
  children: ReactNode;
};

function valueOrDash(value?: string | number | boolean | null) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  if (typeof value === "boolean") {
    return value ? "Sim" : "Não";
  }

  return value;
}

function DetailSection({
  title,
  count,
  defaultOpen = false,
  children,
}: DetailSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Section>
      <SectionButton
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(value => !value)}
      >
        <div>
          <SectionTitle>{title}</SectionTitle>

          {typeof count === "number" && (
            <SectionCount>
              {count} {count === 1 ? "registro" : "registros"}
            </SectionCount>
          )}
        </div>

        <span>{isOpen ? "− Recolher" : "+ Expandir"}</span>
      </SectionButton>

      {isOpen && <SectionContent>{children}</SectionContent>}
    </Section>
  );
}

export function OwnerDetails({
  dadosContato,
  fonteContato,
}: OwnerDetailsProps) {
  if (!dadosContato) {
    return null;
  }

  const dados = dadosContato as Record<string, any>;

  const telefones = Array.isArray(dados.telefones) ? dados.telefones : [];
  const emails = Array.isArray(dados.emails) ? dados.emails : [];
  const enderecos = Array.isArray(dados.enderecos) ? dados.enderecos : [];

  const dadosCadastrais = [
    {
      label: "Fonte",
      value: fonteContato,
    },
    {
      label: "CPF",
      value: dados.cpf,
    },
    {
      label: "Nome",
      value: dados.nome,
    },
    {
      label: "Sexo",
      value: dados.sexo,
    },
    {
      label: "Idade",
      value: dados.idade,
    },
    {
      label: "Signo",
      value: dados.signo,
    },
    {
      label: "Nome da mãe",
      value: dados.nomeMae,
    },
    {
      label: "Data nascimento",
      value: formatBirthdayBR(dados.dataNascimento),
    },
    {
      label: "Renda estimada",
      value: dados.rendaEstimada ? formatCurrencyBRL(Number(dados.rendaEstimada)) : "-",
    },
    {
      label: "Faixa salarial",
      value: valueOrDash(dados.rendaFaixaSalarial),
    },
  ];

  return (
    <Wrapper>
      <DetailSection title="Dados cadastrais" count={dadosCadastrais.length}>
        <Grid>
          {dadosCadastrais.map(item => (
            <Item key={item.label}>
              <Label>{item.label}</Label>
              <Value>{valueOrDash(item.value)}</Value>
            </Item>
          ))}
        </Grid>
      </DetailSection>

      {telefones.length > 0 && (
        <DetailSection title="Telefones" count={telefones.length}>
          <List>
            {telefones.map((telefone: Record<string, any>, index: number) => (
              <ListItem key={`${telefone.telefoneComDDD ?? "telefone"}-${index}`}>
                <Grid>
                  <Item>
                    <Label>Telefone</Label>
                    <Value>{formatPhoneBR(telefone.telefoneComDDD)}</Value>
                  </Item>

                  <Item>
                    <Label>WhatsApp</Label>
                    <Value>{valueOrDash(telefone.whatsApp)}</Value>
                  </Item>

                  <Item>
                    <Label>Operadora</Label>
                    <Value>{valueOrDash(telefone.operadora)}</Value>
                  </Item>

                  <Item>
                    <Label>Tipo</Label>
                    <Value>{valueOrDash(telefone.tipoTelefone)}</Value>
                  </Item>

                  <Item>
                    <Label>Telemarketing bloqueado</Label>
                    <Value>
                      {valueOrDash(telefone.telemarketingBloqueado)}
                    </Value>
                  </Item>
                </Grid>
              </ListItem>
            ))}
          </List>
        </DetailSection>
      )}

      {emails.length > 0 && (
        <DetailSection title="E-mails" count={emails.length}>
          <List>
            {emails.map((email: Record<string, any>, index: number) => (
              <ListItem key={`${email.enderecoEmail ?? "email"}-${index}`}>
                <Value>{valueOrDash(email.enderecoEmail ?? email.email)}</Value>
              </ListItem>
            ))}
          </List>
        </DetailSection>
      )}

      {enderecos.length > 0 && (
        <DetailSection title="Endereços" count={enderecos.length}>
          <List>
            {enderecos.map((endereco: Record<string, any>, index: number) => (
              <ListItem key={`${endereco.cep ?? "endereco"}-${index}`}>
                <Grid>
                  <Item>
                    <Label>Logradouro</Label>
                    <Value>{valueOrDash(endereco.logradouro)}</Value>
                  </Item>

                  <Item>
                    <Label>Número</Label>
                    <Value>{valueOrDash(endereco.numero)}</Value>
                  </Item>

                  <Item>
                    <Label>Complemento</Label>
                    <Value>{valueOrDash(endereco.complemento)}</Value>
                  </Item>

                  <Item>
                    <Label>Bairro</Label>
                    <Value>{valueOrDash(endereco.bairro)}</Value>
                  </Item>

                  <Item>
                    <Label>Cidade</Label>
                    <Value>{valueOrDash(endereco.cidade)}</Value>
                  </Item>

                  <Item>
                    <Label>UF</Label>
                    <Value>{valueOrDash(endereco.uf)}</Value>
                  </Item>

                  <Item>
                    <Label>CEP</Label>
                    <Value>{valueOrDash(endereco.cep)}</Value>
                  </Item>
                </Grid>
              </ListItem>
            ))}
          </List>
        </DetailSection>
      )}
    </Wrapper>
  );
}

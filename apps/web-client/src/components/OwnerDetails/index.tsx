"use client";

import { ReactNode, useState } from "react";
import type { DadosContato } from "../../features/busca/types";
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
      <SectionButton type="button" onClick={() => setIsOpen(value => !value)}>
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

  const dadosCadastrais = [
    {
      label: "Fonte",
      value: fonteContato,
    },
    {
      label: "CPF",
      value: dadosContato.cpf,
    },
    {
      label: "Nome",
      value: dadosContato.nome,
    },
    {
      label: "Sexo",
      value: dadosContato.sexo,
    },
    {
      label: "Idade",
      value: dadosContato.idade,
    },
    {
      label: "Signo",
      value: dadosContato.signo,
    },
    {
      label: "Nome da mãe",
      value: dadosContato.nomeMae,
    },
    {
      label: "Data nascimento",
      value: formatBirthdayBR(dadosContato.dataNascimento),
    },
    {
      label: "Renda estimada",
      value: dadosContato.rendaEstimada ? formatCurrencyBRL(Number(dadosContato.rendaEstimada)) : "-",
    },
    {
      label: "Faixa salarial",
      value: valueOrDash(dadosContato.rendaFaixaSalarial),
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

      {dadosContato.telefones && dadosContato.telefones.length > 0 && (
        <DetailSection title="Telefones" count={dadosContato.telefones.length}>
          <List>
            {dadosContato.telefones.map((telefone, index) => (
              <ListItem key={`${telefone.telefoneComDDD}-${index}`}>
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
                    <Value>{valueOrDash(telefone.telemarketingBloqueado)}</Value>
                  </Item>
                </Grid>
              </ListItem>
            ))}
          </List>
        </DetailSection>
      )}

      {dadosContato.emails && dadosContato.emails.length > 0 && (
        <DetailSection title="E-mails" count={dadosContato.emails.length}>
          <List>
            {dadosContato.emails.map((email, index) => (
              <ListItem key={`${email.enderecoEmail}-${index}`}>
                <Value>{valueOrDash(email.enderecoEmail)}</Value>
              </ListItem>
            ))}
          </List>
        </DetailSection>
      )}

      {dadosContato.enderecos && dadosContato.enderecos.length > 0 && (
        <DetailSection title="Endereços" count={dadosContato.enderecos.length}>
          <List>
            {dadosContato.enderecos.map((endereco, index) => (
              <ListItem key={`${endereco.cep}-${index}`}>
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

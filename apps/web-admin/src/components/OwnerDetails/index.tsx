"use client";

import type { DadosContato } from "../../features/admin/types";
import {
  Grid,
  Item,
  Label,
  List,
  ListItem,
  Section,
  SectionTitle,
  Value,
  Wrapper,
} from "./styles";

type OwnerDetailsProps = {
  dadosContato?: DadosContato | null;
  fonteContato?: string | null;
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

export function OwnerDetails({
  dadosContato,
  fonteContato,
}: OwnerDetailsProps) {
  if (!dadosContato) {
    return null;
  }

  return (
    <Wrapper>
      <Section>
        <SectionTitle>Dados completos do proprietário</SectionTitle>

        <Grid>
          <Item>
            <Label>Fonte</Label>
            <Value>{valueOrDash(fonteContato)}</Value>
          </Item>

          <Item>
            <Label>CPF</Label>
            <Value>{valueOrDash(dadosContato.cpf)}</Value>
          </Item>

          <Item>
            <Label>Nome</Label>
            <Value>{valueOrDash(dadosContato.nome)}</Value>
          </Item>

          <Item>
            <Label>Sexo</Label>
            <Value>{valueOrDash(dadosContato.sexo)}</Value>
          </Item>

          <Item>
            <Label>Idade</Label>
            <Value>{valueOrDash(dadosContato.idade)}</Value>
          </Item>

          <Item>
            <Label>Signo</Label>
            <Value>{valueOrDash(dadosContato.signo)}</Value>
          </Item>

          <Item>
            <Label>Nome da mãe</Label>
            <Value>{valueOrDash(dadosContato.nomeMae)}</Value>
          </Item>

          <Item>
            <Label>Data nascimento</Label>
            <Value>{valueOrDash(dadosContato.dataNascimento)}</Value>
          </Item>

          <Item>
            <Label>Renda estimada</Label>
            <Value>{valueOrDash(dadosContato.rendaEstimada)}</Value>
          </Item>

          <Item>
            <Label>Faixa salarial</Label>
            <Value>{valueOrDash(dadosContato.rendaFaixaSalarial)}</Value>
          </Item>
        </Grid>
      </Section>

      {dadosContato.telefones && dadosContato.telefones.length > 0 && (
        <Section>
          <SectionTitle>Telefones</SectionTitle>

          <List>
            {dadosContato.telefones.map((telefone, index) => (
              <ListItem key={`${telefone.telefoneComDDD}-${index}`}>
                <Grid>
                  <Item>
                    <Label>Telefone</Label>
                    <Value>{valueOrDash(telefone.telefoneComDDD)}</Value>
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
        </Section>
      )}

      {dadosContato.emails && dadosContato.emails.length > 0 && (
        <Section>
          <SectionTitle>E-mails</SectionTitle>

          <List>
            {dadosContato.emails.map((email, index) => (
              <ListItem key={`${email.enderecoEmail}-${index}`}>
                <Value>{valueOrDash(email.enderecoEmail)}</Value>
              </ListItem>
            ))}
          </List>
        </Section>
      )}

      {dadosContato.enderecos && dadosContato.enderecos.length > 0 && (
        <Section>
          <SectionTitle>Endereços</SectionTitle>

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
        </Section>
      )}
    </Wrapper>
  );
}

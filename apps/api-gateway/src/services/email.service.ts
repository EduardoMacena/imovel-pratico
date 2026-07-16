import nodemailer from "nodemailer";
import { env } from "../config/env.js";

type EnviarEmailParams = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

type EnviarEmailRecuperacaoSenhaParams = {
  to: string;
  nome: string;
  resetUrl: string;
  expiraEm: Date;
};

type EnviarEmailBoasVindasUsuarioParams = {
  to: string;
  nome: string;
  clienteNome: string;
  senhaTemporaria: string;
  loginUrl: string;
};

type EnviarEmailSenhaTemporariaAtualizadaParams = {
  to: string;
  nome: string;
  clienteNome: string;
  senhaTemporaria: string;
  loginUrl: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(value);
}

function getEmailFrom() {
  if (env.EMAIL_FROM) {
    return env.EMAIL_FROM;
  }

  if (env.SMTP_USER) {
    return `Imóvel Prático <${env.SMTP_USER}>`;
  }

  return "Imóvel Prático <no-reply@imovelpratico.com.br>";
}

function smtpEstaConfigurado() {
  return Boolean(env.SMTP_USER && env.SMTP_PASS);
}

function criarTransporter() {
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: {
      user: env.SMTP_USER!,
      pass: env.SMTP_PASS!,
    },
  });
}

async function enviarEmail({ to, subject, html, text }: EnviarEmailParams) {
  if (!smtpEstaConfigurado()) {
    console.log("[EMAIL_SIMULADO]", {
      to,
      subject,
      text,
    });

    return {
      id: null,
      skipped: true,
    };
  }

  const transporter = criarTransporter();

  const info = await transporter.sendMail({
    from: getEmailFrom(),
    to,
    subject,
    html,
    text,
    replyTo: env.EMAIL_REPLY_TO,
  });

  return {
    id: info.messageId,
    skipped: false,
  };
}

export async function enviarEmailRecuperacaoSenha({
  to,
  nome,
  resetUrl,
  expiraEm,
}: EnviarEmailRecuperacaoSenhaParams) {
  const nomeSeguro = escapeHtml(nome);
  const resetUrlSeguro = escapeHtml(resetUrl);
  const expiraEmFormatado = formatDateTime(expiraEm);

  const subject = "Redefinição de senha · Imóvel Prático";

  const text = [
    `Olá, ${nome}.`,
    "",
    "Recebemos uma solicitação para redefinir sua senha no Imóvel Prático.",
    "Acesse o link abaixo para criar uma nova senha:",
    resetUrl,
    "",
    `Este link expira em ${expiraEmFormatado}.`,
    "",
    "Se você não solicitou essa alteração, ignore este e-mail.",
    "",
    "Imóvel Prático",
  ].join("\n");

  const html = `
    <!doctype html>
    <html lang="pt-BR">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Redefinição de senha</title>
      </head>

      <body style="margin:0; padding:0; background:#f4f1eb; font-family:Arial, sans-serif; color:#0b1f33;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f4f1eb; padding:32px 16px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:560px; background:#ffffff; border-radius:20px; overflow:hidden; border:1px solid #e6dfd2;">
                <tr>
                  <td style="padding:32px; background:linear-gradient(135deg, #0b1f33, #102b45); color:#ffffff;">
                    <div style="display:inline-block; padding:8px 12px; border-radius:999px; background:rgba(255,255,255,0.10); color:#c8a45d; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.06em;">
                      Segurança da conta
                    </div>

                    <h1 style="margin:20px 0 0; font-size:32px; line-height:1.05; letter-spacing:-1px;">
                      Redefinição de senha
                    </h1>

                    <p style="margin:16px 0 0; color:rgba(255,255,255,0.78); font-size:15px; line-height:1.6;">
                      Recebemos uma solicitação para criar uma nova senha para seu acesso ao Imóvel Prático.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:32px;">
                    <p style="margin:0; font-size:16px; line-height:1.6;">
                      Olá, <strong>${nomeSeguro}</strong>.
                    </p>

                    <p style="margin:16px 0 0; font-size:15px; line-height:1.7; color:#506070;">
                      Clique no botão abaixo para definir uma nova senha. Por segurança, este link expira em <strong>${expiraEmFormatado}</strong>.
                    </p>

                    <table cellpadding="0" cellspacing="0" role="presentation" style="margin:28px 0;">
                      <tr>
                        <td>
                          <a href="${resetUrlSeguro}" style="display:inline-block; padding:14px 22px; background:#0b1f33; color:#ffffff; text-decoration:none; border-radius:999px; font-weight:700; font-size:14px;">
                            Redefinir senha
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:0; font-size:13px; line-height:1.7; color:#667085;">
                      Se o botão não funcionar, copie e cole este link no navegador:
                    </p>

                    <p style="margin:8px 0 0; font-size:13px; line-height:1.7; word-break:break-all;">
                      <a href="${resetUrlSeguro}" style="color:#0b1f33;">${resetUrlSeguro}</a>
                    </p>

                    <p style="margin:24px 0 0; font-size:13px; line-height:1.7; color:#667085;">
                      Se você não solicitou essa alteração, ignore este e-mail.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:20px 32px; background:#f8f6f1; color:#667085; font-size:12px; line-height:1.6;">
                    Imóvel Prático · Inteligência para prospecção imobiliária
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return enviarEmail({
    to,
    subject,
    html,
    text,
  });
}

export async function enviarEmailBoasVindasUsuario({
  to,
  nome,
  clienteNome,
  senhaTemporaria,
  loginUrl,
}: EnviarEmailBoasVindasUsuarioParams) {
  const nomeSeguro = escapeHtml(nome);
  const clienteNomeSeguro = escapeHtml(clienteNome);
  const emailSeguro = escapeHtml(to);
  const senhaTemporariaSeguro = escapeHtml(senhaTemporaria);
  const loginUrlSeguro = escapeHtml(loginUrl);

  const subject = "Seu acesso ao Imóvel Prático foi criado";

  const text = [
    `Olá, ${nome}.`,
    "",
    `Seu acesso ao Imóvel Prático foi criado para a imobiliária ${clienteNome}.`,
    "",
    "Dados de acesso:",
    `E-mail: ${to}`,
    `Senha temporária: ${senhaTemporaria}`,
    "",
    `Acesse: ${loginUrl}`,
    "",
    "Por segurança, ao fazer o primeiro login você será obrigado a criar uma nova senha.",
    "",
    "Imóvel Prático",
  ].join("\n");

  const html = `
    <!doctype html>
    <html lang="pt-BR">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Acesso criado</title>
      </head>

      <body style="margin:0; padding:0; background:#f4f1eb; font-family:Arial, sans-serif; color:#0b1f33;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f4f1eb; padding:32px 16px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:560px; background:#ffffff; border-radius:20px; overflow:hidden; border:1px solid #e6dfd2;">
                <tr>
                  <td style="padding:32px; background:linear-gradient(135deg, #0b1f33, #102b45); color:#ffffff;">
                    <div style="display:inline-block; padding:8px 12px; border-radius:999px; background:rgba(255,255,255,0.10); color:#c8a45d; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.06em;">
                      Bem-vindo ao Imóvel Prático
                    </div>

                    <h1 style="margin:20px 0 0; font-size:32px; line-height:1.05; letter-spacing:-1px;">
                      Seu acesso foi criado
                    </h1>

                    <p style="margin:16px 0 0; color:rgba(255,255,255,0.78); font-size:15px; line-height:1.6;">
                      Você já pode acessar a plataforma da sua imobiliária.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:32px;">
                    <p style="margin:0; font-size:16px; line-height:1.6;">
                      Olá, <strong>${nomeSeguro}</strong>.
                    </p>

                    <p style="margin:16px 0 0; font-size:15px; line-height:1.7; color:#506070;">
                      Seu acesso ao Imóvel Prático foi criado para a imobiliária <strong>${clienteNomeSeguro}</strong>.
                    </p>

                    <div style="margin:24px 0; padding:18px; border-radius:16px; background:#f8f6f1; border:1px solid #e6dfd2;">
                      <p style="margin:0 0 10px; font-size:13px; color:#667085; font-weight:700;">
                        Dados de acesso
                      </p>

                      <p style="margin:0 0 8px; font-size:15px; line-height:1.6;">
                        <strong>E-mail:</strong> ${emailSeguro}
                      </p>

                      <p style="margin:0; font-size:15px; line-height:1.6;">
                        <strong>Senha temporária:</strong> ${senhaTemporariaSeguro}
                      </p>
                    </div>

                    <table cellpadding="0" cellspacing="0" role="presentation" style="margin:28px 0;">
                      <tr>
                        <td>
                          <a href="${loginUrlSeguro}" style="display:inline-block; padding:14px 22px; background:#0b1f33; color:#ffffff; text-decoration:none; border-radius:999px; font-weight:700; font-size:14px;">
                            Acessar plataforma
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:0; font-size:14px; line-height:1.7; color:#667085;">
                      Por segurança, ao fazer o primeiro login você será obrigado a criar uma nova senha.
                    </p>

                    <p style="margin:16px 0 0; font-size:13px; line-height:1.7; color:#667085;">
                      Se o botão não funcionar, copie e cole este link no navegador:
                    </p>

                    <p style="margin:8px 0 0; font-size:13px; line-height:1.7; word-break:break-all;">
                      <a href="${loginUrlSeguro}" style="color:#0b1f33;">${loginUrlSeguro}</a>
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:20px 32px; background:#f8f6f1; color:#667085; font-size:12px; line-height:1.6;">
                    Imóvel Prático · Inteligência para prospecção imobiliária
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return enviarEmail({
    to,
    subject,
    html,
    text,
  });
}

export async function enviarEmailSenhaTemporariaAtualizada({
  to,
  nome,
  clienteNome,
  senhaTemporaria,
  loginUrl,
}: EnviarEmailSenhaTemporariaAtualizadaParams) {
  const nomeSeguro = escapeHtml(nome);
  const clienteNomeSeguro = escapeHtml(clienteNome);
  const senhaTemporariaSeguro = escapeHtml(senhaTemporaria);
  const loginUrlSeguro = escapeHtml(loginUrl);

  const subject = "Sua senha temporária foi atualizada · Imóvel Prático";

  const text = [
    `Olá, ${nome}.`,
    "",
    `Sua senha temporária do Imóvel Prático foi atualizada para a imobiliária ${clienteNome}.`,
    "",
    `Nova senha temporária: ${senhaTemporaria}`,
    `Acesse: ${loginUrl}`,
    "",
    "Por segurança, ao fazer login você será obrigado a criar uma nova senha.",
    "",
    "Imóvel Prático",
  ].join("\n");

  const html = `
    <!doctype html>
    <html lang="pt-BR">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Senha temporária atualizada</title>
      </head>

      <body style="margin:0; padding:0; background:#f4f1eb; font-family:Arial, sans-serif; color:#0b1f33;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f4f1eb; padding:32px 16px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:560px; background:#ffffff; border-radius:20px; overflow:hidden; border:1px solid #e6dfd2;">
                <tr>
                  <td style="padding:32px; background:linear-gradient(135deg, #0b1f33, #102b45); color:#ffffff;">
                    <div style="display:inline-block; padding:8px 12px; border-radius:999px; background:rgba(255,255,255,0.10); color:#c8a45d; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.06em;">
                      Segurança da conta
                    </div>

                    <h1 style="margin:20px 0 0; font-size:32px; line-height:1.05; letter-spacing:-1px;">
                      Senha temporária atualizada
                    </h1>

                    <p style="margin:16px 0 0; color:rgba(255,255,255,0.78); font-size:15px; line-height:1.6;">
                      Uma nova senha temporária foi definida para seu acesso.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:32px;">
                    <p style="margin:0; font-size:16px; line-height:1.6;">
                      Olá, <strong>${nomeSeguro}</strong>.
                    </p>

                    <p style="margin:16px 0 0; font-size:15px; line-height:1.7; color:#506070;">
                      Sua senha temporária do Imóvel Prático foi atualizada para a imobiliária <strong>${clienteNomeSeguro}</strong>.
                    </p>

                    <div style="margin:24px 0; padding:18px; border-radius:16px; background:#f8f6f1; border:1px solid #e6dfd2;">
                      <p style="margin:0 0 10px; font-size:13px; color:#667085; font-weight:700;">
                        Nova senha temporária
                      </p>

                      <p style="margin:0; font-size:15px; line-height:1.6;">
                        <strong>${senhaTemporariaSeguro}</strong>
                      </p>
                    </div>

                    <table cellpadding="0" cellspacing="0" role="presentation" style="margin:28px 0;">
                      <tr>
                        <td>
                          <a href="${loginUrlSeguro}" style="display:inline-block; padding:14px 22px; background:#0b1f33; color:#ffffff; text-decoration:none; border-radius:999px; font-weight:700; font-size:14px;">
                            Acessar plataforma
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:0; font-size:14px; line-height:1.7; color:#667085;">
                      Por segurança, ao fazer login você será obrigado a criar uma nova senha.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:20px 32px; background:#f8f6f1; color:#667085; font-size:12px; line-height:1.6;">
                    Imóvel Prático · Inteligência para prospecção imobiliária
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return enviarEmail({
    to,
    subject,
    html,
    text,
  });
}
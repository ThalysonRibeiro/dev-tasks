import { transporter } from "@/lib/mailer";

export async function sendVerificationEmail(to: string, token: string, name?: string) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_URL}/verify-email?token=${token}`;

  try {
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to,
      subject: "Verificação de Email",
      html: `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verificação de Email - DevTasks</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                    line-height: 1.6;
                    color: #333333;
                    background-color: #f8f9fa;
                }
                .email-container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    padding: 40px 30px;
                    text-align: center;
                    color: white;
                }
                .header h1 {
                    font-size: 28px;
                    font-weight: 600;
                    margin-bottom: 8px;
                }
                .header p {
                    font-size: 16px;
                    opacity: 0.9;
                }
                .content {
                    padding: 40px 30px;
                }
                .greeting {
                    font-size: 18px;
                    font-weight: 500;
                    margin-bottom: 24px;
                    color: #2d3748;
                }
                .message {
                    font-size: 16px;
                    color: #4a5568;
                    margin-bottom: 32px;
                    line-height: 1.7;
                }
                .button-container {
                    text-align: center;
                    margin: 32px 0;
                }
                .verify-button {
                    display: inline-block;
                    padding: 16px 32px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 16px;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                }
                .verify-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
                }
                .link-section {
                    background-color: #f7fafc;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 24px 0;
                    border-left: 4px solid #667eea;
                }
                .link-section p {
                    font-size: 14px;
                    color: #718096;
                    margin-bottom: 8px;
                }
                .link-text {
                    font-family: 'Courier New', monospace;
                    font-size: 12px;
                    color: #4a5568;
                    word-break: break-all;
                    background-color: #edf2f7;
                    padding: 8px 12px;
                    border-radius: 4px;
                }
                .footer {
                    background-color: #f7fafc;
                    padding: 30px;
                    text-align: center;
                    border-top: 1px solid #e2e8f0;
                }
                .footer p {
                    font-size: 14px;
                    color: #718096;
                    margin-bottom: 8px;
                }
                .brand {
                    font-weight: 600;
                    color: #667eea;
                }
                .security-note {
                    background-color: #fff5f5;
                    border: 1px solid #fed7d7;
                    color: #c53030;
                    padding: 16px;
                    border-radius: 8px;
                    margin-top: 24px;
                    font-size: 14px;
                }
                .security-note strong {
                    display: block;
                    margin-bottom: 8px;
                }
                @media (max-width: 600px) {
                    .email-container {
                        margin: 0;
                        border-radius: 0;
                    }
                    .header, .content, .footer {
                        padding: 20px;
                    }
                    .header h1 {
                        font-size: 24px;
                    }
                    .verify-button {
                        padding: 14px 24px;
                        font-size: 15px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <h1>DevTasks</h1>
                    <p>Verificação de Email</p>
                </div>
                
                <div class="content">
                    <div class="greeting">
                        Olá, ${name || 'Usuário'}! 👋
                    </div>
                    
                    <div class="message">
                        Obrigado por se cadastrar no <strong>DevTasks</strong>! Para começar a usar sua conta, precisamos verificar seu endereço de email.
                    </div>
                    
                    <div class="button-container">
                        <a href="${verifyUrl}" class="verify-button">
                            ✓ Verificar meu Email
                        </a>
                    </div>
                    
                    <div class="link-section">
                        <p><strong>Não consegue clicar no botão?</strong> Copie e cole o link abaixo no seu navegador:</p>
                        <div class="link-text">${verifyUrl}</div>
                    </div>
                    
                    <div class="security-note">
                        <strong>🔒 Nota de Segurança</strong>
                        Se você não se cadastrou no DevTasks, pode ignorar este email com segurança. Seu email não será verificado e nenhuma conta será criada.
                    </div>
                </div>
                
                <div class="footer">
                    <p>Este link de verificação expira em <strong>24 horas</strong>.</p>
                    <p>Atenciosamente,</p>
                    <p class="brand">Equipe DevTasks</p>
                </div>
            </div>
        </body>
        </html>
      `,
    });
  } catch (error) {
    console.error("Erro ao enviar email de verificação:", error);
    throw new Error("Não foi possível enviar o email de verificação.");
  }
}
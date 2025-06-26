
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
  Button,
  Hr,
  Img,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface WelcomeEmailProps {
  userName: string;
  userEmail: string;
  confirmationUrl: string;
  token: string;
}

export const WelcomeEmail = ({
  userName,
  userEmail,
  confirmationUrl,
  token,
}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Bem-vindo ao Koombo! Confirme sua conta para começar</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>
            🍽️ Bem-vindo ao Koombo!
          </Heading>
        </Section>
        
        <Section style={content}>
          <Text style={greeting}>
            Olá {userName}!
          </Text>
          
          <Text style={text}>
            Ficamos muito felizes em ter você conosco! Você se cadastrou no <strong>Koombo</strong>, 
            a plataforma que conecta restaurantes e clientes de forma simples e eficiente.
          </Text>
          
          <Text style={text}>
            Para começar a usar sua conta, você precisa confirmar seu email. 
            É rápido e fácil:
          </Text>
          
          <Section style={buttonContainer}>
            <Button href={confirmationUrl} style={button}>
              ✅ Confirmar minha conta
            </Button>
          </Section>
          
          <Text style={alternativeText}>
            Ou copie e cole este link no seu navegador:
          </Text>
          
          <Text style={linkText}>
            {confirmationUrl}
          </Text>
          
          <Hr style={hr} />
          
          <Text style={text}>
            <strong>Código de verificação:</strong>
          </Text>
          <Text style={code}>
            {token}
          </Text>
          
          <Text style={smallText}>
            Este código é válido por 24 horas e pode ser usado como alternativa ao link acima.
          </Text>
          
          <Hr style={hr} />
          
          <Text style={text}>
            <strong>O que você pode fazer no Koombo:</strong>
          </Text>
          <Text style={text}>
            🍕 Descobrir restaurantes incríveis<br/>
            📱 Fazer pedidos online<br/>
            🚚 Acompanhar suas entregas em tempo real<br/>
            ⭐ Avaliar e comentar sobre suas experiências
          </Text>
          
          <Text style={text}>
            Tem alguma dúvida? Nossa equipe está sempre pronta para ajudar!
          </Text>
          
          <Text style={smallText}>
            Se você não criou uma conta no Koombo, pode ignorar este email com segurança.
          </Text>
        </Section>
        
        <Section style={footer}>
          <Text style={footerText}>
            Com carinho,<br/>
            <strong>Equipe Koombo</strong>
          </Text>
          
          <Text style={footerSmall}>
            Este email foi enviado para {userEmail}
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;

// Estilos
const main = {
  backgroundColor: '#f8fafc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
};

const header = {
  backgroundColor: '#ffffff',
  borderRadius: '12px 12px 0 0',
  padding: '32px 32px 24px',
  textAlign: 'center' as const,
  borderBottom: '3px solid #f97316',
};

const h1 = {
  color: '#1f2937',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0',
  textAlign: 'center' as const,
};

const content = {
  backgroundColor: '#ffffff',
  padding: '32px',
  borderRadius: '0 0 12px 12px',
};

const greeting = {
  color: '#1f2937',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 24px 0',
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '16px 0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#f97316',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 32px',
  border: 'none',
};

const alternativeText = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '24px 0 8px 0',
  textAlign: 'center' as const,
};

const linkText = {
  color: '#2563eb',
  fontSize: '14px',
  wordBreak: 'break-all' as const,
  backgroundColor: '#f3f4f6',
  padding: '12px',
  borderRadius: '6px',
  margin: '0 0 24px 0',
};

const code = {
  backgroundColor: '#1f2937',
  color: '#ffffff',
  fontFamily: 'monospace',
  fontSize: '18px',
  fontWeight: 'bold',
  letterSpacing: '2px',
  padding: '16px',
  borderRadius: '8px',
  textAlign: 'center' as const,
  margin: '8px 0 16px 0',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '32px 0',
};

const smallText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '16px 0',
};

const footer = {
  backgroundColor: '#f9fafb',
  padding: '24px 32px',
  borderRadius: '12px',
  marginTop: '24px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#374151',
  fontSize: '16px',
  margin: '0 0 16px 0',
};

const footerSmall = {
  color: '#9ca3af',
  fontSize: '12px',
  margin: '0',
};

import dotenv from 'dotenv';
import path from 'path';

// Carrega .env da raiz
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

import * as Sentry from '@sentry/node';

console.log('--- TESTE DE CONEXÃO SENTRY ---');
console.log('DSN carregado:', process.env.SENTRY_DSN ? process.env.SENTRY_DSN.substring(0, 45) + '...' : '❌ NÃO DEFINIDO');

if (!process.env.SENTRY_DSN) {
  console.error('❌ ERRO: SENTRY_DSN não encontrado nas variáveis de ambiente!');
  process.exit(1);
}

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
});

const testError = new Error('Teste de conexão Sentry - Instituto Girassol');
const eventId = Sentry.captureException(testError);
console.log('✅ Exceção capturada! Event ID:', eventId);

console.log('Enviando evento para os servidores do Sentry...');
Sentry.flush(5000).then((flushed) => {
  if (flushed) {
    console.log('🚀 Evento enviado com SUCESSO ao Sentry! Verifique seu dashboard no Sentry.');
  } else {
    console.warn('⚠️ O flush expirou antes de confirmar o envio.');
  }
  process.exit(0);
}).catch((err) => {
  console.error('❌ Falha ao enviar evento:', err);
  process.exit(1);
});

import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',

    integrations: [
        nodeProfilingIntegration(),
        Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
    ],

    // Tracing: Monitora o caminho da requisição
    tracesSampleRate: 1.0,

    // Profiling: Monitora o consumo de CPU
    profileSessionSampleRate: 1.0,
    profileLifecycle: 'trace',

    beforeSend(event) {
        // Remove dados de requisição sensíveis
        if (event.request?.data) {
            delete event.request.data; // Apaga o corpo da requisição completamente
        }

        // Remove headers de autenticação
        if (event.request?.headers) {
            delete event.request.headers["authorization"];
            delete event.request.headers["cookie"];
        }

        return event; // Envia o erro limpo, apenas com o StackTrace
    },
});
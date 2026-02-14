import DodoPayments from "dodopayments";

const apiKey = process.env.DODO_PAYMENTS_API_KEY;
const environment = (process.env.DODO_PAYMENTS_ENVIRONMENT as "test_mode" | "live_mode") ?? "test_mode";
const webhookKey = process.env.DODO_PAYMENTS_WEBHOOK_KEY;

export const dodo =
  apiKey
    ? new DodoPayments({
        bearerToken: apiKey,
        environment,
        ...(webhookKey && { webhookKey }),
      })
    : null;

import DodoPayments from "dodopayments";

const apiKey = process.env.DODO_PAYMENTS_API_KEY?.trim();
const rawEnvironment = process.env.DODO_PAYMENTS_ENVIRONMENT?.trim();
const environment: "test_mode" | "live_mode" =
  rawEnvironment === "live_mode" || rawEnvironment === "test_mode"
    ? rawEnvironment
    : "test_mode";
const webhookKey = process.env.DODO_PAYMENTS_WEBHOOK_KEY;

export const dodo =
  apiKey
    ? new DodoPayments({
        bearerToken: apiKey,
        environment,
        ...(webhookKey && { webhookKey }),
      })
    : null;

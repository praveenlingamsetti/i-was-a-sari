// Sets up the API client for interacting with your backend. 
// For your API reference, visit: https://docs.gadget.dev/api/i-was-a-sari-dev
import { Client } from "@gadget-client/i-was-a-sari-dev";

export const api = new Client({ environment: window.gadgetConfig.environment });

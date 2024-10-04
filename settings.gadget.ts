import type { GadgetSettings } from "gadget-server";

export const settings: GadgetSettings = {
  type: "gadget/settings/v1",
  frameworkVersion: "v1.2.0",
  plugins: {
    connections: {
      shopify: {
        apiVersion: "2024-07",
        enabledModels: [
          "shopifyInventoryItem",
          "shopifyInventoryLevel",
          "shopifyLocation",
          "shopifyOrder",
          "shopifyOrderLineItem",
          "shopifyProduct",
          "shopifyProductVariant",
        ],
        type: "partner",
        scopes: [
          "read_products",
          "read_orders",
          "write_products",
          "read_locations",
          "read_inventory",
          "write_inventory",
        ],
      },
    },
  },
};

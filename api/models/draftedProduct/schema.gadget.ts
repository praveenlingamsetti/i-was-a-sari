import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "draftedProduct" model, go to https://i-was-a-sari-dev.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "7pIiOGyg9tA8",
  fields: {
    orderId: { type: "string", storageKey: "QZxgXKO_Pbyu" },
    productId: { type: "string", storageKey: "GmYnYhJqrFcq" },
    productTitle: { type: "string", storageKey: "U24rVCefOuK3" },
    relatedProduct: { type: "json", storageKey: "MuwSDg_HK4e2" },
    swatchId: { type: "string", storageKey: "zhpE1xtPZyXr" },
    type: { type: "string", storageKey: "3BWcsOkqZOBL" },
    variant: { type: "json", storageKey: "aHrKS4Yl3ofb" },
  },
};

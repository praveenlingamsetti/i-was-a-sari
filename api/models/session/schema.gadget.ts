import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "session" model, go to https://i-was-a-sari-dev.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "BxPZ9eHoj9Bs",
  fields: {
    roles: {
      type: "roleList",
      default: ["unauthenticated"],
      storageKey: "e33KI-PWPIAM",
    },
  },
  shopify: { fields: ["shop", "shopifySID"] },
};

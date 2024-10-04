import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopifyProduct" model, go to https://i-was-a-sari-dev.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-Shopify-Product",
  fields: {
    swatchId: {
      type: "string",
      shopifyMetafield: {
        privateMetafield: false,
        namespace: "custom",
        key: "swatchid",
        metafieldType: "single_line_text_field",
        allowMultipleEntries: false,
      },
      storageKey: "qKFKJuH_jDG0",
    },
  },
  shopify: {
    fields: [
      "body",
      "category",
      "compareAtPriceRange",
      "handle",
      "orderLineItems",
      "productCategory",
      "productType",
      "publishedAt",
      "shop",
      "shopifyCreatedAt",
      "shopifyUpdatedAt",
      "status",
      "tags",
      "templateSuffix",
      "title",
      "variants",
      "vendor",
    ],
  },
};

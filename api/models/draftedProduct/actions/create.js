 import { applyParams, save, ActionOptions, CreateDraftedProductActionContext } from "gadget-server";

/**
 * @param { CreateDraftedProductActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await save(record);
};

/** @type { ActionOptions } */
export const options = {
  actionType: "create",
};

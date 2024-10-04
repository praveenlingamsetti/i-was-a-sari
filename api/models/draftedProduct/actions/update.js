import { applyParams, save, ActionOptions, UpdateDraftedProductActionContext } from "gadget-server";

/**
 * @param { UpdateDraftedProductActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await save(record);
};

/** @type { ActionOptions } */
export const options = {
  actionType: "update",
};

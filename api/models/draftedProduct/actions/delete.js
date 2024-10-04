import { deleteRecord, ActionOptions, DeleteDraftedProductActionContext } from "gadget-server";

/**
 * @param { DeleteDraftedProductActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  await deleteRecord(record);
};

/** @type { ActionOptions } */
export const options = {
  actionType: "delete",
};

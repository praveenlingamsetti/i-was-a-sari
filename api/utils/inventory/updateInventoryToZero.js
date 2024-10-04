export async function updateInventoryToZero({ inventoryItemId, api, logger, connections, shop }) {
  const shopify = await connections.shopify.forShopId(shop); // Ensure shop ID is correct
  //logger.info({ inventoryItemId, shop, shopify }, "details");
  try {
    // Fetch the inventory level by inventoryItemId
    const lineItems = await api.shopifyInventoryLevel.findMany({
      filter: {
        inventoryItem: {
          equals: inventoryItemId,
        },
      },
      select: { locationId: true },
    });

    // // Update the inventory to zero at the found location
    for (let eachItem of lineItems) {
      const response = await shopify.inventoryLevel.set({
        inventory_item_id: inventoryItemId,
        location_id: eachItem.locationId,
        available: 0,
      });
    }
  } catch (error) {
    // Log the error before rethrowing it
    logger.error(`Failed to update inventory for inventoryItemId: ${inventoryItemId}`, error);

    // Rethrow the original error with context
    throw new Error(`Failed to update inventory: ${error.message}`);
  }
}

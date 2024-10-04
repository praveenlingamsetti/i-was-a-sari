export async function readOrderLineItems({ orderId, api }) {
  try {
    const lineItems = await api.shopifyOrderLineItem.findMany({
      filter: {
        order: {
          equals: orderId,
        },
      },
      select: { productId: true, shopId: true, sku: true, title: true },
    });

    return lineItems;
  } catch (error) {
    // Throw error to be caught in the controller
    throw new Error(`Failed to fetch product siblings: ${error.message}`);
  }
}

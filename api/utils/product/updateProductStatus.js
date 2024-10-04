export async function updateProductStatus({ logger, productId, shop, connections, status }) {
  const shopify = await connections.shopify.forShopId(shop);

  if (!shopify) {
    throw new Error("Shopify connection is undefined");
  }

  const response = await shopify.product.update(productId, {
    status: status,
  });
  //logger.info({ response });
  return response;
}

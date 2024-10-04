export async function readMetafieldByProductId({ productId, api, logger }) {
  const metafield = await api.shopifyProduct.findMany({
    filter: {
      id: {
        equals: productId,
      },
    },
    select: { swatchId: true },
  });
  return metafield;
}

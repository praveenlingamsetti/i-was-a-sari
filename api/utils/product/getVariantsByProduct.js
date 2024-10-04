export async function getVariantsByProduct({ productId, api, logger }) {
  const productVariants = await api.shopifyProductVariant.findMany({
    filter: {
      product: {
        // Replace 'print_id' with the correct metafield key name
        equals: productId,
      },
    },
    select: {
      id: true, // Select the productId field
      inventoryItemId: true,
    },
  });
  return productVariants;
}
//return productVariants.map((variant) => variant.id);

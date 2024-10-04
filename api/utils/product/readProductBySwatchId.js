export async function readProductsBySwatchId({ swatchId, api, logger }) {
  const products = await api.shopifyProduct.findMany({
    filter: {
      swatchId: {
        // Replace 'print_id' with the correct metafield key name
        equals: swatchId,
      },
    },
    select: {
      id: true, // Select the productId field
    },
  });
  return products;
}

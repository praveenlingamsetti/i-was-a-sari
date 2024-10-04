import { applyParams, save, ActionOptions, CreateShopifyOrderActionContext } from "gadget-server";
import { preventCrossShopDataAccess } from "gadget-server/shopify";
import { readOrderLineItems } from "../../../utils/order/readOrderLineItems";
import { readMetafieldByProductId } from "../../../utils/product/readMetafieldByProduct";
import { readProductsBySwatchId } from "../../../utils/product/readProductBySwatchId";
import { updateProductStatus } from "../../../utils/product/updateProductStatus";
import { getVariantsByProduct } from "../../../utils/product/getVariantsByProduct";
import { makeInventoryZero } from "../../../utils/product/makeInventoryZero";
import { updateInventoryToZero } from "../../../utils/inventory/updateInventoryToZero";
/**
 * @param { CreateShopifyOrderActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
}

/**
 * @param { CreateShopifyOrderActionContext } context
 */

export async function onSuccess({ record, logger, api, connections }) {
  try {
    const lineItems = await readOrderLineItems({ orderId: record.id, api });

    const makeToOrderItems = lineItems.filter((item) => item.sku.endsWith("M2O"));
    const manyOfKindItems = lineItems.filter((item) => item.sku.endsWith("MOK"));
    //logger.info({ makeToOrderItems });
    let shopId;

    // List to hold M2O product details
    const draftedProductsList = [];

    // Handle M2O (Made to Order) Items
    if (makeToOrderItems.length > 0) {
      const productIds = makeToOrderItems.map((each) => each.productId);
      const metafields = new Set();

      // Loop through M2O items to fetch metafields and shopId
      for (let product of makeToOrderItems) {
        shopId = product.shopId;

        // Fetch metafield by product ID
        const { productId } = product;
        const metafield = await readMetafieldByProductId({ productId, api, logger });

        // If metafield contains a swatchId, associate it with the productId
        if (metafield?.length > 0 && metafield[0]?.swatchId) {
          const swatchId = metafield[0].swatchId;
          metafields.add(swatchId); // Ensure uniqueness

          const variants = await getVariantsByProduct({ productId, api, logger });
          // logger.info({ variants });
          const variantIds = variants.map((variant) => variant.id);

          // Create a draft product object to save later
          draftedProductsList.push({
            productId,
            title: product.title,
            type: "M2O",
            swatchId,
            variants: variantIds,
            relatedProducts: [], // We'll populate this later
            relatedProductVariants: [],
            relatedProductWithInventoryItem: [],
          });
        } else {
          //logger.warn(Metafield for product ${productId} doesn't contain a swatchId or is empty.);
        }
      }

      // Fetch related products by swatchId and draft them
      const allProductIds = new Set(productIds);

      for (let swatchId of metafields) {
        const relatedProducts = await readProductsBySwatchId({ swatchId, api, logger });

        relatedProducts.forEach((relatedProduct) => {
          allProductIds.add(relatedProduct.id); // Ensure uniqueness

          // Add related product IDs to the respective draft product object
          draftedProductsList.forEach((draftedProduct) => {
            if (draftedProduct.swatchId === swatchId) {
              draftedProduct.relatedProducts.push(relatedProduct.id);
            }
          });
        });
      }

      for (let eachItem of draftedProductsList) {
        let respectedOrderProductVariants = [];

        // Fetch all variants for related products concurrently
        try {
          const variantsList = await Promise.all(eachItem.relatedProducts.map((productId) => getVariantsByProduct({ productId, api, logger })));

          // Flatten the list of variants and extract only the 'id'
          const flattenedVariants = variantsList.flat(); // Flatten the list
          const variantIds = flattenedVariants.map((variant) => variant.id); // Extract 'id' from each variant
          // logger.info({ flattenedVariants, variantIds }, "res");

          respectedOrderProductVariants.push(...variantIds);
          eachItem.relatedProductVariants.push(...respectedOrderProductVariants); // Push variant ids into the array
          eachItem.relatedProductWithInventoryItem.push(...flattenedVariants);
        } catch (error) {
          logger.error(`Error fetching variants for related products:`, error);
        }
      }

      for (let eachItem of draftedProductsList) {
        // Loop through `relatedProductWithInventoryItem` for each `eachItem`
        for (let productWithInventory of eachItem.relatedProductWithInventoryItem) {
          // Check if `inventoryItemId` is not null before updating
          if (productWithInventory.inventoryItemId) {
            try {
              await updateInventoryToZero({
                inventoryItemId: productWithInventory.inventoryItemId,
                api,
                logger,
                connections,
                shop: shopId,
              });
            } catch (error) {
              logger.error(`Error updating inventory for item ${productWithInventory.inventoryItemId}:`, error);
            }
          } else {
            logger.warn(`Skipping product with null inventoryItemId in relatedProductWithInventoryItem`);
          }
        }
        for (let productId of eachItem.relatedProducts) {
          try {
            await updateProductStatus({ logger, productId, shop: shopId, connections, status: "archived" });
          } catch (error) {
            console.log("error updating product " + error);
          }
        }
        //save to our database
        await api.draftedProduct.create({
          orderId: record.id,
          productTitle: eachItem.title,
          type: eachItem.type,
          productId: eachItem.productId,
          swatchId: eachItem.swatchId,
          variant: eachItem.variants, // Add variants
          relatedProduct: eachItem.relatedProducts, // Add related product IDs
          shop: shopId,
        });
        //logger.info({ orderId: record.id, productTitle: eachItem.title, type: eachItem.productType, swatchId: eachItem.swatchId, variant: eachItem.variants, relatedProduct: eachItem.relatedProducts });
      }
    }

    // Handle MOK (Many of Kind) Items
    // for (const mokItem of manyOfKindItems) {
    //   const { productId, shopId, sku } = mokItem;

    //   // Fetch product details (assuming you want to log productType and title)
    //   const productDetails = await readProductById({ productId, api });
    //   const { title, productType } = productDetails;

    //   // Store MOK product record in DraftedProducts model (without drafting product)
    //   await api.draftedProducts.create({
    //     orderId: record.id,
    //     timestamp: new Date(),
    //     productTitle: title,
    //     productType: productType,
    //     relatedIds: [], // No related IDs for MOK products
    //   });

    //   logger.info(Recorded MOK product ${productId} in DraftedProducts.);
    // }
  } catch (error) {
    logger.error("Error in onSuccess:", error); // Catch and log any errors
    console.log("Error in onSuccess:", error);

    // for (const draftedProduct of draftedProductsList) {
  }
}

/** @type { ActionOptions } */
export const options = { actionType: "create" };
//Amal Linen Day Dress IW00182-ECM-00M-000-0070-M2O  RED-ABC-2309-C01-0001
//Amal Linen Collar Dress IW00182-ECM-00M-000-0070-M2O RED-ABC-2309-C01-0001
//A Dog's Life White IW00182-ECM-00M-000-0070-M2O ORG-ABS-2309-C01-0001

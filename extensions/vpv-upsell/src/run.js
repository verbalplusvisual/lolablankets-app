// @ts-check
import { DiscountApplicationStrategy } from "../generated/api";

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */

/**
 * @type {FunctionRunResult}
 */
const EMPTY_DISCOUNT = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  const cartLines = input.cart.lines

  const upsellTargets = cartLines
    .filter(line => line.merchandise.__typename === "ProductVariant" && line.pdp_upsell?.value === "true")
    .map(line => ({
      productVariant: {
        id: line.merchandise.id,
      },
    }))

  return {
    discountApplicationStrategy: DiscountApplicationStrategy.First,
    discounts: upsellTargets.length > 0 ? [
      {
        message: "Upsell $10 Off",
        targets: upsellTargets,
        value: {
          fixedAmount: {
            amount: "10.00",
            appliesToEachItem: true,
          },
        },
      },
    ] : [],
  }
}
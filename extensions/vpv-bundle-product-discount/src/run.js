// @ts-check
import { DiscountApplicationStrategy } from "../generated/api"

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 * @typedef {import("../generated/api").ProductVariantTarget} ProductVariantTarget
 */

/**
 * @type {FunctionRunResult}
 */
const EMPTY_DISCOUNT = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
}

// Bundle configuration
const BUNDLES = [
  // The Mothers Day Bundle
  {
    parentID: 14697500770676,
    products: [
      // 1 x Lola Original
      [14638903624052,14638904705396,14638904770932,7588217553067,14638905262452,6848639598763,7294200217771,7588217389227,7501272154283,7965846929579],
      // 1 x Lola Original Pillow
      [14675446432116,14675445481844,14675445219700,14675446006132,14675446825332,14675447349620],
      // 1 x Lola Candle
      [14681889472884]
    ],
    discount: 10
  },
  // The Lola Tranquility Bundle
  {
    parentID: 14697499623796,
    products: [
      // 1 x Lola Original
      [14638903624052,14638904705396,14638904770932,7588217553067,14638905262452,6848639598763,7294200217771,7588217389227,7501272154283,7965846929579],
      // 1 x Lola Candle
      [14681889472884]
    ],
    discount: 10
  },
  // The Lola Parent Bundle
  {
    parentID: 14697203171700,
    products: [
      // 1 x Baby Original
      [6848655687851,7588217389227,7501272154283,14638903624052,7294208606379,6848639598763],
      // 1 x Lola Original
      [6848655687851,7588217389227,7501272154283,14638903624052,7294208606379,6848639598763]
    ],
    discount: 10
  },
  // The Lola Essentials Bundle
  {
    // cozy-couch-bundle 
    parentID: 14677931393396,
    products: [
      // 1 x Lola Original
      [14638903624052,6848639598763,7588217553067,14638904705396,14638905262452,7294200217771,14638904770932,7965846929579],
      // 1 x Lola Original Pillow
      [14675605750132,14675446432116,14675445481844,14675445219700,14675446006132,14675446825332,14675447349620],
      // 1 x Lola Original Pillow
      [14675605750132,14675446432116,14675445481844,14675445219700,14675446006132,14675446825332,14675447349620]
    ],
    discount: 10
  },
  {
    parentID: 14697176039796,
    products: [
      // 1 x Dog Bed
      [14617842647412],
      // 1 x Pet Blanket
      [14617717244276,14617717145972,14617717277044,14617717211508]
    ],
    discount: 10,
  },
  {
    parentID: 8144552100011,
    products: [
      // 1 x Lola Original
      [14638903624052,6848639598763,7588217553067,14638904705396,14638905262452,7294200217771,14638904770932,7965846929579],
      // 1 x Lola Original
      [14638903624052,6848639598763,7588217553067,14638904705396,14638905262452,7294200217771,14638904770932,7965846929579],
      // 1 x Lola Original Pillow
      [14675605750132,14675446432116,14675445481844,14675445219700,14675446006132,14675446825332,14675447349620],
      // 1 x Lola Original Pillow
      [14675605750132,14675446432116,14675445481844,14675445219700,14675446006132,14675446825332,14675447349620]
    ],
    discount: 10,
  },
  {
    parentID: 14719857033588,
    products: [
      // 1 x Lola Original
      [6848639598763,7588217553067,7294208606379,14638904705396,14638905262452,7294200217771,14638904770932,7965846929579,14638903624052,7501272154283,6848655687851,14675236225396,7112528429227,7588217389227,7292736176299,14610508874100,14620424798580,7869222256811,7869223927979],
      // 1 x Lola Original Pillow
      [14675447349620,14675605750132,14675445219700,14675446432116,14675445481844,14675446006132,14675446825332,14700140265844,14675444531572,14675443122548,14675444105588,14675443548532,8157364650155,7501286047915,8189602300075]
    ],
    discount: 10,
  }
]

// // Testing 1
// {
//   parentID: null,
//   products: [
//     // Chino Pants
//     [6832884154567],
//     // Chino Pants 2
//     [6832883466439],
//   ],
//   discount: 10
// },
// // Testing 2
// {
//   parentID: null,
//   products: [
//     // Chino Pants
//     [6832884154567],
//     // Short-Sleeve T-Shirt
//     [6832888152263, 6832882254023],
//   ],
//   discount: 10
// },

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  const cartLines = input.cart.lines

  // const upsellTargets = cartLines
  //   .filter(line => {
  //     if (line.merchandise.__typename !== "ProductVariant") return false
  //     return line.pdp_upsell?.value === "true"
  //   })
  //   .map(line => ({
  //     productVariant: {
  //       id: line.merchandise.id,
  //     },
  //   }))

  // if (upsellTargets.length > 0) {
  //   return {
  //     discountApplicationStrategy: DiscountApplicationStrategy.First,
  //     discounts: [
  //       {
  //         message: "Upsell $10% Off",
  //         targets: upsellTargets,
  //         value: {
  //           fixedAmount: {
  //             amount: "10.00",
  //             appliesToEachItem: true
  //           }
  //         },
  //       },
  //     ],
  //   }
  // }

  const bundleGroups = new Map()

  for (const line of cartLines) {
    if (line.merchandise.__typename !== "ProductVariant") continue
    if (!line.attribute || line.attribute.key !== "_pdp_bundle") continue

    const bundleKey = line.attribute.value
    const productId = Number(
      line.merchandise.product.id.replace("gid://shopify/Product/", "")
    )

    const lineDetail = {
      productId,
      variantId: line.merchandise.id,
      cartLineId: line.id
    }

    if (!bundleGroups.has(bundleKey)) {
      bundleGroups.set(bundleKey, [])
    }

    bundleGroups.get(bundleKey).push(lineDetail)
  }

  for (const [bundleKey, lines] of bundleGroups) {
    for (const bundle of BUNDLES) {
      if (bundle.parentID !== null) {
        if (!bundleKey.includes("--")) continue
        const [parentPart] = bundleKey.split("--")
        if (parentPart !== String(bundle.parentID)) continue
      }

      const productIdToLines = new Map()

      for (const line of lines) {
        if (!productIdToLines.has(line.productId)) {
          productIdToLines.set(line.productId, [])
        }
        productIdToLines.get(line.productId).push({
          variantId: line.variantId,
          cartLineId: line.cartLineId
        })
      }

      const targets = []
      const usedLineIds = new Set()
      let bundleMatched = true

      for (const group of bundle.products) {
        let found = false

        for (const productId of group) {
          const options = productIdToLines.get(productId)
          if (!options) continue

          const availableLine = options.find(l => !usedLineIds.has(l.cartLineId))

          if (availableLine) {
            targets.push({
              productVariant: {
                id: availableLine.variantId,
              },
            })
            usedLineIds.add(availableLine.cartLineId)
            found = true
            break
          }
        }

        if (!found) {
          bundleMatched = false
          break
        }
      }

      
      if (bundleMatched) {
        return {
          discountApplicationStrategy: DiscountApplicationStrategy.First,
          discounts: [
            {
              message: "Bundle 10% Off",
              targets,
              value: {
                percentage: {
                  value: bundle.discount,
                }
              },
            },
          ],
        }
      }
    }
  }

  return EMPTY_DISCOUNT
}
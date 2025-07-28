import React, { Suspense } from "react"
import { HttpTypes } from "@medusajs/types"
import { notFound } from "next/navigation"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import RelatedProducts from "@modules/products/components/related-products"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import ProductActionsWrapper from "./product-actions-wrapper"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ImageGallery from "@modules/products/components/image-gallery"
import ProductTabs from "@modules/products/components/product-tabs"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}



const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            
            {/* Image Gallery */}
            <ImageGallery images={product?.images || []} />

            {/* Product Info */}
            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
              {/* Breadcrumb */}
              {product.collection && (
                <nav className="flex">
                  <ol className="flex items-center space-x-2">
                    <li>
                      <LocalizedClientLink
                        href={`/collections/${product.collection.handle}`}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        {product.collection.title}
                      </LocalizedClientLink>
                    </li>
                  </ol>
                </nav>
              )}

              {/* Product Title */}
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 mt-4">
                {product.title}
              </h1>



              {/* Description */}
              {product.description && (
                <div className="mt-6">
                  <div className="space-y-6 text-base text-gray-700">
                    <p>{product.description}</p>
                  </div>
                </div>
              )}

              {/* Product Actions */}
              <div className="mt-6">
                <Suspense
                  fallback={
                    <ProductActions
                      disabled={true}
                      product={product}
                      region={region}
                    />
                  }
                >
                  <ProductActionsWrapper id={product.id} region={region} />
                </Suspense>
              </div>

              {/* Product Features */}
              <ProductTabs product={product} />
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="content-container my-16 small:my-32">
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate

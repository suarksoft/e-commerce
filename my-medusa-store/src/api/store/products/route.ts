import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const transformProduct = (product: any) => {
  // Metadata dahil tüm product verilerini döndür
  return {
    ...product,
    metadata: product.metadata || null
  }
}

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    // Query API'den ürünleri çek
    const query = req.scope.resolve("query")
    
    // Sadece geçerli product filterlarını al
    const { 
      limit, 
      offset, 
      fields: queryFields,
      expand,
      category_id,
      region_id,
      collection_id,
      ...validFilters 
    } = req.query
    
    // Collection ID filter'ı geçerliyse ekle
    if (collection_id) {
      validFilters.collection_id = collection_id
    }
    
    const relations = [
      "variants",
      "variants.prices",
      // ...diğer ilişkiler...
    ];
    const productFields = [
      // ...diğer alanlar...
      "variants",
      "variants.id",
      "variants.title",
      "variants.prices",
      "variants.prices.amount",
      "variants.prices.currency_code",
      // ...gerekirse diğer price alanları...
    ];

    const { data: products } = await query.graph({
      entity: "product",
      fields: [
        "id",
        "title",
        "subtitle", 
        "description",
        "handle",
        "is_giftcard",
        "discountable",
        "thumbnail",
        "collection_id",
        "type_id",
        "weight",
        "length", 
        "height",
        "width",
        "hs_code",
        "origin_country",
        "mid_code",
        "material",
        "created_at",
        "updated_at",
        "metadata",
        "collection.*",
        "categories.*",
        "variants.*",
        "variants.prices.*",
        "images.*",
        "options.*",
        "tags.*"
      ],
      filters: validFilters,
      pagination: {
        skip: parseInt(offset as string) || 0,
        take: parseInt(limit as string) || 20
      }
    })

    // Transform edilmiş ürünleri döndür (metadata dahil)
    res.json({
      products: products.map(transformProduct),
      count: products.length,
      offset: parseInt(offset as string) || 0,
      limit: parseInt(limit as string) || 20
    })
  } catch (error) {
    console.error("Store products API error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

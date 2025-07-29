import { Text, clx } from "@medusajs/ui"
import { VariantPrice } from "types/global"

export default function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) {
    return (
      <div className="flex flex-col items-end">
        <Text className="text-sm text-gray-400">
          Fiyat Yok
        </Text>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-end gap-1">
      {/* İndirimli fiyat varsa */}
      {price.price_type === "sale" && (
        <div className="flex items-center gap-2">
          <Text
            className="text-xs text-gray-400 line-through"
            data-testid="original-price"
          >
            {price.original_price}
          </Text>
                     {price.percentage_diff && (
             <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
               %{Math.abs(Number(price.percentage_diff))} İndirim
             </span>
           )}
        </div>
      )}
      
      {/* Ana fiyat */}
      <div className="flex items-center gap-1">
        <Text
          className={clx("font-bold text-lg", {
            "text-rose-600": price.price_type === "sale",
            "text-gray-900": price.price_type !== "sale",
          })}
          data-testid="price"
        >
          {price.calculated_price}
        </Text>
        {price.price_type === "sale" && (
          <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
        )}
      </div>
      
      {/* Ücretsiz kargo bilgisi (opsiyonel) */}
      {price.calculated_price_number && price.calculated_price_number >= 50000 && (
        <Text className="text-xs text-green-600 font-medium">
          ✓ Ücretsiz Kargo
        </Text>
      )}
    </div>
  )
}

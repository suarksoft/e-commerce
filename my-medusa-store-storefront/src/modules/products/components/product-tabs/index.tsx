"use client"

import { useState } from "react"
import { Minus, Plus } from "lucide-react"
import { HttpTypes } from "@medusajs/types"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

// Collapsible Section Component
const DisclosureSection = ({ 
  title, 
  children, 
  defaultOpen = false 
}: { 
  title: string; 
  children: React.ReactNode; 
  defaultOpen?: boolean 
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-t border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-6 text-left"
      >
        <span className="text-sm font-medium text-gray-900 group-data-open:text-rose-600">
          {title}
        </span>
        <span className="ml-6 flex items-center">
          {isOpen ? (
            <Minus className="h-6 w-6 text-rose-400" />
          ) : (
            <Plus className="h-6 w-6 text-gray-400" />
          )}
        </span>
      </button>
      {isOpen && (
        <div className="pb-6">
          {children}
        </div>
      )}
    </div>
  )
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  return (
    <section className="mt-12">
      <h2 className="sr-only">Additional details</h2>
      
      <div className="divide-y divide-gray-200 border-t">
        {/* Product Information */}
        <DisclosureSection title="Ürün Bilgileri" defaultOpen={true}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            <div className="flex flex-col gap-y-4">
              {product.material && (
                <div>
                  <span className="font-semibold text-gray-900">Malzeme</span>
                  <p className="text-sm text-gray-700 mt-1">{product.material}</p>
                </div>
              )}
              {product.origin_country && (
                <div>
                  <span className="font-semibold text-gray-900">Menşe Ülke</span>
                  <p className="text-sm text-gray-700 mt-1">{product.origin_country}</p>
                </div>
              )}
              {product.type && (
                <div>
                  <span className="font-semibold text-gray-900">Kategori</span>
                  <p className="text-sm text-gray-700 mt-1">{product.type.value}</p>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-y-4">
              {product.weight && (
                <div>
                  <span className="font-semibold text-gray-900">Ağırlık</span>
                  <p className="text-sm text-gray-700 mt-1">{product.weight} g</p>
                </div>
              )}
              {(product.length && product.width && product.height) && (
                <div>
                  <span className="font-semibold text-gray-900">Boyutlar</span>
                  <p className="text-sm text-gray-700 mt-1">
                    {product.length}L x {product.width}W x {product.height}H cm
                  </p>
                </div>
              )}
              {product.collection && (
                <div>
                  <span className="font-semibold text-gray-900">Koleksiyon</span>
                  <p className="text-sm text-gray-700 mt-1">{product.collection.title}</p>
                </div>
              )}
            </div>
          </div>
        </DisclosureSection>

        {/* Care Instructions */}
        <DisclosureSection title="Bakım Talimatları">
          <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
            <li>30°C'de makine yıkayın</li>
            <li>Benzer renklerle yıkayın</li>
            <li>Orta ısıda ütüleyin</li>
            <li>Kuru temizlemeye uygun</li>
            <li>Çamaşır suyu kullanmayın</li>
          </ul>
        </DisclosureSection>

        {/* Shipping & Delivery */}
        <DisclosureSection title="Kargo & Teslimat">
          <div className="space-y-4">
            <div className="flex items-start gap-x-3">
              <div className="flex-shrink-0 w-5 h-5 bg-rose-100 rounded-full flex items-center justify-center mt-0.5">
                <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
              </div>
              <div>
                <span className="font-semibold text-gray-900">Hızlı Teslimat</span>
                <p className="text-sm text-gray-700 mt-1">
                  500₺ üzeri siparişlerde ücretsiz kargo. 1-3 iş günü içinde teslimat.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-x-3">
              <div className="flex-shrink-0 w-5 h-5 bg-rose-100 rounded-full flex items-center justify-center mt-0.5">
                <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
              </div>
              <div>
                <span className="font-semibold text-gray-900">Güvenli Teslimat</span>
                <p className="text-sm text-gray-700 mt-1">
                  Kapıda ödeme imkanı ve kargo takip sistemi.
                </p>
              </div>
            </div>
          </div>
        </DisclosureSection>

        {/* Returns & Exchange */}
        <DisclosureSection title="İade & Değişim">
          <div className="space-y-4">
            <div className="flex items-start gap-x-3">
              <div className="flex-shrink-0 w-5 h-5 bg-rose-100 rounded-full flex items-center justify-center mt-0.5">
                <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
              </div>
              <div>
                <span className="font-semibold text-gray-900">Kolay İade</span>
                <p className="text-sm text-gray-700 mt-1">
                  14 gün içinde ücretsiz iade. İade kargo etiketini biz karşılıyoruz.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-x-3">
              <div className="flex-shrink-0 w-5 h-5 bg-rose-100 rounded-full flex items-center justify-center mt-0.5">
                <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
              </div>
              <div>
                <span className="font-semibold text-gray-900">Hızlı Değişim</span>
                <p className="text-sm text-gray-700 mt-1">
                  Beden veya renk değişimi için hızlı değişim imkanı. %100 para iade garantisi.
                </p>
              </div>
            </div>
          </div>
        </DisclosureSection>
      </div>
    </section>
  )
}

export default ProductTabs

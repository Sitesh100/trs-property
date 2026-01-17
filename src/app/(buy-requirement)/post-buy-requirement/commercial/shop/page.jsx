import BuyRequirementForm from "@/components/(buy-requirement)/buy-requirement-from"

export default function CommercialShopPage() {
  return (
    <div className="bg-[#0d0a1a] text-white min-h-screen">
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center">
        <BuyRequirementForm property_type="flat_apartment" />
      </div>
    </div>
  )
}

import CommercialForm from "@/components/(property)/(post-property)/commercial-form"

export default function CommercialWareHousePage() {
  return (
    <div className="bg-[#212121] text-[#F5EFE7] min-h-screen">
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center">
        <CommercialForm property_type="warehouse" />
      </div>
    </div>
  )
}

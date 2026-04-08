import ResidentialForm from "@/components/(property)/(post-property)/residential-form"

export default function ResidentialHouseVillaPage() {
  return (
    <div className="bg-[#212121] text-[#F5EFE7] min-h-screen">
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center">
        <ResidentialForm property_type="villa" />
      </div>
    </div>
  )
}

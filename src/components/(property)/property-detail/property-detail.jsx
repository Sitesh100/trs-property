"use client";
import { getImageUrl } from "@/utils/getImageUrl";
import { useSendNotificationMutation } from "@/service/notificationApi";
import { useRequestTourMutation } from "@/service/tourApi";
import {
  ArrowDownRight,
  Bath,
  Bed,
  Calendar,
  Download,
  Loader,
  Square,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

function PropertyPropertyDetail({
  propertyFeatures,
  facilities,
  property,
}) {
  const [tourType, setTourType] = useState("in-person");
  const { user } = useSelector((state) => state.auth);
  const [requestTour, { isLoading }] = useRequestTourMutation();
  const [sendNotification, { isLoading: isLoadingNotification }] =
    useSendNotificationMutation();
  const [date, setDate] = useState("");

  const handleDownload = () => {
    if (property?.documents?.length > 0) {
      property?.documents.forEach((docUrl) => {
        window.open(getImageUrl(docUrl), "_blank");
      });
    }
  };

  const handleRequestTour = async () => {
    if (!date) return toast.error("Please select a date");
    try {
      const formData = new FormData();
      formData.append("property", property?.id);
      formData.append("user", user?.id);
      const response = await requestTour(formData).unwrap();
      toast.success(response?.message);
    } catch (err) {
      toast.error(err?.data?.message);
      console.log("Tour request failed", err);
    }
  };

  const handleSendNotification = async (id, name) => {
    try {
      const response = await sendNotification({
        property_id: id,
        property_name: name,
      }).unwrap();
      toast.success(response?.message);
    } catch (err) {
      toast.error(err?.data?.message);
      console.log("Delete failed:", err);
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg p-4 mb-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div className="flex flex-col items-center text-center">
                  <div className="text-gray-500 mb-2">Bedrooms</div>
                  <div className="flex items-center justify-center">
                    <Bed className="h-5 w-5 mr-1 text-black" />
                    <span className="font-bold text-black">
                      {property?.bedrooms || 'N/A'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="text-gray-500 mb-2">Bathrooms</div>
                  <div className="flex items-center justify-center">
                    <Bath className="h-5 w-5 mr-1 text-black" />
                    <span className="font-bold text-black">
                      {property?.bathrooms || 'N/A'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="text-gray-500 mb-2">Square Area</div>
                  <div className="flex items-center justify-center">
                    <Square className="h-5 w-5 mr-1 text-black" />
                    <span className="font-bold text-black">
                      {property?.size ?? property?.super_area ?? 'N/A'} {property?.size ? 'sq ft' : ''}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="text-gray-500 mb-2">Carpet Area</div>
                  <div className="flex items-center justify-center">
                    <ArrowDownRight className="h-5 w-5 mr-1 text-black" />
                    <span className="font-bold text-black">
                      {property?.carpet_area || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">About this home</h2>
              <p className="mb-4">{property?.description || property?.nearby_landmarks}</p>
            </div>

            <div className="bg-white rounded-lg p-6 mb-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Logo */}
                <div className="w-28 h-28 flex-shrink-0">
                  <Image
                    src="/assets/logo/logo1.png"
                    alt="Total Realty Solutions"
                    width={112}
                    height={112}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Company Info */}
                <div className="flex-grow text-center md:text-left">
                  <h3 className="font-bold text-xl text-black">
                    {property?.owner || "Total Realty Solutions"}
                  </h3>
                  {property?.agent_name && (
                    <p className="text-sm text-gray-700 font-medium">Agent: {property?.agent_name}</p>
                  )}
                  <p className="text-sm text-gray-700">RERA REGISTERED BNO</p>
                  <p className="text-sm text-gray-700">
                    {property?.map_location || property?.city || "Indore, Madhya Pradesh"}
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-4 md:mt-0 md:ml-auto">
                  {/* Call Button */}
                  <a
                    href={`tel:${property?.agent_phone || '+919165079260'}`}
                    className="bg-black text-white px-5 py-2 rounded-md text-sm flex items-center justify-center"
                  >
                    CALL NOW
                  </a>

                  {/* WhatsApp Button */}
                  <a
                    href={`https://wa.me/${property?.agent_phone?.replace(/\D/g, '') || '919165079260'}`}
                    target="_blank"
                    className="bg-green-500 text-white px-5 py-2 rounded-md text-sm flex items-center justify-center"
                  >
                    WHATSAPP
                  </a>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Amenities & Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold mb-4">Property Features</h3>
                  <ul className="space-y-3">
                    {propertyFeatures.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <div className="h-5 w-5 rounded-full border border-gray-500 flex items-center justify-center mr-2">
                          <div className="h-2 w-2 bg-gray-500 rounded-full"></div>
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold mb-4">Facilities</h3>
                  <ul className="space-y-3">
                    {facilities.map((facility, index) => (
                      <li key={index} className="flex items-center">
                        <div className="h-5 w-5 rounded-full border border-gray-500 flex items-center justify-center mr-2">
                          <div className="h-2 w-2 bg-gray-500 rounded-full"></div>
                        </div>
                        <span>{facility}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Map Location</h2>
              <div className="rounded-lg overflow-hidden h-[400px] relative">
                <Image
                  src="/assets/images/detail/map.png"
                  alt="Map"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-[#1a1333]/80 text-white p-4 rounded-lg">
                    <p className="text-center">
                      Interactive map will be displayed here
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white text-black rounded-lg p-6 sticky top-24">
              <div className="mb-6">
                <p className="text-gray-500 text-sm mb-1">SALE PRICE</p>
                <h3 className="text-2xl font-bold text-black">
                  ₹ {property?.price ?? property?.expected_price}
                </h3>
              </div>

              <button
                className="w-full bg-black text-white py-3 rounded mb-6 flex items-center justify-center cursor-pointer"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Brochure
              </button>

              <div className="mb-6">
                <h4 className="font-bold mb-4">Request Home Tour</h4>
                <div className="flex mb-4">
                  <button
                    className={`flex-1 py-2 text-center cursor-pointer ${
                      tourType === "in-person"
                        ? "bg-black text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                    onClick={() => setTourType("in-person")}
                  >
                    In person
                  </button>
                  <button
                    className={`flex-1 py-2 text-center cursor-pointer ${
                      tourType === "virtual"
                        ? "bg-black text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                    onClick={() => setTourType("virtual")}
                  >
                    Virtual
                  </button>
                </div>

                <div className="relative mb-4">
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded p-2 pl-10"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                  <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>

                <button
                  onClick={handleRequestTour}
                  disabled={isLoading}
                  className="w-full bg-black text-white py-3 rounded cursor-pointer flex justify-center items-center"
                >
                  {isLoading ? (
                    <div className="animate-spin">
                      <Loader className="w-5 h-5" />
                    </div>
                  ) : (
                    "Request a tour"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PropertyPropertyDetail;

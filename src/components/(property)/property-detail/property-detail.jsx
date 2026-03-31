"use client";
import { getImageUrl } from "@/utils/getImageUrl";
import { useSendNotificationMutation } from "@/service/notificationApi";
import { useRequestTourMutation } from "@/service/tourApi";
import PropertyMap from "@/components/PropertyMap";
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
  rawProperty,
}) {
  const STATIC_CALL_NUMBER = "917024144040";
  const STATIC_WHATSAPP_URL =
    "https://api.whatsapp.com/send/?phone=917024144040&text=Hello%2C+I+am+interested+in+your+property%3A+Kalpataru+Grandeur&type=phone_number&app_absent=0";
  const [tourType, setTourType] = useState("in-person");
  const { user } = useSelector((state) => state.auth);
  const [requestTour, { isLoading }] = useRequestTourMutation();
  const [sendNotification, { isLoading: isLoadingNotification }] =
    useSendNotificationMutation();
  const [date, setDate] = useState("");
  const sourceProperty = rawProperty || property || {};

  const isValueMissing = (value) => {
    if (value === null || value === undefined) return true;
    if (typeof value === "string" && value.trim() === "") return true;
    if (Array.isArray(value) && value.length === 0) return true;
    return false;
  };

  const formatValue = (value) => {
    if (isValueMissing(value)) return "N/A";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (Array.isArray(value)) {
      const parsed = value
        .map((item) => {
          if (item === null || item === undefined) return "";
          if (typeof item === "string") return item.trim();
          if (typeof item === "object") return JSON.stringify(item);
          return String(item);
        })
        .filter(Boolean);
      return parsed.length ? parsed.join(", ") : "N/A";
    }
    if (typeof value === "object") {
      return JSON.stringify(value);
    }
    return String(value);
  };

  const detailStats = [
    {
      label: "Bedrooms",
      icon: Bed,
      value: formatValue(property?.bedrooms),
    },
    {
      label: "Bathrooms",
      icon: Bath,
      value: formatValue(property?.bathrooms),
    },
    {
      label: "Super Area",
      icon: Square,
      value: isValueMissing(property?.super_area)
        ? "N/A"
        : `${property?.super_area} sq ft`,
    },
    {
      label: "Carpet Area",
      icon: ArrowDownRight,
      value: isValueMissing(property?.carpet_area)
        ? "N/A"
        : `${property?.carpet_area} sq ft`,
    },
  ];

  const requiredDetails = [
    // { label: "Title", value: sourceProperty?.title },
    // { label: "Property Type", value: sourceProperty?.property_type },
    // { label: "Expected Price", value: sourceProperty?.expected_price },
    // { label: "Status", value: sourceProperty?.status },
    // { label: "Possession Status", value: sourceProperty?.possession_status },
    { label: "Price Negotiable", value: sourceProperty?.is_price_negotiable },
    // { label: "Bedrooms", value: sourceProperty?.bedrooms },
    // { label: "Bathrooms", value: sourceProperty?.bathrooms },
    { label: "Balconies", value: sourceProperty?.balconies },
    { label: "Floor Number", value: sourceProperty?.floor_number },
    { label: "Total Floors", value: sourceProperty?.total_floors },
    { label: "Parking Spaces", value: sourceProperty?.parking_spaces },
    // { label: "Carpet Area", value: sourceProperty?.carpet_area },
    // { label: "Super Area", value: sourceProperty?.super_area },
    // { label: "Booking Amount", value: sourceProperty?.booking_amount },
    { label: "City", value: sourceProperty?.city },
    // { label: "Map Address", value: sourceProperty?.map_address },
    // { label: "Project Name", value: sourceProperty?.project_name },
    { label: "Builder Name", value: sourceProperty?.builder_name },
    // { label: "RERA ID", value: sourceProperty?.rera_id },
    { label: "Facing", value: sourceProperty?.facing },
    { label: "Furnished Status", value: sourceProperty?.furnished_status },
    { label: "Property Age", value: sourceProperty?.property_age },
    { label: "Owner", value: sourceProperty?.owner },
    { label: "Agent Name", value: sourceProperty?.agent_name },
    // { label: "Agent Email", value: sourceProperty?.agent_email },
    // { label: "Agent Phone", value: sourceProperty?.agent_phone },
  ];
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
                {detailStats.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex flex-col items-center text-center">
                      <div className="text-gray-500 mb-2">{item.label}</div>
                      <div className="flex items-center justify-center">
                        <Icon className="h-5 w-5 mr-1 text-black" />
                        <span className="font-bold text-black">{item.value}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">About this home</h2>
              <p className="mb-4">{formatValue(property?.description || property?.nearby_landmarks)}</p>
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
                    Total Realty Solutions
                  </h3>
                  <p className="text-sm text-gray-700">
                    RERA REGISTERED BNO
                  </p>
                  <p className="text-sm text-gray-700">
                    Indore, Madhya Pradesh
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-4 md:mt-0 md:ml-auto">
                  {/* Call Button */}
                  <a
                    href={`tel:${STATIC_CALL_NUMBER}`}
                    className="px-5 py-2 rounded-md text-sm flex items-center justify-center bg-black text-white"
                  >
                    CALL NOW
                  </a>

                  {/* WhatsApp Button */}
                  <a
                    href={STATIC_WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2 rounded-md text-sm flex items-center justify-center bg-green-500 text-white"
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
                    {(propertyFeatures?.length > 0 ? propertyFeatures : ["N/A"]).map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <div className="h-5 w-5 rounded-full border border-gray-500 flex items-center justify-center mr-2">
                          <div className="h-2 w-2 bg-gray-500 rounded-full"></div>
                        </div>
                        <span>{formatValue(feature)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold mb-4">Facilities</h3>
                  <ul className="space-y-3">
                    {(facilities?.length > 0 ? facilities : ["N/A"]).map((facility, index) => (
                      <li key={index} className="flex items-center">
                        <div className="h-5 w-5 rounded-full border border-gray-500 flex items-center justify-center mr-2">
                          <div className="h-2 w-2 bg-gray-500 rounded-full"></div>
                        </div>
                        <span>{formatValue(facility)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4 text-white">Required Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {requiredDetails.map((item) => (
                  <div key={item.label} className="rounded-xl border border-white/15 bg-black/15 p-3">
                    <p className="text-xs text-white/60 mb-1">{item.label}</p>
                    <p className="text-sm font-semibold text-white break-words">{formatValue(item.value)}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div>
            <div className="bg-white text-black rounded-lg p-6 sticky top-24">
              <div className="mb-6">
                <p className="text-gray-500 text-sm mb-1">SALE PRICE</p>
                <h3 className="text-2xl font-bold text-black">
                  ₹ {formatValue(property?.price ?? property?.expected_price)}
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

          <div className="md:col-span-3 mb-8">
            <h2 className="text-2xl font-bold mb-4">Map Location</h2>
            {property?.latitude !== null && property?.latitude !== undefined &&
            property?.longitude !== null && property?.longitude !== undefined ? (
              <PropertyMap
                lat={property?.latitude}
                lng={property?.longitude}
                  address={property?.map_address || property?.map_location || property?.city || "N/A"}
              />
            ) : (
              <div className="relative rounded-lg h-[400px] overflow-hidden border border-white/20">
                <Image
                  src="/assets/images/property/map-placeholder.svg"
                  alt="Map placeholder"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                  <p className="text-center text-sm text-white px-4">
                    Map coordinates are not available for this property.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default PropertyPropertyDetail;

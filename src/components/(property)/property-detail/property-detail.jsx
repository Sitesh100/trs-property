"use client";
import { getImageUrl } from "@/utils/getImageUrl";
import { useGetCustomerProfileQuery } from "@/service/profileApi";
import PropertyMap from "@/components/PropertyMap";
import {
  ArrowDownRight,
  Bath,
  Bed,
  ChevronDown,
  ChevronUp,
  Download,
  Loader,
  Square,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

function PropertyPropertyDetail({
  propertyFeatures,
  facilities,
  property,
  rawProperty,
}) {
  const STATIC_CALL_NUMBER = "9111655111";
  const STATIC_WHATSAPP_URL =
    "https://api.whatsapp.com/send/?phone=9111655111&text=Hello%2C+I+am+interested+in+your+property%3A+Kalpataru+Grandeur&type=phone_number&app_absent=0";
  const { token, user } = useSelector((state) => state.auth);
  const { data: customerProfile } = useGetCustomerProfileQuery(undefined, {
    skip: !token,
  });
  const [isSubmittingTourLead, setIsSubmittingTourLead] = useState(false);
  const [pendingTourRequest, setPendingTourRequest] = useState(false);
  const [showAllDetails, setShowAllDetails] = useState(false);
  const sourceProperty = rawProperty || property || {};

  const profileSource = customerProfile || user || {};

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
    { label: "Price Negotiable", value: sourceProperty?.is_price_negotiable },
    { label: "City", value: sourceProperty?.city },
    { label: "Balconies", value: sourceProperty?.balconies },
    { label: "Parking Spaces", value: sourceProperty?.parking_spaces },
    { label: "Furnished Status", value: sourceProperty?.furnished_status },
    { label: "Floor Number", value: sourceProperty?.floor_number },
    { label: "Total Floors", value: sourceProperty?.total_floors },
    { label: "Builder Name", value: sourceProperty?.builder_name },
    { label: "Facing", value: sourceProperty?.facing },
    { label: "Property Age", value: sourceProperty?.property_age },
    { label: "Owner", value: sourceProperty?.owner },
    { label: "Agent Name", value: sourceProperty?.agent_name },
  ];
  const normalizedPropertyType = String(sourceProperty?.property_type || "")
    .toLowerCase()
    .replace(/[_\s-]+/g, " ")
    .trim();
  const shouldShowBedBath = ["flat", "villa"].includes(normalizedPropertyType);

  const visibleDetailStats = shouldShowBedBath
    ? detailStats
    : detailStats.filter((item) => item.label !== "Bedrooms" && item.label !== "Bathrooms");

  const initialRequiredDetails = requiredDetails.slice(0, 6);
  const additionalRequiredDetails = requiredDetails.slice(6);
  const handleDownload = () => {
    if (property?.documents?.length > 0) {
      property?.documents.forEach((docUrl) => {
        window.open(getImageUrl(docUrl), "_blank");
      });
    }
  };

  const getLeadField = (...values) => {
    const selectedValue = values.find((value) => {
      if (typeof value === "string") return value.trim();
      return value !== null && value !== undefined;
    });

    return typeof selectedValue === "string"
      ? selectedValue.trim()
      : selectedValue || "";
  };

  const customerName = getLeadField(
    profileSource?.full_name,
    profileSource?.name,
    profileSource?.first_name,
    user?.full_name,
    user?.name
  );
  const customerEmail = getLeadField(
    profileSource?.email,
    user?.email
  );
  const customerNumber = getLeadField(
    profileSource?.phone,
    profileSource?.mobile_no,
    user?.phone,
    user?.mobile_no
  );

  const submitTourLead = async () => {
    const propertyUrl =
      typeof window !== "undefined" ? window.location.href : "";

    if (!customerName || !customerEmail || !customerNumber) {
      toast.error("Please complete your profile details before requesting a tour.");
      return;
    }

    setIsSubmittingTourLead(true);

    try {
      const response = await fetch("/api/sell-do/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerNumber,
          notes: propertyUrl,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message || "Failed to submit tour request.");
      }

      setPendingTourRequest(false);
      toast.success("Our team will get back to you in the next 24 hours.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to submit your request right now.");
      console.log("Sell.do lead submission failed", err);
    } finally {
      setIsSubmittingTourLead(false);
    }
  };

  const openAuthModal = () => {
    if (typeof window === "undefined") return;

    window.dispatchEvent(
      new CustomEvent("open-auth-modal", {
        detail: {
          tab: "sendOtp",
        },
      })
    );
  };

  const handleRequestTour = async () => {
    if (!token) {
      setPendingTourRequest(true);
      openAuthModal();
      return;
    }

    await submitTourLead();
  };

  useEffect(() => {
    const handleResumeSubmit = () => {
      setPendingTourRequest(true);
    };

    window.addEventListener("resume-form-submit", handleResumeSubmit);

    return () => {
      window.removeEventListener("resume-form-submit", handleResumeSubmit);
    };
  }, []);

  useEffect(() => {
    if (!pendingTourRequest || !token || isSubmittingTourLead) return;
    if (!customerProfile && (!customerName || !customerEmail || !customerNumber)) return;
    submitTourLead();
  }, [pendingTourRequest, token, customerProfile, customerName, customerEmail, customerNumber, isSubmittingTourLead]);

  return (
    <>
      <div className="container mx-auto px-3 sm:px-4 py-5 sm:py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
          <div className="md:col-span-2">
            <div className="bg-[#F5EFE7] rounded-lg p-3 sm:p-4 mb-6 sm:mb-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
                {visibleDetailStats.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex flex-col items-center text-center">
                      <div className="text-[#212121]/70 text-xs sm:text-sm mb-1.5 sm:mb-2">{item.label}</div>
                      <div className="flex items-center justify-center">
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 text-[#212121]" />
                        <span className="font-bold text-sm sm:text-base text-[#212121]">{item.value}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">About this home</h2>
              <p className="mb-4 text-sm sm:text-base leading-5">{formatValue(property?.description || property?.nearby_landmarks)}</p>
            </div>

            <div className="bg-[#F5EFE7] rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
              <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6">
                {/* Logo */}
                <div className="flex items-center gap-4 w-full md:w-auto"> 
                <div className="w-20 h-20 sm:w-28 sm:h-28 flex-shrink-0">
                  <Image
                    src="/assets/logo/logo1.png"
                    alt="Total Realty Solutions"
                    width={112}
                    height={112}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Company Info */}
                <div className="flex-grow text-left">
                  <h3 className="font-bold text-lg sm:text-xl text-[#212121]">
                    Total Realty Solutions
                  </h3>
                  <p className="text-xs sm:text-sm text-[#212121]/70">
                    RERA REGISTERED BNO
                  </p>
                  <p className="text-xs sm:text-sm text-[#212121]/70">
                    Indore, Madhya Pradesh
                  </p>
                </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2 sm:gap-3 mt-3 md:mt-0 md:ml-auto">
                  {/* Call Button */}
                  <a
                    href={`tel:${STATIC_CALL_NUMBER}`}
                    className="px-4 py-2.5 rounded-md text-sm flex items-center justify-center bg-[#212121] text-[#F5EFE7]"
                  >
                    CALL NOW
                  </a>

                  {/* WhatsApp Button */}
                  <a
                    href={STATIC_WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-md text-sm flex items-center justify-center bg-[#212121] text-[#F5EFE7]"
                  >
                    WHATSAPP
                  </a>
                </div>
              </div>
            </div>

            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl font-bold mb-3 sm:mb-4">Amenities & Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                <div>
                  <h3 className="font-bold mb-3 sm:mb-4">Property Features</h3>
                  <ul className="space-y-2.5 sm:space-y-3">
                    {(propertyFeatures?.length > 0 ? propertyFeatures : ["N/A"]).map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-full border border-[#F5EFE7] flex items-center justify-center mr-2">
                          <div className="h-2 w-2 bg-[#212121] rounded-full"></div>
                        </div>
                        <span className="text-sm sm:text-base">{formatValue(feature)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold mb-3 sm:mb-4">Facilities</h3>
                  <ul className="space-y-2.5 sm:space-y-3">
                    {(facilities?.length > 0 ? facilities : ["N/A"]).map((facility, index) => (
                      <li key={index} className="flex items-center">
                        <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-full border border-[#F5EFE7] flex items-center justify-center mr-2">
                          <div className="h-2 w-2 bg-[#212121] rounded-full"></div>
                        </div>
                        <span className="text-sm sm:text-base">{formatValue(facility)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#F5EFE7]/20 bg-[#F5EFE7]/5 backdrop-blur-sm p-4 sm:p-6 mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-[#F5EFE7]">Property Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {initialRequiredDetails.map((item) => (
                  <div key={item.label} className="rounded-xl border border-[#F5EFE7]/15 bg-[#212121]/15 p-3">
                    <p className="text-xs text-[#F5EFE7]/60 mb-1">{item.label}</p>
                    <p className="text-sm font-semibold text-[#F5EFE7] break-words">{formatValue(item.value)}</p>
                  </div>
                ))}
              </div>

              {showAllDetails && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {additionalRequiredDetails.map((item) => (
                    <div key={item.label} className="rounded-xl border border-[#F5EFE7]/15 bg-[#212121]/15 p-3">
                      <p className="text-xs text-[#F5EFE7]/60 mb-1">{item.label}</p>
                      <p className="text-sm font-semibold text-[#F5EFE7] break-words">{formatValue(item.value)}</p>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => setShowAllDetails((prev) => !prev)}
                className="mt-4 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-[#F5EFE7]/20 bg-[#212121]/20 text-sm font-medium text-[#F5EFE7] hover:bg-[#212121]/35 transition-colors cursor-pointer"
              >
                {showAllDetails ? (
                  <>
                    Show Less Details <ChevronUp className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Show More Details <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>

          </div>

          <div>
            <div className="bg-[#F5EFE7] text-[#212121] rounded-lg p-4 sm:p-6 lg:sticky lg:top-24">
              <div className="mb-4 sm:mb-5 rounded-2xl border border-[#212121]/10 bg-white/55 p-3 sm:p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#212121]/55">
                  Pricing
                </p>
                <h3 className="text-xl sm:text-2xl font-bold text-[#212121]">
                  ₹ {formatValue(property?.price ?? property?.expected_price)}
                </h3>
              </div>

              <button
                className="w-full bg-[#212121] text-[#F5EFE7] py-2.5 sm:py-3 rounded mb-4 sm:mb-5 flex items-center justify-center cursor-pointer text-sm sm:text-base"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Brochure
              </button>

              <div className="rounded-2xl border border-[#212121]/10 bg-white/40 p-3 sm:p-4">
                <h4 className="text-base sm:text-lg font-bold text-[#212121]">Request a Tour</h4>
                <p className="mt-2 text-sm leading-6 text-[#212121]/70">
                  Share your interest and our team will connect with you for the next step.
                </p>
                <button
                  onClick={handleRequestTour}
                  disabled={isSubmittingTourLead}
                  className="mt-4 w-full bg-[#212121] text-[#F5EFE7] py-2.5 sm:py-3 rounded cursor-pointer flex justify-center items-center disabled:cursor-not-allowed disabled:opacity-70 text-sm sm:text-base"
                >
                  {isSubmittingTourLead ? (
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

          <div className="md:col-span-3 mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Map Location</h2>
            {property?.latitude !== null && property?.latitude !== undefined &&
            property?.longitude !== null && property?.longitude !== undefined ? (
              <PropertyMap
                lat={property?.latitude}
                lng={property?.longitude}
                  address={property?.map_address || property?.map_location || property?.city || "N/A"}
              />
            ) : (
              <div className="relative rounded-lg h-64 sm:h-[400px] overflow-hidden border border-[#F5EFE7]/20">
                <Image
                  src="/assets/images/property/map-placeholder.svg"
                  alt="Map placeholder"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[#212121]/35 flex items-center justify-center">
                  <p className="text-center text-sm text-[#F5EFE7] px-4">
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

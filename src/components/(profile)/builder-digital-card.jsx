"use client";

import { Dialog } from "@headlessui/react";
import { Fragment, useMemo, useState } from "react";
import { Building2, Copy, ExternalLink, Mail, Phone, Share2, X } from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const getInitials = (name = "") => {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("") || "BD";
};

export default function BuilderDigitalCard() {
    const [open, setOpen] = useState(false);
    const { user } = useSelector((state) => state.auth);

    const profile = useMemo(() => {
        return {
            companyName: user?.company_name || user?.full_name || "Builder Name",
            roleName: "Builder Profile",
            city: user?.city || "",
            phone: user?.phone || "",
            email: user?.email || "",
            rera: user?.rera_registration_number || user?.rera_number || "",
            imageUrl: user?.profile_image_url || "",
            website: user?.website || "",
        };
    }, [user]);

    const shareCard = async () => {
        const cardText = [
            `Builder Card: ${profile.companyName}`,
            profile.rera ? `RERA: ${profile.rera}` : "",
            profile.phone ? `Phone: ${profile.phone}` : "",
            profile.email ? `Email: ${profile.email}` : "",
        ]
            .filter(Boolean)
            .join("\n");

        try {
            if (typeof navigator !== "undefined" && navigator.share) {
                await navigator.share({
                    title: `${profile.companyName} - Builder Card`,
                    text: cardText,
                });
                return;
            }

            if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(cardText);
                toast.success("Builder card details copied");
            }
        } catch (error) {
            console.error("Share failed", error);
        }
    };

    const copyPhone = async () => {
        if (!profile.phone || !navigator?.clipboard?.writeText) return;
        await navigator.clipboard.writeText(profile.phone);
        toast.success("Phone number copied");
    };

    return (
        <>
            <div className="mb-6 rounded-xl border border-[#212121]/20 bg-[#F5EFE7] p-4">
                <p className="text-sm text-[#F5EFE7]">Builder Profile as Digital Card</p>
                <div className="mt-3 flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={() => setOpen(true)}
                        className="rounded-md bg-[#212121] px-4 py-2 text-sm font-medium text-[#F5EFE7] transition hover:bg-[#212121]"
                    >
                        View your digital card
                    </button>
                    <button
                        type="button"
                        onClick={shareCard}
                        className="inline-flex items-center gap-2 rounded-md border border-[#212121]/30 px-4 py-2 text-sm font-medium text-[#212121] transition hover:bg-[#F5EFE7]"
                    >
                        <Share2 size={14} /> Share your digital card
                    </button>
                </div>
            </div>

            <Dialog as={Fragment} open={open} onClose={() => setOpen(false)}>
                <div className="fixed inset-0 z-50">
                    <div className="fixed inset-0 bg-[#212121]/50" onClick={() => setOpen(false)} />

                    <div className="fixed inset-0 flex items-center justify-center px-4">
                        <div className="relative w-full max-w-md rounded-2xl border border-[#F5EFE7]/20 bg-linear-to-br from-[#212121] via-[#212121] to-[#212121] p-5 text-[#F5EFE7] shadow-2xl">
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="absolute right-3 top-3 rounded-full p-1 text-[#F5EFE7]/80 hover:bg-[#F5EFE7]/10"
                            >
                                <X size={16} />
                            </button>

                            <div className="mb-5 flex items-center gap-3">
                                {profile.imageUrl ? (
                                    <img
                                        src={profile.imageUrl}
                                        alt="Builder"
                                        className="h-16 w-16 rounded-full border border-[#F5EFE7]/20 object-cover"
                                    />
                                ) : (
                                    <div className="grid h-16 w-16 place-items-center rounded-full border border-[#F5EFE7]/20 bg-[#F5EFE7]/10 font-semibold">
                                        {getInitials(profile.companyName)}
                                    </div>
                                )}

                                <div>
                                    <p className="text-lg font-semibold">{profile.companyName}</p>
                                    <p className="text-sm text-[#F5EFE7]/80">{profile.roleName}</p>
                                    {profile.city && <p className="text-xs text-[#F5EFE7]">{profile.city}</p>}
                                </div>
                            </div>

                            <div className="space-y-2 rounded-xl border border-[#F5EFE7]/15 bg-[#212121]/20 p-3 text-sm">
                                {profile.rera && <p className="text-[#F5EFE7]/80">RERA: {profile.rera}</p>}
                                {profile.phone && (
                                    <a href={`tel:${profile.phone}`} className="flex items-center justify-between rounded-md px-2 py-1 hover:bg-[#F5EFE7]/10">
                                        <span className="inline-flex items-center gap-2"><Phone size={14} /> {profile.phone}</span>
                                        <ExternalLink size={13} />
                                    </a>
                                )}
                                {profile.email && (
                                    <a href={`mailto:${profile.email}`} className="flex items-center justify-between rounded-md px-2 py-1 hover:bg-[#F5EFE7]/10">
                                        <span className="inline-flex items-center gap-2"><Mail size={14} /> {profile.email}</span>
                                        <ExternalLink size={13} />
                                    </a>
                                )}
                                {profile.website && (
                                    <a href={profile.website} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-md px-2 py-1 hover:bg-[#F5EFE7]/10">
                                        <span>Website</span>
                                        <ExternalLink size={13} />
                                    </a>
                                )}
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={copyPhone}
                                    className="inline-flex items-center justify-center gap-2 rounded-md border border-[#F5EFE7]/20 px-3 py-2 text-sm hover:bg-[#F5EFE7]/10"
                                >
                                    <Copy size={14} /> Copy Phone
                                </button>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    );
}

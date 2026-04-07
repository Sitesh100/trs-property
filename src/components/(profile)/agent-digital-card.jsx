"use client";

import { Dialog } from "@headlessui/react";
import { Fragment, useMemo, useState } from "react";
import { Copy, ExternalLink, Mail, Phone, Share2, UserRound, X } from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const getInitials = (name = "") => {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("") || "AG";
};

const getWhatsAppLink = (phone = "") => {
    const digits = String(phone).replace(/\D/g, "");
    if (!digits) return "";
    return `https://wa.me/${digits}`;
};

export default function AgentDigitalCard() {
    const [open, setOpen] = useState(false);
    const { user } = useSelector((state) => state.auth);

    const profile = useMemo(() => {
        return {
            fullName: user?.full_name || "Agent Name",
            roleName: user?.designation || user?.role || "Property Consultant",
            company: user?.company_name || "TRS Property",
            city: user?.city || "",
            phone: user?.phone || "",
            email: user?.email || "",
            imageUrl: user?.profile_image_url || "",
            linkedin: user?.linkedin_url || user?.linkedin || "",
            instagram: user?.instagram_url || user?.instagram || "",
            facebook: user?.facebook_url || user?.facebook || "",
        };
    }, [user]);

    const shareCard = async () => {
        const cardText = [
            `Agent Card: ${profile.fullName}`,
            `${profile.roleName} | ${profile.company}`,
            profile.phone ? `Phone: ${profile.phone}` : "",
            profile.email ? `Email: ${profile.email}` : "",
        ]
            .filter(Boolean)
            .join("\n");

        try {
            if (typeof navigator !== "undefined" && navigator.share) {
                await navigator.share({
                    title: `${profile.fullName} - Digital Card`,
                    text: cardText,
                });
                return;
            }

            if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(cardText);
                toast.success("Digital card details copied");
                return;
            }

            toast.success("Sharing is not supported on this device");
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
            <div className="mb-6 rounded-xl border border-[#2a1f45]/20 bg-[#f8f7fb] p-4">
                <p className="text-sm text-gray-700">Agent Profile as Digital Card</p>
                <div className="mt-3 flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={() => setOpen(true)}
                        className="rounded-md bg-[#2a1f45] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#3a2a5a]"
                    >
                        View your digital card
                    </button>
                    <button
                        type="button"
                        onClick={shareCard}
                        className="inline-flex items-center gap-2 rounded-md border border-[#2a1f45]/30 px-4 py-2 text-sm font-medium text-[#2a1f45] transition hover:bg-[#efedf6]"
                    >
                        <Share2 size={14} /> Share your digital card
                    </button>
                </div>
            </div>

            <Dialog as={Fragment} open={open} onClose={() => setOpen(false)}>
                <div className="fixed inset-0 z-50">
                    <div
                        className="fixed inset-0 bg-black/50"
                        onClick={() => setOpen(false)}
                    />

                    <div className="fixed inset-0 flex items-center justify-center px-4">
                        <div className="relative w-full max-w-md rounded-2xl border border-white/20 bg-linear-to-br from-[#2a1f45] via-[#1f1534] to-[#111] p-5 text-white shadow-2xl">
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="absolute right-3 top-3 rounded-full p-1 text-gray-200 hover:bg-white/10"
                            >
                                <X size={16} />
                            </button>

                            <div className="mb-5 flex items-center gap-3">
                                {profile.imageUrl ? (
                                    <img
                                        src={profile.imageUrl}
                                        alt="Agent"
                                        className="h-16 w-16 rounded-full border border-white/20 object-cover"
                                    />
                                ) : (
                                    <div className="grid h-16 w-16 place-items-center rounded-full border border-white/20 bg-white/10 font-semibold">
                                        {getInitials(profile.fullName)}
                                    </div>
                                )}

                                <div>
                                    <p className="text-lg font-semibold">{profile.fullName}</p>
                                    <p className="text-sm text-gray-200">{profile.roleName}</p>
                                    <p className="text-xs text-gray-300">{profile.company}</p>
                                </div>
                            </div>

                            <div className="space-y-2 rounded-xl border border-white/15 bg-black/20 p-3 text-sm">
                                {profile.city && <p className="text-gray-200">City: {profile.city}</p>}
                                {profile.phone && (
                                    <a href={`tel:${profile.phone}`} className="flex items-center justify-between rounded-md px-2 py-1 hover:bg-white/10">
                                        <span className="inline-flex items-center gap-2"><Phone size={14} /> {profile.phone}</span>
                                        <ExternalLink size={13} />
                                    </a>
                                )}
                                {profile.email && (
                                    <a href={`mailto:${profile.email}`} className="flex items-center justify-between rounded-md px-2 py-1 hover:bg-white/10">
                                        <span className="inline-flex items-center gap-2"><Mail size={14} /> {profile.email}</span>
                                        <ExternalLink size={13} />
                                    </a>
                                )}
                                {getWhatsAppLink(profile.phone) && (
                                    <a href={getWhatsAppLink(profile.phone)} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-md px-2 py-1 hover:bg-white/10">
                                        <span>WhatsApp</span>
                                        <ExternalLink size={13} />
                                    </a>
                                )}
                                {profile.linkedin && (
                                    <a href={profile.linkedin} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-md px-2 py-1 hover:bg-white/10">
                                        <span>LinkedIn</span>
                                        <ExternalLink size={13} />
                                    </a>
                                )}
                                {profile.instagram && (
                                    <a href={profile.instagram} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-md px-2 py-1 hover:bg-white/10">
                                        <span>Instagram</span>
                                        <ExternalLink size={13} />
                                    </a>
                                )}
                                {profile.facebook && (
                                    <a href={profile.facebook} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-md px-2 py-1 hover:bg-white/10">
                                        <span>Facebook</span>
                                        <ExternalLink size={13} />
                                    </a>
                                )}
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={copyPhone}
                                    className="inline-flex items-center justify-center gap-2 rounded-md border border-white/20 px-3 py-2 text-sm hover:bg-white/10"
                                >
                                    <Copy size={14} /> Copy Phone
                                </button>
                                <button
                                    type="button"
                                    onClick={shareCard}
                                    className="inline-flex items-center justify-center gap-2 rounded-md bg-white text-sm font-semibold text-[#2a1f45] px-3 py-2 hover:bg-gray-100"
                                >
                                    <UserRound size={14} /> Share Card
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    );
}

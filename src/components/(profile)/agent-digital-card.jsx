"use client";

import { Dialog } from "@headlessui/react";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import {
    Copy, ExternalLink, Mail, Phone, Share2, UserRound, X,
    MapPin
} from "lucide-react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useGetMyWorkInfoQuery } from "@/service/profileApi";
import { getImageUrl } from "@/utils/getImageUrl";

// ─── Brand tokens ────────────────────────────────────────────────
const GOLD       = "#B8972E";
const GOLD_LIGHT = "#D4AF5A";
const CHARCOAL   = "#1A1A2E";
const CHARCOAL2  = "#16213E";
const CHARCOAL3  = "#0F3460";
const OFF_WHITE  = "#F8F3E8";
const MUTED      = "rgba(248,243,232,0.6)";

// ─── Fallback data ────────────────────────────────────────────────
const FALLBACK_PROFILE = {
    fullName:  "Rahul Kapoor",
    roleName:  "Senior Property Consultant",
    company:   "PRIME ESTATES REALTY PVT. LTD.",
    address:   "Bandra West, Mumbai, Maharashtra",
    officeAddress: "",
    phone:     "+91 98765 43210",
    email:     "rahul.kapoor@primeestates.in",
    imageUrl:  "",
    focusLocations: [],
    topCategories: [],
    linkedin:  "https://linkedin.com/in/rahul-kapoor",
    instagram: "https://instagram.com/rahul.kapoor",
    facebook:  "https://facebook.com/rahul.kapoor",
};

// ─── Helpers ─────────────────────────────────────────────────────
const getInitials = (name = "") =>
    name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "RK";

const getWhatsAppLink = (phone = "") => {
    const d = String(phone).replace(/\D/g, "");
    return d ? `https://wa.me/${d}` : "";
};

const getProfileImageUrl = (path) => {
    if (!path) return "";
    return getImageUrl(path);
};

// WhatsApp SVG icon
const WhatsAppIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.122 1.531 5.856L.044 23.25a.75.75 0 00.916.916l5.394-1.487A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.696-.5-5.243-1.376l-.375-.218-3.881 1.07 1.07-3.882-.217-.374A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
    </svg>
);

// Gold divider
const GoldDivider = () => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "12px 0" }}>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${GOLD})` }} />
        <div style={{ width: 4, height: 4, borderRadius: "50%", background: GOLD }} />
        <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${GOLD})` }} />
    </div>
);

// ─── Card face (updated with address, email, and company) ─────────
function DigitalCardFace({ profile }) {
    const initials = getInitials(profile.fullName);
    const [avatarError, setAvatarError] = useState(false);

    useEffect(() => {
        setAvatarError(false);
    }, [profile.imageUrl]);

    return (
        <div style={{
            background: `linear-gradient(160deg, ${CHARCOAL2} 0%, ${CHARCOAL} 55%, ${CHARCOAL3} 100%)`,
            borderRadius: 20,
            padding: "28px 24px 20px",
            color: OFF_WHITE,
            fontFamily: "Georgia, serif",
            position: "relative",
            overflow: "hidden",
        }}>
            {/* corner ornaments */}
            <div style={{
                position: "absolute", top: 0, right: 0, width: 140, height: 140,
                background: `radial-gradient(circle at top right, ${GOLD}22 0%, transparent 70%)`,
                pointerEvents: "none",
            }} />
            <div style={{
                position: "absolute", bottom: 0, left: 0, width: 110, height: 110,
                background: `radial-gradient(circle at bottom left, ${CHARCOAL3}88 0%, transparent 70%)`,
                pointerEvents: "none",
            }} />

            {/* avatar + name + role */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 1 }}>
                {/* Large avatar (size unchanged) */}
                <div style={{
                    width: 140,
                    height: 140,
                    borderRadius: "50%",
                    border: `4px solid ${GOLD}`,
                    boxShadow: `0 0 0 6px ${GOLD}1A`,
                    background: profile.imageUrl ? "transparent" : `${GOLD}22`,
                    overflow: "hidden",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 44, fontWeight: 600, color: GOLD, fontFamily: "sans-serif",
                    marginBottom: 16,
                    flexShrink: 0,
                }}>
                    {profile.imageUrl && !avatarError
                        ? (
                            <img
                                src={profile.imageUrl}
                                alt="Agent"
                                onError={() => setAvatarError(true)}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        )
                        : initials}
                </div>

                <p style={{ margin: "0 0 4px", fontSize: 22, color: OFF_WHITE, fontStyle: "italic", letterSpacing: 0.5, textAlign: "center" }}>
                    {profile.fullName}
                </p>
               
            </div>

           

            {/* company footer (updated with dummy company) */}
            <div style={{
                marginTop: 16,
                borderTop: `1px solid ${GOLD}44`,
                paddingTop: 10,
                textAlign: "center",
                fontSize: 10,
                letterSpacing: 2,
                color: `${GOLD}BB`,
                textTransform: "uppercase",
                fontFamily: "sans-serif",
                position: "relative",
                zIndex: 1,
            }}>
                {profile.company}
            </div>
        </div>
    );
}

// ─── Main component (using dummy data only, no API) ──────────────
export default function AgentDigitalCard() {
    const [open, setOpen] = useState(false);
    const cardRef = useRef(null);
    const { token, user } = useSelector((state) => state.auth);
    const { data: profileResponse } = useGetMyWorkInfoQuery(undefined, {
        skip: !token,
    });

    const profile = useMemo(() => {
        const payload = profileResponse?.data || profileResponse?.result || profileResponse || {};
        const source = payload && typeof payload === "object" && Object.keys(payload).length > 0
            ? payload
            : (user || {});

        return {
            fullName: source?.full_name || source?.name || FALLBACK_PROFILE.fullName,
            roleName: source?.role ? String(source.role).replace(/_/g, " ").toUpperCase() : FALLBACK_PROFILE.roleName,
            company: source?.company_name || FALLBACK_PROFILE.company,
            address: source?.city || FALLBACK_PROFILE.address,
            officeAddress: source?.office_address || "",
            phone: source?.phone || source?.mobile_no || FALLBACK_PROFILE.phone,
            email: source?.email || FALLBACK_PROFILE.email,
            imageUrl: getProfileImageUrl(source?.profile_image_url) || FALLBACK_PROFILE.imageUrl,
            focusLocations: Array.isArray(source?.focus_locations) ? source.focus_locations : [],
            topCategories: Array.isArray(source?.top_categories) ? source.top_categories : [],
            linkedin: source?.linkedin || "",
            instagram: source?.instagram || "",
            facebook: source?.facebook || "",
        };
    }, [profileResponse, user]);

    const shareCard = async () => {
        const cardText = [
            `🏠 ${profile.fullName}`,
            `${profile.roleName} | ${profile.company}`,
            profile.phone ? `📞 ${profile.phone}` : "",
            profile.email ? `✉️  ${profile.email}` : "",
            profile.address ? `📍 ${profile.address}` : "",
            profile.officeAddress ? `🏢 Office: ${profile.officeAddress}` : "",
            profile.focusLocations?.length ? `📌 Focus Areas: ${profile.focusLocations.join(", ")}` : "",
            profile.topCategories?.length ? `🏘️ Categories: ${profile.topCategories.join(", ")}` : "",
            profile.linkedin  ? `🔗 LinkedIn: ${profile.linkedin}` : "",
            profile.instagram ? `📸 Instagram: ${profile.instagram}` : "",
        ].filter(Boolean).join("\n");

        try {
            if (typeof navigator !== "undefined" && navigator.share) {
                await navigator.share({ title: `${profile.fullName} – Digital Card`, text: cardText });
                return;
            }
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(cardText);
                toast.success("Card details copied to clipboard");
                return;
            }
            toast("Sharing not supported on this device");
        } catch (err) {
            console.error("Share failed", err);
        }
    };

    const shareAsImage = async () => {
        try {
            if (!cardRef.current) {
                toast.error("Card preview not available");
                return;
            }

            const waitForImages = async (rootEl) => {
                const images = Array.from(rootEl.querySelectorAll("img"));
                if (!images.length) return;

                await Promise.all(images.map((img) => {
                    if (img.complete && img.naturalWidth > 0) return Promise.resolve();
                    return new Promise((resolve) => {
                        const onDone = () => {
                            img.removeEventListener("load", onDone);
                            img.removeEventListener("error", onDone);
                            resolve();
                        };
                        img.addEventListener("load", onDone, { once: true });
                        img.addEventListener("error", onDone, { once: true });
                    });
                }));
            };

            await waitForImages(cardRef.current);
            const html2canvas = (await import("html2canvas")).default;
            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: null,
                scale: Math.max(2, window.devicePixelRatio || 1),
                useCORS: true,
                allowTaint: false,
                logging: false,
                imageTimeout: 15000,
                scrollX: 0,
                scrollY: -window.scrollY,
                windowWidth: document.documentElement.clientWidth,
                windowHeight: document.documentElement.clientHeight,
            });
            canvas.toBlob(async (blob) => {
                if (!blob) { toast.error("Could not generate image"); return; }
                try {
                    const file = new File([blob], "agent-card.png", { type: "image/png" });
                    if (navigator.canShare?.({ files: [file] })) {
                        await navigator.share({ files: [file], title: `${profile.fullName} – Digital Card` });
                    } else {
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url; a.download = "agent-card.png"; a.click();
                        URL.revokeObjectURL(url);
                        toast.success("Card downloaded as image");
                    }
                } catch {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url; a.download = "agent-card.png"; a.click();
                    URL.revokeObjectURL(url);
                    toast.success("Card downloaded as image");
                }
            });
        } catch {
            toast.error("Image sharing unavailable");
        }
    };

    const copyPhone = async () => {
        if (!profile.phone || !navigator?.clipboard?.writeText) return;
        await navigator.clipboard.writeText(profile.phone);
        toast.success("Phone number copied");
    };

    const btnBase = {
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        gap: 6, borderRadius: 8, padding: "9px 16px", fontSize: 13,
        fontFamily: "sans-serif", cursor: "pointer", border: "none",
    };

    return (
        <>
            {/* ── trigger strip ── */}
            <div style={{
                marginBottom: 24, borderRadius: 12,
                border: `1px solid ${GOLD}44`,
                background: `linear-gradient(135deg, ${CHARCOAL2}EE, ${CHARCOAL3}CC)`,
                padding: "16px 20px",
            }}>
                <p style={{ margin: "0 0 4px", fontSize: 11, letterSpacing: 2, color: GOLD, textTransform: "uppercase", fontFamily: "sans-serif" }}>
                    Agent Profile
                </p>
                <p style={{ margin: "0 0 14px", fontSize: 13, color: `${OFF_WHITE}99`, fontFamily: "sans-serif" }}>
                    Your personal digital business card
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    <button type="button" onClick={() => setOpen(true)} style={{
                        ...btnBase,
                        background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                        color: CHARCOAL,
                        fontWeight: 600,
                    }}>
                        <UserRound size={14} /> View Digital Card
                    </button>
                   
                </div>
            </div>

            {/* ── modal ── */}
            <Dialog as={Fragment} open={open} onClose={() => setOpen(false)}>
                <div style={{ position: "fixed", inset: 0, zIndex: 50 }}>
                    {/* backdrop */}
                    <div
                        style={{ position: "fixed", inset: 0, background: "rgba(10,10,20,0.75)", backdropFilter: "blur(4px)" }}
                        onClick={() => setOpen(false)}
                    />

                    <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", overflowY: "auto" }}>
                        <div style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 12, position: "relative", zIndex: 1 }}>

                            {/* close */}
                            <button type="button" onClick={() => setOpen(false)} style={{
                                position: "absolute", top: -12, right: -12, zIndex: 10,
                                background: CHARCOAL2, border: `1px solid ${GOLD}44`,
                                borderRadius: "50%", width: 32, height: 32,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: OFF_WHITE, cursor: "pointer",
                            }}>
                                <X size={14} />
                            </button>

                            {/* ── card face (avatar + name + role + email + address + socials + company) ── */}
                            <div ref={cardRef} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                <DigitalCardFace profile={profile} />

                                {/* ── quick-link rows (all contact details) ── */}
                                <div style={{
                                    background: `${CHARCOAL2}F0`,
                                    border: `1px solid ${GOLD}33`,
                                    borderRadius: 14, padding: "10px 12px",
                                    display: "flex", flexDirection: "column", gap: 2,
                                    fontFamily: "sans-serif", fontSize: 13,
                                }}>
                                {profile.phone && (
                                    <a href={`tel:${profile.phone}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 8px", borderRadius: 8, color: OFF_WHITE, textDecoration: "none" }}
                                        onMouseEnter={e => e.currentTarget.style.background = `${GOLD}11`}
                                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                        <span style={{ display: "flex", alignItems: "center", gap: 8 }}><Phone size={13} color={GOLD} /> {profile.phone}</span>
                                        <ExternalLink size={12} color={GOLD} />
                                    </a>
                                )}
                                {profile.email && (
                                    <a href={`mailto:${profile.email}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 8px", borderRadius: 8, color: OFF_WHITE, textDecoration: "none" }}
                                        onMouseEnter={e => e.currentTarget.style.background = `${GOLD}11`}
                                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                        <span style={{ display: "flex", alignItems: "center", gap: 8 }}><Mail size={13} color={GOLD} /> {profile.email}</span>
                                        <ExternalLink size={12} color={GOLD} />
                                    </a>
                                )}
                                {profile.address && (
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 8px", borderRadius: 8, color: OFF_WHITE }}>
                                        <span style={{ display: "flex", alignItems: "center", gap: 8 }}><MapPin size={13} color={GOLD} /> {profile.address}</span>
                                    </div>
                                )}
                                {profile.officeAddress && (
                                    <div style={{ padding: "8px 8px", borderRadius: 8, color: OFF_WHITE }}>
                                        <span style={{ color: GOLD }}>Office:</span> {profile.officeAddress}
                                    </div>
                                )}
                                {profile.focusLocations?.length > 0 && (
                                    <div style={{ padding: "8px 8px", borderRadius: 8, color: OFF_WHITE }}>
                                        <span style={{ color: GOLD }}>Focus Locations:</span> {profile.focusLocations.join(", ")}
                                    </div>
                                )}
                                {profile.topCategories?.length > 0 && (
                                    <div style={{ padding: "8px 8px", borderRadius: 8, color: OFF_WHITE }}>
                                        <span style={{ color: GOLD }}>Top Categories:</span> {profile.topCategories.join(", ")}
                                    </div>
                                )}
                                </div>
                            </div>

                            {/* ── action buttons ── */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                                <button type="button" onClick={copyPhone} style={{
                                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                    gap: 5, padding: "10px 8px",
                                    background: `${CHARCOAL2}F0`, border: `1px solid ${GOLD}33`,
                                    borderRadius: 10, color: OFF_WHITE, fontSize: 11,
                                    fontFamily: "sans-serif", cursor: "pointer",
                                }}>
                                    <Copy size={15} color={GOLD} />
                                    Copy Phone
                                </button>
                                <button type="button" onClick={shareCard} style={{
                                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                    gap: 5, padding: "10px 8px",
                                    background: `${CHARCOAL2}F0`, border: `1px solid ${GOLD}33`,
                                    borderRadius: 10, color: OFF_WHITE, fontSize: 11,
                                    fontFamily: "sans-serif", cursor: "pointer",
                                }}>
                                    <Share2 size={15} color={GOLD} />
                                    Share Text
                                </button>
                                <button type="button" onClick={shareAsImage} style={{
                                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                    gap: 5, padding: "10px 8px",
                                    background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                                    border: "none", borderRadius: 10,
                                    color: CHARCOAL, fontWeight: 600, fontSize: 11,
                                    fontFamily: "sans-serif", cursor: "pointer",
                                }}>
                                    <UserRound size={15} />
                                    Share Image
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    );
}

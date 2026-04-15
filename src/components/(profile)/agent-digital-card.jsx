"use client";

import { Dialog } from "@headlessui/react";
import { Fragment, useMemo, useRef, useState } from "react";
import {
    Copy, ExternalLink, Mail, Phone, Share2, UserRound, X,
    MapPin, Instagram, Facebook, Linkedin
} from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

// ─── Brand tokens ────────────────────────────────────────────────
const GOLD      = "#B8972E";
const GOLD_LIGHT = "#D4AF5A";
const GOLD_PALE  = "#F0E0A0";
const CHARCOAL  = "#1A1A2E";      // midnight-blue-charcoal
const CHARCOAL2 = "#16213E";
const CHARCOAL3 = "#0F3460";      // midnight blue accent
const OFF_WHITE = "#F8F3E8";
const MUTED     = "rgba(248,243,232,0.6)";

// ─── Helpers ─────────────────────────────────────────────────────
const getInitials = (name = "") =>
    name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "AG";

const getWhatsAppLink = (phone = "") => {
    const d = String(phone).replace(/\D/g, "");
    return d ? `https://wa.me/${d}` : "";
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

// ─── Card face (also used for html2canvas screenshot) ─────────────
function DigitalCardFace({ profile, compact = false }) {
    const initials = getInitials(profile.fullName);
    const sz = compact ? 0.85 : 1;

    return (
        <div style={{
            background: `linear-gradient(160deg, ${CHARCOAL2} 0%, ${CHARCOAL} 55%, ${CHARCOAL3} 100%)`,
            borderRadius: 20,
            padding: compact ? "24px 20px" : "28px 24px",
            color: OFF_WHITE,
            fontFamily: "Georgia, serif",
            position: "relative",
            overflow: "hidden",
            minWidth: compact ? 260 : 340,
        }}>
            {/* corner ornament */}
            <div style={{
                position: "absolute", top: 0, right: 0, width: 120, height: 120,
                background: `radial-gradient(circle at top right, ${GOLD}22 0%, transparent 70%)`,
                pointerEvents: "none",
            }} />
            <div style={{
                position: "absolute", bottom: 0, left: 0, width: 100, height: 100,
                background: `radial-gradient(circle at bottom left, ${CHARCOAL3}88 0%, transparent 70%)`,
                pointerEvents: "none",
            }} />

            {/* logo row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div style={{ fontSize: 11 * sz, letterSpacing: 2, color: GOLD, textTransform: "uppercase", fontFamily: "sans-serif" }}>
                    TRS Property Mall
                </div>
                <div style={{
                    width: 36 * sz, height: 36 * sz, borderRadius: "50%",
                    border: `2px solid ${GOLD}`,
                    background: `${GOLD}22`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11 * sz, fontWeight: 700, color: GOLD, fontFamily: "sans-serif",
                }}>TRS</div>
            </div>

            {/* avatar + name */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 16 }}>
                <div style={{
                    width: 84 * sz, height: 84 * sz, borderRadius: "50%",
                    border: `3px solid ${GOLD}`,
                    background: profile.imageUrl ? "transparent" : `${GOLD}22`,
                    overflow: "hidden",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 26 * sz, fontWeight: 600, color: GOLD, fontFamily: "sans-serif",
                    marginBottom: 12,
                    flexShrink: 0,
                }}>
                    {profile.imageUrl
                        ? <img src={profile.imageUrl} alt="Agent" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : initials}
                </div>

                <p style={{ margin: 0, fontSize: 22 * sz, color: OFF_WHITE, fontStyle: "italic", letterSpacing: 0.5 }}>
                    {profile.fullName}
                </p>

                <div style={{
                    marginTop: 6, padding: "3px 14px",
                    border: `1px solid ${GOLD}`,
                    borderRadius: 20,
                    fontSize: 10 * sz, letterSpacing: 2,
                    color: GOLD, textTransform: "uppercase", fontFamily: "sans-serif",
                }}>
                    {profile.roleName}
                </div>
            </div>

            <GoldDivider />

            {/* contact rows */}
            <div style={{ fontFamily: "sans-serif", fontSize: 12 * sz, display: "flex", flexDirection: "column", gap: 7 }}>
                {profile.phone && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Phone size={13} color={GOLD} />
                        <span style={{ color: MUTED }}>{profile.phone} &nbsp;<span style={{ color: `${GOLD}99`, fontSize: 10 }}>CELL</span></span>
                    </div>
                )}
                {profile.email && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Mail size={13} color={GOLD} />
                        <span style={{ color: MUTED }}>{profile.email}</span>
                    </div>
                )}
                {profile.city && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <MapPin size={13} color={GOLD} />
                        <span style={{ color: MUTED }}>{profile.city}</span>
                    </div>
                )}
            </div>

            {/* social icons */}
            {(profile.instagram || profile.facebook || profile.linkedin) && (
                <>
                    <GoldDivider />
                    <div style={{ display: "flex", justifyContent: "center", gap: 16, fontFamily: "sans-serif" }}>
                        {profile.facebook && (
                            <a href={profile.facebook} target="_blank" rel="noreferrer" style={{ color: GOLD_LIGHT, display: "flex" }}>
                                <Facebook size={16} />
                            </a>
                        )}
                        {profile.instagram && (
                            <a href={profile.instagram} target="_blank" rel="noreferrer" style={{ color: GOLD_LIGHT, display: "flex" }}>
                                <Instagram size={16} />
                            </a>
                        )}
                        {profile.linkedin && (
                            <a href={profile.linkedin} target="_blank" rel="noreferrer" style={{ color: GOLD_LIGHT, display: "flex" }}>
                                <Linkedin size={16} />
                            </a>
                        )}
                    </div>
                </>
            )}

            {/* brokerage footer */}
            <div style={{
                marginTop: 16, borderTop: `1px solid ${GOLD}44`,
                paddingTop: 10, textAlign: "center",
                fontSize: 10 * sz, letterSpacing: 3, color: `${GOLD}BB`,
                textTransform: "uppercase", fontFamily: "sans-serif",
            }}>
                {profile.company}
            </div>
        </div>
    );
}

// ─── Main component ───────────────────────────────────────────────
export default function AgentDigitalCard() {
    const [open, setOpen] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const cardRef = useRef(null);

    const profile = useMemo(() => ({
        fullName:  user?.full_name         || "Agent Name",
        roleName:  user?.designation       || user?.role || "Property Consultant",
        company:   user?.company_name      || "TRS Property Mall",
        city:      user?.city              || "",
        phone:     user?.phone             || "",
        email:     user?.email             || "",
        imageUrl:  user?.profile_image_url || "",
        linkedin:  user?.linkedin_url      || user?.linkedin   || "",
        instagram: user?.instagram_url     || user?.instagram  || "",
        facebook:  user?.facebook_url      || user?.facebook   || "",
    }), [user]);

    // Share as text or use native share API
    const shareCard = async () => {
        const cardText = [
            `🏠 ${profile.fullName}`,
            `${profile.roleName} | ${profile.company}`,
            profile.phone ? `📞 ${profile.phone}` : "",
            profile.email ? `✉️  ${profile.email}` : "",
            profile.city  ? `📍 ${profile.city}`  : "",
            profile.linkedin  ? `🔗 LinkedIn: ${profile.linkedin}`  : "",
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

    // Share as image using html2canvas
    const shareAsImage = async () => {
        try {
            const html2canvas = (await import("html2canvas")).default;
            const canvas = await html2canvas(cardRef.current, { backgroundColor: null, scale: 2 });
            canvas.toBlob(async (blob) => {
                if (!blob) { toast.error("Could not generate image"); return; }
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
                    <button type="button" onClick={shareCard} style={{
                        ...btnBase,
                        background: "transparent",
                        color: GOLD_LIGHT,
                        border: `1px solid ${GOLD}66`,
                    }}>
                        <Share2 size={14} /> Share Card
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

                    <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
                        <div style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 16, position: "relative", zIndex: 1 }}>

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

                            {/* ── card face ── */}
                            <div ref={cardRef}>
                                <DigitalCardFace profile={profile} />
                            </div>

                            {/* ── quick-link rows ── */}
                            <div style={{
                                background: `${CHARCOAL2}F0`,
                                border: `1px solid ${GOLD}33`,
                                borderRadius: 14, padding: "12px 14px",
                                display: "flex", flexDirection: "column", gap: 4,
                                fontFamily: "sans-serif", fontSize: 13,
                            }}>
                                {profile.phone && (
                                    <a href={`tel:${profile.phone}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 8px", borderRadius: 8, color: OFF_WHITE, textDecoration: "none" }}
                                        onMouseEnter={e => e.currentTarget.style.background = `${GOLD}11`}
                                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                        <span style={{ display: "flex", alignItems: "center", gap: 8 }}><Phone size={13} color={GOLD} /> {profile.phone}</span>
                                        <ExternalLink size={12} color={GOLD} />
                                    </a>
                                )}
                                {profile.email && (
                                    <a href={`mailto:${profile.email}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 8px", borderRadius: 8, color: OFF_WHITE, textDecoration: "none" }}
                                        onMouseEnter={e => e.currentTarget.style.background = `${GOLD}11`}
                                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                        <span style={{ display: "flex", alignItems: "center", gap: 8 }}><Mail size={13} color={GOLD} /> {profile.email}</span>
                                        <ExternalLink size={12} color={GOLD} />
                                    </a>
                                )}
                                {getWhatsAppLink(profile.phone) && (
                                    <a href={getWhatsAppLink(profile.phone)} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 8px", borderRadius: 8, color: OFF_WHITE, textDecoration: "none" }}
                                        onMouseEnter={e => e.currentTarget.style.background = `${GOLD}11`}
                                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                        <span style={{ display: "flex", alignItems: "center", gap: 8 }}><WhatsAppIcon /> WhatsApp</span>
                                        <ExternalLink size={12} color={GOLD} />
                                    </a>
                                )}
                                {profile.linkedin && (
                                    <a href={profile.linkedin} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 8px", borderRadius: 8, color: OFF_WHITE, textDecoration: "none" }}
                                        onMouseEnter={e => e.currentTarget.style.background = `${GOLD}11`}
                                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                        <span style={{ display: "flex", alignItems: "center", gap: 8 }}><Linkedin size={13} color={GOLD} /> LinkedIn</span>
                                        <ExternalLink size={12} color={GOLD} />
                                    </a>
                                )}
                                {profile.instagram && (
                                    <a href={profile.instagram} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 8px", borderRadius: 8, color: OFF_WHITE, textDecoration: "none" }}
                                        onMouseEnter={e => e.currentTarget.style.background = `${GOLD}11`}
                                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                        <span style={{ display: "flex", alignItems: "center", gap: 8 }}><Instagram size={13} color={GOLD} /> Instagram</span>
                                        <ExternalLink size={12} color={GOLD} />
                                    </a>
                                )}
                                {profile.facebook && (
                                    <a href={profile.facebook} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 8px", borderRadius: 8, color: OFF_WHITE, textDecoration: "none" }}
                                        onMouseEnter={e => e.currentTarget.style.background = `${GOLD}11`}
                                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                        <span style={{ display: "flex", alignItems: "center", gap: 8 }}><Facebook size={13} color={GOLD} /> Facebook</span>
                                        <ExternalLink size={12} color={GOLD} />
                                    </a>
                                )}
                            </div>

                            {/* ── action buttons ── */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                                <button type="button" onClick={copyPhone} style={{
                                    ...btnBase, flexDirection: "column", gap: 4, padding: "10px 8px",
                                    background: `${CHARCOAL2}F0`, border: `1px solid ${GOLD}33`,
                                    borderRadius: 10, color: OFF_WHITE, fontSize: 11,
                                }}>
                                    <Copy size={15} color={GOLD} />
                                    Copy Phone
                                </button>
                                <button type="button" onClick={shareCard} style={{
                                    ...btnBase, flexDirection: "column", gap: 4, padding: "10px 8px",
                                    background: `${CHARCOAL2}F0`, border: `1px solid ${GOLD}33`,
                                    borderRadius: 10, color: OFF_WHITE, fontSize: 11,
                                }}>
                                    <Share2 size={15} color={GOLD} />
                                    Share Text
                                </button>
                                <button type="button" onClick={shareAsImage} style={{
                                    ...btnBase, flexDirection: "column", gap: 4, padding: "10px 8px",
                                    background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                                    border: "none", borderRadius: 10,
                                    color: CHARCOAL, fontWeight: 600, fontSize: 11,
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
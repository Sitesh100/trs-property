export const AUTH_TOKEN_COOKIE = "auth_token";
export const USER_ROLE_COOKIE = "user_role";

export const normalizeRole = (roleValue) => {
    if (!roleValue) return "";
    return String(roleValue).trim().toLowerCase();
};

export const getRoleBucket = (roleValue) => {
    const role = normalizeRole(roleValue);
    if (role.includes("agent") || role.includes("consultant")) return "agent";
    if (role.includes("builder")) return "builder";
    return "customer";
};

export const setAuthCookies = ({ token, role }) => {
    if (typeof document === "undefined") return;

    const maxAge = 60 * 60 * 24 * 30;
    const secure = typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : "";

    if (token) {
        document.cookie = `${AUTH_TOKEN_COOKIE}=${encodeURIComponent(token)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
    }

    const normalizedRole = normalizeRole(role);
    if (normalizedRole) {
        document.cookie = `${USER_ROLE_COOKIE}=${encodeURIComponent(normalizedRole)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
    }
};

export const clearAuthCookies = () => {
    if (typeof document === "undefined") return;
    document.cookie = `${AUTH_TOKEN_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
    document.cookie = `${USER_ROLE_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
};

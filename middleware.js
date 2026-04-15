import { NextResponse } from "next/server";
import { AUTH_TOKEN_COOKIE, USER_ROLE_COOKIE, getRoleBucket } from "./src/utils/authCookies";

const AGENT_ONLY_PREFIXES = ["/agent"];
const BUILDER_ONLY_PREFIXES = ["/builder/analytics", "/builder"];
const CUSTOMER_ONLY_PREFIXES = [
    "/profile",
    "/post-property",
    "/post-buy-requirement",
    "/my-buy-requirement",
    "/my-property",
    "/property-matches",
    "/property-favourite",
];

const pathMatches = (pathname, prefixes) => {
    return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
};

export function middleware(request) {
    const { pathname } = request.nextUrl;

    const isAgentOnly = pathMatches(pathname, AGENT_ONLY_PREFIXES);
    const isBuilderOnly = pathMatches(pathname, BUILDER_ONLY_PREFIXES);
    const isCustomerOnly = pathMatches(pathname, CUSTOMER_ONLY_PREFIXES);

    if (!isAgentOnly && !isBuilderOnly && !isCustomerOnly) {
        return NextResponse.next();
    }

    const token = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;
    const role = request.cookies.get(USER_ROLE_COOKIE)?.value;

    if (!token || !role) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    const roleBucket = getRoleBucket(role);

    if (isAgentOnly && roleBucket !== "agent") {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (isBuilderOnly && roleBucket !== "builder") {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (isCustomerOnly && roleBucket !== "customer") {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/agent/:path*",
        "/builder-panel/:path*",
        "/builder/:path*",
        "/profile/:path*",
        "/post-property/:path*",
        "/post-buy-requirement/:path*",
        "/my-buy-requirement/:path*",
        "/my-property/:path*",
        "/property-matches/:path*",
        "/property-favourite/:path*",
    ],
};

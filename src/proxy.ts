import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";

/** Edge proxy for locale routing (Next.js `proxy.ts` replaces deprecated `middleware.ts`). */
export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};

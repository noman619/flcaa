import type { NextConfig } from "next";
import { LEGACY_ROUTES } from "./src/lib/legacy-routes";

const nextConfig: NextConfig = {
  /**
   * The original site's course URLs resolve here too, so inbound links and
   * bookmarks keep working. Permanent (308) because these paths are aliases on
   * this domain — the page they name now lives at the target.
   */
  async redirects() {
    return Object.entries(LEGACY_ROUTES).map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
  },
};

export default nextConfig;

import { redirect } from "next/navigation";

import { DEFAULT_PUBLIC_TENANT_SLUG } from "@/lib/leanyou/constants";
import { leanyouLoginPath } from "@/lib/leanyou/paths";

export default function LeanYouLegacyLoginPage() {
  redirect(leanyouLoginPath(DEFAULT_PUBLIC_TENANT_SLUG));
}

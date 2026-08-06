import type { Metadata } from "next";
import { CartView } from "./cart-view";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Your cart",
  robots: { index: false, follow: false },
};

export default async function CartPage({
  searchParams,
}: {
  searchParams: Promise<{ canceled?: string }>;
}) {
  const [{ canceled }, user] = await Promise.all([searchParams, getCurrentUser()]);

  return (
    <div className="container-page py-12 lg:py-16">
      <h1 className="font-display text-3xl lg:text-4xl">Your cart</h1>
      <p className="mt-2 text-sm text-ink-500">
        Courses are added to your account the moment payment clears.
      </p>
      <div className="mt-10">
        <CartView
          isAuthed={Boolean(user)}
          canceled={Boolean(canceled)}
          email={user?.email ?? ""}
          emailOptIn={user?.profile?.email_opt_in ?? true}
        />
      </div>
    </div>
  );
}

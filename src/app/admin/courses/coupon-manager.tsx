"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { upsertCoupon, type AdminState } from "@/app/admin/admin-actions";
import { formatPrice } from "@/lib/utils";
import type { Coupon } from "@/lib/database.types";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : null}
      Save coupon
    </Button>
  );
}

export function CouponManager({ coupons }: { coupons: Coupon[] }) {
  const [state, formAction] = useActionState<AdminState, FormData>(
    upsertCoupon,
    {},
  );

  return (
    <section className="rounded-card border border-ink-200 bg-white p-6">
      <h2 className="flex items-center gap-2 font-display text-lg">
        <Tag className="size-4 text-ink-400" aria-hidden />
        Coupon codes
      </h2>
      <p className="mt-1.5 text-sm text-ink-500">
        Codes are matched case-insensitively at checkout. Set either a percentage
        or a fixed amount off — not both.
      </p>

      {coupons.length ? (
        <ul className="mt-5 flex flex-wrap gap-2">
          {coupons.map((coupon) => (
            <li key={coupon.code}>
              <Badge variant={coupon.active ? "success" : "neutral"}>
                {coupon.code} —{" "}
                {coupon.percent_off
                  ? `${coupon.percent_off}% off`
                  : formatPrice(coupon.amount_off_cents ?? 0) + " off"}
                {coupon.active ? "" : " (inactive)"}
              </Badge>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-5 text-sm text-ink-400">No coupons created yet.</p>
      )}

      <form action={formAction} className="mt-6 space-y-4">
        {state.error ? <Alert tone="error">{state.error}</Alert> : null}
        {state.notice ? <Alert tone="success">{state.notice}</Alert> : null}

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Code" htmlFor="code" required>
            <Input id="code" name="code" placeholder="SAVE20" required />
          </Field>
          <Field label="Percent off" htmlFor="percentOff" hint="0–100">
            <Input
              id="percentOff"
              name="percentOff"
              type="number"
              min={0}
              max={100}
              defaultValue={0}
            />
          </Field>
          <Field label="Amount off (cents)" htmlFor="amountOffCents" hint="e.g. 2500 = $25">
            <Input
              id="amountOffCents"
              name="amountOffCents"
              type="number"
              min={0}
              defaultValue={0}
            />
          </Field>
        </div>

        <label className="flex items-center gap-2.5 text-sm text-ink-700">
          <input
            type="checkbox"
            name="active"
            defaultChecked
            className="size-4 rounded border-ink-300 text-brand-700 focus:ring-brand-500"
          />
          Active
        </label>

        <Submit />
      </form>
    </section>
  );
}

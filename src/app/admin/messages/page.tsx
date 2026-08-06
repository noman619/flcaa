import { createClient } from "@/lib/supabase/server";
import { ContactInbox } from "./contact-inbox";
import type { ContactMessage } from "@/lib/database.types";

export default async function AdminMessagesPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  const messages = (data ?? []) as ContactMessage[];
  const openCount = messages.filter((m) => !m.handled).length;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl">Contact inbox</h1>
        <p className="mt-1.5 text-sm text-ink-500">
          {openCount} unhandled of {messages.length} total. Replies go out by email
          — mark a message handled once you have answered it.
        </p>
      </header>

      <ContactInbox messages={messages} />
    </div>
  );
}

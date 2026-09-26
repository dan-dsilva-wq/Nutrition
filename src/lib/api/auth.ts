import type { User } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type SignedInResult =
  | { user: User | null; error: null }
  | { user: null; error: NextResponse };

// Resolves the signed-in user. When Supabase isn't configured (local demo
// mode) there is no auth to enforce, so it returns no user and no error.
export async function getSignedInUser(): Promise<SignedInResult> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return { user: null, error: null };
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      user: null,
      error: NextResponse.json(
        { error: "Sign in to use this feature." },
        { status: 401 },
      ),
    };
  }

  return { user, error: null };
}

export async function requireSignedInUser() {
  return (await getSignedInUser()).error;
}

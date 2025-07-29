import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/supabase/client';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ success: false, message: "No user ID provided" }, { status: 400 });
    }

    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) {
      console.error("Supabase Admin Delete Error:", error);
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("API Route Exception:", e);
    return NextResponse.json({ success: false, message: e.message || "Unknown error" }, { status: 500 });
  }
}

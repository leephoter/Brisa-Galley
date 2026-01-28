import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(_request: NextRequest) {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

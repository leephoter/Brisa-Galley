import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(_request: NextRequest) {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('archives')
    .select('*')
    .order('year', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const body = await request.json()

  const { data: { user } } = await supabase.auth.getUser()

  // Prepare data for insertion
  const insertData: {
    season: string;
    year: number;
    title: string;
    description: string;
    slug: string;
    image_order: string[];
    created_by: string | undefined;
    is_published: boolean;
    label?: string;
  } = {
    season: body.season,
    year: body.year,
    title: body.title,
    description: body.description,
    slug: body.slug,
    image_order: body.image_order,
    created_by: user?.id,
    is_published: body.is_published !== undefined ? body.is_published : true
  }

  // Add label only if it exists (for backwards compatibility)
  if (body.label !== undefined && body.label !== null) {
    insertData.label = body.label
  }

  const { data, error } = await supabase
    .from('archives')
    .insert(insertData)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data }, { status: 201 })
}

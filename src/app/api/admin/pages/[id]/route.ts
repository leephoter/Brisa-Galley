import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()
  const body = await request.json()

  const updateData: {
    title: string;
    label: string;
    description: string;
    slug: string;
    content: string;
    is_published: boolean;
    updated_at: string;
  } = {
    title: body.title,
    label: body.label,
    description: body.description,
    slug: body.slug,
    content: body.content,
    is_published: body.is_published,
    updated_at: new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('pages')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('archives')
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

  const { data, error } = await supabase
    .from('archives')
    .update({
      ...body,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()

  // First get the archive to find images
  const { data: archive } = await supabase
    .from('archives')
    .select('image_order')
    .eq('id', id)
    .single()

  // Delete images from storage if they exist
  if (archive?.image_order && Array.isArray(archive.image_order)) {
    const imagePaths = archive.image_order.map((url: string) => {
      try {
        const urlObj = new URL(url)
        return urlObj.pathname.split('/').slice(-2).join('/')
      } catch {
        return null
      }
    }).filter(Boolean)

    if (imagePaths.length > 0) {
      await supabase.storage
        .from('archive-images')
        .remove(imagePaths as string[])
    }
  }

  const { error } = await supabase
    .from('archives')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

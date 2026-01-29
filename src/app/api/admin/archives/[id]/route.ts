import { STORAGE, TABLES, COLUMNS } from '@/lib/data';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from(TABLES.ARCHIVES)
    .select('*')
    .eq(COLUMNS.ARCHIVES.ID, id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const body = await request.json();

  // Prepare data for update
  const updateData: {
    season: string;
    year: number;
    title: string;
    description: string;
    slug: string;
    image_order: string[];
    is_published: boolean;
    updated_at: string;
    label?: string;
  } = {
    season: body.season,
    year: body.year,
    title: body.title,
    description: body.description,
    slug: body.slug,
    image_order: body.image_order,
    is_published: body.is_published,
    updated_at: new Date().toISOString(),
  };

  // Add label only if it exists (for backwards compatibility)
  if (body.label !== undefined && body.label !== null) {
    updateData.label = body.label;
  }

  const { data, error } = await supabase
    .from(TABLES.ARCHIVES)
    .update(updateData)
    .eq(COLUMNS.ARCHIVES.ID, id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  // First get the archive to find images
  const { data: archive } = await supabase
    .from(TABLES.ARCHIVES)
    .select(COLUMNS.ARCHIVES.IMAGE_ORDER)
    .eq(COLUMNS.ARCHIVES.ID, id)
    .single();

  // Delete images from storage if they exist
  if (archive?.image_order && Array.isArray(archive.image_order)) {
    const imagePaths = archive.image_order
      .map((url: string) => {
        try {
          const urlObj = new URL(url);
          return urlObj.pathname.split('/').slice(-2).join('/');
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    if (imagePaths.length > 0) {
      await supabase.storage.from(STORAGE.BUCKET_NAME).remove(imagePaths as string[]);
    }
  }

  const { error } = await supabase.from(TABLES.ARCHIVES).delete().eq(COLUMNS.ARCHIVES.ID, id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

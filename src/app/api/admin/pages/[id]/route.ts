import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { TABLES, COLUMNS } from '@/lib/data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from(TABLES.PAGES)
      .select('*')
      .eq(COLUMNS.PAGES.ID, id)
      .single();

    if (error) throw error;

    // Parse JSON content if it exists
    const page = {
      ...data,
      content:
        typeof data.content === 'string' && data.content
          ? JSON.parse(data.content)
          : data.content,
    };

    return NextResponse.json({ data: page });
  } catch (error) {
    console.error('Failed to fetch page:', error);
    return NextResponse.json({ error: 'Failed to fetch page' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();
    const body = await request.json();

    const { content, ...rest } = body;

    const updateData = {
      ...rest,
      [COLUMNS.PAGES.CONTENT]: content ? JSON.stringify(content) : null,
      [COLUMNS.PAGES.UPDATED_AT]: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from(TABLES.PAGES)
      .update(updateData)
      .eq(COLUMNS.PAGES.ID, id)
      .select()
      .single();

    if (error) throw error;

    // Parse JSON content in response
    const page = {
      ...data,
      content:
        typeof data.content === 'string' && data.content
          ? JSON.parse(data.content)
          : data.content,
    };

    return NextResponse.json({ data: page });
  } catch (error) {
    console.error('Failed to update page:', error);
    return NextResponse.json({ error: 'Failed to update page' }, { status: 500 });
  }
}

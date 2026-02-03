import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { TABLES, COLUMNS } from '@/lib/data';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from(TABLES.PAGES)
      .select('*')
      .order(COLUMNS.PAGES.DISPLAY_ORDER, { ascending: true });

    if (error) throw error;

    // Parse JSON content if it exists
    const pages = (data || []).map((page) => ({
      ...page,
      content:
        typeof page.content === 'string' && page.content
          ? JSON.parse(page.content)
          : page.content,
    }));

    return NextResponse.json({ data: pages });
  } catch (error) {
    console.error('Failed to fetch pages:', error);
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const body = await request.json();

    const { content, ...rest } = body;

    const { data, error } = await supabase
      .from(TABLES.PAGES)
      .insert({
        ...rest,
        [COLUMNS.PAGES.CONTENT]: content ? JSON.stringify(content) : null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('Failed to create page:', error);
    return NextResponse.json({ error: 'Failed to create page' }, { status: 500 });
  }
}

import { createClient } from '@/lib/supabase/client';
import { Archive } from '@/types';
import { archives as staticArchives } from '@/lib/data';

export async function getArchives(): Promise<Archive[]> {
  try {
    const supabase = createClient();

    // Try with display_order first
    let { data, error } = await supabase
      .from('archives')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true })
      .order('year', { ascending: false });

    // If display_order column doesn't exist, fallback to year only
    if (error && error.message.includes('display_order')) {
      console.log('display_order column not found, using year sorting');
      const fallback = await supabase
        .from('archives')
        .select('*')
        .eq('is_published', true)
        .order('year', { ascending: false })
        .order('created_at', { ascending: false });

      data = fallback.data;
      error = fallback.error;
    }

    if (error) throw error;
    if (!data) return staticArchives;

    // Supabase data to Archive type conversion
    return data.map((archive) => ({
      id: archive.id,
      season: archive.season,
      year: archive.year,
      title: archive.title,
      label: archive.label,
      description: archive.description,
      slug: archive.slug,
      images: archive.image_order || [],
      display_order: archive.display_order,
    }));
  } catch (error) {
    console.error('Failed to fetch from Supabase, using static data:', error);
    // Fallback to static data
    return staticArchives;
  }
}

export async function getArchiveBySlug(slug: string): Promise<Archive | null> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('archives')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Archive not found');

    return {
      id: data.id,
      season: data.season,
      year: data.year,
      title: data.title,
      label: data.label,
      description: data.description,
      slug: data.slug,
      images: data.image_order || [],
    };
  } catch (error) {
    console.error('Failed to fetch from Supabase, using static data:', error);
    // Fallback to static data
    return staticArchives.find((a) => a.slug === slug) || null;
  }
}

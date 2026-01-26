import { createClient } from '@/lib/supabase/client'
import { Archive } from '@/types'
import { archives as staticArchives } from '@/lib/data'

export async function getArchives(): Promise<Archive[]> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('archives')
      .select('*')
      .eq('is_published', true)
      .order('year', { ascending: false })

    if (error) throw error

    // Supabase data to Archive type conversion
    return data.map(archive => ({
      id: archive.id,
      season: archive.season,
      year: archive.year,
      title: archive.title,
      description: archive.description,
      slug: archive.slug,
      images: archive.image_order || []
    }))
  } catch (error) {
    console.error('Failed to fetch from Supabase, using static data:', error)
    // Fallback to static data
    return staticArchives
  }
}

export async function getArchiveBySlug(slug: string): Promise<Archive | null> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('archives')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()

    if (error) throw error

    return {
      id: data.id,
      season: data.season,
      year: data.year,
      title: data.title,
      description: data.description,
      slug: data.slug,
      images: data.image_order || []
    }
  } catch (error) {
    console.error('Failed to fetch from Supabase, using static data:', error)
    // Fallback to static data
    return staticArchives.find(a => a.slug === slug) || null
  }
}

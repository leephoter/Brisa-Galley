import { createClient } from '@/lib/supabase/client'
import { Page } from '@/types'
import { TABLES, COLUMNS } from '@/lib/data'

export async function getPages(): Promise<Page[]> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from(TABLES.PAGES)
      .select('*')
      .eq(COLUMNS.PAGES.IS_PUBLISHED, true)
      .order(COLUMNS.PAGES.DISPLAY_ORDER, { ascending: true })

    if (error) throw error

    // Parse JSON content if it exists
    return (data || []).map(page => ({
      ...page,
      content: typeof page.content === 'string' && page.content ? JSON.parse(page.content) : page.content
    }))
  } catch (error) {
    console.error('Failed to fetch pages:', error)
    // Fallback to default data
    return [
      { id: '1', page_key: 'place', title: 'PLACE', label: 'PLACE', slug: 'place', display_order: 1 },
      { id: '2', page_key: 'news', title: 'NEWS', label: 'NEWS', slug: 'news', display_order: 2 },
      { id: '3', page_key: 'call', title: 'CALL', label: 'CALL', slug: 'call', display_order: 3 }
    ]
  }
}

export async function getPageByKey(pageKey: string): Promise<Page | null> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from(TABLES.PAGES)
      .select('*')
      .eq(COLUMNS.PAGES.PAGE_KEY, pageKey)
      .eq(COLUMNS.PAGES.IS_PUBLISHED, true)
      .maybeSingle()

    if (error) throw error

    if (!data) return null

    // Parse JSON content if it exists
    return {
      ...data,
      content: typeof data.content === 'string' && data.content ? JSON.parse(data.content) : data.content
    }
  } catch (error) {
    console.error('Failed to fetch page:', error)
    return null
  }
}

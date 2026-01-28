import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const body = await request.json()

  const { orderedIds } = body as { orderedIds: string[] }

  if (!orderedIds || !Array.isArray(orderedIds)) {
    return NextResponse.json({ error: 'Invalid orderedIds' }, { status: 400 })
  }

  try {
    // Update display_order for each archive
    const updates = orderedIds.map(async (id, index) => {
      const { error } = await supabase
        .from('archives')
        .update({ display_order: index })
        .eq('id', id)

      if (error) {
        console.error(`Failed to update ${id}:`, error)
        throw error
      }
      return { id, index }
    })

    const results = await Promise.all(updates)
    console.log('Reorder successful:', results)

    return NextResponse.json({ success: true, updated: results.length })
  } catch (error: unknown) {
    console.error('Reorder error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to reorder archives'
    return NextResponse.json({
      error: errorMessage,
    }, { status: 500 })
  }
}

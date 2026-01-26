import { createClient } from '@supabase/supabase-js'
import { archives } from '../src/lib/data'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials. Please check your .env.local file.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function migrateArchives() {
  console.log('🚀 Starting archive migration...\n')

  for (const archive of archives) {
    console.log(`Migrating: ${archive.title}...`)

    const { error } = await supabase
      .from('archives')
      .insert({
        season: archive.season,
        year: archive.year,
        title: archive.title,
        description: archive.description,
        slug: archive.slug,
        image_order: archive.images,
        is_published: true
      })

    if (error) {
      console.error(`  ❌ Failed: ${error.message}`)
    } else {
      console.log(`  ✅ Success`)
    }
  }

  console.log('\n✨ Migration complete!')
}

migrateArchives()

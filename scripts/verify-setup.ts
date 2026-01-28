import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

console.log('\n🔍 Verifying Admin System Setup...\n')

let hasErrors = false

// Check environment variables
console.log('1️⃣ Checking environment variables...')
if (!supabaseUrl || supabaseUrl.includes('your-project')) {
  console.log('   ❌ NEXT_PUBLIC_SUPABASE_URL not configured')
  hasErrors = true
} else {
  console.log('   ✅ NEXT_PUBLIC_SUPABASE_URL configured')
}

if (!supabaseServiceKey || supabaseServiceKey.includes('your-service-role-key')) {
  console.log('   ❌ SUPABASE_SERVICE_KEY not configured')
  hasErrors = true
} else {
  console.log('   ✅ SUPABASE_SERVICE_KEY configured')
}

if (hasErrors) {
  console.log('\n❌ Please configure your .env.local file with Supabase credentials')
  console.log('   See ADMIN_SETUP.md for instructions\n')
  process.exit(1)
}

const supabase = createClient(supabaseUrl!, supabaseServiceKey!)

// Check database connection
console.log('\n2️⃣ Checking database connection...')
try {
  const { error } = await supabase.from('archives').select('count', { count: 'exact', head: true })
  if (error) throw error
  console.log('   ✅ Database connection successful')
} catch (error) {
  console.log('   ❌ Database connection failed:', error)
  hasErrors = true
}

// Check archives table
console.log('\n3️⃣ Checking archives table...')
try {
  const { count, error: countError } = await supabase
    .from('archives')
    .select('*', { count: 'exact', head: true })

  if (countError) throw countError

  // Check if display_order and label columns exist
  const { data: sampleData, error: sampleError } = await supabase
    .from('archives')
    .select('id, title, display_order, label')
    .limit(1)

  if (sampleError) throw sampleError

  console.log('   ✅ Archives table exists')
  console.log(`   ℹ️  Found ${count || 0} archives`)

  // Verify columns
  if (sampleData && sampleData.length > 0) {
    const hasDisplayOrder = 'display_order' in sampleData[0]
    const hasLabel = 'label' in sampleData[0]

    if (hasDisplayOrder) {
      console.log('   ✅ display_order column exists')
    } else {
      console.log('   ⚠️  display_order column missing (drag & drop won\'t work)')
      console.log('   💡 Run: ALTER TABLE archives ADD COLUMN display_order INTEGER DEFAULT 0;')
    }

    if (hasLabel) {
      console.log('   ✅ label column exists')
    } else {
      console.log('   ⚠️  label column missing (custom menu labels won\'t work)')
      console.log('   💡 Run: ALTER TABLE archives ADD COLUMN label VARCHAR(200);')
    }
  }
} catch (error) {
  console.log('   ❌ Archives table not found or inaccessible')
  console.log('   💡 Run scripts/supabase-setup.sql in Supabase SQL Editor')
  hasErrors = true
}

// Check pages table
console.log('\n4️⃣ Checking pages table...')
try {
  const { data, error } = await supabase
    .from('pages')
    .select('page_key, title, label, slug, is_published')
    .order('display_order', { ascending: true })

  if (error) throw error
  console.log('   ✅ Pages table exists')
  console.log(`   ℹ️  Found ${data?.length || 0} pages`)

  if (data && data.length > 0) {
    console.log('   📋 Pages:')
    data.forEach(page => {
      const status = page.is_published ? '✅' : '❌'
      console.log(`      ${status} ${page.page_key.toUpperCase()}: ${page.label || page.title} (/${page.slug})`)
    })
  } else {
    console.log('   ⚠️  No pages found')
    console.log('   💡 Default pages should be created. Run scripts/supabase-setup.sql')
  }
} catch (error) {
  console.log('   ❌ Pages table not found or inaccessible')
  console.log('   💡 Run scripts/supabase-setup.sql in Supabase SQL Editor')
  hasErrors = true
}

// Check admin_users table
console.log('\n5️⃣ Checking admin_users table...')
try {
  const { data, error } = await supabase.from('admin_users').select('*')
  if (error) throw error
  console.log('   ✅ Admin users table exists')
  console.log(`   ℹ️  Found ${data?.length || 0} admin users`)

  if (data && data.length === 0) {
    console.log('   ⚠️  No admin users found')
    console.log('   💡 Create an admin user in Supabase Auth and add to admin_users table')
  } else if (data) {
    console.log('   📋 Admin users:')
    data.forEach(user => {
      console.log(`      - ${user.email} (${user.role})`)
    })
  }
} catch (error) {
  console.log('   ❌ Admin users table not found or inaccessible')
  console.log('   💡 Run scripts/supabase-setup.sql in Supabase SQL Editor')
  hasErrors = true
}

// Check storage bucket
console.log('\n6️⃣ Checking storage bucket...')
try {
  const { data, error } = await supabase.storage.getBucket('archive-images')
  if (error) throw error
  console.log('   ✅ Storage bucket "archive-images" exists')
  console.log(`   ℹ️  Public: ${data?.public ? 'Yes' : 'No'}`)

  if (!data?.public) {
    console.log('   ⚠️  Bucket should be public for images to be accessible')
  }
} catch (error) {
  console.log('   ❌ Storage bucket "archive-images" not found')
  console.log('   💡 Create bucket in Supabase Storage section')
  hasErrors = true
}

// Check RLS policies
console.log('\n7️⃣ Checking Row Level Security policies...')
try {
  // Try to access archives as public
  const { error: archivesError } = await supabase
    .from('archives')
    .select('*')
    .eq('is_published', true)
    .limit(1)

  if (archivesError) throw archivesError

  // Try to access pages as public
  const { error: pagesError } = await supabase
    .from('pages')
    .select('*')
    .eq('is_published', true)
    .limit(1)

  if (pagesError) throw pagesError

  console.log('   ✅ RLS policies appear to be working')
} catch (error) {
  console.log('   ⚠️  Could not verify RLS policies')
  console.log('   💡 Make sure RLS policies are set up in Supabase')
}

// Summary
console.log('\n' + '='.repeat(50))
if (hasErrors) {
  console.log('❌ Setup verification FAILED')
  console.log('\nPlease fix the issues above and run this script again.')
  console.log('See scripts/SUPABASE_SETUP_GUIDE.md for detailed instructions.\n')
  process.exit(1)
} else {
  console.log('✅ Setup verification PASSED')
  console.log('\nYour admin system is ready to use!')
  console.log('Start the dev server: bun run dev')
  console.log('Then visit: http://localhost:3000/login\n')
}

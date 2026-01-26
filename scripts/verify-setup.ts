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
  const { data, error } = await supabase.from('archives').select('*').limit(1)
  if (error) throw error
  console.log('   ✅ Archives table exists')
  console.log(`   ℹ️  Found ${data?.length || 0} archives`)
} catch (error) {
  console.log('   ❌ Archives table not found or inaccessible')
  console.log('   💡 Run scripts/supabase-setup.sql in Supabase SQL Editor')
  hasErrors = true
}

// Check admin_users table
console.log('\n4️⃣ Checking admin_users table...')
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
console.log('\n5️⃣ Checking storage bucket...')
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
console.log('\n6️⃣ Checking Row Level Security policies...')
try {
  // Try to access archives as public
  const { error } = await supabase
    .from('archives')
    .select('*')
    .eq('is_published', true)
    .limit(1)

  if (error) throw error
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
  console.log('See ADMIN_SETUP.md for detailed instructions.\n')
  process.exit(1)
} else {
  console.log('✅ Setup verification PASSED')
  console.log('\nYour admin system is ready to use!')
  console.log('Start the dev server: bun run dev')
  console.log('Then visit: http://localhost:3000/admin/login\n')
}

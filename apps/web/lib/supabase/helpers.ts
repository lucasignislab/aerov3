// apps/web/lib/supabase/helpers.ts
import { createClient } from './client'

export async function ensureUserExists() {
  const supabase = createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  console.log('🔐 Auth user:', { user: user?.id, email: user?.email, authError })
  
  if (!user) {
    console.error('❌ No authenticated user found')
    return null
  }

  // Check if user exists in our users table
  const { data: existingUser, error: selectError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  console.log('👤 Existing user check:', { existingUser, selectError })

  // If not, create it
  if (!existingUser) {
    console.log('📝 Creating new user in users table...')
    
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        id: user.id,
        email: user.email,
        display_name: user.user_metadata?.full_name || user.email?.split('@')[0],
        role: 'owner',
      })
      .select()
      .single()

    console.log('📝 Insert result:', { newUser, insertError })

    if (insertError) {
      console.error('❌ Failed to create user:', insertError)
      console.error('❌ Insert error details:', {
        message: insertError.message,
        code: insertError.code,
        details: insertError.details,
        hint: insertError.hint
      })
      // Don't return null - the user might still exist even if we can't insert
      // This can happen with RLS policies
    }
  }

  return user
}

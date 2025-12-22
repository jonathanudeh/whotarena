import { serve } from 'https://deno.land/std/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") // IMPORTANT
)

const WAIT_TIME_SECONDS = 8 // tweak later

serve(async () => {
  const cutoff = new Date(Date.now() - WAIT_TIME_SECONDS * 1000).toISOString()

  // 1. Find waiting matches that have waited long enough
  const { data: matches, error } = await supabase
    .from('matches')
    .select('id, maxPlayers')
    .eq('status', 'waiting')
    .lt('created_at', cutoff)

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }

  for (const match of matches ?? []) {
    await maybeAddAIPlayers(match.id, match.maxPlayers)
  }

  return new Response(JSON.stringify({ ok: true }))
})



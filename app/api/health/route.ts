import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
export const dynamic='force-dynamic'
export async function GET(){try{const supabase=await createClient();const {error}=await supabase.from('categories').select('id').limit(1);return NextResponse.json({ok:!error,database:!error,auth:true,error:error?.message??null},{status:error?503:200})}catch(e){return NextResponse.json({ok:false,error:e instanceof Error?e.message:'Health check failed'},{status:503})}}

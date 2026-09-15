import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔄 Connecting to Supabase...');
  try {
    const { data, error } = await supabase.from('products').select('*').limit(1);
    
    if (error) {
      console.error('❌ Connection Failed!', error.message);
    } else {
      console.log('✅ CONNECTION SUCCESSFUL! 🚀');
      console.log('📊 Your AutoZonIndia React App is fully linked to your Supabase database!');
      console.log('--------------------------------------------------');
      console.log(`📡 Pinged Database: ${supabaseUrl}`);
      console.log(`🗄️ Tables Checked: products`);
      console.log('--------------------------------------------------');
    }
  } catch (err) {
    console.error('❌ Unexpected Error:', err.message);
  }
}

testConnection();

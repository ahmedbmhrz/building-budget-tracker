const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

supabase.storage.createBucket('receipts', { public: true })
  .then(res => console.log('Bucket created:', res))
  .catch(err => console.error('Error:', err));

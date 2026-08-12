require('dotenv').config();

console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log(
    'KEY EXISTS:',
    !!process.env.SUPABASE_SERVICE_ROLE_KEY
);

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function test() {
    const { data, error } = await supabase
        .from('devices')
        .select('*')
        .limit(1);

    console.log('DATA:', data);
    console.log('ERROR:', error);
}

test();
const { Client } = require('pg');
const regions = ['eu-central-1', 'eu-west-1', 'eu-west-2', 'eu-west-3', 'us-east-1', 'us-west-1', 'ap-southeast-1'];
(async () => {
  for (const region of regions) {
    const host = `aws-0-${region}.pooler.supabase.com`;
    const client = new Client({
      host,
      port: 6543,
      user: 'postgres.bepojjxgbpfodwzhohfn',
      password: 'Renas1232acar',
      database: 'postgres',
      ssl: { rejectUnauthorized: false }
    });
    try {
      await client.connect();
      console.log('SUCCESS: ' + region);
      await client.end();
      process.exit(0);
    } catch (e) {
      if (e.message.includes('Tenant or user not found')) {
        // wrong region
      } else {
        console.log('ERROR on ' + region + ': ' + e.message);
      }
    }
  }
  console.log('FAILED ALL');
})();

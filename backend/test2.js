const { Client } = require('pg');
const regions = [
  'eu-central-1', 'eu-west-1', 'eu-west-2', 'eu-west-3', 
  'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
  'ap-southeast-1', 'ap-northeast-1', 'sa-east-1'
];
(async () => {
  for (const region of regions) {
    const client = new Client({
      host: `aws-0-${region}.pooler.supabase.com`,
      port: 6543,
      user: 'postgres.bepojjxgbpfodwzhohfn',
      password: 'Renas1232acar',
      database: 'postgres',
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000 // Don't hang forever
    });
    try {
      await client.connect();
      console.log('SUCCESS: ' + region);
      process.exit(0);
    } catch (e) {
      console.log('ERROR ' + region + ': ' + e.message);
    }
  }
})();

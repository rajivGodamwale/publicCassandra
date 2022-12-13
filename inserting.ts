const cassandra = require('cassandra-driver');

const { randomUUID, randomBytes } = require('node:crypto');

const client = new cassandra.Client({
  contactPoints: ['localhost'],
  localDataCenter: 'datacenter1',
  keyspace: 'test',
});

async function main() {
  const queries = Array.from({ length: 10 }, () => ({
    query: 'INSERT INTO test.test_table (id, value) VALUES (?, ?)',
    params: [randomUUID(), randomBytes(32).toString('base64')],
  }));

  console.log({ queries });

  await client.batch(queries, { prepare: true });

  const records = await client.execute('select * from test.test_table');

  console.log(records.rows);
}

main();


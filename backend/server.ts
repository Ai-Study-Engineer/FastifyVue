import Fastify from 'fastify';
import path from 'path';
import fastifyStatic from '@fastify/static';
import { questionList } from './sqlQuestions';
import { answerList } from './sqlAnswers';
import { userDB, productsDB } from './utils/db';

const fastify = Fastify({ logger: true });

fastify.register(fastifyStatic, {
  root: path.join(__dirname, '../frontend'),
  prefix: '/',
});

fastify.get('/api/questions', async () => {
  return questionList;
});

fastify.get('/api/answers', async () => {
  return answerList;
});

fastify.post('/api/execute', async (request, reply) => {
    try {
      const { query } = request.body as { query: string };
      const stmt = productsDB.prepare(query);
      const rows = stmt.all() as Record<string, any>[];
  
      const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
  
      return { rows, columns };
    } catch (err) {
      reply.status(400).send({ error: String(err) });
    }
  });

fastify.get('/api/table/:DB', async (request, reply) => {
try {
    const { DB } = request.params as { DB: string };    
    const query = `SELECT * FROM ${DB};`;
    const stmt = productsDB.prepare(query);
    const allRows = stmt.all() as Record<string, any>[];

    const allColumns = allRows.length > 0 ? Object.keys(allRows[0]) : [];

    return { allRows, allColumns };
} catch (err) {
    reply.status(400).send({ error: String(err) });
}
});

fastify.listen({ port: 3000 }, (err) => {
  if (err) throw err;
  console.log('Server listening on http://localhost:3000');
});

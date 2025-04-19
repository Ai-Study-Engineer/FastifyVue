import Fastify from 'fastify';
import path from 'path';
import fastifyStatic from '@fastify/static';
import { questionList } from './sqlQuestions';
import { answerList } from './sqlAnswers';
import { usersDB, productsDB } from './utils/db';

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
      const { query, index } = request.body as { query: string, index: string };
      const DB = questionList[Number(index)].DB;    
      const stmt = DB.prepare(query);
      const rows = stmt.all() as Record<string, any>[];
  
      const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
  
      return { rows, columns };
    } catch (err) {
      reply.status(400).send({ error: String(err) });
    }
  });

fastify.get('/api/table/:index', async (request, reply) => {
try {
    const { index } = request.params as { index: string };    
    const DB = questionList[Number(index)].DB;
    const query = `SELECT * FROM ${DB.toString()};`;
    const stmt = DB.prepare(query);
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

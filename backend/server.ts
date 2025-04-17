import Fastify from 'fastify';
import path from 'path';
import fastifyStatic from '@fastify/static';
import { questionList } from './sqlQuestions';

const fastify = Fastify({ logger: true });

fastify.register(fastifyStatic, {
  root: path.join(__dirname, '../frontend'),
  prefix: '/',
});

fastify.get('/api/questions', async () => {
  return questionList;
});

fastify.listen({ port: 3000 }, (err) => {
  if (err) throw err;
  console.log('Server listening on http://localhost:3000');
});

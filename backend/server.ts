import Fastify from 'fastify';
import path from 'path';
import fastifyStatic from '@fastify/static';
import { questionList } from './sqlQuestions';
import { answerList } from './sqlAnswers';
import { usersDB, productsDB } from './utils/db';
import dotenv   from 'dotenv'

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

dotenv.config()
const apiKey = process.env.OPENAI_API_KEY;

fastify.post('/api/ask', async (request, reply) => {
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'user', content: 'Write a one-sentence bedtime story about a unicorn.' }
        ]
      })
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('OpenAI API error:', errText)
      return reply.status(500).send({ error: 'OpenAI API request failed' })
    }

    const data = await res.json()
    const aiAnswer = data.choices[0].message.content.trim()
    return reply.send({ aiAnswer: aiAnswer })
  } catch (err) {
    console.error('Error:', err)
    return reply.status(500).send({ error: 'Internal server error' })
  }
})

fastify.listen({ port: 3000 }, (err) => {
  if (err) throw err;
  console.log('Server listening on http://localhost:3000');
});

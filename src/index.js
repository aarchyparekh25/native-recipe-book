import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { typeDefs } from './graphql/schema.js';
import { connectDB } from './db.js';
import { resolvers } from './graphql/resolvers.js';
import jwt from 'jsonwebtoken';

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

async function bootstrap() {
  await connectDB(process.env.MONGODB_URI);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
      {
        async requestDidStart({ request }) {
          // console.log('Incoming Request:', JSON.stringify(request, null, 2));
          return {};
        },
      },
    ],
  });
  await server.start();

  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

  app.use('/graphql', expressMiddleware(server, {
    context: async ({ req }) => {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) return { user: null };
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return { user: { id: decoded.id } };
      } catch (e) {
        console.error(e)
        return { user: null };
      }
    },
  }));

  app.get('/', (_, res) => {
    res.json({ ok: true, message: 'Recipe GraphQL API. Go to /graphql' });
  });

  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
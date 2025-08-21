import mongoose from 'mongoose';

export async function connectDB(uri) {
  if (!uri) throw new Error('MONGODB_URI missing');

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { autoIndex: true });

  const conn = mongoose.connection;
  conn.on('connected', () => {
    //console.log(`✅ MongoDB connected: ${conn.host}/${conn.name}`);
  });
  conn.on('error', (err) => {
    console.error('MongoDB error:', err?.message || err);
  });

  return conn;
}

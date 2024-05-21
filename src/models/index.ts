import db from '../database';

const connectDatabase = async () => {
  try {
    const client = await db.connect();
    try {
      console.log('Database connected successfully');
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.error('Database connection error:', err.stack);
  }
};

export default connectDatabase;

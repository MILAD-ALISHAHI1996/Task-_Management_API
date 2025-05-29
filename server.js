const app = require('./app');
const dotenv = require('dotenv');
const prisma = require('./config/db');

dotenv.config();

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await prisma.$connect();
    console.log('✅ Connected to DB');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ DB connection error', err);
    process.exit(1);
  }
}

start();

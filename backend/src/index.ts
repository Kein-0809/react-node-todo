import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth';
import taskRoutes from './routes/tasks';
import path from 'path';

// 環境変数を読み込む
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
const prisma = new PrismaClient();

app.use(cors({
  origin: process.env.FRONTEND_URL, // 環境変数から読み込んでフロントエンドのURLを指定
  credentials: true,
}));

app.use(express.json());

const PORT = process.env.PORT;

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// アプリケーション終了時にPrismaクライアントを切断
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});
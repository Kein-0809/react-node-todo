import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';
import { Prisma } from '@prisma/client';

const router = express.Router();

// サインアップ
// POSTリクエストを'/signup'エンドポイントで処理するルートを定義します
router.post('/signup', async (req, res) => {
  try {
    // リクエストボディからemailとpasswordを取得します
    const { email, password } = req.body;
    
    // パスワードをハッシュ化します（セキュリティのため）
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Prismaを使用して新しいユーザーをデータベースに作成します
    const user = await prisma.user.create({
      // データベースに保存するデータの内容を指定
      data: {
        email,
        password: hashedPassword,
      },
    });
    
    // ユーザー作成成功時、201ステータスコードとメッセージを返します
    res.status(201).json({ message: 'User created successfully', userId: user.id });
  } catch (error) {
    // エーが発生した場合の処理
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Prismaの既知のエラーの場合
      if (error.code === 'P2002') {
        // P2002はユニーク制約違反を示すエラーコードです
        return res.status(400).json({ error: 'Email already exists' });
      }
    }
    // その他のエラーの場合、コンソールにエラーを出力し、
    // 500ステータスコードとエラーメッセージを返します
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ログイン
router.post('/login', async (req, res) => {
  try {
    // リクエストボディからemailとpasswordを取得します
    const { email, password } = req.body;
    
    // Prismaを使用して、指定されたemailを持つユーザーを検索します
    const user = await prisma.user.findUnique({ where: { email } });
    
    // ユーザーが見つからない場合、400エラーを返します
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // bcryptを使用して、入力されたパスワードとデータベースのハッシュ化されたパスワードを比較します
    const validPassword = await bcrypt.compare(password, user.password || '');
    
    // パスワードが一致しない場合、400エラーを返します
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // JWTトークンを生成します。ペイロードにはユーザーIDが含まれ、1時間で期限切れになります
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });
    
    // 生成されたトークンをJSONレスポンスとして返します
    res.json({ token });
  } catch (error) {
    // エラーが発生した場合、コンソールにエラーを出力し、
    // 500エラーとエラーメッセージをJSONレスポンスとして返します
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  // Optional property
  user?: {
    userId: number;
  };
}

// JWT認証を行うミドルウェア関数を定義します
export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  // リクエストヘッダーからAuthorizationヘッダーを取得します
  const authHeader = req.headers['authorization'];
  // Authorizationヘッダーが存在する場合、'Bearer 'の後のトークン部分を取得します
  const token = authHeader && authHeader.split(' ')[1];

  // トークンが存在しない場合、401 Unauthorizedを返します
  if (token == null) return res.sendStatus(401);

  // JWTトークンを検証します
  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err: any, user: any) => {
    // エラーがある場合（トークンが無効な場合）、403 Forbiddenを返します
    if (err) return res.sendStatus(403);
    // トークンが有効な場合、デコードされたユーザー情報をリクエストオブジェクトに追加します
    req.user = user;
    // 次のミドルウェアまたはルートハンドラに処理を渡します
    next();
  });
};
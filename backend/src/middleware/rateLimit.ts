import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 100, // 各IPアドレスからの最大リクエスト数
  message: 'Too many requests from this IP, please try again later.',
});

export default limiter;
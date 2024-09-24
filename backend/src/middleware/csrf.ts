import { Request, Response, NextFunction } from 'express';
import csrf from 'csurf';

const csrfProtection = csrf({ cookie: true });

export const generateCsrfToken = (req: Request, res: Response, next: NextFunction) => {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  next();
};

export default csrfProtection;
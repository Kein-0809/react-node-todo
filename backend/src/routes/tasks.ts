import express from 'express';
import { authenticateToken } from '../middleware/auth';
import prisma from '../prisma';
import { Priority, Status } from '@prisma/client';

const router = express.Router();

interface AuthRequest extends express.Request {
  // Optional property
  user?: {
    userId: number;
  };
}

// GETリクエストを'/'ルートに対して処理するルーターを定義します
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    // Prismaを使用してタスクを取得します
    const tasks = await prisma.task.findMany({
      // 現在認証されているユーザーのタスクのみを取得します
      where: { userId: req.user?.userId },
      // タスクに関連するタグ情報も含めて取得します
      include: { tags: { include: { tag: true } } },
    });
    // 取得したタスクをJSONレスポンスとして返します
    res.json(tasks);
  } catch (error) {
    // エラーが発生した場合、500エラーとエラーメッセージを返します
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Error fetching tasks' });
  }
});

// タスク作成エンドポイントを定義します
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    // リクエストボディからタスクの詳細を取得します
    const { title, description, priority, status, dueDate, tags } = req.body;
    
    // ユーザーが認証されていない場合、401 Unauthorizedを返します
    if (!req.user?.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Prismaを使用して新しいタスクをデータベースに作成します
    const task = await prisma.task.create({
      data: {
        // タスクのタイトル
        title,
        // タスクの説明
        description,
        // タスクの優先度（Priority型にキャスト）
        priority: priority as Priority,
        // タスクのステータス（Status型にキャスト）
        status: status as Status,
        // タスクの期限（存在する場合はDate型に変換）
        dueDate: dueDate ? new Date(dueDate) : undefined,
        // 認証されたユーザーのID
        userId: req.user.userId,
        // タグが存在する場合、タグを関連付けます
        // タグが配列であり、かつその配列が空でない場合��のみタグを作成します
        tags: Array.isArray(tags) && tags.length > 0
        ? {
            // タグの配列をマッピングし、各タグIDに対してタグをデータベースに接続します
            create: tags.map((tagId: number) => ({ tag: { connect: { id: tagId } } })),
          }
        // タグが存在しない場合はundefinedを設定します
        : undefined,
      },
      // 作成したタスクに関連するタグ情報も含めて取得します
      include: { tags: { include: { tag: true } } },
    });
    // 作成したタスクをJSONレスポンスとして返します
    res.status(201).json(task);
  } catch (error) {
    // エラーが発生した場合、エラーメッセージをログに出力し、500 Internal Server Errorを返します
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Error creating task' });
  }
});

// 特定のタスクを更新する
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    // リクエストパラメータからタスクIDを取得します
    const { id } = req.params;
    // リクエストボディからタスクの詳細を取得します
    const { title, description, priority, status, dueDate, tags } = req.body;

    // Prismaを使用して既存のタスクを更新します
    const task = await prisma.task.update({
      // 更新するタスクを特定するための条件を指定します
      where: { id: Number(id), userId: req.user?.userId },
      // 更新するデータの内容を指定します
      data: {
        // タスクのタイトル
        title,
        // タスクの説明
        description,
        // タスクの優先度（Priority型にキャスト）
        priority: priority as Priority,
        // タスクのステータス（Status型にキャスト）
        status: status as Status,
        // タスクの期限（存在する場合はDate型に変換）
        dueDate: dueDate ? new Date(dueDate) : undefined,
        // タグが存在する場合、既存のタグを削除し、新しいタグを作成します
        tags: tags ? {
          // 既存のタグをすべて削除します
          deleteMany: {},
          // 新しいタグを作成します
          create: tags.map((tagId: number) => ({ tag: { connect: { id: tagId } } })),
        } : undefined,
      },
      // 更新したタスクに関連するタグ情報も含めて取得します
      include: { tags: { include: { tag: true } } },
    });
    // 更新したタスクをJSONレスポンスとして返します
    res.json(task);
  } catch (error) {
    // エラーが発生した場合、エラーメッセージをログに出力し、500 Internal Server Errorを返します
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Error updating task' });
  }
});

// タスク完了マーク
router.put('/:id/complete', authenticateToken, async (req: AuthRequest, res) => {
  try {
    // リクエストパラメータからタスクIDを取得します
    const { id } = req.params;

    // Prismaを使用して特定のタスクを更新します
    const task = await prisma.task.update({
      // 更新するタスクを特定するための条件を指定します
      where: { id: Number(id), userId: req.user?.userId },
      // 更新するデータの内容を指定します
      data: {
        // タスクのステータスを「完了」に設定します
        status: Status.COMPLETED,
      },
    });
    // 更新したタスクをJSONレスポンスとして返します
    res.json(task);
  } catch (error) {
    // エラーが発生した場合、エラーメッセージをログに出力し、500 Internal Server Errorを返します
    console.error('Error marking task as complete:', error);
    res.status(500).json({ error: 'Error marking task as complete' });
  }
});

// タスク��除
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    // リクエストパラメータからタスクIDを取得します
    const { id } = req.params;
    
    // Prismaを使用して特定のタスクを削除します
    await prisma.task.delete({
      // 削除するタスクを特定するための条件を指定します
      where: { id: Number(id), userId: req.user?.userId },
    });
    
    // 削除が成功した場合、204 No Contentステータスを返します
    res.status(204).send();
  } catch (error) {
    // エラーが発生した場合、エラーメッセージをログに出力し、500 Internal Server Errorを返します
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Error deleting task' });
  }
});

// タスク検索とフィルタリング
router.get('/search', authenticateToken, async (req: AuthRequest, res) => {
  try {
    // クエリパラメータから検索条件を取得します
    const { query, priority, status, dueDate } = req.query;
    
    // Prismaを使用してタスクを検索します
    const tasks = await prisma.task.findMany({
      // 検索条件を指定します
      where: {
        // 認証されたユーザーのタスクのみを検索します
        userId: req.user?.userId,
        // タイトルまたは説明にクエリ文字列が含まれるタスクを検索します
        OR: [
          { title: { contains: query as string, mode: 'insensitive' } },
          { description: { contains: query as string, mode: 'insensitive' } },
        ],
        // 優先度が一致するタスクを検索します
        priority: priority as Priority,
        // ステータスが一致するタスクを検索します
        status: status as Status,
        // 期限が指定された日付以下のタスクを検索します
        dueDate: dueDate ? { lte: new Date(dueDate as string) } : undefined,
      },
      // タスクに関連するタグ情報も含めて取得します
      include: { tags: { include: { tag: true } } },
    });
    // 検索結果のタスクをJSONレスポンスとして返します
    res.json(tasks);
  } catch (error) {
    // エラーが発生した場合、エラーメッセージをログに出力し、500 Internal Server Errorを返します
    console.error('Error searching tasks:', error);
    res.status(500).json({ error: 'Error searching tasks' });
  }
});

export default router;
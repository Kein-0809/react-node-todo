# リッチなTodoアプリケーション

## セットアップ手順

1. リポジトリをクローンする
2. バックエンドディレクトリに移動し、`npm install`を実行
3. フロントエンドディレクトリに移動し、`npm install`を実行
4. `.env.example`ファイルをコピーして`.env`ファイルを作成し、必要な環境変数を設定
5. `docker-compose up -d`でPostgreSQLコンテナを起動
6. バックエンドディレクトリで`npm run dev`を実行
7. フロントエンドディレクトリで`npm start`を実行

## 環境変数

以下の環境変数を`.env`ファイルに設定してください：

- `DB_USER`: PostgreSQLのユーザー名
- `DB_PASSWORD`: PostgreSQLのパスワード
- `DB_NAME`: PostgreSQLのデータベース名
- `JWT_SECRET`: JWTトークンの署名に使用する秘密鍵
- `DATABASE_URL`: PostgreSQLの接続URL
- `REACT_APP_API_URL`: バックエンドAPIのURL（フロントエンド用）

## セキュリティに関する注意事項

- `.env`ファイルをGitにコミットしないでください
- 本番環境では強力なパスワ��ドと秘密鍵を使用してください
- 定期的にパッケージを更新し、セキュリティの脆弱性に対処してください
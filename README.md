# lambda-ts-mysql

これは lambda から DB(MySQL) にアクセスする時に使うリポジトリーです

# 環境構築

```bash
# nodeのインストール
npm i
```

```bash
# envファイルの作成
touch .env
```

```env
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
```

```bash
# nodeを実行
node index.mjs
```

# AWS にあげる

```bash
# ファイルをzipに(AWSにあげる時に使う)
zip -r lambda-function.zip .
```

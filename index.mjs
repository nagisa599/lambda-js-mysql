// MySQLライブラリをインポート
import mysql from "mysql2/promise";

// データベース接続設定
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// Lambdaハンドラ関数
export const handler = async (event) => {
  console.log("Received event:", JSON.stringify(event)); // ログにイベントを記録

  let response;
  try {
    const body = JSON.parse(event.body); // POSTリクエストのボディをパース
    console.log("Parsed body:", body); // ログにパースされたボディを記録

    const powerState = body.context.powerState;
    const deviceMac = body.context.deviceMac; // 'powerState'プロパティにアクセス
    console.log("Power State:", powerState);

    const connection = await mysql.createConnection(dbConfig); // DB接続
    // 最初のboxs_on_keysレコードを検索
    const [rows] = await connection.execute(
      "SELECT boxs_id FROM boxs_on_keys WHERE keys_id = ? LIMIT 1",
      [deviceMac]
    );
    const boxsId = rows[0]?.boxs_id;

    if (boxsId) {
      // 取得したboxs_idを使用してboxsテーブルを更新
      if (powerState === "ON") {
        await connection.execute("UPDATE boxs SET is_lock = 0 WHERE id = ?", [
          boxsId,
        ]);
      } else {
        await connection.execute("UPDATE boxs SET is_lock = 1 WHERE id = ?", [
          boxsId,
        ]);
      }
    }
    await connection.end();
    response = {
      statusCode: 200,
      body: JSON.stringify({ powerState: powerState }), // レスポンスとして'powerState'を返す
    };
  } catch (error) {
    console.error("Error processing request:", error);
    response = {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to process request",
        details: error.toString(),
      }),
    };
  }

  return response;
};

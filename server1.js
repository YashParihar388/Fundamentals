import express from "express";
import sqlite3 from "better-sqlite3";

const app = express();
app.use(express.json());

const db = new sqlite3("./database.db");

// ─── Tables ───────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS user (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    email    TEXT NOT NULL,
    password TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS orders (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    product TEXT,
    amount  REAL,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES user(id)
  );
`);

// ─── Seed Data ────────────────────────────
const userCount = db.prepare('SELECT COUNT(*) as c FROM user').get().c;

if (userCount === 0) {
  const insertUser  = db.prepare('INSERT INTO user (email, password) VALUES (?, ?)');
  const insertOrder = db.prepare('INSERT INTO orders (product, amount, user_id) VALUES (?, ?, ?)');

  for (let i = 1; i <= 5; i++) {
    const { lastInsertRowid: userId } = insertUser.run(`user${i}@gmail.com`, 'hashedpassword');
    for (let j = 1; j <= 3; j++) {
      insertOrder.run(`Product ${j}`, j * 100, userId);
    }
  }
  console.log('✅ Seeded 5 users with 3 orders each');
}

// ─── Cache setup ──────────────────────────
let cache = null;
let isFetching = false;

const getFromDb = async () => {
  await new Promise(r => setTimeout(r, 500));
  return { users: ["yash", "amit", "alok"] };
};

// ─── Routes ───────────────────────────────

app.get("/users", async (req, res) => {
  if (cache) return res.json(cache);
  if (!isFetching) {
    isFetching = true;
    cache = await getFromDb();  // ✅ fixed — was missing ()
  } else {
    await new Promise(r => setTimeout(r, 500));
    return res.json(cache);
  }
  return res.json(cache);
});

// ❌ N+1 approach
app.get("/users/n-plus-one", (req, res) => {
  console.log('\n--- N+1 APPROACH ---');

  const users = db.prepare('SELECT * FROM user').all();
  console.log('Query 1: SELECT * FROM user');

  const result = users.map((user, i) => {
    const orders = db.prepare('SELECT * FROM orders WHERE user_id = ?').all(user.id);
    console.log(`Query ${i + 2}: SELECT * FROM orders WHERE user_id = ${user.id}`);
    return {
      user: user.email,
      orderCount: orders.length,
      orders: orders.map(o => o.product)
    };
  });

  console.log(`Total queries fired: ${users.length + 1}`);
  res.json(result);
});

// ✅ Optimized JOIN approach
app.get("/users/optimized", (req, res) => {
  console.log('\n--- OPTIMIZED JOIN ---');

  const rows = db.prepare(`
    SELECT 
      user.id    AS userId,
      user.email AS userEmail,
      orders.product,
      orders.amount
    FROM user
    JOIN orders ON orders.user_id = user.id
  `).all();

  console.log('Query 1: SELECT with JOIN — everything in one shot');
  console.log('Total queries fired: 1');

  const grouped = {};
  for (const row of rows) {
    if (!grouped[row.userId]) {
      grouped[row.userId] = { user: row.userEmail, orders: [] };
    }
    grouped[row.userId].orders.push(row.product);
  }

  res.json(Object.values(grouped));
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
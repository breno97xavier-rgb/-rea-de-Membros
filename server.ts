import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Database from "better-sqlite3";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("database.sqlite");

// Inicializar banco de dados
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fullName TEXT NOT NULL,
    nickname TEXT,
    email TEXT UNIQUE NOT NULL COLLATE NOCASE,
    password TEXT NOT NULL,
    phone TEXT,
    birthDate TEXT,
    course TEXT,
    profilePic TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS support_tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    fullName TEXT,
    course TEXT,
    email TEXT,
    phone TEXT,
    comment TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Migração: Adicionar coluna phone em support_tickets se não existir
try {
  db.exec("ALTER TABLE support_tickets ADD COLUMN phone TEXT");
} catch (e) {
  // Coluna já existe ou erro ignorado
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API: Login/Register Simplificado (Nome + E-mail)
  app.post("/api/login-simple", (req, res) => {
    let { fullName, email } = req.body;
    if (!fullName || !fullName.trim() || !email || !email.trim()) {
      return res.status(400).json({ error: "Nome e E-mail são obrigatórios." });
    }

    fullName = fullName.trim();
    email = email.toLowerCase().trim();

    try {
      // Tenta encontrar o usuário pelo e-mail (que é único)
      let user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
      
      if (!user) {
        // Se não existir, cria um novo com o nome e e-mail fornecidos
        const stmt = db.prepare(`
          INSERT INTO users (fullName, email, password)
          VALUES (?, ?, ?)
        `);
        const info = stmt.run(fullName, email, "");
        user = db.prepare("SELECT * FROM users WHERE id = ?").get(info.lastInsertRowid);
      } else {
        // Se já existe, atualiza o nome caso tenha mudado
        db.prepare("UPDATE users SET fullName = ? WHERE id = ?").run(fullName, user.id);
        user.fullName = fullName;
      }
      
      res.json({ success: true, user });
    } catch (error: any) {
      console.error("Erro no login simples:", error);
      res.status(500).json({ error: "Erro ao processar login." });
    }
  });

  // API: Atualizar Perfil
  app.post("/api/update-profile", (req, res) => {
    const { userId, fullName, nickname, phone, birthDate, profilePic, password } = req.body;
    try {
      let query = "UPDATE users SET fullName = ?, nickname = ?, phone = ?, birthDate = ?, profilePic = ?";
      let params = [fullName, nickname, phone, birthDate, profilePic];
      
      if (password) {
        query += ", password = ?";
        params.push(password);
      }
      
      query += " WHERE id = ?";
      params.push(userId);
      
      db.prepare(query).run(...params);
      const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
      res.json({ success: true, user });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // API: Suporte
  app.post("/api/support", (req, res) => {
    const { userId, fullName, course, email, phone, comment } = req.body;
    db.prepare(`
      INSERT INTO support_tickets (userId, fullName, course, email, phone, comment)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(userId, fullName, course, email, phone, comment);
    res.json({ success: true });
  });

  // API: Admin - Listar Usuários e Tickets
  app.post("/api/admin/users", (req, res) => {
    const { password } = req.body;
    if (password === "AdmPRF2026") {
      const users = db.prepare("SELECT * FROM users ORDER BY createdAt DESC").all();
      const tickets = db.prepare("SELECT * FROM support_tickets ORDER BY createdAt DESC").all();
      res.json({ success: true, users, tickets });
    } else {
      res.status(403).json({ error: "Senha administrativa incorreta." });
    }
  });

  // Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

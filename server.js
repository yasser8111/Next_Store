import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// خدم الملفات الثابتة من مجلد public
app.use(express.static(path.join(__dirname, "public")));

// جميع الطلبات تخدم index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// تصدير التطبيق لـ Vercel
export default app;

app.listen(port, () => {
  console.log(`--> http://localhost:${port}`);
});
// to start the server wriate "npm start" in the terminal
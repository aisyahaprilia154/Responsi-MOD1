import express from "express";
import loanRoutes from "./routes/loanRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";

const app = express();

app.disable("x-powered-by");
app.use(express.json({ limit: "100kb" }));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Library Loans API aktif.",
    endpoints: {
      loans: "/loans",
      health: "/health"
    }
  });
});

app.get("/health", (req, res) => {
  res.json({ success: true, status: "ok" });
});

app.use("/loans", loanRoutes);
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;

if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
  });
}

export default app;

import { Router } from "express";

const router = Router();

// Dashboard routes will be implemented here
router.get("/", (req, res) => {
  res.json({ message: "Dashboard routes - Coming soon" });
});

export default router;

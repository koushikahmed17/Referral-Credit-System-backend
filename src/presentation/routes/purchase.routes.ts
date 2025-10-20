import { Router } from "express";

const router = Router();

// Purchase routes will be implemented here
router.get("/", (req, res) => {
  res.json({ message: "Purchase routes - Coming soon" });
});

export default router;

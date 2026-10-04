import { Router } from "express";
import bcrypt from "bcryptjs";
import { users, id, publicUser, userByEmail } from "../store.js";
import { setSession, clearSession, requireAuth } from "../middleware/auth.js";
const router = Router();
router.post("/register", async (req, res) => {
  const { name, email, password, preferredLang, role, staffCode } = req.body;
  const normalized = String(email || "")
    .trim()
    .toLowerCase();
  if (!name?.trim() || !normalized || !password || password.length < 6)
    return res
      .status(400)
      .json({ error: "Name, email and a 6+ character password are required" });
  if (userByEmail(normalized))
    return res.status(409).json({ error: "Email already registered" });
  let finalRole = "citizen";
  if (["authority", "ngo"].includes(role)) {
    if (staffCode !== (process.env.STAFF_CODE || "civicforge-staff"))
      return res.status(403).json({ error: "Invalid staff code" });
    finalRole = role;
  }
  const user = {
    _id: id(),
    name: name.trim(),
    email: normalized,
    password: await bcrypt.hash(password, 10),
    role: finalRole,
    preferredLang: preferredLang || "en",
    trustScore: 50,
    verifiedReports: 0,
    points: 0,
    badges: [],
    createdAt: new Date(),
  };
  users.set(user._id, user);
  setSession(res, user);
  res.status(201).json({ user: publicUser(user) });
});
router.post("/login", async (req, res) => {
  const user = userByEmail(req.body.email);
  if (!user || !(await bcrypt.compare(req.body.password || "", user.password)))
    return res.status(401).json({ error: "Invalid email or password" });
  setSession(res, user);
  res.json({ user: publicUser(user) });
});
router.post("/logout", (_req, res) => {
  clearSession(res);
  res.json({ ok: true });
});
router.get("/me", requireAuth, (req, res) =>
  res.json({ user: publicUser(req.user) }),
);
export default router;

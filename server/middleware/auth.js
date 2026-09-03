import jwt from "jsonwebtoken";

export function optionalAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    req.user = null;
    return next();
  }

  const token = header.split(" ")[1];

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    console.log("JWT verification failed:", error.message);
    req.user = null;
    next();
  }
}

export function protect(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required"
    });
  }

  next();
}
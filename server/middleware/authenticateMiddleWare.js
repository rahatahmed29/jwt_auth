import jwt from "jsonwebtoken"

export const protect = (req, res, next) => {
  // 🔹 1. Get token from header
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" })
  }

  // 🔹 2. Extract token
  const token = authHeader.split(" ")[1]

  try {
    // 🔹 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET)

    // 🔹 4. Attach user info to request
    req.user = decoded

    // 🔹 5. Move to next step (route)
    next()

  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" })
  }
}
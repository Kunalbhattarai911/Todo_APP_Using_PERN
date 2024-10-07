import jwt from "jsonwebtoken";

export const isUserAuthenticated = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if the authorization header is present and starts with "Bearer"
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication failed: No token provided.",
        success: false,
      });
    }

    // Extract the token from the authorization header
    const token = authHeader.split(" ")[1]; // get the token after "Bearer"

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          message: "Authentication failed: Invalid token",
          success: false,
        });
      }

      // Attach user info to the request object for use in the next middleware or route
      req.user = decoded;

      // Proceed to next middleware or route
      next();
    });
  } catch (error) {
    console.error("Error in authentication middleware:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message,
    });
  }
};

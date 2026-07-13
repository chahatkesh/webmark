import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";
import {
  clearAdminCookie,
  getAdminTokenFromRequest,
} from "../utils/adminAuth.js";

const adminAuth = async (req, res, next) => {
  const token = getAdminTokenFromRequest(req);

  if (!token) {
    return res.status(401).json({
      success: false,
      code: "ADMIN_AUTH_REQUIRED",
      message: "Admin authentication required",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.typ !== "admin") {
      throw new Error("Invalid token type");
    }

    const admin = await Admin.findById(decoded.id).select("email").lean();
    if (!admin) {
      clearAdminCookie(res);
      return res.status(401).json({
        success: false,
        code: "ADMIN_NOT_FOUND",
        message: "Admin session is no longer valid",
      });
    }

    req.admin = admin;
    return next();
  } catch {
    clearAdminCookie(res);
    return res.status(401).json({
      success: false,
      code: "INVALID_ADMIN_SESSION",
      message: "Admin session expired or invalid",
    });
  }
};

export default adminAuth;

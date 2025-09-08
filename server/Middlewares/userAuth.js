import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ success: false, message: "Not authorised, login again" });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if (!tokenDecode.id) {
            return res.status(401).json({ success: false, message: "Not authorised, login again" });
        }

        // Ensure req.body exists before adding userId
        if (!req.body) req.body = {};
        req.body.userId = tokenDecode.id;

        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: err.message });
    }
}

export default userAuth;

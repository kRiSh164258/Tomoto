import jwt from "jsonwebtoken";
export const isAuth = async (req, res, next) => {
    try {
        const isHeader = req.headers.authorization;
        if (!isHeader || !isHeader.startsWith("Bearer ")) {
            res.status(401).json({
                message: "Please Login - No auth header"
            });
            return;
        }
        const token = isHeader.split(" ")[1];
        if (!token) {
            res.status(401).json({
                message: "Please Login - Token missing"
            });
            return;
        }
        const decodeValue = jwt.verify(token, process.env.JWT_Sec);
        if (!decodeValue || !decodeValue.user) {
            res.status(401).json({
                message: "iNVALID TOKEN",
            });
            return;
        }
        req.user = decodeValue.user;
        next();
    }
    catch (error) {
        res.status(500).json({
            message: "Please Login -- Jwt error"
        });
    }
};

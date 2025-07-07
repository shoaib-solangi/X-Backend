export const protectedRoute = async (req , res , next) => {
    if(!req.auth.isAuthenticated) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    next();
}
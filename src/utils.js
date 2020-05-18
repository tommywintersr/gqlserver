const jwt = require("jsonwebtoken");
const APP_SECRET = "89twzy-1s-4w3s0m";

//get & verify JWT token, return userId
function getUserId(context) {
    const Authorization = context.request.get("Authorization");
    if (Authorization) {
        const token = Authorization.replace("Bearer ", "");
        const { userId } = jwt.verify(token, APP_SECRET);
        return userId;
    }

    throw new Error("Not authenticated");
}

const jwt = require("jsonwebtoken");
const APP_SECRET = "GraphQL-is-aw3s0me";

function getUserId(context) {
    const Authorization = context.request.get("Authorization");
    if (Authorization) {
        const token = Authorization.replace("Bearer ", "");
        const { userId } = jwt.verify(token, APP_SECRET);
    }
}

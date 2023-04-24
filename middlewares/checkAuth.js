require("dotenv").config();
const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

async function verifyToken(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload;
}

const checkAuth = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  console.log("accessToken");
  console.log(accessToken);
  if (!accessToken) {
    return res.status(401).send("Access token not found");
  }
  try {
    const payload = await verifyToken(accessToken);
    console.log(payload);
    req.user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).send("Invalid access token");
  }
};

export default checkAuth;

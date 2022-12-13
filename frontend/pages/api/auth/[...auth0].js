import { handleAuth } from "@auth0/nextjs-auth0";

// log AUTH0_BASE_URL
console.log("AUTH0 base url:", process.env.AUTH0_BASE_URL);

export default handleAuth();

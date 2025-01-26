import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

// This helper function will allows us to get the domain name regardless of its form
// beta.example.com => example.com
// example.com/* => example.com
// localhost:3000 => localhost
const getDomainWithoutSubdomain = (url: string) => {
  const urlParts = new URL(url).hostname.split(".");

  return urlParts
    .slice(0)
    .slice(-(urlParts.length === 4 ? 3 : 2))
    .join(".");
};

const NEXTAUTH_URL = process.env.NEXTAUTH_URL;
const useSecureCookies = NEXTAUTH_URL?.startsWith("https://");
const cookiePrefix = useSecureCookies ? "__Secure-" : "";
const hostName = NEXTAUTH_URL
  ? getDomainWithoutSubdomain(NEXTAUTH_URL)
  : "localhost";

// Define how we want the session token to be stored in our browser
const cookies = {
  sessionToken: {
    name: `${cookiePrefix}next-auth.session-token`,
    options: {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: useSecureCookies,
      domain: hostName === "localhost" ? hostName : "." + hostName, // add a . in front so that subdomains are included
    },
  },
};

const callbacks = {
  async jwt({ token, user }: { token: any; user: any }) {
    // we store the user data and access token in the token
    if (user) {
      token.user = user.user;
      token.accessToken = user.access_token;
      token.refreshToken = user.refresh_token;
    }

    return token;
  },

  async session({ session, token }: { session: any; token: any }) {
    session.accessToken = token.accessToken;
    const { firstName, lastName, email } = token.user;
    session.user = {
      name: `${firstName} ${lastName}`,
      email: email,
    };
    session.refreshToken = token.refreshToken;
    return session;
  },
};

const options = {
  debug: false, // if you want to debug
  //The secred that you use to hash your token
  secret: useSecureCookies,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "name" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const payload = {
            loginCredential: credentials?.username || "",
            password: credentials?.password || "",
          };

          const res = await loginUser({ payload });

          if (res.status === 200) {
            const user: any = res?.data?.data;

            return user;
          }

          return null;
        } catch (error: any) {
          throw new Error(
            JSON.stringify({
              errors: error.data.message,
              messageCode: error.data.messageCode,
              status: false,
            })
          );
        }
      },
    }),
  ],
  callbacks,
  cookies,
  pages: {
    // set pages that tell nextauth where to redirect for an action
    signIn: "/signin",
    signOut: "/",
    error: "/signin",
  },
};

const Auth = (req, res) => NextAuth(req, res, options);
export default Auth;

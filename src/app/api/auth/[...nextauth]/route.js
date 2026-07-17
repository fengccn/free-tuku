// src/app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "账号", type: "text" },
        password: { label: "密码", type: "password" }
      },
      async authorize(credentials) {
        // 从 Cloudflare Pages 环境变量读取账号密码
        const validUsername = process.env.AUTH_USERNAME;
        const validPassword = process.env.AUTH_PASSWORD;
        
        // 验证逻辑
        if (credentials.username === validUsername && credentials.password === validPassword) {
          // 验证通过，返回用户信息
          return { 
            id: "1", 
            name: "Admin", 
            email: "admin@example.com",
            role: "admin" 
          };
        }
        // 验证失败
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
      }
      return session;
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

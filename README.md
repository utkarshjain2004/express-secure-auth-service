# express-secure-auth-service

A production‑ready Express.js backend implementing:

- **User Registration** with email verification (Nodemailer + Gmail)  
- **JWT‑based Authentication** and protected routes  
- **MongoDB Atlas** integration for persistent storage  
- **Password Reset** flow (secure, expirable links)  
- **Bcrypt** password hashing  
- Ready for **Nginx + Let’s Encrypt** HTTPS deployment

## Getting Started

```bash
git clone https://github.com/utkarshjain2004/express-secure-auth-service.git
cd express-secure-auth-service
npm install
cp .env.example .env
# fill in .env (MONGO_URI, EMAIL_USER, EMAIL_PASS, JWT_SECRET, BASE_URL)
npm run dev

# Innovate Inc API - OAuth Integration
This branch showcases GitHub OAuth login along with traditional email/password login

## Features
- Traditional registration and login with email/password
- Protected routes with JWT authentication 
    - Adding, updating, and deleting bookmarks
    - Viewing profile information
- GitHub OAuth login with email requested
- Automatic handling for private GitHub emails with placeholder emails for the database
- Password hashing with bcrypt, with fallback for OAuth users without passwords stored

## How to Test
1. Clone the repo
2. Run `npm install` for dependencies
3. Create an `.env` file with the following variables
    You will need to create a GitHub OAuth App in your GitHub developer setting to get a client ID and secret.
    ```
    PORT=5000
    MONGODB_URI=<your-mongo-uri>
    JWT_SECRET=<your-jwt-secret>
    GITHUB_CLIENT_ID=<your-github-client-id>
    GITHUB_CLIENT_SECRET=<your-github-client-secret>
    GITHUB_CALLBACK_URL=http://localhost:5000/api/users/auth/github/callback
    ```
4. Start the server with `npm start` or `npx nodemon`
5. Test routes in Postman by registering with a username email and password or logging in
    - `POST /api/users/register` with username, email, and password in the body
    - `POST /api/users/login` with email and password in the body
    - `GET /api/users/me` with `Authorization: Bearer <token>` as the header
6. Test protected bookmarks routes in Postman with `Authorization: Bearer <token>` header
    - `GET /api/bookmarks`
    - `GET /api/bookmarks/:id`
    - `POST /api/bookmarks` with bookmark fields in the body
    - `PUT /api/bookmarks/:id` with updated fields in the body
    - `DELETE /api/bookmarks/:id`
7. Test GitHub OAuth
    - Visit http://localhost:5000/api/users/auth/github
    - Approve OAuth request
    - The server will respond with a JSON object with your JWT token and user info as there is no frontend
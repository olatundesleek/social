# Social Media Backend (Express.js)

This is the backend for a **Social Media Application** built with **Express.js**. It includes features for user authentication, profile management, and post handling, designed to power the social network.

## Table of Contents

- [Installation](#installation)
- [Prerequisites](#prerequisites)
- [Configuration](#configuration)
- [Run the App](#run-the-app)
- [API Endpoints](#api-endpoints)
- [Folder Structure](#folder-structure)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

---

## Installation

### Step 1: Clone the repository

Clone this repository to your local machine using the following command:

```bash
git clone https://github.com/olatundesleek/social.git
```

### Step 2: Navigate to the project folder

```bash
cd social
```

### Step 3: Install dependencies

Run the following command to install the required dependencies:

```bash
npm install
```

---

## Prerequisites

- **Node.js** (version 14 or above)
- **MongoDB** (locally or via MongoDB Atlas)
- **Postman or similar tool** (for testing API requests)

Make sure you have MongoDB running (or use MongoDB Atlas for a cloud database).

---

## Configuration

1. **Environment Variables**

Create a `.env` file at the root of your project and add the following variables:

```env
MONGODB_URI=mongodb://localhost:27017/social  # Change if using MongoDB Atlas
SECRET=your-jwt-secret-key
PORT=3000
```

- `MONGODB_URI`: Connection string to your MongoDB instance.
- `JWT_SECRET`: Secret key for JWT authentication (make it a long, secure string).
- `PORT`: The port your server will run on.

---

## Run the App

To run the development server, execute the following command:

```bash
npm start
```

The server will run on `http://localhost:3000` by default.

For development, you can also run the server with `nodemon` for automatic restarts:

```bash
npm run dev
```

---

## API Endpoints

### **User Authentication**

#### 1. **POST /api/auth/register**

- **Description**: Registers a new user.
- **Request Body**:
  ```json
  {
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "message": "User registered successfully"
  }
  ```

#### 2. **POST /api/auth/login**

- **Description**: Authenticates a user and generates a JWT.
- **Request Body**:
  ```json
  {
    "username": "daniel",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "token": "jwt_token_here"
  }
  ```

### **User Profile**

#### 3. **GET /profile/me**

- **Description**: Get the profile of the logged-in user.
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`
- **Response**:
  ```json
  {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "createdAt": "2025-02-05T00:00:00Z"
  }
  ```

#### 4. **PUT profile/update**

- **Description**: Update the logged-in user's profile.
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`
- **Request Body**:
  ```json
  {
    "email": "newemail@example.com",
    "username": "john_doe_updated"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Profile updated successfully",
    "updatedUser": {
      "id": "user_id",
      "username": "john_doe_updated",
      "email": "newemail@example.com"
    }
  }
  ```

### **Posts**

#### 5. **POST /api/posts**

- **Description**: Create a new post.
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`
- **Request Body**:
  ```json
  {
    "content": "This is a new post!"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Post created successfully",
    "post": {
      "id": "post_id",
      "content": "This is a new post!",
      "createdAt": "2025-02-05T00:00:00Z"
    }
  }
  ```

#### 6. **GET /api/posts**

- **Description**: Get all posts.
- **Response**:
  ```json
  [
    {
      "id": "post_id",
      "content": "This is a new post!",
      "createdAt": "2025-02-05T00:00:00Z"
    }
  ]
  ```

#### 7. **DELETE /api/posts/:postId**

- **Description**: Delete a post.
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`
- **Response**:
  ```json
  {
    "message": "Post deleted successfully"
  }
  ```

---

## Folder Structure

```
/social-media-backend
├── /config              # Configuration files (DB, JWT secret, etc.)
├── /controllers         # Controller files handling the logic
├── /models              # Mongoose models
├── /routes              # API route definitions
├── /middleware          # Middleware for authentication and validation
├── /utils               # Utility functions
├── .gitignore           # Git ignore file
├── .env                 # Environment variables
├── server.js            # Entry point of the application
├── package.json         # Project dependencies and scripts
└── README.md            # This file
```

---

## Technologies Used

- **Node.js** with **Express.js**
- **MongoDB** for the database
- **Mongoose** for object data modeling
- **JWT** for authentication
- **Bcrypt.js** for password hashing

---

## Contributing

We welcome contributions! If you'd like to improve this project, follow these steps:

1. Fork the repository.
2. Create a new branch.
3. Make your changes and commit them.
4. Push your changes to your fork.
5. Create a pull request.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

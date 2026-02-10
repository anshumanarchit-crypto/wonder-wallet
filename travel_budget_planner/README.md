# Travel Budget Planner

A comprehensive web application designed to help users plan, manage, and track their travel budgets efficiently. This project leverages a modern tech stack to provide a seamless user experience for budget estimation and expense tracking.

## 🚀 Tech Stack

### Frontend
-   **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Authentication**: [Firebase Auth](https://firebase.google.com/docs/auth)
-   **State Management/Data**: React Hooks

### Backend
-   **Runtime**: [Node.js](https://nodejs.org/)
-   **Framework**: [Express.js](https://expressjs.com/)
-   **Database**: [MongoDB](https://www.mongodb.com/) (using [Mongoose](https://mongoosejs.com/))
-   **AI Integration**: [LangChain](https://js.langchain.com/) + Google GenAI
-   **Authentication**: Firebase Admin SDK

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
-   [Node.js](https://nodejs.org/) (v18 or higher recommended)
-   [npm](https://www.npmjs.com/) (comes with Node.js) or [Bun](https://bun.sh/)
-   [MongoDB](https://www.mongodb.com/try/download/community) installed locally or a [MongoDB Atlas](https://www.mongodb.com/atlas) connection string.
-   A [Firebase Project](https://console.firebase.google.com/) set up for authentication.

## 🛠️ Installation & Setup

Follow these steps to get the project up and running on your local machine.

### 1. Clone the Repository

```bash
git clone https://github.com/anshumanarchit-crypto/wonder-wallet.git
cd wonder-wallet/travel_budget_planner
```

### 2. Backend Setup

New terminal for the backend:

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure Environment Variables:
    -   Create a `.env` file in the `backend` directory based on `.env.example`.
    -   Update the values (Port, MongoDB URI, Firebase Service Account Key).

4.  Start the Backend Server:
    ```bash
    npm run dev
    # or
    npm start
    ```
    The server should now be running on `http://localhost:5000` (or your configured port).

### 3. Frontend Setup

Open a **new terminal** for the frontend:

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure Environment Variables:
    -   Create a `.env` file in the `frontend` directory based on `.env.example`.
    -   Add your Firebase configuration details (`VITE_FIREBASE_API_KEY`, etc.).

4.  Start the Frontend Application:
    ```bash
    npm run dev
    ```
    The application will act accessible at `http://localhost:5173` (by default).

## 🏃 Running the Project

Once both servers are running:
1.  Ensure your MongoDB database is active.
2.  Open your browser and navigate to the frontend URL (e.g., `http://localhost:5173`).
3.  You can now sign up/login and start planning your travel budget!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

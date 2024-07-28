Jenni Editor
=========================

This project is a simple real-time collaborative text editor built with Next.js and TypeScript for the frontend and Rust with Actix-web for the backend. It allows multiple users to edit text simultaneously and resolves conflicts to ensure a smooth user experience.

Features
--------

-   Real-time collaboration on a single document
-   Responsive and accessible text editor
-   Conflict resolution to handle simultaneous edits
-   Connection status and document version display

Installation and Setup
----------------------

### Prerequisites

-   Node.js and npm (for the frontend)
-   Rust and Cargo (for the backend)

### Frontend Setup

1.  **Clone the repo and navigate to the *frontend* directory**:

2.  **Install dependencies**:
    `npm install`

3.  **Run the development server**:
    `npm run dev`

The frontend will be available at `http://localhost:3000`.

### Backend Setup

1.  **Navigate to the root of the project**:

2.  **Install Rust if you haven't already**:

3.  **Run the server**:
    `cargo run`

The backend will be available at `http://localhost:8080`.

Usage
-----

1.  **Start the frontend and backend servers** as described in the setup steps above.
2.  **Open multiple browser windows** and navigate to `http://localhost:3000`.
3.  **Start typing in the text editor**. Changes will be reflected in real-time across all open windows.
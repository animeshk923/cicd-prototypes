---
title: Blog API
description: Backend API for blog data fetching.
date: 10/30/2025
demoURL: https://blog-animesh-kumars-projects-d9d0efa3.vercel.app/
repoURL: https://github.com/animeshk923/blog/tree/v2.1
---

## Project Overview

This project is a modern, full-stack web application designed for creating, managing, and displaying blog content. It follows a monorepo architecture, separating concerns into three distinct applications: a user-facing frontend, an admin panel for managing blogs, and a backend API to serve data to both.

## Architecture

The project is structured as a monorepo, containing three independent applications within the `apps` directory:

- **`apps/frontend`**: A React-based single-page application (SPA) that serves as the public face of the blog. It fetches and displays published blog posts for readers.
- **`apps/admin`**: A separate React-based SPA that provides a secure area for administrator(s) to create, edit, and manage blog posts. It includes a rich text editor and authentication.
- **`apps/backend`**: A Node.js and Express.js application that functions as the central API. It handles business logic, data storage, and authentication for admin application.

## Technology Stack

Built with a modern, robust technology stack to ensure a high-quality scalable, and maintainable application.

### Backend (`apps/backend`)

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL _([Schema](apps/backend/src/prisma/schema.prisma))_
- **Database ORM**: Prisma
- **Authentication**: Passport.js (with Local and JWT strategies), bcryptjs for password hashing.
- **API Security**: CORS, sanitize-html for XSS protection.

### Frontend (`apps/frontend`)

- **Framework**: React
- **Build Tool**: Vite
- **Routing**: React Router
- **HTTP Client**: Axios
- **Styling**: SCSS and CSS Modules
- **Content Parsing**: `html-react-parser` to render blog content from the backend.

### Admin Panel (`apps/admin`)

- **Framework**: React
- **Build Tool**: Vite
- **Routing**: React Router
- **HTTP Client**: Axios
- **Styling**: SCSS and CSS Modules
- **Rich Text Editor**: TinyMCE (via `@tinymce/tinymce-react`) for a comprehensive content creation experience.

## Features

- **Monorepo Architecture**: Centralized code management for streamlined development.
- **Separation of Concerns**: Distinct frontend, backend, and admin applications.
- **Secure Authentication**: Robust authentication system for the admin panel using Passport.js.
- **Content Management**: A full-featured admin dashboard for creating and managing blog posts.
- **Rich Text Editing**: An advanced text editor for crafting engaging blog content.
- **RESTful API**: A well-structured backend API to handle all data operations.
- **Modern Frontend**: A fast and responsive user interface built with React and Vite.

## Getting Started

To run this project locally, you will need to install dependencies and run each application separately.

### Prerequisites

- Node.js and npm
- A running PostgreSQL database instance (as configured in [`prisma/schema.prisma`](apps/backend/src/prisma/schema.prisma))

### Installation

1.  **Clone the repository:**

    Use either of the following commands to clone the repository as per your preference:

    #### SSH Method

    ```bash
    git clone git@github.com:animeshk923/blog.git
    cd blog
    ```

    #### HTTPS Method

    ```bash
    git clone https://github.com/animeshk923/blog.git
    cd blog
    ```

2.  **Install backend dependencies:**

    ```bash
    cd apps/backend
    npm install
    ```

3.  **Install frontend dependencies:**

    ```bash
    cd ../frontend
    npm install
    ```

4.  **Install admin dependencies:**
    ```bash
    cd ../admin
    npm install
    ```

### Running the Application

1.  **Start the backend server:**
    From the `apps/backend` directory:

    ```bash
    npm run nodemon
    ```

    The server will start on the configured port (e.g., `http://localhost:3000`).

2.  **Start the frontend application:**
    From the `apps/frontend` directory:

    ```bash
    npm run dev
    ```

    The frontend will be available at `http://localhost:5173` (or another port if 5173 is in use).

3.  **Start the admin application:**
    From the `apps/admin` directory:
    ```bash
    npm run dev
    ```
    The admin panel will be available at a different port (e.g., `http://localhost:5174`).

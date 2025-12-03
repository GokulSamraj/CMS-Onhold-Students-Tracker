# CMS On-Hold Students Tracker

## Overview

This is a full-stack web application designed to help educational organizations track and manage students who are currently "on-hold". It provides a centralized dashboard for administrators and staff to monitor student status, set reminders, and automate follow-up communications.

## Features

*   **Secure User Login**: Differentiated access for administrators and standard users.
*   **Analytics Dashboard**: Get a quick overview of student statuses with visual analytics.
*   **Comprehensive Student Table**: View, search, and filter all on-hold students.
*   **Student Management**: Add, edit, and delete student records (delete is admin-only).
*   **Automated Email Reminders**:
    *   Automatically sends email reminders for follow-ups at configurable times (10:00 AM, 1:00 PM, 4:00 PM, 6:00 PM, and 8:00 PM).
    *   An initial reminder is sent as soon as a new student is added.
    *   All reminder emails are sent to a central operations email (`operation@lmes.in`).
*   **Reminder Control**: Users can toggle automatic reminders on or off for individual students.
*   **Manual Reminders**: Admins can manually trigger reminders for all pending students.
*   **Activity Log**: Records all major actions taken by users, such as login, logout, adding/editing students, and toggling reminders.
*   **Dark Mode**: A comfortable viewing experience in low-light environments.

## Tech Stack

*   **Frontend**: React, TypeScript, Vite, Tailwind CSS
*   **Backend**: Node.js, Express.js
*   **Database**: MongoDB
*   **Email Service**: Nodemailer with Gmail (OAuth2)

## Prerequisites

Before you begin, ensure you have the following installed on your system:

*   [Node.js](https://nodejs.org/) (v20.x or later recommended)
*   [npm](https://www.npmjs.com/) (usually comes with Node.js)
*   A [MongoDB](https://www.mongodb.com/) database (local or a cloud-based service like MongoDB Atlas)

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd cms-on-hold-students-tracker
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## Configuration

1.  **Create an environment file:**

    Create a `.env` file in the root of the project by copying the example file:
    ```bash
    cp .env.sample .env
    ```

2.  **Set up environment variables:**

    Open the `.env` file and fill in the required values:

    *   `MONGO_URI`: Your MongoDB connection string.
    *   `EMAIL_USER`: The Gmail address from which emails will be sent.
    *   `EMAIL_CLIENT_ID`: Your Google Cloud project's OAuth 2.0 Client ID.
    *   `EMAIL_CLIENT_SECRET`: Your Google Cloud project's OAuth 2.0 Client Secret.
    *   `EMAIL_REFRESH_TOKEN`: The OAuth 2.0 Refresh Token for the `EMAIL_USER`.

    **Note**: To get the email-related credentials, you need to set up an OAuth 2.0 consent screen and create credentials in the [Google Cloud Console](https://console.cloud.google.com/).

3.  **Configure Users:**

    *   **Admin Users**: To designate users as administrators, add their email addresses to the `ADMIN_USERS` array in `App.tsx` (line 17).
    *   **Initiators/Agents**: To ensure users can see students assigned to them, update the `initiators` array in `types.ts` with the correct names and email addresses of your team members.

## Running the Application

To run the application in development mode, which starts both the backend and frontend servers concurrently, use the following command:

```bash
npm run dev
```

*   The backend server will run on `http://localhost:5000`.
*   The frontend development server will be accessible at the URL provided by Vite (usually `http://localhost:5173`).

## Building for Production

To build the frontend for production, run:

```bash
npm run build
```

The production-ready files will be in the `dist` directory. To run the application in a production-like environment, you would typically serve the contents of the `dist` directory with a static file server and have a reverse proxy to route `/api` requests to the Node.js backend server, which can be started with `npm start`.
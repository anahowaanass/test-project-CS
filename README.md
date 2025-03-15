
Overview
This project is a web application designed to manage events. It includes features for event creation, participant management, notifications, and real-time updates. The project uses Laravel as the backend and Next.js as the frontend. It implements real-time notifications with Soketi and integrates various APIs for event management. The app also sends notification emails, which are tested using Mailpit.

Tech Stack

Frontend: Next.js, React, TypeScript, Material-UI (MUI)
Backend: Laravel, PHP
Database: MySQL
Real-Time Communication: Soketi, Pusher
Authentication: Laravel Passport / Token-based authentication
Email Testing: Mailpit for email delivery testing
Code Quality: ESLint for linting
Features
Event creation and management
User registration and authentication
Real-time notifications for event updates and participant activities
User interface to join
Admin functionality for managing events and users
Responsive UI
Email notifications for event creation and joining
Email testing with Mailpit

Setup Instructions
1. Clone the repository
First, clone the repository to your local machine:

git clone <your-repo-url>

cd <your-repo-name>

2. Install Dependencies
Backend (Laravel)
Install PHP dependencies:

cd backend

composer install

Set up the .env file: Copy .env.example to .env and modify the environment variables as needed.

cp .env.example .env

Generate the application key:

php artisan key:generate

Run migrations to set up the database:

php artisan migrate

Run seeders to seed the database

php artisan db:seed


Make sure your .env file is correctly configured for Mailpit. For local testing, set it like this:

MAIL_MAILER=smtp
MAIL_HOST=127.0.0.1
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
This setup assumes you are running Mailpit locally. If you have a different email service, adjust the settings accordingly.

Frontend (Next.js)
Install Node.js dependencies:

cd frontend

npm install

Configure environment variables: Copy .env.example to .env.local and add the necessary environment variables for your application.

cp .env.example .env.local

Run the development server:

npm run dev

The application should now be running locally. Open your browser and go to http://localhost:3000 to access the frontend. And don't forgot to set NEXT_PUBLIC_UNDER_MAINTENANCE=false

Environment Variables
Make sure to set the following environment variables in the .env files for both backend and frontend:

Backend
DB_CONNECTION=mysql

DB_HOST=127.0.0.1

DB_PORT=3306

DB_DATABASE=<your-database>

DB_USERNAME=<your-db-username>

DB_PASSWORD=<your-db-password>

BROADCAST_DRIVER=pusher

PUSHER_APP_ID=<your-app-id>

PUSHER_APP_KEY=<your-app-key>

PUSHER_APP_SECRET=<your-app-secret>

PUSHER_HOST=127.0.0.1

PUSHER_PORT=6001

Mailpit:

MAIL_MAILER=smtp
MAIL_HOST=127.0.0.1
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null

Frontend

NEXT_PUBLIC_PUSHER_APP_KEY=<your-app-key>
NEXT_PUBLIC_PUSHER_APP_CLUSTER=<your-app-cluster>
NEXT_PUBLIC_PUSHER_SOCKET_URL=http://127.0.0.1:6001

ESLint Setup

This project uses ESLint for linting to ensure code quality and consistency. If you need to modify the linting rules or want to manually lint the project, follow these steps:

Install ESLint dependencies (if not already installed):

cd frontend

npm install eslint --save-dev

Run ESLint to check for any issues:

npm run lint

If you need to manually run ESLint on specific files, you can run:

npx eslint <file-path>



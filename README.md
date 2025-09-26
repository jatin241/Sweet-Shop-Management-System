
# Sweet-Shop-Management-System

## Project Overview
Sweet Shop Management System is a full-stack web application that allows customers to browse, search, and purchase sweets, while admins can add, update, and manage sweet inventory. The project is split into a React + TypeScript + Vite frontend and a Node.js + Express + MongoDB backend.

## Features
- Customer registration and login
- Browse and search sweets by name, category, or price
- Purchase sweets and manage cart
- Admin dashboard for adding, updating, and deleting sweets
- Secure authentication and authorization

## Setup Instructions

### Prerequisites
- Node.js (v18 or above recommended)
- npm
- MongoDB (local or cloud, e.g., MongoDB Atlas)

### Backend Setup
1. Navigate to the backend directory:
	```sh
	cd Sweet-Shop-Management-System/backend
	```
2. Install dependencies:
	```sh
	npm install
	```
3. Create a `.env` file with the following variables:
	```env
	MONGO_URL=your_mongodb_connection_string
	PORT=3000
	JWT_SECRET=your_jwt_secret
	```
4. Start the backend server:
	```sh
	npm start
	```

### Frontend Setup
1. Navigate to the frontend directory:
	```sh
	cd Sweet-Shop-Management-System/frontend
	```
2. Install dependencies:
	```sh
	npm install
	```
3. Start the frontend development server:
	```sh
	npm run dev
	```

### Running Tests (Backend)
1. In the backend directory, run:
	```sh
	npm run test
	```


## My AI Usage
### Tools Used
- GitHub Copilot

### How I Used Them
- I used GitHub Copilot to assist with code generation, bug fixing, and to suggest improvements for both backend and frontend code.
- Copilot was used to generate unit tests for backend routes and to scaffold React components quickly.
- I also used Copilot to help with writing configuration files (e.g., vercel.json) and to troubleshoot deployment errors.

### Reflection
Using AI tools like Copilot significantly improved my productivity by reducing boilerplate coding and helping me quickly resolve errors. It also provided useful suggestions for best practices and code structure. However, I always reviewed and tested the generated code to ensure correctness and security.



## Public Repository
This project is available at: [Live Demo](https://sweet-shop-management-system-3b69.vercel.app/)


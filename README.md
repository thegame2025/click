# The Game - 90s Style Web App

A simple web application with 90s retro design. The game allows users to enter their credentials and click a button to increase their counter. The goal is to reach a predefined click count.

## Features

- Simplified authentication (single form auto-detects login/register)
- Session management
- Click counter
- Goal tracking
- 90s retro UI styling

## Tech Stack

- **Backend**: Node.js with Express
- **Frontend**: HTML and CSS with EJS templates
- **Database**: MongoDB
- **Libraries**: mongoose, bcrypt, express-session

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the server:
   ```
   npm start
   ```
   
   For development with auto-restart:
   ```
   npm run dev
   ```

4. Access the application at `http://localhost:3000`

## Database Setup

The application uses MongoDB. It will automatically:
- Connect to the provided MongoDB Atlas instance
- Create the required collections (users, settings)
- Initialize the goal value if not already set

## Game Rules

1. Enter your username and password (new users are automatically registered)
2. Click the "CLICK" button to increase your counter
3. Reach the goal value to see the success message

## License

ISC 
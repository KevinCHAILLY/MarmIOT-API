# MarmIOT Backend

This is the backend API for the MarmIOT project, designed to manage IoT sensors based on ESP32.

## Features
- RESTful API for sensor management
- Event handling (e.g., button press)
- Swagger documentation
- MariaDB database integration

## Prerequisites
- Node.js (v18 or later)
- MariaDB (v10.6 or later)
- TypeScript

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example` and configure your database and server settings.

4. Build the project:
   ```bash
   npm run build
   ```

5. Start the server:
   ```bash
   npm start
   ```

## Development
- Run the server in development mode:
  ```bash
  npm run dev
  ```

- Run tests:
  ```bash
  npm test
  ```

- Lint the code:
  ```bash
  npm run lint
  ```

- Format the code:
  ```bash
  npm run format
  ```

## API Documentation
The API is documented using Swagger. After starting the server, you can access the documentation at:
```
http://localhost:3000/api-docs
```

## Project Structure
- `src/config/`: Configuration files
- `src/controllers/`: Route controllers
- `src/entities/`: Database entities
- `src/middlewares/`: Express middlewares
- `src/routes/`: API routes
- `src/services/`: Business logic
- `src/utils/`: Utility functions

## License
This project is licensed under the MIT License.
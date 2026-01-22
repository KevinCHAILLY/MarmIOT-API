# MarmIOT Frontend

This is the frontend for the MarmIOT project, built with React and Vite.

## Features
- Display list of sensors
- Display list of events
- Interactive dashboard

## Prerequisites
- Node.js (v18 or later)
- npm (v9 or later)

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Development
- Run the development server:
  ```bash
  npm run dev
  ```

- Build for production:
  ```bash
  npm run build
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

## API Integration
The frontend communicates with the backend API at `http://localhost:3000/api`.

## Project Structure
- `src/api.ts`: API service
- `src/components/`: React components
- `src/App.tsx`: Main application component

## License
This project is licensed under the MIT License.
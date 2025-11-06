# AI-Powered Presentation Generator (Frontend)

This is the frontend for an AI-powered presentation generator, built with React and Vite. It allows users to generate slides based on prompts, leveraging various AI and image APIs.

## Features

- **AI Slide Generation**: Utilizes Google Gemini and Groq SDKs to generate presentation content.
- **Rich Content**: Integrates with SERPAPI (via a backend proxy) to fetch images for slides when Gemini fails.
- **Routing**: Uses React Router for navigation.
- **Styling**: Styled with Tailwind CSS.
- **Authentication**: Includes a basic authentication context for user management.
- **Math Rendering**: Supports mathematical notations using `better-react-mathjax`.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or a compatible package manager
  -- A running instance of the backend server. By default this project uses the deployed backend at `https://mini-p-backend-kyer6f77a-aditya-bajpayees-projects.vercel.app`, or you can run a local backend on `http://localhost:3000` and update the Vite proxy or service URLs accordingly.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/Aditya-Bajpayee007/miniP.git
    ```
2.  **Navigate to the frontend directory:**
    ```sh
    cd miniP/frontend
    ```
3.  **Install NPM packages:**
    ```sh
    npm install
    ```

### Environment Variables

To run this project, you will need to add the following environment variables to a `.env.local` file in the `frontend` directory.

`VITE_GEMINI_API_KEY`
`VITE_GROQ_API_KEY`

Create the file:

```sh
touch .env.local
```

And add the following content:

```
VITE_GEMINI_API_KEY="YOUR_API_KEY"
VITE_GROQ_API_KEY="YOUR_API_KEY"
```

## Available Scripts

In the project directory, you can run:

- `npm run dev`: Runs the app in development mode. Open [http://localhost:5173](http://localhost:5173) (or another port if 5173 is busy) to view it in the browser.
- `npm run build`: Builds the app for production to the `dist` folder.
- `npm run lint`: Lints the project files using ESLint.
- `npm run preview`: Serves the production build locally to preview it.

## Project Structure

The `src` folder contains the main application logic:

- `components/`: Reusable React components.
- `context/`: React context providers (e.g., `AuthContext`).
- `pages/`: Main page components for different routes (e.g., `Slides.jsx`).
- `services/`: Modules for making API calls (e.g., `slidesService.js`).

## About-first landing

The application now opens to an About page at the root path (`/`). From the About page a user can:

- Click "Go to Home" to navigate to the protected slides page (`/home`) only when logged in.
- Use the Login or Signup buttons shown on the About page when not authenticated.

This change keeps the public project information first and gates the main slides interface behind authentication.

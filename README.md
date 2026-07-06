# AI Resume Analyzer

A complete AI Resume Analyzer web application with React + Tailwind frontend and Node.js + Express backend.

## Folder structure

- `backend/` - Express API server
- `frontend/` - React application with Tailwind CSS

## Backend setup

1. Open terminal in `backend`.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and set `OPENAI_API_KEY`.
4. Run `npm start` for production or `npm run dev` if you have `nodemon` installed.

### API endpoints

- `POST /api/upload` - upload resume file (`resume` form field)
- `POST /api/analyze` - analyze extracted resume text and selected role

## Frontend setup

1. Open terminal in `frontend`.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and set `REACT_APP_API_BASE_URL` if your backend is not running on `http://localhost:5000`.
4. Run `npm start`.
5. The app will open on `http://localhost:3000`.

## Deployment notes

- Frontend: deploy to Netlify/Vercel by connecting the frontend folder and using build command `npm run build`.
- Backend: deploy to Render by connecting the backend folder and using `npm start`.
- Set `OPENAI_API_KEY` in the backend service environment variables.
- Set `REACT_APP_API_BASE_URL` in Vercel to your deployed backend URL, for example `https://your-backend.onrender.com`.

## Features

- Resume upload via drag-and-drop
- Extract text from PDF / DOCX
- Resume analysis with scoring and AI feedback
- Job role keyword matching
- ATS compatibility insights
- Responsive SaaS-style UI
- Dark mode toggle

## Optional enhancements

- Add MongoDB history storage
- Add PDF feedback download
- Add user authentication

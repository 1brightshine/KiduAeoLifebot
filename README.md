# Kidu Chatbot

This project combines a simple HTML/JS chat UI with a Node.js backend that sends requests to the Gemini API.

## 1. Install dependencies

```bash
npm install
```

## 2. Add your Gemini API key

Create a `.env` file based on `.env.example`:

```bash
copy .env.example .env
```

Then update the key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

## 3. Run the app

```bash
npm start
```

Then open:

```text
http://localhost:3000
```

## Deploy to Vercel

Import this repository into Vercel, then add the environment variable
`GEMINI_API_KEY` in the project settings. Do not upload `.env` to Vercel or GitHub.

Vercel serves `index.html` as the website and uses `api/chat.js` for `/api/chat`.

## Notes

- The frontend sends chat history to the backend at `/api/chat`.
- The backend never exposes the API key in the browser.
- The frontend uses the same origin, so there is no CORS issue.

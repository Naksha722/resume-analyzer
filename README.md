# Resume Analyzer — Setup & Deployment Guide

## Project Structure

```
resume-analyzer/
├── backend/
│   ├── main.py                  # FastAPI entry point
│   ├── requirements.txt
│   ├── .env.example
│   ├── routers/
│   │   ├── upload.py            # POST /upload_pdf
│   │   ├── analyze.py           # POST /analyze_resume
│   │   ├── keywords.py          # POST /suggest_keywords
│   │   └── enhance.py           # POST /improve_resume
│   ├── services/
│   │   ├── pdf_extractor.py     # PDF → text
│   │   ├── ats_scorer.py        # Rule-based ATS scoring
│   │   └── llm_service.py       # Claude API calls
│   └── models/
│       └── schemas.py           # Pydantic models
└── frontend/
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx             # Upload page
    │   ├── dashboard/page.tsx   # Analysis dashboard
    │   ├── keywords/page.tsx    # Keyword gaps
    │   └── enhance/page.tsx     # Resume enhancement
    ├── components/
    │   ├── ui/
    │   │   ├── Navbar.tsx
    │   │   └── Providers.tsx
    │   └── charts/
    │       ├── ScoreGauge.tsx
    │       └── BreakdownChart.tsx
    ├── hooks/
    │   └── useResumeStore.ts    # Global state
    ├── lib/
    │   └── api.ts               # API client
    └── package.json
```

---

## Local Development

### 1. Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# Run the server
uvicorn main:app --reload --port 8000
```

API docs available at: http://localhost:8000/docs

### 2. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Set environment variables
cp .env.local.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Run dev server
npm run dev
```

App available at: http://localhost:3000

---

## Getting Your Anthropic API Key

1. Go to https://console.anthropic.com
2. Sign up / log in
3. Navigate to API Keys → Create Key
4. Copy the key into your backend `.env` file

---

## Deployment

### Backend → Render (free tier)

1. Push your `backend/` folder to a GitHub repo
2. Go to https://render.com → New → Web Service
3. Connect your GitHub repo
4. Set these values:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Environment:** Python 3
5. Add environment variable:
   - `ANTHROPIC_API_KEY` = your key
   - `FRONTEND_URL` = your Vercel URL (add after deploying frontend)
6. Click Deploy

Your backend URL will be: `https://your-app-name.onrender.com`

### Frontend → Vercel

1. Push your `frontend/` folder to a GitHub repo (or the same repo, different folder)
2. Go to https://vercel.com → New Project
3. Import your repo
4. Set **Root Directory** to `frontend`
5. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = your Render backend URL
6. Click Deploy

Your frontend URL will be: `https://your-app.vercel.app`

### Final Step: Connect them

After both are deployed:
1. Go to Render → your backend service → Environment
2. Update `FRONTEND_URL` to your Vercel URL
3. Redeploy backend

---

## Example API Calls

### Upload PDF
```bash
curl -X POST http://localhost:8000/upload_pdf \
  -F "file=@resume.pdf"
```

### Analyze Resume
```bash
curl -X POST http://localhost:8000/analyze_resume \
  -H "Content-Type: application/json" \
  -d '{"resume_text": "John Doe\nSoftware Engineer\n5 years experience..."}'
```

### Suggest Keywords
```bash
curl -X POST http://localhost:8000/suggest_keywords \
  -H "Content-Type: application/json" \
  -d '{"resume_text": "...", "job_description": "We are looking for..."}'
```

### Improve Resume
```bash
curl -X POST http://localhost:8000/improve_resume \
  -H "Content-Type: application/json" \
  -d '{"resume_text": "..."}'
```

---

## Estimated Costs

| Usage | Monthly Cost |
|---|---|
| 100 resumes analyzed | ~$2–4 |
| 500 resumes analyzed | ~$10–20 |
| 1000 resumes analyzed | ~$20–40 |

Claude Sonnet is cost-efficient for this use case. Each full analysis (analyze + keywords + enhance) uses ~3,000–5,000 tokens.

---

## Next Features to Add (after launch)

- [ ] User authentication (NextAuth.js)
- [ ] Save analysis history (Supabase)
- [ ] Export improved resume as PDF
- [ ] Side-by-side original vs improved view
- [ ] Job description matching score
- [ ] Email results to user

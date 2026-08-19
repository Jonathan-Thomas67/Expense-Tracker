# Expense Tracker

A simple personal income & expense tracking web app.

**Stack:** React (Vite) · Django REST Framework · MySQL (SQLite for quick local dev) · JWT auth · Recharts

```
expense-tracker/
├── backend/    Django REST API
├── frontend/   React app (Vite)
└── docs/       Requirements & design docs (single source of truth)
```

The `docs/` folder is the single source of truth for scope — see `SRS.md`,
`DATABASE_DESIGN.md`, `API_SPEC.md` and `DEVELOPMENT_PLAN.md`.

## 1. Backend setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env            # then edit DB_ENGINE / DB_* as needed
```

**Quick start (no MySQL required):** leave `DB_ENGINE=sqlite` (or delete
that line) in `.env` and skip straight to migrations below.

**With MySQL** (matches `docs/DATABASE_DESIGN.md`): create a database first,
then in `.env` set:

```
DB_ENGINE=mysql
DB_NAME=expense_tracker
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306
```

Then, either way:

```bash
python manage.py migrate
python manage.py seed_categories     # creates default categories from SRS.md
python manage.py createsuperuser     # optional, for /admin/
python manage.py runserver
```

Backend runs at **http://127.0.0.1:8000**. Run the test suite anytime with:

```bash
python manage.py test
```

## 2. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env   # VITE_API_URL defaults to http://127.0.0.1:8000/api
npm run dev
```

Frontend runs at **http://localhost:5173**.

## 3. Try it out

Register → log in → add a category (or use the seeded defaults) → add
income → add an expense → set a budget → check the dashboard → view
reports → export CSV/Excel.

## 4. Git workflow (per docs/DEVELOPMENT_PLAN.md)

```bash
git init
git add .
git commit -m "Initial commit: Expense Tracker (backend + frontend)"
```

Commit after each phase of work; use `git restore .` or reset to a previous
commit if an AI-driven change breaks something.

## Notes

- `docs/DEVELOPMENT_PLAN.md` outlines the original phase-by-phase build
  plan this project followed (Django setup → apps → models → JWT → each
  API → each React page → final integration testing).
- Dashboard and report figures are calculated live from the Expense/Income/
  Budget tables — there is no separate dashboard table, per the DB design
  notes.
- The `AI / OCR / bank integration / notifications / mobile app` items
  listed as "Do Not Implement Initially" in the development plan were
  intentionally left out of this build.

# Development Plan

## Expense Tracking System

This plan is intentionally simple for first-year college students.

## Phase 1 --- Setup

### Backend

-   Install Python
-   Create Django project
-   Install Django REST Framework
-   Configure MySQL
-   Configure CORS

### Frontend

-   Create React project
-   Install Axios
-   Install React Router
-   Install Recharts

Architecture:

`React → Django REST API → MySQL`

## Phase 2 --- Database

Create: 1. User 2. Category 3. Expense 4. Income 5. Budget

Create relationships and migrations.

## Phase 3 --- Authentication

Implement: - Register - Login - JWT - Logout - Profile

Test protected APIs.

## Phase 4 --- Categories

Implement: - List - Add - Edit - Delete

## Phase 5 --- Expenses

Implement: - Add - List - Edit - Delete - Search - Filter - Pagination

React: - Expense List - Expense Form

## Phase 6 --- Income

Implement: - Add - List - Edit - Delete - Search - Filter - Pagination

React: - Income List - Income Form

## Phase 7 --- Budgets

Implement: - Add budget - List budgets - Edit budget - Delete budget -
Show budget usage

Example:

`Food Budget ₹10,000 / Expense ₹7,000 / Used 70%`

## Phase 8 --- Dashboard

### KPI Cards

-   Total Income
-   Total Expense
-   Balance
-   Monthly Expense

### Charts

-   Category Expense Pie Chart
-   Monthly Income vs Expense Bar Chart

### Other

-   Recent Transactions
-   Budget Summary

## Phase 9 --- Reports

Create: - Monthly report - Category report - Income/expense summary

Filters: - Date - Category - Type

## Phase 10 --- Export

Implement: - CSV - Excel

PDF can be added later.

## Phase 11 --- Testing

### Backend

Test registration, login, JWT, Expense CRUD, Income CRUD, Category CRUD,
Budget CRUD, Dashboard and Reports.

### Validation

Test empty fields, invalid email, duplicate email, negative amount, zero
amount and invalid date.

### Security

Test that User A cannot see or modify User B's financial records and
unauthenticated users cannot access protected APIs.

### Frontend

Test login, forms, dashboard, navigation and API errors.

## Phase 12 --- Final Integration

``` text
Register
   ↓
Login
   ↓
Create Category
   ↓
Add Income
   ↓
Add Expense
   ↓
Create Budget
   ↓
View Dashboard
   ↓
View Report
   ↓
Export Data
```

## Simple Project Structure

``` text
expense-tracker/
├── backend/
│   ├── manage.py
│   ├── config/
│   ├── users/
│   ├── categories/
│   ├── expenses/
│   ├── income/
│   ├── budgets/
│   └── dashboard/
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── context/
│       └── utils/
│
└── docs/
    ├── SYSTEM_REQUIREMENT_ANALYSIS.md
    ├── SRS.md
    ├── API_SPEC.md
    ├── DATABASE_DESIGN.md
    └── DEVELOPMENT_PLAN.md
```

## React Pages

-   Login
-   Register
-   Dashboard
-   Expenses
-   Income
-   Categories
-   Budgets
-   Reports
-   Profile

## Django Applications

-   users
-   categories
-   expenses
-   income
-   budgets
-   dashboard

Reports can initially be handled with simple API logic without creating
another Django app.

## Do Not Implement Initially

-   AI
-   OCR
-   Bank integration
-   UPI API integration
-   Recurring transactions
-   Email/WhatsApp notifications
-   Mobile application
-   Complex admin dashboard
-   Advanced analytics
-   PDF generation

## Final Scope

``` text
              EXPENSE TRACKER
                    |
       +------------+------------+
       |            |            |
     React        Django       MySQL
    Frontend     Backend      Database
       |            |
       +------------+
             JWT
              |
     Users / Expenses
     Income / Budgets
     Categories / Reports
```

# System Requirement Analysis

## Expense Tracking System

### Purpose

A simple web application to record and manage personal income and
expenses.

### Technology

-   Frontend: React.js
-   Backend: Django + Django REST Framework
-   Database: MySQL
-   Authentication: JWT
-   Charts: Recharts

### Users

**User:** Register, login, manage expenses, income, categories and
budgets, and view dashboard/reports.

**Admin:** Manage users and default categories.

### Main Modules

1.  Login/Register
2.  Dashboard
3.  Expenses
4.  Income
5.  Categories
6.  Budgets
7.  Reports

### Basic Rules

-   Amount must be greater than zero.
-   Email must be unique.
-   Users can see only their own financial records.
-   Balance = Income - Expense.
-   Budget is monthly and category-based.

### MVP

Registration/Login, JWT, Expenses, Income, Categories, Budgets,
Dashboard, Reports and CSV/Excel export.

Future features: recurring transactions, notifications, PDF, AI and
external bank integrations.

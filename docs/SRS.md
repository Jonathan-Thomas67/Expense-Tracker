# Software Requirements Specification (SRS)

## Expense Tracking System

**Version:** 1.0

## 1. Introduction

The system is a simple web application for managing personal income and
expenses.

## 2. Technology Stack

  Part             Technology
  ---------------- -----------------------
  Frontend         React.js
  Backend          Django REST Framework
  Database         MySQL
  Authentication   JWT
  Charts           Recharts
  API              REST API

## 3. User Roles

### User

-   Register and login
-   Manage expenses and income
-   Manage categories
-   Manage budgets
-   View dashboard
-   View reports

### Admin

-   Manage users
-   Manage default categories

## 4. Functional Requirements

### FR-01 Registration

Name, email, mobile and password. Email must be unique.

### FR-02 Login

Login using email and password. Backend returns JWT tokens.

### FR-03 Expense Management

Add, view, edit and delete expenses.

Fields: date, category, amount, payment method, description.

Payment methods: Cash, Card, UPI, Bank.

### FR-04 Income Management

Add, view, edit and delete income.

Fields: date, category, amount, payment method, description.

### FR-05 Category Management

Users can create custom categories.

Expense examples: Food, Travel, Shopping, Rent, Education, Utilities,
Others.

Income examples: Salary, Business, Freelancing, Investment, Other
Income.

### FR-06 Budget Management

Create a monthly budget for a category.

Example: Food - August 2026 - ₹10,000.

### FR-07 Dashboard

Display total income, total expense, balance, monthly expense, recent
transactions, category expense chart and monthly income/expense chart.

### FR-08 Search and Filter

Filter by date, category and transaction type.

### FR-09 Reports

Provide monthly expense report, category report and income/expense
summary.

### FR-10 Export

Export data as CSV and Excel.

## 5. Business Rules

1.  Amount must be greater than zero.
2.  Email must be unique.
3.  Users can access only their own data.
4.  Balance = Total Income - Total Expense.
5.  Budget amount must be greater than zero.
6.  Category is required.

## 6. Non-Functional Requirements

-   Simple responsive interface
-   Secure password storage
-   JWT authentication
-   MySQL persistence
-   Server-side validation
-   Basic API error handling
-   Pagination for transaction lists

## 7. MVP

Registration/Login, JWT, Expense CRUD, Income CRUD, Categories, Budgets,
Dashboard, Search/Filter, Monthly Reports, Charts and CSV/Excel export.

## 8. Future Features

Recurring transactions, notifications, PDF reports, AI prediction, OCR,
bank integration and mobile application.

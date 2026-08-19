# API Specification

## Expense Tracking System

**Base URL:** `/api/`\
**Format:** JSON\
**Authentication:** JWT

## 1. Authentication

### Register

`POST /api/auth/register/`

``` json
{
  "name": "John",
  "email": "john@gmail.com",
  "mobile": "9876543210",
  "password": "123456"
}
```

### Login

`POST /api/auth/login/`

``` json
{
  "email": "john@gmail.com",
  "password": "123456"
}
```

Response:

``` json
{
  "access": "jwt_access_token",
  "refresh": "jwt_refresh_token",
  "user": {
    "id": 1,
    "name": "John"
  }
}
```

### Profile

-   `GET /api/profile/`
-   `PUT /api/profile/`

## 2. Categories

-   `GET /api/categories/`
-   `POST /api/categories/`
-   `PUT /api/categories/{id}/`
-   `DELETE /api/categories/{id}/`

Example:

``` json
{
  "name": "Food",
  "type": "expense"
}
```

## 3. Expenses

-   `GET /api/expenses/`
-   `POST /api/expenses/`
-   `GET /api/expenses/{id}/`
-   `PUT /api/expenses/{id}/`
-   `DELETE /api/expenses/{id}/`

Filters: `category`, `from_date`, `to_date`.

Example:

``` json
{
  "category_id": 1,
  "amount": 500,
  "expense_date": "2026-08-18",
  "payment_method": "UPI",
  "description": "Lunch"
}
```

## 4. Income

-   `GET /api/income/`
-   `POST /api/income/`
-   `GET /api/income/{id}/`
-   `PUT /api/income/{id}/`
-   `DELETE /api/income/{id}/`

Example:

``` json
{
  "category_id": 2,
  "amount": 50000,
  "income_date": "2026-08-01",
  "payment_method": "Bank",
  "description": "Salary"
}
```

## 5. Budgets

-   `GET /api/budgets/`
-   `POST /api/budgets/`
-   `GET /api/budgets/{id}/`
-   `PUT /api/budgets/{id}/`
-   `DELETE /api/budgets/{id}/`

Example:

``` json
{
  "category_id": 1,
  "month": 8,
  "year": 2026,
  "amount": 10000
}
```

## 6. Dashboard

`GET /api/dashboard/`

``` json
{
  "total_income": 50000,
  "total_expense": 18000,
  "balance": 32000,
  "monthly_expense": 18000,
  "recent_transactions": [],
  "category_expenses": [],
  "monthly_summary": []
}
```

## 7. Reports

-   `GET /api/reports/?month=8&year=2026`
-   `GET /api/reports/?category=1`
-   `GET /api/reports/?type=expense`

## 8. Export

-   `GET /api/reports/export/csv/`
-   `GET /api/reports/export/excel/`

## 9. Authentication Rule

Protected APIs require:

`Authorization: Bearer <access_token>`

Users can access only their own financial records.

## 10. HTTP Status Codes

  Code   Meaning
  ------ -------------------
  200    Success
  201    Created
  400    Invalid data
  401    Login required
  403    Permission denied
  404    Not found
  500    Server error

## 11. Error Example

``` json
{
  "message": "Amount must be greater than zero."
}
```

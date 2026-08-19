# Database Design

## Expense Tracking System

**Database:** MySQL\
**Currency:** INR

## 1. Main Tables

1.  users
2.  categories
3.  expenses
4.  incomes
5.  budgets

## 2. users

  Column       Type           Key
  ------------ -------------- --------
  id           BIGINT         PK
  name         VARCHAR(100)   
  email        VARCHAR(150)   UNIQUE
  mobile       VARCHAR(15)    
  password     VARCHAR(255)   
  role         VARCHAR(20)    
  created_at   DATETIME       

## 3. categories

  Column    Type           Key
  --------- -------------- ----------
  id        BIGINT         PK
  user_id   BIGINT         FK, NULL
  name      VARCHAR(100)   
  type      VARCHAR(20)    
  status    BOOLEAN        

Type: `expense` or `income`.

`user_id = NULL` can represent a default category.

## 4. expenses

  Column           Type            Key
  ---------------- --------------- -----
  id               BIGINT          PK
  user_id          BIGINT          FK
  category_id      BIGINT          FK
  amount           DECIMAL(12,2)   
  expense_date     DATE            
  payment_method   VARCHAR(20)     
  description      VARCHAR(255)    
  created_at       DATETIME        

## 5. incomes

  Column           Type            Key
  ---------------- --------------- -----
  id               BIGINT          PK
  user_id          BIGINT          FK
  category_id      BIGINT          FK
  amount           DECIMAL(12,2)   
  income_date      DATE            
  payment_method   VARCHAR(20)     
  description      VARCHAR(255)    
  created_at       DATETIME        

## 6. budgets

  Column        Type            Key
  ------------- --------------- -----
  id            BIGINT          PK
  user_id       BIGINT          FK
  category_id   BIGINT          FK
  month         INT             
  year          INT             
  amount        DECIMAL(12,2)   
  created_at    DATETIME        

One user should have one budget for a category/month/year combination.

## 7. Relationships

``` text
USER
 |
 +----< EXPENSES >---- CATEGORY
 |
 +----< INCOMES >----- CATEGORY
 |
 +----< BUDGETS >----- CATEGORY
 |
 +----< CATEGORIES
```

## 8. Rules

-   Email must be unique.
-   Password must be hashed by Django.
-   Expense amount \> 0.
-   Income amount \> 0.
-   Budget amount \> 0.
-   Month must be 1--12.
-   Category is required.
-   User ID is required for financial records.

## 9. Django Models

Create: - User - Category - Expense - Income - Budget

Use `ForeignKey` for relationships, `DecimalField` for money,
`DateField` for dates and Django migrations.

## 10. Student Note

Do not create separate tables for dashboard or reports. Calculate
dashboard and report values from the transaction tables.

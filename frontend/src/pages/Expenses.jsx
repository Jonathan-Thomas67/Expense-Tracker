import Layout from "../components/Layout";
import TransactionPage from "../components/TransactionPage";
import { listExpenses, createExpense, updateExpense, deleteExpense } from "../services/expenses";

export default function Expenses() {
  return (
    <Layout>
      <TransactionPage
        title="Expenses"
        categoryType="expense"
        dateField="expense_date"
        listFn={listExpenses}
        createFn={createExpense}
        updateFn={updateExpense}
        deleteFn={deleteExpense}
      />
    </Layout>
  );
}

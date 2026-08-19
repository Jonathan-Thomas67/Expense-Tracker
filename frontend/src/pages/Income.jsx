import Layout from "../components/Layout";
import TransactionPage from "../components/TransactionPage";
import { listIncome, createIncome, updateIncome, deleteIncome } from "../services/income";

export default function Income() {
  return (
    <Layout>
      <TransactionPage
        title="Income"
        categoryType="income"
        dateField="income_date"
        listFn={listIncome}
        createFn={createIncome}
        updateFn={updateIncome}
        deleteFn={deleteIncome}
      />
    </Layout>
  );
}

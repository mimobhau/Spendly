import { useEffect, useState } from "react";
// useState - React hook to store and update component state (transactions, formInputs)
// useEffect - React hook for side-effects (like saving to localStorage)
import "./index.css"
// for Tailwind

function formatCurrency(amount)
{
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(amount)
}
// uses Javascript's 'Int1.NumberFormat' to format numbers into USD currency strings
// ex, 100 -> $100.00

const App = () => {
  const [transactions, setTransactions] = useState(() => {
    const stored = localStorage.getItem("transactions")
    return stored ? JSON.parse(stored) : []
  })
  /**
   *  'transactions' -- the current list of income/expenses
   *  'transactions' -- an array of {id, description, amount}
   *  'setTransactions()' -- a function used to update that list
   *   initialises state from 'localStorage' so the list "persists after refresh"
   *   start with data fromn localStorage (if any), or else start with an empty list
   */

  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  // holds values from the user

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions))
  }, [transactions])
  /**
   *  'localStorage.setItem()' -- saves the list as a string
   *   whenever 'transactions' change, they are saved to localStorage
   *  'JSON.stringify()' -- converts a JS object to a string (so it can be saved)
   */

  const handleSubmit = (e) => {
    e.preventDefault()
    // prevents the page from 'reloading'
    const newTransaction = {
      id: Date.now(),
      description,
      amount: parseFloat(amount) || 0
    }
    /**
     *  takes all the input values for the 'fields' from the user
     *  creates a new transaction 'object' with fields {id, description, amount}
     *  'parseFloat(amount)' -- coverts string to float
     */

    setTransactions([newTransaction, ...transactions])
    // adds the 'object' to the top of the array/list
    setDescription("")              // clears form
    setAmount("")              // clears form
  }

  const removeTransaction = (id) => {
    setTransactions(transactions.filter((tx) => tx.id !== id))
  }
  /**
   * 'filter()' -- goes through every item & keeps only those who don't match the ID
   *  filters out the transaction by 'id'
   *  'useEffect' then updates the state with the new list (minus the deleted ones)
   */

  // splits transactions into 'income' & 'expenses'
  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0)
  // if 'amount > 0' (that is, positive), then it comes under income

  /**
   * ".reduce()" function is used to 'loop through an array' [here, transactions] & combine all its values into a single result
   *  (acc, t) => acc + t.amount
   *          'acc' : short for "accumulator" - keeps track of the total as we go
   *          't' : the current transaction in the list
   */

  const expenses = transactions
    .filter((t) => t.amount < 0)
    .reduce((acc, t) => acc + t.amount, 0)
   // if 'amount < 0' (that is, negative), then it comes under expenses

  const balance = income + expenses
  // final balance

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-700 to-green-700 flex items-center justify-center p-4 text-gray-800">
      <div className="w-full max-w-6xl bg-white p-6 md:p-8 rounded-3xl shadow-2xl">
        <h1 className="text-center text-2xl sm:text-3xl font-semibold text-gray-900 mb-8">
          Expense Tracker
        </h1>

        <div className="text-center mb-10 p-5 md:p-6 rounded-xl bg-gradient-to-br from-green-200 to-green-600 shadow-md">
          <h2 className="text-lg sm:text-xl font-medium">
            Your Balance
          </h2>
          <h1 className="text-4xl sm:text-5xl my-4">
            {formatCurrency(balance)}
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-6">
            <div className="bg-white p-5 sm:p-6 rounded-xl shadow hover:-translate-y-1 transition">
              <h3 className="text-green-600 font-medium">
                Income
              </h3>
              <p className="text-xl sm:text-2xl font-semibold text-green-600 mt-2">
                {formatCurrency(income)}
              </p>
            </div>

            <div className="bg-white p-5 sm:p-6 rounded-xl shadow hover:-translate-y-1 transition">
              <h3 className="text-red-600 font-medium">
                Expenses
              </h3>
              <p className="text-xl sm:text-2xl font-semibold text-red-600 mt-2">
                {formatCurrency(expenses)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <h2 className="text-lg sm:text-xl font-medium mb-4">
              Transactions
            </h2>
            <ul className="overflow-y-auto max-h-[400px] sm:max-h-[500px] pr-2 space-y-3">
              {transactions.map((t) => (
                <li
                  key={t.id}
                  className={`flex justify-between items-center p-4 rounded-xl shadow border-r-4 transition-all animate-slideIn ${
                    t.amount > 0 ? "border-gray-600" : "border-red-600"
                  }`}
                >
                  <span className="text-sm sm:text-base">
                    {t.description}
                  </span>
                  <span className="flex items-center gap-2 text-sm sm:text-base">
                    {formatCurrency(t.amount)}
                    <button
                      className="text-red-600 text-lg sm:text-xl opacity-0 hover:opacity-100 hover:bg-red-100 rounded px-2 py-1 transition"
                      onClick={() => removeTransaction(t.id)}
                    >
                      &times;
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 sm:p-6 rounded-xl shadow flex flex-col">
            <h2 className="text-lg sm:text-xl font-medium mb-4">
              Add Transactions
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-grow">
              <div>
                <label className="block mb-2 text-gray-700 font-medium">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder="Enter description..."
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-700 font-medium">
                  Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder="Enter amount..."
                />
                <small className="text-gray-500 text-xs sm:text-sm">
                  Use negative (-) for expenses
                </small>
              </div>

              <button
                type="submit"
                className="mt-auto w-full py-3 bg-gradient-to-r from-green-700 to-green-500 text-white rounded-lg shadow-md hover:-translate-y-1 transition"
              >
                Add Transaction
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  )
}

export default App
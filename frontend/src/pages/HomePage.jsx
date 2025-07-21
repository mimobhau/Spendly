import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { LogOut, Pencil, Trash2 } from 'lucide-react';

const BASE_URL = import.meta.env.MODE === "development"
  ? import.meta.env.VITE_API_URL
  : "/api"

const HomePage = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [fullName, setFullName] = useState('');
  const [editId, setEditId] = useState(null);
  const [editDescription, setEditDescription] = useState('');
  const [editAmount, setEditAmount] = useState('');

  const navigate = useNavigate();

  const fetchHomeData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/auth`, { withCredentials: true });
      const { fullName, balance, income, expenses, transactions } = res.data;
      setFullName(fullName);
      setBalance(balance);
      setIncome(income);
      setExpenses(expenses);
      setTransactions(transactions);
    } catch (err) {
      console.error('Error fetching home data:', err);
      navigate('/login');
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (!description || !amount) return toast.error("Please fill in all fields");
    try {
      const res = await axios.post(`${BASE_URL}/transactions/add`, {
        description,
        amount: parseFloat(amount)
      }, { withCredentials: true });

      if (res.status === 200) {
        toast.success("Transaction added!");
        setDescription('');
        setAmount('');
        fetchHomeData();
      }
    } catch (err) {
      console.error("Add transaction failed", err);
      toast.error("Something went wrong");
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/transactions/${id}`, { withCredentials: true });
      toast.success("Transaction deleted!");
      fetchHomeData();
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete");
    }
  };

  const handleEditTransaction = (transaction) => {
    setEditId(transaction._id);
    setEditDescription(transaction.description);
    setEditAmount(transaction.amount);
  };

  const handleUpdateTransaction = async (e) => {
    e.preventDefault();
    if (!editDescription || !editAmount) return toast.error("All fields required");

    try {
      await axios.put(`${BASE_URL}/transactions/${editId}`, {
        description: editDescription,
        amount: parseFloat(editAmount)
      }, { withCredentials: true });

      toast.success("Transaction updated!");
      setEditId(null);
      setEditDescription('');
      setEditAmount('');
      fetchHomeData();
    } catch (err) {
      console.error("Update failed", err);
      toast.error("Failed to update");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/auth/signout`, {}, { withCredentials: true });
      navigate('/login');
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Logout failed");
    }
  };

  return (
    <div className='min-h-screen bg-green-700 text-black'>
      {/* Navbar */}
      <nav className='bg-white p-4 flex justify-between items-center shadow-md'>
        <h1 className='text-3xl font-bold text-green-700'>Spendly</h1>
        <button
          onClick={handleLogout}
          className='flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition'
        >
          <LogOut size={18} />
          Logout
        </button>
      </nav>

      {/* Content */}
      <div className='max-w-4xl mx-auto bg-white p-6 mt-6 rounded-lg shadow-lg'>
        <h2 className='text-2xl font-semibold mb-6'>Welcome, {fullName}</h2>

        {/* Balance */}
        <div className='bg-green-200 p-6 rounded-lg text-center'>
          <p className='text-sm'>Your Balance</p>
          <h2 className='text-3xl font-bold'>₹{balance.toFixed(2)}</h2>
        </div>

        {/* Income & Expenses */}
        <div className='grid grid-cols-2 gap-4 mt-4'>
          <div className='bg-green-50 p-4 text-center rounded'>
            <p className='text-green-600 font-semibold'>Income</p>
            <h3 className='font-bold'>₹{income.toFixed(2)}</h3>
          </div>
          <div className='bg-red-50 p-4 text-center rounded'>
            <p className='text-red-600 font-semibold'>Expenses</p>
            <h3 className='font-bold text-red-600'>-₹{Math.abs(expenses).toFixed(2)}</h3>
          </div>
        </div>

        {/* Transactions List & Add Transaction */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
          {/* Transactions */}
          <div>
            <h3 className='font-semibold mb-2'>Transactions</h3>
            <ul className='space-y-2 max-h-64 overflow-y-auto pr-2'>
              {transactions.length > 0 ? transactions.map((tx) => (
                <li
                  key={tx._id}
                  className={`flex flex-col border rounded-md p-2 ${tx.amount < 0 ? 'border-red-400' : 'border-green-400'}`}
                >
                  {editId === tx._id ? (
                    <form onSubmit={handleUpdateTransaction} className='space-y-2'>
                      <input
                        className='w-full p-1 border rounded'
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                      />
                      <input
                        className='w-full p-1 border rounded'
                        type='number'
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                      />
                      <button type='submit' className='bg-blue-500 text-white px-2 py-1 rounded'>Save</button>
                    </form>
                  ) : (
                    <div className='flex justify-between items-center'>
                      <span>{tx.description}</span>
                      <div className='flex gap-2 items-center'>
                        <span className={`${tx.amount < 0 ? 'text-red-500' : 'text-green-600'}`}>
                          {tx.amount < 0 ? '-' : '+'}₹{Math.abs(tx.amount).toFixed(2)}
                        </span>
                        <button onClick={() => handleEditTransaction(tx)} className='text-blue-600'>
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => handleDeleteTransaction(tx._id)} className='text-red-600'>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              )) : (
                <p>No transactions yet.</p>
              )}
            </ul>
          </div>

          {/* Add Transaction */}
          <div className='bg-gray-100 p-4 rounded-md'>
            <h3 className='font-semibold mb-4'>Add Transactions</h3>
            <form onSubmit={handleAddTransaction} className='space-y-4'>
              <input
                type='text'
                placeholder='Description'
                className='w-full p-2 border rounded-md'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <input
                type='number'
                placeholder='Amount'
                className='w-full p-2 border rounded-md'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <p className='text-sm text-gray-600'>Use negative (-) for expenses</p>
              <button
                type='submit'
                className='w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition'
              >
                Add Transaction
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

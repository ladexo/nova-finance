import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kgjusqdtfdcunhrczheu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnanVzcWR0ZmRjdW5ocmN6aGV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzNjU5NTYsImV4cCI6MjA5OTk0MTk1Nn0.H1FdbQuj4g5cL7RKrJhVg7xagGdBML_RmmXh3KHsoU0';
const supabase = createClient(supabaseUrl, supabaseKey);

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const years = Array.from({ length: 100 }, (_, i) => 2025 + i);

type ExpenseItem = { id: string; name: string; amount: number; };

const NovaFinance = () => {
  const [currentView, setCurrentView] = useState('Dashboard');
  const [income, setIncome] = useState<number>(0);
  const [actualSavings, setActualSavings] = useState<number>(0);
  const [expensesList, setExpensesList] = useState<ExpenseItem[]>([]);
  const [selectedMonth, setSelectedMonth] = useState('July');
  const [selectedYear, setSelectedYear] = useState(2026);
  const [loading, setLoading] = useState(false);
  const [newExpenseName, setNewExpenseName] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');

  const totalExpenses = expensesList.reduce((sum, item) => sum + item.amount, 0);
  const unallocated = income - totalExpenses - actualSavings;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('monthly_data')
        .select('*')
        .eq('month', selectedMonth)
        .eq('year', selectedYear)
        .single();
      
      if (data) {
        setIncome(data.income || 0);
        setActualSavings(data.savings || 0);
        setExpensesList(data.itemized_expenses || []);
      } else {
        setIncome(0);
        setActualSavings(0);
        setExpensesList([]);
      }
      setLoading(false);
    };
    fetchData();
  }, [selectedMonth, selectedYear]);

  const addExpense = () => {
    if (!newExpenseName || !newExpenseAmount) return;
    setExpensesList([...expensesList, { id: crypto.randomUUID(), name: newExpenseName, amount: Number(newExpenseAmount) }]);
    setNewExpenseName('');
    setNewExpenseAmount('');
  };

  const removeExpense = (idToRemove: string) => setExpensesList(expensesList.filter(item => item.id !== idToRemove));

  const saveData = async () => {
    setLoading(true);
    const { error } = await supabase.from('monthly_data').upsert({ 
      year: selectedYear, month: selectedMonth, income, expenses: totalExpenses, savings: actualSavings, itemized_expenses: expensesList 
    });
    setLoading(false);
    if (error) alert("Error: " + error.message);
    else alert("Cloud sync successful.");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex font-sans">
      <aside className="hidden md:flex flex-col w-64 border-r border-white/5 bg-[#0d0d0d] p-6">
        <h1 className="text-2xl font-light tracking-tighter mb-12 text-emerald-400">Nova.</h1>
        <nav className="flex flex-col gap-2">
          {['Dashboard', 'Analytics', 'Transactions', 'Settings'].map((tab) => (
            <button key={tab} onClick={() => setCurrentView(tab)} className={`text-left px-4 py-3 rounded-lg transition-all ${currentView === tab ? 'bg-white/10 text-white font-medium' : 'text-gray-500 hover:text-white'}`}>
              {tab}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        {currentView === 'Dashboard' && (
          <>
            <header className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-extralight">Financial Ledger</h2>
              <div className="flex gap-2">
                <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="bg-black border border-white/10 px-3 py-1 rounded-lg text-sm">{months.map(m => <option key={m} value={m}>{m}</option>)}</select>
                <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className="bg-black border border-white/10 px-3 py-1 rounded-lg text-sm">{years.map(y => <option key={y} value={y}>{y}</option>)}</select>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/5 p-6 rounded-2xl"><p className="text-xs text-gray-500 uppercase">Income</p><input type="number" value={income} onChange={(e) => setIncome(Number(e.target.value))} className="bg-transparent w-full text-3xl font-bold mt-2 outline-none" /></div>
              <div className="bg-white/5 p-6 rounded-2xl"><p className="text-xs text-gray-500 uppercase">Expenses</p><h3 className="text-3xl font-bold text-rose-400 mt-2">${totalExpenses.toLocaleString()}</h3></div>
              <div className="bg-white/5 p-6 rounded-2xl"><p className="text-xs text-gray-500 uppercase">Savings</p><input type="number" value={actualSavings} onChange={(e) => setActualSavings(Number(e.target.value))} className="bg-transparent w-full text-3xl font-bold text-emerald-400 mt-2 outline-none" /></div>
            </div>

            <div className={`p-6 rounded-2xl mb-8 ${unallocated < 0 ? 'bg-rose-900/20' : 'bg-white/5'}`}>
              <p>Remaining to Allocate: <span className="font-bold text-xl">${unallocated.toLocaleString()}</span></p>
            </div>

            <div className="bg-white/5 rounded-2xl p-6">
              <div className="flex gap-4 mb-6">
                <input placeholder="Expense name" value={newExpenseName} onChange={(e) => setNewExpenseName(e.target.value)} className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none" />
                <input type="number" placeholder="Amount" value={newExpenseAmount} onChange={(e) => setNewExpenseAmount(e.target.value)} className="w-32 bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none" />
                <button onClick={addExpense} className="bg-white text-black px-6 rounded-xl font-bold">+</button>
              </div>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {expensesList.map((item) => (
                  <div key={item.id} className="flex justify-between bg-black/50 p-4 rounded-xl border border-white/5">
                    <span>{item.name}</span>
                    <div className="flex gap-4"><span>${item.amount.toLocaleString()}</span><button onClick={() => removeExpense(item.id)} className="text-red-500">Delete</button></div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* HERE IS THE FIX: Using 'loading' in the button UI */}
            <button onClick={saveData} disabled={loading} className="w-full mt-6 bg-emerald-500 text-black py-4 rounded-xl font-bold hover:bg-emerald-400">
              {loading ? 'Syncing...' : 'Commit to Cloud'}
            </button>
          </>
        )}

        {currentView === 'Analytics' && (
          <div><h2 className="text-2xl mb-6">Analytics</h2><p className="text-gray-400">Total Spent: ${totalExpenses.toLocaleString()}</p></div>
        )}

        {currentView === 'Transactions' && (
          <div><h2 className="text-2xl mb-6">Transaction History</h2>
            <div className="space-y-2">
              {expensesList.map(item => <div key={item.id} className="flex justify-between p-4 border-b border-white/10"><span>{item.name}</span><span>${item.amount}</span></div>)}
            </div>
          </div>
        )}

        {currentView === 'Settings' && (
          <div><h2 className="text-2xl mb-6">Settings</h2><p className="text-gray-400">Account status: Connected to Supabase</p></div>
        )}
      </main>
    </div>
  );
};

export default NovaFinance;
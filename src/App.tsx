import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Connected directly to your cloud project
const supabaseUrl = 'https://kgjusqdtfdcunhrczheu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnanVzcWR0ZmRjdW5ocmN6aGV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzNjU5NTYsImV4cCI6MjA5OTk0MTk1Nn0.H1FdbQuj4g5cL7RKrJhVg7xagGdBML_RmmXh3KHsoU0';
const supabase = createClient(supabaseUrl, supabaseKey);

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
// GENERATING 100 YEARS (2025 - 2124)
const years = Array.from({ length: 100 }, (_, i) => 2025 + i);

type ExpenseItem = {
  id: string;
  name: string;
  amount: number;
};

const NovaFinance = () => {
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
    const newItem: ExpenseItem = {
      id: crypto.randomUUID(),
      name: newExpenseName,
      amount: Number(newExpenseAmount)
    };
    setExpensesList([...expensesList, newItem]);
    setNewExpenseName('');
    setNewExpenseAmount('');
  };

  const removeExpense = (idToRemove: string) => {
    setExpensesList(expensesList.filter(item => item.id !== idToRemove));
  };

  const saveData = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('monthly_data')
      .upsert({ 
        year: selectedYear, 
        month: selectedMonth, 
        income: income, 
        expenses: totalExpenses,
        savings: actualSavings,
        itemized_expenses: expensesList 
      });

    setLoading(false);
    if (error) alert("Error saving data: " + error.message);
    else alert(`Success! ${selectedMonth} ${selectedYear} ledger saved.`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex font-sans selection:bg-emerald-500">
      
      <aside className="hidden md:flex flex-col w-64 border-r border-white/5 bg-[#0d0d0d] p-6">
        <h1 className="text-2xl font-light tracking-tighter mb-12 text-emerald-400">Nova.</h1>
        <nav className="flex flex-col gap-4 text-sm text-gray-400">
          <div className="text-white font-medium bg-white/5 px-4 py-3 rounded-lg border border-white/10 cursor-pointer">Dashboard</div>
          <div className="px-4 py-3 hover:text-white cursor-pointer transition-colors">Analytics</div>
          <div className="px-4 py-3 hover:text-white cursor-pointer transition-colors">Transactions</div>
          <div className="px-4 py-3 hover:text-white cursor-pointer transition-colors">Settings</div>
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-extralight tracking-tight">Financial Overview</h2>
            <p className="text-gray-500 mt-1 text-sm tracking-widest uppercase">Secure Ledger</p>
          </div>
          
          <div className="flex gap-3">
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="bg-white/5 border border-white/10 text-white px-4 py-2 rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 appearance-none text-sm cursor-pointer">
              {months.map(m => <option key={m} value={m} className="bg-black">{m}</option>)}
            </select>
            <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className="bg-white/5 border border-white/10 text-white px-4 py-2 rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 appearance-none text-sm cursor-pointer">
              {years.map(y => <option key={y} value={y} className="bg-black">{y}</option>)}
            </select>
          </div>
        </header>

        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-xl hover:border-white/20 transition-colors">
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Total Income</p>
            <div className="flex items-center">
              <span className="text-xl text-gray-500 mr-2">$</span>
              <input type="number" value={income || ''} placeholder="0" onChange={(e) => setIncome(Number(e.target.value))} className="bg-transparent w-full text-3xl font-bold outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
            </div>
          </div>
          
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-xl">
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Total Expenses</p>
            <h3 className="text-3xl font-bold text-rose-400">${totalExpenses.toLocaleString()}</h3>
          </div>
          
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl group-hover:bg-emerald-500/30 transition-all"></div>
            <p className="text-emerald-400/80 text-xs uppercase tracking-widest mb-2 relative z-10">Target Savings</p>
            <div className="flex items-center relative z-10">
              <span className="text-xl text-emerald-500/50 mr-2">$</span>
              <input type="number" value={actualSavings || ''} placeholder="0" onChange={(e) => setActualSavings(Number(e.target.value))} className="bg-transparent w-full text-3xl font-bold text-emerald-400 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
            </div>
          </div>
        </div>

        <div className={`mb-10 p-5 rounded-2xl flex justify-between items-center border backdrop-blur-md transition-all duration-300 ${unallocated < 0 ? 'bg-rose-500/10 border-rose-500/20' : unallocated === 0 && income > 0 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-white/5 border-white/10'}`}>
          <span className="text-xs md:text-sm uppercase tracking-widest text-gray-400">{unallocated < 0 ? 'Over Budget By' : 'Remaining to Allocate'}</span>
          <span className={`text-2xl font-bold tracking-tight ${unallocated < 0 ? 'text-rose-400' : 'text-white'}`}>${Math.abs(unallocated).toLocaleString()}</span>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-xl mb-10">
          <h3 className="text-lg font-medium mb-6 flex items-center justify-between">
            <span>Itemized Expenses</span>
            <span className="text-xs text-gray-500 bg-black px-3 py-1 rounded-full border border-white/10">{expensesList.length} items</span>
          </h3>
          
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <input type="text" placeholder="Expense Name (e.g. Rent)" value={newExpenseName} onChange={(e) => setNewExpenseName(e.target.value)} className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-emerald-500/50 text-sm" />
            <div className="relative w-full md:w-48">
              <span className="absolute left-4 top-3 text-gray-500">$</span>
              <input type="number" placeholder="0.00" value={newExpenseAmount} onChange={(e) => setNewExpenseAmount(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl pl-8 pr-4 py-3 outline-none focus:border-emerald-500/50 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
            </div>
            <button onClick={addExpense} className="bg-white text-black px-6 py-3 rounded-xl font-medium text-sm hover:bg-emerald-400 transition-colors">
              Add Item
            </button>
          </div>

          <div className="space-y-3">
            {expensesList.length === 0 ? (
              <div className="text-center py-10 text-gray-600 text-sm border border-dashed border-white/10 rounded-xl">No expenses logged for this month.</div>
            ) : (
              expensesList.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-black/30 border border-white/5 p-4 rounded-xl hover:border-white/10 transition-colors">
                  <span className="text-gray-300 text-sm">{item.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-rose-400">${item.amount.toLocaleString()}</span>
                    <button onClick={() => removeExpense(item.id)} className="text-gray-600 hover:text-rose-500 transition-colors text-xl leading-none px-2">×</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <button onClick={saveData} disabled={loading} className="w-full bg-white text-black font-bold px-12 py-5 rounded-2xl hover:bg-emerald-400 transition-all duration-300 disabled:opacity-50">
          {loading ? 'Syncing...' : 'Commit Dashboard to Cloud'}
        </button>

      </main>
    </div>
  );
};

export default NovaFinance;
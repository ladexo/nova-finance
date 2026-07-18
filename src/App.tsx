import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Connected directly to your cloud project
const supabaseUrl = 'https://kgjusqdtfdcunhrczheu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnanVzcWR0ZmRjdW5ocmN6aGV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzNjU5NTYsImV4cCI6MjA5OTk0MTk1Nn0.H1FdbQuj4g5cL7RKrJhVg7xagGdBML_RmmXh3KHsoU0';
const supabase = createClient(supabaseUrl, supabaseKey);

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const years = [2025, 2026, 2027, 2028];

const NovaFinance = () => {
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState('July');
  const [selectedYear, setSelectedYear] = useState(2026);
  const [loading, setLoading] = useState(false);

  // Automatically pulls records from the database when month or year changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('monthly_data')
        .select('*')
        .eq('month', selectedMonth)
        .eq('year', selectedYear)
        .single();
      
      if (data) {
        setIncome(data.income);
        setExpenses(data.expenses);
      } else {
        // Clear screen values if no records exist for the selected period yet
        setIncome(0);
        setExpenses(0);
      }
      setLoading(false);
    };
    fetchData();
  }, [selectedMonth, selectedYear]);

  const saveData = async () => {
    setLoading(true);
    const savings = income - expenses;
    const { error } = await supabase
      .from('monthly_data')
      .upsert({ 
        year: selectedYear, 
        month: selectedMonth, 
        income: income, 
        expenses: expenses,
        savings: savings
      });

    setLoading(false);
    if (error) {
      alert("Error saving data: " + error.message);
    } else {
      alert(`Success! ${selectedMonth} ${selectedYear} architecture sync complete.`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12 font-sans selection:bg-emerald-500">
      
      {/* Premium Dashboard Header & Dropdowns */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <header>
          <h1 className="text-4xl md:text-5xl font-extralight tracking-tighter">Nova Finance</h1>
          <p className="text-emerald-400 mt-2 font-medium tracking-widest uppercase text-xs md:text-sm">Secure Cloud Architecture</p>
        </header>

        {/* Dynamic Timeline Selection Controls */}
        <div className="flex gap-4 w-full md:w-auto">
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full md:w-auto bg-white/5 border border-white/10 text-white px-5 py-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none cursor-pointer backdrop-blur-md font-light text-sm"
          >
            {months.map(m => <option key={m} value={m} className="bg-black text-white">{m}</option>)}
          </select>
          
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="w-full md:w-auto bg-white/5 border border-white/10 text-white px-5 py-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none cursor-pointer backdrop-blur-md font-light text-sm"
          >
            {years.map(y => <option key={y} value={y} className="bg-black text-white">{y}</option>)}
          </select>
        </div>
      </div>

      {/* Glassmorphic Metric Framework */}
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 transition-all duration-300 ${loading ? 'opacity-40 scale-[0.99]' : 'opacity-100 scale-100'}`}>
        
        {/* Income Architecture */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[2rem] hover:bg-white/10 hover:border-white/20 transition-all duration-500 group">
          <p className="text-gray-500 text-xs uppercase tracking-widest group-hover:text-gray-400 transition-colors">Income Ledger</p>
          <div className="flex items-center mt-4">
            <span className="text-2xl font-light text-gray-500 mr-2">$</span>
            <input 
              type="number" 
              value={income || ''} 
              placeholder="0"
              onChange={(e) => setIncome(Number(e.target.value))} 
              className="bg-transparent w-full text-4xl font-bold text-white outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
            />
          </div>
        </div>

        {/* Expenses Architecture */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[2rem] hover:bg-white/10 hover:border-white/20 transition-all duration-500 group">
          <p className="text-gray-500 text-xs uppercase tracking-widest group-hover:text-gray-400 transition-colors">Expense Ledger</p>
          <div className="flex items-center mt-4">
            <span className="text-2xl font-light text-gray-500 mr-2">$</span>
            <input 
              type="number" 
              value={expenses || ''} 
              placeholder="0"
              onChange={(e) => setExpenses(Number(e.target.value))} 
              className="bg-transparent w-full text-4xl font-bold text-rose-500 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
            />
          </div>
        </div>

        {/* Dynamic Calculation Engine */}
        <div className="bg-emerald-500/5 backdrop-blur-2xl border border-emerald-500/10 p-8 rounded-[2rem] relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-500"></div>
          <p className="text-emerald-400/80 text-xs uppercase tracking-widest relative z-10">Net Savings Reserve</p>
          <h2 className="text-4xl font-bold mt-4 text-emerald-400 relative z-10 tracking-tight">
            ${(income - expenses).toLocaleString()}
          </h2>
        </div>
      </div>

      {/* Cloud Sync Controller */}
      <button 
        onClick={saveData} 
        disabled={loading}
        className="w-full md:w-auto bg-white text-black font-semibold px-12 py-5 rounded-2xl hover:bg-emerald-400 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.05)] disabled:bg-gray-700 disabled:text-gray-400 disabled:scale-100 disabled:cursor-not-allowed"
      >
        {loading ? 'Syncing Framework...' : `Commit ${selectedMonth} ${selectedYear}`}
      </button>

    </div>
  );
};

export default NovaFinance;
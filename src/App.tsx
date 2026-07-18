import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// 1. ADD YOUR CREDENTIALS HERE
const supabaseUrl = 'https://kgjusqdtfdcunhrczheu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnanVzcWR0ZmRjdW5ocmN6aGV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzNjU5NTYsImV4cCI6MjA5OTk0MTk1Nn0.H1FdbQuj4g5cL7RKrJhVg7xagGdBML_RmmXh3KHsoU0';
const supabase = createClient(supabaseUrl, supabaseKey);

const NovaFinance = () => {
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [loading, setLoading] = useState(true);

  // 2. FETCH DATA FROM CLOUD
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('monthly_data')
        .select('*')
        .eq('month', 'July') // Hardcoded for this demo, can be dynamic
        .eq('year', 2026)
        .single();
      
      if (data) {
        setIncome(data.income);
        setExpenses(data.expenses);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // 3. SAVE DATA TO CLOUD
  const saveData = async () => {
    const { error } = await supabase
      .from('monthly_data')
      .upsert({ year: 2026, month: 'July', income, expenses });

    if (error) alert("Error saving: " + error.message);
    else alert("Success! Saved to your Cloud Database.");
  };

  return (
    <div className="min-h-screen bg-black text-white p-10 font-sans">
      <h1 className="text-4xl font-light mb-10">Nova Finance</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl">
          <p className="text-gray-400 text-sm">Income</p>
          <input type="number" value={income} onChange={(e) => setIncome(Number(e.target.value))} className="bg-transparent w-full text-3xl font-bold mt-2 outline-none" />
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl">
          <p className="text-gray-400 text-sm">Expenses</p>
          <input type="number" value={expenses} onChange={(e) => setExpenses(Number(e.target.value))} className="bg-transparent w-full text-3xl font-bold mt-2 outline-none text-rose-500" />
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-3xl">
          <p className="text-emerald-400 text-sm">Savings</p>
          <h2 className="text-3xl font-bold mt-2 text-emerald-400">${income - expenses}</h2>
        </div>
      </div>

      <button onClick={saveData} className="bg-white text-black font-bold px-10 py-4 rounded-2xl hover:bg-emerald-400 transition-all">
        Sync to Cloud
      </button>
    </div>
  );
};

export default NovaFinance;
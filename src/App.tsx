import { useState, useEffect } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize the AI engine
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

interface Expense {
  id: string;
  name: string;
  amount: number;
}

export default function App() {
  const [income, setIncome] = useState<number | string>(() => {
    return localStorage.getItem('nova-income') || '';
  })
  
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('nova-expenses');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Mum', amount: 145 },
      { id: '2', name: 'T-Mobile', amount: 138 },
      { id: '3', name: 'Food & Fun', amount: 100 },
      { id: '4', name: 'Haircut', amount: 70 },
      { id: '5', name: 'Sister', amount: 50 },
      { id: '6', name: 'Personal Expenses', amount: 20 },
    ];
  });

  const [aiAdvice, setAiAdvice] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAmount, setNewAmount] = useState('');

  useEffect(() => {
    localStorage.setItem('nova-expenses', JSON.stringify(expenses));
    localStorage.setItem('nova-income', income.toString());
  }, [expenses, income]);

  const consultAI = async () => {
    setLoading(true);
    setAiAdvice('Consulting the intelligence...');
    
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `I am a student with a net monthly income of $${income}. My expenses are: ${JSON.stringify(expenses)}. 
      Please provide a brief, professional, and encouraging financial critique. Suggest one way to optimize spending. Keep it under 50 words.`;

      const result = await model.generateContent(prompt);
      setAiAdvice(result.response.text());
    } catch (error) {
      setAiAdvice("The AI is currently resting. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const addExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newAmount) return;
    setExpenses([...expenses, { id: crypto.randomUUID(), name: newName, amount: Number(newAmount) }]);
    setNewName('');
    setNewAmount('');
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const totalFixed = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const numIncome = Number(income) || 0;
  const remaining = numIncome - totalFixed;

  return (
    <div className="min-h-screen bg-brand-950 p-4 sm:p-8 text-white relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-400/10 rounded-full blur-[100px] pointer-events-none" />

      <main className="max-w-4xl mx-auto relative z-10">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-light">Nova <span className="font-bold text-brand-400">Finance</span></h1>
          </div>
          <button 
            onClick={consultAI}
            disabled={loading}
            className="px-5 py-2 bg-brand-400 text-black font-semibold rounded-full hover:bg-brand-300 transition-colors text-sm shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          >
            {loading ? 'Consulting...' : 'Consult AI'}
          </button>
        </header>

        {aiAdvice && (
          <div className="glass-panel p-6 border-brand-400/30 mb-8 animate-fade-in">
            <h3 className="text-brand-400 text-xs uppercase font-bold mb-2 tracking-widest">AI Wealth Insight</h3>
            <p className="text-sm leading-relaxed text-gray-300">{aiAdvice}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-panel p-6">
            <label className="block text-sm text-gray-400 mb-2">Monthly Net Income</label>
            <input 
              type="number" 
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              className="input-field text-xl font-medium"
              placeholder="$0.00"
            />
            
            <div className="mt-8">
              <h2 className="text-sm text-gray-400 mb-4 uppercase">Fixed Expenses</h2>
              <div className="space-y-3 mb-4">
                {expenses.map((exp) => (
                  <div key={exp.id} className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                    <span className="text-sm">{exp.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-bold">${exp.amount}</span>
                      <button onClick={() => removeExpense(exp.id)} className="text-red-400 text-xs">✕</button>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={addExpense} className="flex gap-2">
                <input placeholder="Name" value={newName} onChange={e => setNewName(e.target.value)} className="input-field text-sm" />
                <input type="number" placeholder="$" value={newAmount} onChange={e => setNewAmount(e.target.value)} className="input-field text-sm w-20" />
                <button type="submit" className="bg-brand-400 text-black px-4 rounded-xl font-bold">+</button>
              </form>
            </div>
          </div>

          <div className="glass-panel p-8 flex flex-col justify-center">
            <p className="text-gray-400 text-sm">Disposable Income</p>
            <h3 className="text-5xl font-bold text-white mb-2">${remaining.toFixed(2)}</h3>
            <p className="text-gray-500 text-xs">Total Fixed: ${totalFixed.toFixed(2)}</p>
          </div>
        </div>
      </main>
    </div>
  )
}
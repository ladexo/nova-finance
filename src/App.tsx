import { useState, useEffect } from 'react'

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
      { id: '7', name: 'Crunchyroll', amount: 10 },
      { id: '8', name: 'Copilot', amount: 9.99 },
      { id: '9', name: 'Apple Music/Space', amount: 9 },
      { id: '10', name: 'Gemini', amount: 4.99 },
      { id: '11', name: 'Google Space', amount: 2 },
    ];
  });

  const [newName, setNewName] = useState('');
  const [newAmount, setNewAmount] = useState('');

  useEffect(() => {
    localStorage.setItem('nova-expenses', JSON.stringify(expenses));
    localStorage.setItem('nova-income', income.toString());
  }, [expenses, income]);

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
  const suggestedSavings = numIncome * 0.3; // 30% baseline
  const remaining = numIncome - totalFixed - suggestedSavings;

  return (
    <div className="min-h-screen bg-brand-950 relative overflow-hidden p-4 sm:p-8">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-400/10 rounded-full blur-[120px] pointer-events-none" />

      <main className="max-w-6xl mx-auto relative z-10 animate-fade-in">
        
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-white mb-2">
              Nova <span className="font-bold text-brand-400">Finance</span>
            </h1>
            <p className="text-gray-400 text-sm">AI-Powered Wealth Intelligence</p>
          </div>
          <button className="px-5 py-2 bg-brand-400 text-black font-semibold rounded-full hover:bg-brand-300 transition-colors text-sm shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            Consult AI
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-panel p-6">
              <label className="block text-sm text-gray-400 mb-2">Monthly Net Income</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-400">$</span>
                <input 
                  type="number" 
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  className="input-field pl-8 text-xl font-medium"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="glass-panel p-6">
              <h2 className="text-sm text-gray-400 mb-4 uppercase tracking-wider font-semibold">Expense Engine</h2>
              
              <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                {expenses.map((expense) => (
                  <div key={expense.id} className="flex justify-between items-center border-b border-white/5 pb-3 group">
                    <span className="text-gray-300 text-sm">{expense.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-white font-medium">${expense.amount.toFixed(2)}</span>
                      <button 
                        onClick={() => removeExpense(expense.id)} 
                        className="text-red-400 opacity-0 lg:group-hover:opacity-100 transition-opacity text-xs bg-red-400/10 px-2 py-1 rounded"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-white/10 mt-2">
                <span className="text-brand-400 font-medium text-sm">Total Fixed</span>
                <span className="text-brand-400 font-bold">${totalFixed.toFixed(2)}</span>
              </div>

              <form onSubmit={addExpense} className="mt-6 flex gap-2">
                <input 
                  type="text" 
                  placeholder="Category" 
                  value={newName} 
                  onChange={e => setNewName(e.target.value)} 
                  className="input-field text-sm px-3 py-2 flex-1" 
                />
                <input 
                  type="number" 
                  placeholder="$" 
                  value={newAmount} 
                  onChange={e => setNewAmount(e.target.value)} 
                  className="input-field text-sm px-3 py-2 w-20" 
                />
                <button type="submit" className="bg-white/10 hover:bg-white/20 text-white px-3 rounded-xl transition-colors font-medium">
                  +
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="glass-panel p-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <p className="text-gray-400 text-sm mb-2">Suggested Savings (30%)</p>
                <h3 className="text-4xl font-bold text-white">${suggestedSavings.toFixed(2)}</h3>
              </div>

              <div className="glass-panel p-8">
                <p className="text-gray-400 text-sm mb-2">Net Disposable</p>
                <h3 className={`text-4xl font-bold ${remaining >= 0 ? 'text-white' : 'text-red-400'}`}>
                  ${remaining.toFixed(2)}
                </h3>
              </div>

            </div>

            <div className="glass-panel p-8 h-[300px] flex flex-col items-center justify-center border-dashed border-2 border-brand-800/50 bg-transparent">
              <span className="text-3xl mb-3">✨</span>
              <p className="text-gray-400 font-medium">AI Wealth Trajectory Chart</p>
              <p className="text-gray-600 text-sm mt-1">Pending Integration</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
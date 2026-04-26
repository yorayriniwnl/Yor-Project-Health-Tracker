'use client';

import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const healthData = [
  { name: 'Healthy', value: 42 },
  { name: 'Watchlist', value: 18 },
  { name: 'Critical', value: 9 }
];

const budgetData = [
  { department: 'Health', allocated: 500, spent: 280 },
  { department: 'Roads', allocated: 420, spent: 365 },
  { department: 'Water', allocated: 260, spent: 190 },
  { department: 'Education', allocated: 310, spent: 212 }
];

const trendData = [
  { month: 'Jan', completed: 4, delayed: 2 },
  { month: 'Feb', completed: 7, delayed: 3 },
  { month: 'Mar', completed: 6, delayed: 5 },
  { month: 'Apr', completed: 9, delayed: 3 },
  { month: 'May', completed: 12, delayed: 4 }
];

export function DashboardCharts() {
  return (
    <div className="grid gap-5 xl:grid-cols-3">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <h3 className="font-semibold text-slate-900">Project health distribution</h3>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={healthData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} label>
                {healthData.map((entry) => <Cell key={entry.name} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft xl:col-span-2">
        <h3 className="font-semibold text-slate-900">Budget allocated vs spent</h3>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={budgetData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="allocated" name="Allocated" />
              <Bar dataKey="spent" name="Spent" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft xl:col-span-3">
        <h3 className="font-semibold text-slate-900">Monthly completion and delay trend</h3>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="completed" name="Completed" />
              <Line type="monotone" dataKey="delayed" name="Delayed" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

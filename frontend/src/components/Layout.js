import { Link } from 'react-router-dom';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

function Layout({ children }) {
  const [dark, setDark] = useState(true);

  return (
    <div className={dark ? 'min-h-screen bg-slate-950 text-slate-100' : 'min-h-screen bg-slate-50 text-slate-900'}>
      <header className="border-b border-slate-800/70 bg-slate-950/75 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-xl font-semibold tracking-wide">
            AI Resume Analyzer
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/upload" className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500">
              Upload Resume
            </Link>
            <button
              type="button"
              onClick={() => setDark((prev) => !prev)}
              className="rounded-full bg-slate-800/90 p-2 text-slate-100 transition hover:bg-slate-700"
            >
              {dark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}

export default Layout;

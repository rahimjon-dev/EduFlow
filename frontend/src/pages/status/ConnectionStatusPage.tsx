import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Server, 
  Database, 
  RefreshCw, 
  ArrowLeft, 
  Activity, 
  Wifi, 
  WifiOff, 
  ExternalLink 
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface HealthData {
  success: boolean;
  status: string;
  message: string;
  database: string;
  uptime?: number;
  timestamp?: string;
  error?: string;
}

export const ConnectionStatusPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [connected, setConnected] = useState<boolean | null>(null);
  const [data, setData] = useState<HealthData | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const checkConnection = async () => {
    setLoading(true);
    setErrorMsg(null);
    const startTime = performance.now();

    try {
      // Try both proxy /api/health and direct backend URL
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const endpoint = `${backendUrl}/api/health`;

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });

      const endTime = performance.now();
      setLatency(Math.round(endTime - startTime));

      const result = await response.json();

      if (response.ok && (result.status === 'SUCCESS' || result.success === true)) {
        setConnected(true);
        setData(result);
      } else {
        setConnected(false);
        setData(result);
        setErrorMsg(result.message || result.error || 'Noma\'lum xatolik');
      }
    } catch (err: any) {
      const endTime = performance.now();
      setLatency(Math.round(endTime - startTime));
      setConnected(false);
      setErrorMsg(err.message || 'Serverga ulanish imkoni bo\'lmadi (Failed to fetch)');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-slate-800/80 backdrop-blur bg-slate-950/60 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            EF
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-white">EduFlow</span>
            <span className="text-xs text-indigo-400 block font-medium">Integration Check</span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={checkConnection}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-600 text-sm font-medium text-slate-300 hover:text-white transition-all shadow-sm active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
            <span>Qayta tekshirish</span>
          </button>
          <Link
            to="/"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Asosiy sahifa</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 max-w-4xl mx-auto w-full px-4 py-12 flex flex-col items-center justify-center">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
              <Activity className="w-8 h-8 text-indigo-400 absolute inset-0 m-auto animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Aloqa tekshirilmoqda...</h2>
            <p className="text-slate-400 text-sm max-w-sm">
              Frontend (port 5173) va Backend (port 5000) o'rtasidagi real ulanish sinovdan o'tkazilmoqda.
            </p>
          </div>
        ) : connected ? (
          /* SUCCESS STATE */
          <div className="w-full space-y-8 animate-in fade-in zoom-in-95 duration-300">
            {/* Main Result Banner */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-emerald-950/40 to-slate-900/90 border-2 border-emerald-500/30 shadow-2xl shadow-emerald-950/40 backdrop-blur text-center relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
              
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-5 shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="inline-block px-4 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3">
                Ulanish o'rnatildi
              </div>

              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
                SUCCESS
              </h1>

              <p className="text-emerald-300 text-base md:text-lg max-w-xl mx-auto font-medium">
                EduFlow Frontend va Backend bir-biriga muvaffaqiyatli ulangan!
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1 */}
              <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-start gap-4">
                <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Server className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Backend API</div>
                  <div className="text-base font-bold text-white mt-0.5">localhost:5000</div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs text-emerald-400 font-medium">Faol / Ishlayapti</span>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-start gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">PostgreSQL</div>
                  <div className="text-base font-bold text-white mt-0.5">Prisma ORM</div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs text-emerald-400 font-medium">Ulangan (connected)</span>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-start gap-4">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Wifi className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Javob Tezligi</div>
                  <div className="text-base font-bold text-white mt-0.5">{latency !== null ? `${latency} ms` : '—'}</div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xs text-blue-400 font-medium">Juda tez va barqaror</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed JSON Response */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Backenddan Qaytgan Real Response (JSON)
                </span>
                <span className="text-xs text-emerald-400 font-mono">HTTP 200 OK</span>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs text-emerald-400 overflow-x-auto">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to="/login"
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
              >
                <span>Tizimga kirish (Login)</span>
                <ExternalLink className="w-4 h-4" />
              </Link>
              <a
                href="http://localhost:5000/api/health"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm transition-all flex items-center gap-2"
              >
                <span>To'g'ridan-to'g'ri Backend API ochish</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        ) : (
          /* UNSUCCESS STATE */
          <div className="w-full space-y-8 animate-in fade-in zoom-in-95 duration-300">
            {/* Failure Banner */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-rose-950/40 to-slate-900/90 border-2 border-rose-500/30 shadow-2xl shadow-rose-950/40 backdrop-blur text-center relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent" />

              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mb-5 shadow-inner">
                <XCircle className="w-10 h-10" />
              </div>

              <div className="inline-block px-4 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-3">
                Aloqa uzilgan
              </div>

              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
                UNSUCCESS
              </h1>

              <p className="text-rose-300 text-base md:text-lg max-w-xl mx-auto font-medium">
                Backend serveri bilan aloqa o'rnatilmadi yoki server ishga tushmagan.
              </p>
            </div>

            {/* Error Diagnostics Card */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-rose-900/30 space-y-4">
              <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
                <WifiOff className="w-5 h-5" />
                <span>Xatolik Tafsiloti:</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-rose-900/30 font-mono text-xs text-rose-300">
                {errorMsg || 'Failed to connect to http://localhost:5000'}
              </div>

              <div className="text-xs text-slate-400 space-y-2 pt-2 border-t border-slate-800">
                <div className="font-semibold text-slate-300">Tuzatish uchun:</div>
                <div>1. `eduflow-backend` papkasida backend ishga tushirilganligini tekshiring (`npm run dev`).</div>
                <div>2. Backend `http://localhost:5000` portida faol ekanligiga ishonch hosil qiling.</div>
              </div>
            </div>

            {/* Action */}
            <div className="flex justify-center">
              <button
                onClick={checkConnection}
                className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Qaytadan urinib ko'rish</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 py-6 text-center text-xs text-slate-400">
        EduFlow Platform &bull; Frontend (5173) &harr; Backend (5000) Health Monitor
      </footer>
    </div>
  );
};

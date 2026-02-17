'use client';

import { useState, useRef, useEffect } from 'react';
import { AgentTrace } from '@/types/triage';

export default function Home() {
  const [message, setMessage] = useState('');
  const [source, setSource] = useState('WhatsApp');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [agentLogs, setAgentLogs] = useState<AgentTrace[]>([]);

  // Auto-scroll logs
  const logsEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [agentLogs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setAgentLogs([]);

    try {
      const res = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          source,
          senderId: 'browser-tester'
        })
      });
      const data = await res.json();

      // Simulate real-time streaming of logs for effect
      if (data.agent_traces) {
        for (const trace of data.agent_traces) {
          await new Promise(r => setTimeout(r, 400)); // Delay for dramatic effect
          setAgentLogs(prev => [...prev, trace]);
        }
      }

      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({ error: 'Failed to fetch' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-gray-100 p-4 md:p-8 font-mono relative overflow-hidden">
      {/* Background Grid Effect */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Left Column: Input */}
        <div className="space-y-6">
          <header className="border-b border-gray-800 pb-6">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">
              CondoGuard AI
            </h1>
            <p className="text-gray-500 mt-2">Semantic Triage Engine v1.0</p>
          </header>

          <section className="bg-gray-900/80 backdrop-blur border border-gray-800 p-6 rounded-xl shadow-2xl">
            <h2 className="text-xl font-semibold mb-4 text-emerald-400 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Input Simulation
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase text-gray-500 mb-1 tracking-wider">Source Channel</label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full bg-black/50 border border-gray-700 rounded p-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                >
                  <option value="WhatsApp">WhatsApp Gateway</option>
                  <option value="Email">Email Server</option>
                  <option value="SMS">SMS Provider</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase text-gray-500 mb-1 tracking-wider">Raw Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full bg-black/50 border border-gray-700 rounded p-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"
                  placeholder="Enter message content..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-6 rounded-lg font-bold tracking-wide uppercase transition-all transform active:scale-95 ${loading
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-900/20'
                  }`}
              >
                {loading ? 'Processing...' : 'Initialize Logic'}
              </button>
            </form>
          </section>

          {/* Quick Scenarios */}
          <div className="flex gap-2 justify-center flex-wrap">
            <button onClick={() => setMessage("SOCORRO TEM FOGO NO AP 302!")} className="text-xs bg-gray-800 hover:bg-red-900/30 text-gray-400 hover:text-red-400 px-3 py-1 rounded border border-gray-800 transition-colors">🔥 Fire (P0)</button>
            <button onClick={() => setMessage("Elevador social parou de novo")} className="text-xs bg-gray-800 hover:bg-orange-900/30 text-gray-400 hover:text-orange-400 px-3 py-1 rounded border border-gray-800 transition-colors">⚙️ Elevator (P1)</button>
            <button onClick={() => setMessage("Gostaria de reservar a churrasqueira para o dia 20")} className="text-xs bg-gray-800 hover:bg-green-900/30 text-gray-400 hover:text-green-400 px-3 py-1 rounded border border-gray-800 transition-colors">📅 Reservar (OK)</button>
            <button onClick={() => setMessage("Quero reservar o salão para hoje a noite")} className="text-xs bg-gray-800 hover:bg-red-900/30 text-gray-400 hover:text-red-400 px-3 py-1 rounded border border-gray-800 transition-colors">📅 Reservar (Fail)</button>
            <button onClick={() => setMessage("Liberar entrada da minha mãe Maria Silva")} className="text-xs bg-gray-800 hover:bg-blue-900/30 text-gray-400 hover:text-blue-400 px-3 py-1 rounded border border-gray-800 transition-colors">🔓 Visita (Mãe)</button>
            <button onClick={() => setMessage("Autorizar técnico da net para instalação")} className="text-xs bg-gray-800 hover:bg-blue-900/30 text-gray-400 hover:text-blue-400 px-3 py-1 rounded border border-gray-800 transition-colors">🛠️ Técnico (Net)</button>
            <button onClick={() => setMessage("Posso fechar a varanda com cortina azul?")} className="text-xs bg-gray-800 hover:bg-purple-900/30 text-gray-400 hover:text-purple-400 px-3 py-1 rounded border border-gray-800 transition-colors">⚖️ Varanda (Jurista)</button>
            <button onClick={() => setMessage("Qual o horário de silêncio para obras?")} className="text-xs bg-gray-800 hover:bg-purple-900/30 text-gray-400 hover:text-purple-400 px-3 py-1 rounded border border-gray-800 transition-colors">⚖️ Silêncio (Jurista)</button>
          </div>
        </div>

        {/* Right Column: Visualization */}
        <div className="space-y-6">

          {/* Active Agents Visualization */}
          <section className="bg-black/40 border border-gray-800 rounded-xl p-6 h-[500px] flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-50"></div>

            <h2 className="text-sm font-semibold mb-4 text-gray-400 uppercase tracking-widest flex justify-between items-center">
              <span>Agent Neural Activity</span>
              {loading && <span className="text-emerald-500 animate-pulse">● LIVE</span>}
            </h2>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-gray-800">
              {agentLogs.length === 0 && !loading && (
                <div className="h-full flex items-center justify-center text-gray-700 text-sm italic">
                  System Standby. Awaiting Input.
                </div>
              )}

              {agentLogs.map((log, i) => (
                <div key={i} className="animate-in slide-in-from-left-2 fade-in duration-300">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg mt-1 ${log.agent === 'Analyst' ? 'bg-blue-900/20 text-blue-400 border border-blue-900/50' :
                      log.agent === 'Architect' ? 'bg-purple-900/20 text-purple-400 border border-purple-900/50' :
                        'bg-orange-900/20 text-orange-400 border border-orange-900/50'
                      }`}>
                      {log.agent === 'Analyst' && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
                      {log.agent === 'Architect' && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
                      {log.agent === 'Dev' && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <span className={`text-xs font-bold uppercase ${log.agent === 'Analyst' ? 'text-blue-400' :
                          log.agent === 'Architect' ? 'text-purple-400' :
                            'text-orange-400'
                          }`}>{log.agent}</span>
                        <span className="text-[10px] text-gray-600">{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-sm text-gray-300 font-medium">{log.step}</p>
                      {log.details && <p className="text-xs text-gray-500 mt-1">{log.details}</p>}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          </section>

          {/* Reservation Ticket Visualization */}
          {result && result.reservation && (
            <section className="animate-in slide-in-from-right fade-in duration-700">
              <div className="bg-gradient-to-br from-emerald-900/40 to-black border border-emerald-500/30 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-50">
                  <svg className="w-16 h-16 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>

                <h2 className="text-emerald-400 font-bold tracking-widest uppercase text-xs mb-4">Reservation Ticket</h2>

                <div className="flex justify-between items-end mb-4">
                  <div>
                    <span className="block text-2xl font-bold text-white">{result.reservation.espaco.replace('_', ' ')}</span>
                    <span className="text-gray-400 text-sm">Status: </span>
                    <span className={`font-bold ${result.reservation.status === 'confirmed' ? 'text-green-400' : 'text-red-400'
                      }`}>{result.reservation.status.toUpperCase()}</span>
                  </div>
                </div>

                {result.reservation.status === 'confirmed' && (
                  <div className="bg-black/40 p-3 rounded flex gap-4 items-center mb-2">
                    <div className="text-center bg-white text-black p-2 rounded">
                      <span className="block text-xs font-bold">OUT</span>
                      <span className="block text-xl font-bold">20</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-300">Reserva confirmada para uso exclusivo.</p>
                      <p className="text-xs text-emerald-500/80">QR Code enviado para e-mail.</p>
                    </div>
                  </div>
                )}

                {result.reservation.status === 'denied' && (
                  <div className="bg-red-900/20 p-3 rounded border border-red-900/50">
                    <p className="text-red-300 text-sm">⛔ <b>Recusado:</b> {result.reservation.motivo_recusa}</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Visitor Access Ticket Visualization */}
          {result && result.visitor_access && (
            <section className="animate-in slide-in-from-right fade-in duration-700">
              <div className="bg-gradient-to-br from-blue-900/40 to-black border border-blue-500/30 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-50">
                  <svg className="w-16 h-16 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v1m6 11h2m-6 0h-2v4h-4v-4H8m13-4V7a1 1 0 00-1-1H4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </div>

                <h2 className="text-blue-400 font-bold tracking-widest uppercase text-xs mb-4">Visitor Access Pass</h2>

                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="block text-2xl font-bold text-white">{result.visitor_access.nome_visitante}</span>
                    <span className="text-gray-400 text-sm">{result.visitor_access.tipo.replace('_', ' ')}</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg">
                    {/* Simulated QR Code */}
                    <div className="w-16 h-16 bg-black" style={{ backgroundImage: 'radial-gradient(white 30%, transparent 30%)', backgroundSize: '4px 4px' }}></div>
                  </div>
                </div>

                <div className="bg-blue-900/20 p-3 rounded border border-blue-900/50 flex flex-col gap-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-blue-300">TOKEN:</span>
                    <span className="font-mono text-blue-100">{result.visitor_access.qr_code_token}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-blue-300">VALID UNTIL:</span>
                    <span className="font-mono text-blue-100">{new Date(result.visitor_access.data_validade).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* RAG / CondoGPT Visualization */}
          {result && result.rag_response && (
            <section className="animate-in slide-in-from-right fade-in duration-700">
              <div className="bg-gradient-to-br from-purple-900/40 to-black border border-purple-500/30 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-50">
                  <svg className="w-16 h-16 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
                </div>

                <h2 className="text-purple-400 font-bold tracking-widest uppercase text-xs mb-4">CondoGPT (Jurista)</h2>

                <div className="mb-4">
                  <p className="text-gray-400 text-xs uppercase mb-1">Dúvida Identificada</p>
                  <p className="text-white italic">"{result.rag_response.pergunta_identificada}"</p>
                </div>

                <div className="bg-purple-900/20 p-4 rounded border border-purple-900/50 mb-4">
                  <p className="text-gray-200 text-sm leading-relaxed">{result.rag_response.resposta}</p>
                </div>

                <div className="flex flex-col gap-2">
                  {result.rag_response.citacoes.map((citacao: { artigo: string; texto: string }, idx: number) => (
                    <div key={idx} className="bg-black/40 p-2 rounded border-l-2 border-purple-500">
                      <span className="block text-purple-300 font-bold text-xs mb-1">{citacao.artigo}</span>
                      <p className="text-gray-500 text-xs italic">"{citacao.texto}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Final Output Result */}
          {result && !loading && (
            <section className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 animate-in zoom-in-95 duration-500">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-white font-semibold">Classification Result</h2>
                <span className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider ${result.classification?.priority === 'P0' ? 'bg-red-500/20 text-red-400 border border-red-500/50 animate-pulse' :
                  result.classification?.priority === 'P1' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50' :
                    result.classification?.priority === 'P2' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' :
                      'bg-green-500/20 text-green-400 border border-green-500/50'
                  }`}>
                  {result.classification?.priority} :: {result.classification?.category}
                </span>
              </div>

              <p className="text-gray-400 text-sm mb-4 border-l-2 border-gray-600 pl-3 italic">
                "{result.suggested_response}"
              </p>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-black/30 p-2 rounded">
                  <span className="text-gray-500 block mb-1">CONFIDENCE</span>
                  <span className="text-emerald-400 font-mono text-lg">{(result.classification?.confidence_score * 100).toFixed(1)}%</span>
                </div>
                <div className="bg-black/30 p-2 rounded">
                  <span className="text-gray-500 block mb-1">ACTION REQUIRED</span>
                  <span className={result.action_required ? "text-red-400 font-bold" : "text-gray-400"}>
                    {result.action_required ? "YES" : "NO"}
                  </span>
                </div>
              </div>
            </section>
          )}

        </div>
      </div>
    </main>
  );
}

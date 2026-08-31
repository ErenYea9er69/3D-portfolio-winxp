'use client';

import { useState, useEffect, useRef } from 'react';
import XPIcon from '../XPIcon';

export interface OpenWindowInfo {
  id: string;
  title: string;
  icon: string;
  isMinimized?: boolean;
}

interface TaskManagerContentProps {
  openWindows?: OpenWindowInfo[];
  onFocusWindow?: (id: string) => void;
  onCloseWindow?: (id: string) => void;
  onOpenApp?: (id: string) => void;
}

interface ProcessItem {
  id: string;
  name: string;
  pid: number;
  cpu: number;
  cpuTime: string;
  memUsage: number;
  user: string;
  windowId?: string;
}

const DEFAULT_PROCESSES: ProcessItem[] = [
  { id: 'system', name: 'System', pid: 4, cpu: 0, cpuTime: '0:01:24', memUsage: 216, user: 'SYSTEM' },
  { id: 'smss', name: 'smss.exe', pid: 428, cpu: 0, cpuTime: '0:00:01', memUsage: 384, user: 'SYSTEM' },
  { id: 'csrss', name: 'csrss.exe', pid: 512, cpu: 0, cpuTime: '0:00:18', memUsage: 4120, user: 'SYSTEM' },
  { id: 'winlogon', name: 'winlogon.exe', pid: 540, cpu: 0, cpuTime: '0:00:03', memUsage: 2940, user: 'SYSTEM' },
  { id: 'services', name: 'services.exe', pid: 588, cpu: 0, cpuTime: '0:00:05', memUsage: 3680, user: 'SYSTEM' },
  { id: 'lsass', name: 'lsass.exe', pid: 600, cpu: 0, cpuTime: '0:00:04', memUsage: 5420, user: 'SYSTEM' },
  { id: 'svchost1', name: 'svchost.exe', pid: 748, cpu: 0, cpuTime: '0:00:12', memUsage: 14200, user: 'SYSTEM' },
  { id: 'svchost2', name: 'svchost.exe', pid: 824, cpu: 0, cpuTime: '0:00:08', memUsage: 5140, user: 'NETWORK SERVICE' },
  { id: 'svchost3', name: 'svchost.exe', pid: 912, cpu: 0, cpuTime: '0:00:02', memUsage: 3960, user: 'LOCAL SERVICE' },
  { id: 'spoolsv', name: 'spoolsv.exe', pid: 1044, cpu: 0, cpuTime: '0:00:01', memUsage: 4720, user: 'SYSTEM' },
  { id: 'explorer', name: 'explorer.exe', pid: 1420, cpu: 1, cpuTime: '0:02:45', memUsage: 28650, user: 'Rayen' },
  { id: 'taskmgr', name: 'taskmgr.exe', pid: 2048, cpu: 1, cpuTime: '0:00:02', memUsage: 4280, user: 'Rayen' },
  { id: 'alg', name: 'alg.exe', pid: 2196, cpu: 0, cpuTime: '0:00:01', memUsage: 1480, user: 'LOCAL SERVICE' },
];

export default function TaskManagerContent({
  openWindows = [],
  onFocusWindow,
  onCloseWindow,
  onOpenApp,
}: TaskManagerContentProps) {
  const [activeTab, setActiveTab] = useState<'apps' | 'processes' | 'perf' | 'net' | 'users'>('perf');
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [selectedProcessId, setSelectedProcessId] = useState<string | null>(null);
  const [processes, setProcesses] = useState<ProcessItem[]>(DEFAULT_PROCESSES);

  // Performance metrics
  const [cpuUsage, setCpuUsage] = useState(4);
  const [memUsageMb, setMemUsageMb] = useState(192);
  const cpuHistoryRef = useRef<number[]>(new Array(60).fill(4));
  const memHistoryRef = useRef<number[]>(new Array(60).fill(192));
  
  const cpuCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const memCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const netCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync open windows to dynamic processes
  useEffect(() => {
    const appProcesses: ProcessItem[] = openWindows.map((w, idx) => {
      let exeName = `${w.id}.exe`;
      if (w.id === 'notepad') exeName = 'notepad.exe';
      if (w.id === 'calculator') exeName = 'calc.exe';
      if (w.id === 'minesweeper') exeName = 'winmine.exe';
      if (w.id === 'solitaire') exeName = 'sol.exe';
      if (w.id === 'spidersolitaire') exeName = 'spider.exe';
      if (w.id === 'paint') exeName = 'mspaint.exe';
      if (w.id === 'pinball') exeName = 'pinball.exe';
      if (w.id === 'wordpad') exeName = 'wordpad.exe';
      if (w.id === 'cmd') exeName = 'cmd.exe';
      if (w.id === 'iexplorer') exeName = 'iexplore.exe';
      if (w.id === 'mediaplayer') exeName = 'wmplayer.exe';
      if (w.id === 'msnmsgr') exeName = 'msnmsgr.exe';
      if (w.id === 'pictureviewer') exeName = 'shimgvw.exe';

      return {
        id: `app_${w.id}`,
        name: exeName,
        pid: 3000 + idx * 80,
        cpu: Math.floor(Math.random() * 2),
        cpuTime: '0:00:08',
        memUsage: 8000 + (w.id.length * 1420),
        user: 'Rayen',
        windowId: w.id,
      };
    });

    setProcesses([...DEFAULT_PROCESSES, ...appProcesses]);
  }, [openWindows]);

  // Real-time animation loop for CPU and Memory history
  useEffect(() => {
    const interval = setInterval(() => {
      // Fluctuate CPU slightly based on open windows count
      const baseLoad = Math.min(25, 2 + openWindows.length * 2);
      const jitter = Math.floor(Math.random() * 7) - 3;
      const newCpu = Math.max(1, Math.min(99, baseLoad + jitter));
      setCpuUsage(newCpu);

      const newMem = Math.max(180, 185 + openWindows.length * 14 + Math.floor(Math.random() * 6));
      setMemUsageMb(newMem);

      cpuHistoryRef.current = [...cpuHistoryRef.current.slice(1), newCpu];
      memHistoryRef.current = [...memHistoryRef.current.slice(1), newMem];

      // Draw CPU History Canvas
      const cpuCanvas = cpuCanvasRef.current;
      if (cpuCanvas) {
        const ctx = cpuCanvas.getContext('2d');
        if (ctx) {
          const w = cpuCanvas.width;
          const h = cpuCanvas.height;
          ctx.fillStyle = '#001400';
          ctx.fillRect(0, 0, w, h);

          // Grid lines
          ctx.strokeStyle = '#004a00';
          ctx.lineWidth = 1;
          for (let x = 0; x < w; x += 12) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
          }
          for (let y = 0; y < h; y += 12) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
          }

          // Green waveform line
          ctx.strokeStyle = '#00ff00';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          const step = w / (cpuHistoryRef.current.length - 1);
          cpuHistoryRef.current.forEach((val, i) => {
            const x = i * step;
            const y = h - (val / 100) * (h - 4) - 2;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });
          ctx.stroke();
        }
      }

      // Draw Memory History Canvas
      const memCanvas = memCanvasRef.current;
      if (memCanvas) {
        const ctx = memCanvas.getContext('2d');
        if (ctx) {
          const w = memCanvas.width;
          const h = memCanvas.height;
          ctx.fillStyle = '#001400';
          ctx.fillRect(0, 0, w, h);

          ctx.strokeStyle = '#004a00';
          ctx.lineWidth = 1;
          for (let x = 0; x < w; x += 12) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
          }
          for (let y = 0; y < h; y += 12) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
          }

          ctx.strokeStyle = '#ffff00';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          const maxMem = 512;
          const step = w / (memHistoryRef.current.length - 1);
          memHistoryRef.current.forEach((val, i) => {
            const x = i * step;
            const y = h - (val / maxMem) * (h - 4) - 2;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });
          ctx.stroke();
        }
      }

      // Draw Network Canvas if visible
      const netCanvas = netCanvasRef.current;
      if (netCanvas) {
        const ctx = netCanvas.getContext('2d');
        if (ctx) {
          const w = netCanvas.width;
          const h = netCanvas.height;
          ctx.fillStyle = '#001400';
          ctx.fillRect(0, 0, w, h);

          ctx.strokeStyle = '#004a00';
          ctx.lineWidth = 1;
          for (let x = 0; x < w; x += 15) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
          }
          for (let y = 0; y < h; y += 15) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
          }

          ctx.strokeStyle = '#ff0033';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          const netHistory = cpuHistoryRef.current.map(v => Math.min(100, v * 1.8));
          const step = w / (netHistory.length - 1);
          netHistory.forEach((val, i) => {
            const x = i * step;
            const y = h - (val / 100) * (h - 4) - 2;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });
          ctx.stroke();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [openWindows.length]);

  const handleEndTask = () => {
    if (!selectedAppId) return;
    onCloseWindow?.(selectedAppId);
    setSelectedAppId(null);
  };

  const handleSwitchTo = () => {
    if (!selectedAppId) return;
    onFocusWindow?.(selectedAppId);
  };

  const handleEndProcess = () => {
    if (!selectedProcessId) return;
    const p = processes.find(item => item.id === selectedProcessId);
    if (p && p.windowId) {
      onCloseWindow?.(p.windowId);
    }
    setProcesses(prev => prev.filter(item => item.id !== selectedProcessId));
    setSelectedProcessId(null);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: '#ece9d8',
      fontFamily: 'Tahoma, sans-serif',
      fontSize: '11px',
      userSelect: 'none',
    }}>
      {/* Task Manager Classic Menu Bar */}
      <div style={{
        display: 'flex',
        gap: '12px',
        padding: '3px 8px',
        borderBottom: '1px solid #d4d0c8',
        background: '#ece9d8',
        fontSize: '11px',
      }}>
        <span style={{ cursor: 'pointer' }}><u>F</u>ile</span>
        <span style={{ cursor: 'pointer' }}><u>O</u>ptions</span>
        <span style={{ cursor: 'pointer' }}><u>V</u>iew</span>
        <span style={{ cursor: 'pointer' }}><u>S</u>hut Down</span>
        <span style={{ cursor: 'pointer' }}><u>H</u>elp</span>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        padding: '6px 8px 0',
        gap: '2px',
        borderBottom: '1px solid #919b9c',
      }}>
        {[
          { id: 'apps', label: 'Applications' },
          { id: 'processes', label: 'Processes' },
          { id: 'perf', label: 'Performance' },
          { id: 'net', label: 'Networking' },
          { id: 'users', label: 'Users' },
        ].map(tab => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            style={{
              padding: '3px 10px',
              borderTopLeftRadius: '3px',
              borderTopRightRadius: '3px',
              border: '1px solid #919b9c',
              borderBottom: activeTab === tab.id ? '1px solid #ece9d8' : '1px solid #919b9c',
              background: activeTab === tab.id ? '#ece9d8' : '#e0ded3',
              marginBottom: '-1px',
              cursor: 'pointer',
              fontWeight: activeTab === tab.id ? 'bold' : 'normal',
              zIndex: activeTab === tab.id ? 2 : 1,
            }}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {/* Tab Body */}
      <div style={{
        flex: 1,
        padding: '8px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* ================= APPLICATIONS TAB ================= */}
        {activeTab === 'apps' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{
              flex: 1,
              background: '#fff',
              border: '1px solid #7f9db9',
              overflowY: 'auto',
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                <thead>
                  <tr style={{ background: '#ece9d8', borderBottom: '1px solid #d4d0c8', textAlign: 'left' }}>
                    <th style={{ padding: '3px 6px', borderRight: '1px solid #d4d0c8', width: '70%' }}>Task</th>
                    <th style={{ padding: '3px 6px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {openWindows.length === 0 ? (
                    <tr>
                      <td colSpan={2} style={{ padding: '16px', textAlign: 'center', color: '#888' }}>
                        No applications currently running.
                      </td>
                    </tr>
                  ) : (
                    openWindows.map(w => {
                      const isSelected = selectedAppId === w.id;
                      return (
                        <tr
                          key={w.id}
                          onClick={() => setSelectedAppId(w.id)}
                          onDoubleClick={() => onFocusWindow?.(w.id)}
                          style={{
                            background: isSelected ? '#316ac5' : 'transparent',
                            color: isSelected ? '#fff' : '#000',
                            cursor: 'pointer',
                          }}
                        >
                          <td style={{ padding: '3px 6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <XPIcon src={w.icon} size={16} alt="" />
                            <span>{w.title}</span>
                          </td>
                          <td style={{ padding: '3px 6px' }}>Running</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Task action buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', marginTop: '8px' }}>
              <button
                className="xp-button"
                disabled={!selectedAppId}
                onClick={handleEndTask}
                style={{ opacity: selectedAppId ? 1 : 0.6 }}
              >
                End Task
              </button>
              <button
                className="xp-button"
                disabled={!selectedAppId}
                onClick={handleSwitchTo}
                style={{ opacity: selectedAppId ? 1 : 0.6 }}
              >
                Switch To
              </button>
              <button
                className="xp-button"
                onClick={() => onOpenApp?.('run')}
              >
                New Task...
              </button>
            </div>
          </div>
        )}

        {/* ================= PROCESSES TAB ================= */}
        {activeTab === 'processes' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{
              flex: 1,
              background: '#fff',
              border: '1px solid #7f9db9',
              overflowY: 'auto',
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                <thead>
                  <tr style={{ background: '#ece9d8', borderBottom: '1px solid #d4d0c8', textAlign: 'left', position: 'sticky', top: 0 }}>
                    <th style={{ padding: '3px 6px', borderRight: '1px solid #d4d0c8' }}>Image Name</th>
                    <th style={{ padding: '3px 6px', borderRight: '1px solid #d4d0c8', textAlign: 'right' }}>PID</th>
                    <th style={{ padding: '3px 6px', borderRight: '1px solid #d4d0c8' }}>User Name</th>
                    <th style={{ padding: '3px 6px', borderRight: '1px solid #d4d0c8', textAlign: 'right' }}>CPU</th>
                    <th style={{ padding: '3px 6px', textAlign: 'right' }}>Mem Usage</th>
                  </tr>
                </thead>
                <tbody>
                  {processes.map(p => {
                    const isSelected = selectedProcessId === p.id;
                    return (
                      <tr
                        key={p.id}
                        onClick={() => setSelectedProcessId(p.id)}
                        style={{
                          background: isSelected ? '#316ac5' : 'transparent',
                          color: isSelected ? '#fff' : '#000',
                          cursor: 'pointer',
                        }}
                      >
                        <td style={{ padding: '2px 6px' }}>{p.name}</td>
                        <td style={{ padding: '2px 6px', textAlign: 'right' }}>{p.pid}</td>
                        <td style={{ padding: '2px 6px' }}>{p.user}</td>
                        <td style={{ padding: '2px 6px', textAlign: 'right' }}>{p.cpu < 10 ? `0${p.cpu}` : p.cpu}</td>
                        <td style={{ padding: '2px 6px', textAlign: 'right' }}>
                          {p.memUsage.toLocaleString()} K
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked />
                Show processes from all users
              </label>
              <button
                className="xp-button"
                disabled={!selectedProcessId}
                onClick={handleEndProcess}
                style={{ opacity: selectedProcessId ? 1 : 0.6 }}
              >
                End Process
              </button>
            </div>
          </div>
        )}

        {/* ================= PERFORMANCE TAB ================= */}
        {activeTab === 'perf' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '8px', overflowY: 'auto' }}>
            {/* Top row: CPU usage and History */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {/* CPU Usage % Gauge */}
              <fieldset style={{
                border: '1px solid #d4d0c8',
                borderRadius: '4px',
                padding: '6px',
                width: '80px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
                <legend style={{ fontSize: '10px', color: '#000' }}>CPU Usage</legend>
                <div style={{
                  width: '32px',
                  height: '65px',
                  background: '#001400',
                  border: '1px solid #7f9db9',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column-reverse',
                  padding: '2px',
                  boxSizing: 'border-box',
                }}>
                  <div style={{
                    width: '100%',
                    height: `${cpuUsage}%`,
                    background: 'linear-gradient(0deg, #00ff00 0%, #33ff33 100%)',
                    transition: 'height 0.3s ease',
                  }} />
                </div>
                <div style={{ marginTop: '4px', fontWeight: 'bold', fontSize: '12px' }}>{cpuUsage}%</div>
              </fieldset>

              {/* CPU Usage History Canvas */}
              <fieldset style={{
                border: '1px solid #d4d0c8',
                borderRadius: '4px',
                padding: '6px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
              }}>
                <legend style={{ fontSize: '10px', color: '#000' }}>CPU Usage History</legend>
                <canvas
                  ref={cpuCanvasRef}
                  width={240}
                  height={65}
                  style={{ width: '100%', height: '65px', borderRadius: '2px' }}
                />
              </fieldset>
            </div>

            {/* Middle row: PF Usage and History */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {/* PF Usage Gauge */}
              <fieldset style={{
                border: '1px solid #d4d0c8',
                borderRadius: '4px',
                padding: '6px',
                width: '80px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
                <legend style={{ fontSize: '10px', color: '#000' }}>PF Usage</legend>
                <div style={{
                  width: '32px',
                  height: '65px',
                  background: '#001400',
                  border: '1px solid #7f9db9',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column-reverse',
                  padding: '2px',
                  boxSizing: 'border-box',
                }}>
                  <div style={{
                    width: '100%',
                    height: `${Math.min(100, (memUsageMb / 512) * 100)}%`,
                    background: 'linear-gradient(0deg, #ffcc00 0%, #ffff33 100%)',
                    transition: 'height 0.3s ease',
                  }} />
                </div>
                <div style={{ marginTop: '4px', fontWeight: 'bold', fontSize: '11px' }}>{memUsageMb} MB</div>
              </fieldset>

              {/* Memory Usage History Canvas */}
              <fieldset style={{
                border: '1px solid #d4d0c8',
                borderRadius: '4px',
                padding: '6px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
              }}>
                <legend style={{ fontSize: '10px', color: '#000' }}>Page File Usage History</legend>
                <canvas
                  ref={memCanvasRef}
                  width={240}
                  height={65}
                  style={{ width: '100%', height: '65px', borderRadius: '2px' }}
                />
              </fieldset>
            </div>

            {/* Bottom stat blocks grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              {/* Totals */}
              <fieldset style={{ border: '1px solid #d4d0c8', padding: '4px 8px', borderRadius: '3px' }}>
                <legend style={{ fontSize: '10px' }}>Totals</legend>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Handles</span><span>8420</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Threads</span><span>348</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Processes</span><span>{processes.length}</span></div>
              </fieldset>

              {/* Commit Charge */}
              <fieldset style={{ border: '1px solid #d4d0c8', padding: '4px 8px', borderRadius: '3px' }}>
                <legend style={{ fontSize: '10px' }}>Commit Charge (K)</legend>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Total</span><span>{(memUsageMb * 1024).toLocaleString()}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Limit</span><span>4,194,304</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Peak</span><span>298,420</span></div>
              </fieldset>

              {/* Physical Memory */}
              <fieldset style={{ border: '1px solid #d4d0c8', padding: '4px 8px', borderRadius: '3px' }}>
                <legend style={{ fontSize: '10px' }}>Physical Memory (K)</legend>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Total</span><span>2,096,624</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Available</span><span>1,462,810</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>System Cache</span><span>512,380</span></div>
              </fieldset>

              {/* Kernel Memory */}
              <fieldset style={{ border: '1px solid #d4d0c8', padding: '4px 8px', borderRadius: '3px' }}>
                <legend style={{ fontSize: '10px' }}>Kernel Memory (K)</legend>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Total</span><span>42,880</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Paged</span><span>31,440</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Nonpaged</span><span>11,440</span></div>
              </fieldset>
            </div>
          </div>
        )}

        {/* ================= NETWORKING TAB ================= */}
        {activeTab === 'net' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '8px' }}>
            <fieldset style={{ border: '1px solid #d4d0c8', padding: '8px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <legend style={{ fontSize: '10px' }}>Local Area Connection - 100 Mbps</legend>
              <canvas
                ref={netCanvasRef}
                width={320}
                height={120}
                style={{ width: '100%', flex: 1, borderRadius: '2px' }}
              />
            </fieldset>
            <div style={{
              background: '#fff',
              border: '1px solid #7f9db9',
              padding: '6px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
                <span>Adapter: Realtek RTL8139 Family PCI Fast Ethernet</span>
                <span style={{ color: '#008000', fontWeight: 'bold' }}>Connected</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
                <span>Network Utilization: {Math.max(0.1, (cpuUsage * 0.08)).toFixed(1)}%</span>
                <span>Link Speed: 100 Mbps</span>
              </div>
            </div>
          </div>
        )}

        {/* ================= USERS TAB ================= */}
        {activeTab === 'users' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{
              flex: 1,
              background: '#fff',
              border: '1px solid #7f9db9',
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                <thead>
                  <tr style={{ background: '#ece9d8', borderBottom: '1px solid #d4d0c8', textAlign: 'left' }}>
                    <th style={{ padding: '3px 6px', borderRight: '1px solid #d4d0c8' }}>User</th>
                    <th style={{ padding: '3px 6px', borderRight: '1px solid #d4d0c8' }}>ID</th>
                    <th style={{ padding: '3px 6px', borderRight: '1px solid #d4d0c8' }}>Status</th>
                    <th style={{ padding: '3px 6px' }}>Client Name</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ background: '#316ac5', color: '#fff' }}>
                    <td style={{ padding: '3px 6px' }}>Rayen Ben Aissa</td>
                    <td style={{ padding: '3px 6px' }}>0</td>
                    <td style={{ padding: '3px 6px' }}>Active</td>
                    <td style={{ padding: '3px 6px' }}>Console</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Status Bar */}
      <div style={{
        display: 'flex',
        borderTop: '1px solid #919b9c',
        background: '#ece9d8',
        padding: '2px 6px',
        fontSize: '11px',
      }}>
        <div style={{ borderRight: '1px solid #d4d0c8', paddingRight: '12px', marginRight: '12px' }}>
          Processes: {processes.length}
        </div>
        <div style={{ borderRight: '1px solid #d4d0c8', paddingRight: '12px', marginRight: '12px' }}>
          CPU Usage: {cpuUsage}%
        </div>
        <div>
          Commit Charge: {memUsageMb}M / 4096M
        </div>
      </div>
    </div>
  );
}

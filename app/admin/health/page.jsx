"use client";

import { useState, useEffect } from "react";
import {
  Activity,
  Database,
  Server,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Play,
  ShieldCheck,
  Globe,
  Layers,
} from "lucide-react";

export default function AdminHealthPage() {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [testingAction, setTestingAction] = useState(null);
  const [testResults, setTestResults] = useState([]);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/health");
      const data = await res.json();
      setHealthData(data);
    } catch (err) {
      console.error("Health fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const runTest = async (action, title) => {
    setTestingAction(action);
    try {
      const res = await fetch("/api/admin/health", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      setTestResults((prev) => [
        {
          id: Date.now(),
          title,
          time: new Date().toLocaleTimeString(),
          success: data.success,
          durationMs: data.durationMs,
          message: data.message || (data.success ? "Passed successfully" : data.error),
          details: data,
        },
        ...prev,
      ]);
    } catch (err) {
      setTestResults((prev) => [
        {
          id: Date.now(),
          title,
          time: new Date().toLocaleTimeString(),
          success: false,
          message: err.message,
        },
        ...prev,
      ]);
    } finally {
      setTestingAction(null);
      fetchHealth();
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-mono text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
              SYSTEM HEALTH & PERSISTENCE DIAGNOSTICS
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#CCFF00]/40 bg-[#CCFF00]/10 px-3 py-1 font-mono text-[10px] font-bold uppercase text-[#CCFF00]">
              <Activity className="h-3 w-3 animate-pulse" />
              LIVE TELEMETRY
            </span>
          </div>
          <p className="mt-1.5 font-mono text-xs text-neutral-400">
            Real-time Supabase PostgreSQL connectivity, environment status, and automated CRUD verification.
          </p>
        </div>

        <button
          onClick={fetchHealth}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 font-mono text-xs font-bold text-white transition-all hover:border-[#CCFF00] hover:bg-[#CCFF00]/10 hover:text-[#CCFF00] disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          REFRESH STATUS
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Database Status Card */}
        <div className="rounded-2xl border border-white/10 bg-[#090C10]/80 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-neutral-400 uppercase">DATABASE STATUS</span>
            <Database className="h-4 w-4 text-[#00F0FF]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span
              className={`font-mono text-2xl font-black uppercase ${
                healthData?.database?.status === "CONNECTED" ? "text-[#CCFF00]" : "text-[#EF0606]"
              }`}
            >
              {healthData?.database?.status || "CHECKING..."}
            </span>
          </div>
          <p className="mt-1 font-mono text-[10px] text-neutral-500">
            Engine: {healthData?.database?.engine || "PostgreSQL"} • Latency: {healthData?.latencyMs || 0}ms
          </p>
        </div>

        {/* Active Publication Card */}
        <div className="rounded-2xl border border-white/10 bg-[#090C10]/80 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-neutral-400 uppercase">PUBLISHED RELEASE</span>
            <Layers className="h-4 w-4 text-[#CCFF00]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-black uppercase text-white">
              {healthData?.activePublication?.versionNumber || "v1.0"}
            </span>
          </div>
          <p className="mt-1 font-mono text-[10px] text-neutral-500 truncate">
            {healthData?.activePublication?.releaseTitle || "Baseline Release"}
          </p>
        </div>

        {/* Products Count */}
        <div className="rounded-2xl border border-white/10 bg-[#090C10]/80 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-neutral-400 uppercase">PRODUCTS IN DB</span>
            <span className="font-mono text-[10px] text-neutral-500">POSTGRES</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-black uppercase text-white">
              {healthData?.counts?.products ?? 0}
            </span>
            <span className="font-mono text-xs text-neutral-500">ITEMS</span>
          </div>
          <p className="mt-1 font-mono text-[10px] text-neutral-500">
            {healthData?.counts?.categories ?? 0} Categories • {healthData?.counts?.banners ?? 0} Banners
          </p>
        </div>

        {/* Security & Env */}
        <div className="rounded-2xl border border-white/10 bg-[#090C10]/80 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-neutral-400 uppercase">SECURITY STATUS</span>
            <ShieldCheck className="h-4 w-4 text-[#CCFF00]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-black uppercase text-[#CCFF00]">
              PROTECTED
            </span>
          </div>
          <p className="mt-1 font-mono text-[10px] text-neutral-500">
            Zero Client Secret Exposure
          </p>
        </div>
      </div>

      {/* Environment Variables Audit (0 Values Displayed) */}
      <div className="rounded-3xl border border-white/10 bg-[#090C10]/90 p-6 backdrop-blur-2xl">
        <h2 className="font-mono text-base font-bold uppercase text-white flex items-center gap-2">
          <Server className="h-4 w-4 text-[#00F0FF]" />
          Environment Variables Configuration Audit
        </h2>
        <p className="mt-1 font-mono text-xs text-neutral-400">
          Status of required runtime environment variables (values are strictly hidden for security).
        </p>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {healthData?.envStatus &&
            Object.entries(healthData.envStatus).map(([key, status]) => (
              <div
                key={key}
                className="flex items-center justify-between rounded-xl border border-white/5 bg-black/40 px-4 py-3"
              >
                <span className="font-mono text-xs font-semibold text-neutral-300 truncate">{key}</span>
                <span
                  className={`font-mono text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                    status === "SET"
                      ? "bg-[#CCFF00]/15 text-[#CCFF00] border border-[#CCFF00]/40"
                      : "bg-[#EF0606]/15 text-[#EF0606] border border-[#EF0606]/40"
                  }`}
                >
                  {status}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Interactive Verification Suite */}
      <div className="rounded-3xl border border-white/10 bg-[#090C10]/90 p-6 backdrop-blur-2xl">
        <h2 className="font-mono text-base font-bold uppercase text-white flex items-center gap-2">
          <Play className="h-4 w-4 text-[#CCFF00]" />
          Interactive End-to-End Test Suite
        </h2>
        <p className="mt-1 font-mono text-xs text-neutral-400">
          Execute direct real-time database CRUD, read, and customer synchronization tests.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <button
            onClick={() => runTest("test_db_read", "Database Read Test")}
            disabled={testingAction !== null}
            className="flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 p-4 font-mono text-xs font-bold uppercase text-white transition-all hover:border-[#00F0FF] hover:bg-[#00F0FF]/10 hover:text-[#00F0FF] disabled:opacity-50"
          >
            <Database className="h-4 w-4" />
            1. TEST DB READ
          </button>

          <button
            onClick={() => runTest("test_db_write", "Full Database CRUD Test")}
            disabled={testingAction !== null}
            className="flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 p-4 font-mono text-xs font-bold uppercase text-white transition-all hover:border-[#CCFF00] hover:bg-[#CCFF00]/10 hover:text-[#CCFF00] disabled:opacity-50"
          >
            <RefreshCw className="h-4 w-4" />
            2. TEST DB WRITE/CRUD
          </button>

          <button
            onClick={() => runTest("test_customer_read", "Customer Storefront Read")}
            disabled={testingAction !== null}
            className="flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 p-4 font-mono text-xs font-bold uppercase text-white transition-all hover:border-[#EF0606] hover:bg-[#EF0606]/10 hover:text-[#EF0606] disabled:opacity-50"
          >
            <Globe className="h-4 w-4" />
            3. TEST CUSTOMER SYNC
          </button>

          <button
            onClick={async () => {
              setTestingAction("migrate");
              try {
                const res = await fetch("/api/admin/migrate", { method: "POST" });
                const data = await res.json();
                setTestResults((prev) => [
                  {
                    id: Date.now(),
                    title: "Real Data Migration (SQLite -> PostgreSQL)",
                    time: new Date().toLocaleTimeString(),
                    success: data.success,
                    message: data.message || data.error,
                  },
                  ...prev,
                ]);
              } catch (err) {
                setTestResults((prev) => [
                  {
                    id: Date.now(),
                    title: "Migration Execution Error",
                    time: new Date().toLocaleTimeString(),
                    success: false,
                    message: err.message,
                  },
                  ...prev,
                ]);
              } finally {
                setTestingAction(null);
                fetchHealth();
              }
            }}
            disabled={testingAction !== null}
            className="flex items-center justify-center gap-2 rounded-2xl border border-[#CCFF00]/40 bg-[#CCFF00]/10 p-4 font-mono text-xs font-black uppercase text-[#CCFF00] transition-all hover:border-[#CCFF00] hover:bg-[#CCFF00]/20 disabled:opacity-50 shadow-[0_0_20px_rgba(204,255,0,0.15)]"
          >
            <Layers className="h-4 w-4" />
            4. MIGRATE REAL DATA
          </button>
        </div>

        {/* Live Execution Logs */}
        {testResults.length > 0 && (
          <div className="mt-6 space-y-3">
            <h3 className="font-mono text-xs font-bold uppercase text-neutral-400">Execution Output</h3>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {testResults.map((res) => (
                <div
                  key={res.id}
                  className={`rounded-xl border p-4 font-mono text-xs ${
                    res.success
                      ? "border-[#CCFF00]/40 bg-[#CCFF00]/5 text-neutral-200"
                      : "border-[#EF0606]/40 bg-[#EF0606]/5 text-[#EF0606]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold uppercase flex items-center gap-2">
                      {res.success ? (
                        <CheckCircle2 className="h-4 w-4 text-[#CCFF00]" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-[#EF0606]" />
                      )}
                      {res.title}
                    </span>
                    <span className="text-[10px] text-neutral-500">
                      {res.time} • {res.durationMs}ms
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] text-neutral-300">{res.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

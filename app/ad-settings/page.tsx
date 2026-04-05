"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Save, AlertCircle, Plus, Minus, MousePointerClick, Clock, Power, Settings2 } from "lucide-react";

export default function AdSettings() {
  const [config, setConfig] = useState({
    is_ads_enabled: true,
    show_on_first_open: true,
    skip_duration_seconds: 3,
    trigger_strategy: "after_clicks",
    trigger_clicks_count: 5,
    trigger_seconds_delay: 120,
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Minutes / Seconds logic for UX
  const [delayMinutes, setDelayMinutes] = useState(2);
  const [delaySeconds, setDelaySeconds] = useState(0);

  const [initialConfig, setInitialConfig] = useState<any>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const docRef = doc(db, "ad_settings", "hitunguntung_config");
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setConfig(data as any);
          setInitialConfig(data as any);
          setDelayMinutes(Math.floor((data?.trigger_seconds_delay || 120) / 60));
          setDelaySeconds((data.trigger_seconds_delay || 120) % 60);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchConfig();
  }, []);

  // Update total seconds whenever mins/secs change
  useEffect(() => {
    setConfig(prev => ({
      ...prev,
      trigger_seconds_delay: (delayMinutes * 60) + delaySeconds
    }));
  }, [delayMinutes, delaySeconds]);

  useEffect(() => {
    if (initialConfig && config) {
      setHasChanges(JSON.stringify(initialConfig) !== JSON.stringify(config));
    }
  }, [config, initialConfig]);

  const handleSave = async () => {
    setIsSaving(true);
    setToastMsg("");
    try {
      const finalConfig = { ...config };
      
      // Apply fallbacks based on strategy
      if (finalConfig.trigger_strategy === "after_clicks") {
        finalConfig.trigger_seconds_delay = 43200; // 12 hours fallback
      } else if (finalConfig.trigger_strategy === "after_seconds") {
        finalConfig.trigger_clicks_count = 10000; // 10k clicks fallback
      }

      await setDoc(doc(db, "ad_settings", "hitunguntung_config"), finalConfig, { merge: true });
      setInitialConfig(finalConfig);
      setToastMsg("Pengaturan berhasil disimpan!");
      setTimeout(() => setToastMsg(""), 3000);

      // Re-adjust display values if they were overwritten
      setDelayMinutes(Math.floor(finalConfig.trigger_seconds_delay / 60));
      setDelaySeconds(finalConfig.trigger_seconds_delay % 60);

    } catch (error) {
      console.error(error);
      setToastMsg("Gagal menyimpan pengaturan.");
    } finally {
      setIsSaving(false);
    }
  };

  const adjustValue = (field: keyof typeof config, amount: number) => {
    setConfig(prev => ({
      ...prev,
      [field]: Math.max(1, (prev[field] as number) + amount)
    }));
  };

  if (isLoading) {
    return <div className="animate-pulse space-y-6">
      <div className="h-10 bg-card-border/50 rounded-xl w-1/3 mb-8"></div>
      <div className="h-64 bg-card-border/30 rounded-2xl w-full"></div>
    </div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Ad Settings</h1>
          <p className="text-foreground/70">Atur kemunculan Iklan secara Global pada aplikasi.</p>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={isSaving || !hasChanges}
          className={`w-full md:w-auto px-6 py-3 font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg ${
            hasChanges 
              ? "bg-gold-500 text-black hover:bg-gold-600 shadow-[0_0_15px_rgba(255,215,0,0.5)] animate-pulse" 
              : "bg-card-bg border border-card-border text-foreground/50 cursor-not-allowed opacity-50"
          }`}
        >
          <Save className="w-5 h-5" />
          {isSaving ? "Menyimpan..." : hasChanges ? "Simpan Perubahan*" : "Belum Ada Perubahan"}
        </button>
      </div>

      {toastMsg && (
        <div className={`p-4 rounded-xl border ${toastMsg.includes("Gagal") ? "bg-red-500/10 border-red-500/50 text-red-400" : "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"} flex items-center gap-3`}>
          <AlertCircle className="w-5 h-5" />
          {toastMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core Settings */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2 border-b border-card-border/50 pb-4">
              <Power className="w-5 h-5 text-indigo-400" /> Pengaturan Dasar
            </h3>

            {/* Global Ads Toggle */}
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-semibold text-[15px]">Global Ads</p>
                <p className="text-xs text-foreground/50">Nyalakan/matikan seluruh iklan</p>
              </div>
              <button 
                onClick={() => setConfig(p => ({...p, is_ads_enabled: !p.is_ads_enabled}))}
                className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${config.is_ads_enabled ? "bg-gold-500" : "bg-card-border"}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute transition-transform ${config.is_ads_enabled ? "translate-x-7" : "translate-x-1"}`} />
              </button>
            </div>

            {/* First Open Toggle */}
            <div className="flex items-center justify-between py-3 border-t border-card-border/50">
              <div>
                <p className="font-semibold text-[15px]">First Open</p>
                <p className="text-xs text-foreground/50">Tampilkan otomatis setelah Splash Screen</p>
              </div>
              <button 
                onClick={() => setConfig(p => ({...p, show_on_first_open: !p.show_on_first_open}))}
                className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${config.show_on_first_open ? "bg-indigo-500" : "bg-card-border"}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute transition-transform ${config.show_on_first_open ? "translate-x-7" : "translate-x-1"}`} />
              </button>
            </div>

            {/* Skip Duration */}
            <div className="pt-6 border-t border-card-border/50">
               <p className="font-semibold text-[15px] mb-1">Durasi Skip (Detik)</p>
               <p className="text-xs text-foreground/50 mb-4">Waktu tunggu tombol skip muncul.</p>
               
               <div className="flex items-center gap-3">
                  <button onClick={() => adjustValue("skip_duration_seconds", -1)} className="p-3 glass-panel hover:bg-card-border transition-colors rounded-xl"><Minus className="w-4 h-4" /></button>
                  <input 
                    type="number" 
                    value={config.skip_duration_seconds}
                    onChange={(e) => setConfig(p => ({...p, skip_duration_seconds: Math.max(0, parseInt(e.target.value) || 0)}))}
                    className="w-full bg-card-bg border border-card-border rounded-xl p-3 text-center font-bold text-lg focus:outline-none focus:border-gold-500 transition-colors"
                  />
                  <button onClick={() => adjustValue("skip_duration_seconds", 1)} className="p-3 glass-panel hover:bg-card-border transition-colors rounded-xl"><Plus className="w-4 h-4" /></button>
               </div>
               
               <div className="flex flex-wrap gap-2 mt-4">
                 {[3, 5, 10, 30, 60].map(val => (
                   <button 
                    key={val} 
                    onClick={() => setConfig(p => ({...p, skip_duration_seconds: val}))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${config.skip_duration_seconds === val ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-card-bg border-card-border text-foreground/70 hover:bg-card-border'}`}
                   >
                     {val}s
                   </button>
                 ))}
               </div>
            </div>

          </div>
        </div>

        {/* Trigger Strategy */}
        <div className="lg:col-span-2 space-y-6">
           <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full blur-[80px] -mr-10 -mt-10 pointer-events-none" />
             
             <h3 className="font-bold text-lg mb-6 flex items-center gap-2 border-b border-card-border/50 pb-4 relative z-10">
                <Settings2 className="w-5 h-5 text-gold-500" /> Strategi Trigger
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8 relative z-10">
                {[
                  { id: "after_clicks", label: "Setelah Klik", icon: MousePointerClick, desc: "Berdasarkan interaksi klik menu/navigasi." },
                  { id: "after_seconds", label: "Berdasarkan Waktu", icon: Clock, desc: "Akan otomatis muncul setiap N menit/detik." },
                  { id: "hybrid", label: "Hybrid", icon: Settings2, desc: "Dikombinasikan, mana yang lebih dulu terpenuhi." }
                ].map((strategy) => {
                  const isSelected = config.trigger_strategy === strategy.id;
                  return (
                    <div 
                      key={strategy.id}
                      onClick={() => setConfig(p => ({...p, trigger_strategy: strategy.id}))}
                      className={`cursor-pointer p-4 rounded-xl border-2 transition-all group ${isSelected ? "border-gold-500 bg-gold-500/10 shadow-[0_4px_20px_rgba(229,179,0,0.1)]" : "border-card-border bg-card-bg/50 hover:border-card-border/80"}`}
                    >
                       <div className="flex items-center gap-2 mb-2">
                         <strategy.icon className={`w-5 h-5 ${isSelected ? "text-gold-500" : "text-foreground/50 group-hover:text-foreground/80"}`} />
                         <span className="font-bold">{strategy.label}</span>
                       </div>
                       <p className="text-xs text-foreground/60">{strategy.desc}</p>
                    </div>
                  )
                })}
              </div>

              {/* Dynamic Inputs based on Strategy */}
              <div className="space-y-6 relative z-10 p-6 bg-card-bg/50 rounded-xl border border-card-border/50">
                 
                 {/* Klik config */}
                 {(config.trigger_strategy === "after_clicks" || config.trigger_strategy === "hybrid") && (
                   <div className="animate-in fade-in slide-in-from-top-2">
                     <p className="font-semibold text-[15px] mb-1 flex items-center gap-2"><MousePointerClick className="w-4 h-4 text-indigo-400"/> Jumlah Klik Pemicu</p>
                     <p className="text-xs text-foreground/50 mb-4">Iklan akan muncul setelah user melakukan klik sebanyak ini pada tombol menu navigasi/kembali.</p>
                     <div className="flex items-center gap-3 w-full max-w-sm">
                        <button onClick={() => adjustValue("trigger_clicks_count", -1)} className="p-3 glass-panel hover:bg-card-border transition-colors rounded-xl"><Minus className="w-4 h-4" /></button>
                        <input 
                          type="number" 
                          value={config.trigger_clicks_count}
                          onChange={(e) => setConfig(p => ({...p, trigger_clicks_count: Math.max(1, parseInt(e.target.value) || 1)}))}
                          className="w-full bg-background border border-card-border rounded-xl p-3 text-center font-bold text-lg focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                        <button onClick={() => adjustValue("trigger_clicks_count", 1)} className="p-3 glass-panel hover:bg-card-border transition-colors rounded-xl"><Plus className="w-4 h-4" /></button>
                     </div>
                     <div className="flex flex-wrap gap-2 mt-4">
                       {[3, 5, 10, 15, 20].map(val => (
                         <button 
                          key={val} 
                          onClick={() => setConfig(p => ({...p, trigger_clicks_count: val}))}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${config.trigger_clicks_count === val ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-card-bg border-card-border text-foreground/70 hover:bg-card-border'}`}
                         >
                           {val} Klik
                         </button>
                       ))}
                     </div>
                   </div>
                 )}

                 {config.trigger_strategy === "hybrid" && <div className="h-px bg-card-border w-full my-6 opacity-50" />}

                 {/* Detik Config */}
                 {(config.trigger_strategy === "after_seconds" || config.trigger_strategy === "hybrid") && (
                   <div className="animate-in fade-in slide-in-from-top-2">
                     <p className="font-semibold text-[15px] mb-1 flex items-center gap-2"><Clock className="w-4 h-4 text-emerald-400"/> Jeda Waktu Pemicu</p>
                     <p className="text-xs text-foreground/50 mb-4">Iklan akan muncul secara tiba-tiba (apabila berada di menu utama) saat mencapai jeda ini.</p>
                     
                     <div className="flex items-center gap-4 w-full max-w-sm">
                        <div className="flex-1">
                          <label className="text-[10px] uppercase text-foreground/50 font-bold ml-1 mb-1 block">Menit</label>
                          <input 
                            type="number" 
                            value={delayMinutes}
                            onChange={(e) => setDelayMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-full bg-background border border-card-border rounded-xl p-3 text-center font-bold text-lg focus:outline-none focus:border-emerald-500 transition-colors"
                          />
                        </div>
                        <span className="text-2xl font-bold pt-4">:</span>
                        <div className="flex-1">
                          <label className="text-[10px] uppercase text-foreground/50 font-bold ml-1 mb-1 block">Detik</label>
                          <input 
                            type="number" 
                            max={59}
                            value={delaySeconds}
                            onChange={(e) => setDelaySeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                            className="w-full bg-background border border-card-border rounded-xl p-3 text-center font-bold text-lg focus:outline-none focus:border-emerald-500 transition-colors"
                          />
                        </div>
                     </div>
                     <p className="text-xs text-foreground/40 mt-3">Total: {config.trigger_seconds_delay} detik</p>
                   </div>
                 )}
              </div>

           </div>
        </div>

      </div>
    </div>
  );
}

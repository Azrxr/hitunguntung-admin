"use client";

import { useEffect, useState } from "react";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { 
  BarChart3, 
  Settings2, 
  Megaphone,
  CheckCircle2,
  XCircle,
  Clock,
  MousePointerClick,
  Smartphone,
  Power
} from "lucide-react";
import { useRouter } from "next/navigation";
import { updateDoc } from "firebase/firestore";

export default function Dashboard() {
  const [config, setConfig] = useState<any>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Listen to config
    const unsubConfig = onSnapshot(doc(db, "ad_settings", "hitunguntung_config"), (doc) => {
      setConfig(doc.exists() ? doc.data() : null);
    });

    // Listen to campaigns
    const unsubCampaigns = onSnapshot(collection(db, "campaigns"), (snap) => {
      setCampaigns(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setIsLoading(false);
    });

    return () => {
      unsubConfig();
      unsubCampaigns();
    };
  }, []);

  if (isLoading) {
    return <div className="animate-pulse space-y-6">
      <div className="h-10 bg-card-border/50 rounded-xl w-1/3"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-card-border/30 rounded-2xl"></div>)}
      </div>
    </div>;
  }

  const activeCampaigns = campaigns.filter(c => c.is_active);
  const isAdsGlobalEnabled = config?.is_ads_enabled;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-foreground/70">Ringkasan performa dan pengaturan Ads HitungUntung.</p>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-[30px] -mr-10 -mt-10 transition-transform group-hover:scale-150" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-sm font-semibold text-foreground/50 mb-1">Status Ads Global</p>
              <h3 className="text-2xl font-bold flex items-center gap-2">
                {isAdsGlobalEnabled ? (
                   <><span className="text-emerald-400">Aktif</span></>
                ) : (
                   <><span className="text-red-400">Nonaktif</span></>
                )}
              </h3>
            </div>
            <button 
              onClick={() => updateDoc(doc(db, "ad_settings", "hitunguntung_config"), { is_ads_enabled: !isAdsGlobalEnabled })}
              className={`p-3 rounded-xl transition-all shadow-lg hover:opacity-80 hover:scale-105 active:scale-95 ${isAdsGlobalEnabled ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}
              title={isAdsGlobalEnabled ? "Matikan Iklan" : "Nyalakan Iklan"}
            >
              <Power className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div onClick={() => router.push('/campaigns')} className="glass-panel p-6 rounded-2xl relative overflow-hidden group cursor-pointer hover:border-indigo-500/50 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[30px] -mr-10 -mt-10 transition-transform group-hover:scale-150" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-sm font-semibold text-foreground/50 mb-1">Total Campaigns</p>
              <h3 className="text-3xl font-bold">{campaigns.length}</h3>
            </div>
            <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl">
              <Megaphone className="w-6 h-6" />
            </div>
          </div>
          <div className="relative z-10">
             <span className="text-sm text-emerald-400 font-medium">{activeCampaigns.length} Aktif</span>
          </div>
        </div>

        <div onClick={() => router.push('/ad-settings')} className="glass-panel p-6 rounded-2xl relative overflow-hidden lg:col-span-2 group border-gold-500/30 cursor-pointer hover:border-gold-500/70 transition-colors">
           <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-full blur-[30px] -mr-10 -mt-10 transition-transform group-hover:scale-150" />
           <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-sm font-semibold text-foreground/50 mb-1">Strategi Trigger Aktif</p>
              <h3 className="text-2xl font-bold capitalize">
                {config?.trigger_strategy ? config.trigger_strategy.replace("_", " ") : "Belum diatur"}
              </h3>
            </div>
            <div className="p-3 bg-gold-500/20 text-gold-500 rounded-xl">
              <Settings2 className="w-6 h-6" />
            </div>
          </div>
          <div className="relative z-10 flex gap-4 text-sm mt-4">
             {config?.trigger_strategy === 'after_clicks' || config?.trigger_strategy === 'hybrid' ? (
                <div className="flex items-center gap-1.5 text-foreground/80 bg-card-bg/50 px-3 py-1.5 rounded-lg border border-card-border">
                  <MousePointerClick className="w-4 h-4 text-indigo-400" />
                  <span>{config?.trigger_clicks_count} Klik</span>
                </div>
             ) : null}
             {config?.trigger_strategy === 'after_seconds' || config?.trigger_strategy === 'hybrid' ? (
                <div className="flex items-center gap-1.5 text-foreground/80 bg-card-bg/50 px-3 py-1.5 rounded-lg border border-card-border">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>{Math.floor((config?.trigger_seconds_delay || 0) / 60)}m {(config?.trigger_seconds_delay || 0) % 60}s</span>
                </div>
             ) : null}
             {config?.show_on_first_open && (
               <div className="flex items-center gap-1.5 text-foreground/80 bg-card-bg/50 px-3 py-1.5 rounded-lg border border-card-border">
                  <Smartphone className="w-4 h-4 text-gold-400" />
                  <span>First Open</span>
                </div>
             )}
          </div>
        </div>

      </div>

      {/* Recent Campaign Preview */}
      <div className="flex items-center justify-between mt-8 mb-4">
        <h3 className="text-xl font-bold">Campaigns Aktif (Terbaru)</h3>
      </div>
      <div className="grid shrink-0 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeCampaigns.slice(0, 3).map((camp) => (
          <div 
             key={camp.id} 
             onClick={() => router.push(`/campaigns#edit-${camp.id}`)}
             className="glass-panel p-5 rounded-2xl flex flex-col justify-between cursor-pointer hover:border-indigo-500/50 transition-colors group"
          >
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col gap-1 pr-2">
                  <h4 className="font-bold text-lg leading-tight group-hover:text-indigo-400 transition-colors">{camp.title}</h4>
                  <span className="text-[10px] text-foreground/50 truncate max-w-[200px]">{camp.target_url || "Tanpa Link Target"}</span>
                </div>
                <span className="text-xs font-bold px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-md shrink-0">
                  {camp.weight}%
                </span>
              </div>
              <div className="flex gap-2">
                 <span className="text-xs bg-card-bg px-2 py-1 rounded border border-card-border uppercase">{camp.ad_type}</span>
                 <span className="text-xs bg-card-bg px-2 py-1 rounded border border-card-border uppercase text-foreground/60">{camp.open_target_in}</span>
              </div>
          </div>
        ))}
        {activeCampaigns.length === 0 && (
          <div className="col-span-full py-8 text-center text-foreground/50 border-2 border-dashed border-card-border rounded-2xl">
            Tidak ada campaign aktif.
          </div>
        )}
      </div>

    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Plus, X, Trash2, Pencil, Megaphone, CheckCircle2, XCircle, Link, MoveRight, Save } from "lucide-react";

export default function CampaignsManagement() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    id: "",
    is_active: true,
    ad_type: "image", // image | video | webview
    title: "",
    media_url: "",
    target_url: "",
    weight: 50,
    open_target_in: "internal", // internal | external
    button_text: "Daftar Sekarang",
    schedule_start: "00:00",
    schedule_end: "23:59",
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "campaigns"), (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as any));
      // sort by weight descending
      data.sort((a, b) => (b.weight || 0) - (a.weight || 0));
      setCampaigns(data);
    });
    return () => unsubscribe();
  }, []);

  const parseTimeFromField = (fieldValue?: any) => {
    if (!fieldValue) return "00:00";
    try {
      let d: Date;
      if (typeof fieldValue === 'string') {
        d = new Date(fieldValue);
      } else if (fieldValue.toDate && typeof fieldValue.toDate === 'function') {
        d = fieldValue.toDate();
      } else if (fieldValue.seconds) { // fallback API
        d = new Date(fieldValue.seconds * 1000);
      } else {
        return "00:00";
      }
      
      if (isNaN(d.getTime())) return "00:00";
      return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
    } catch {
      return "00:00";
    }
  };

  const createTimestampFromTime = (timeStr: string) => {
    try {
      const [hh, mm] = timeStr.split(":");
      const d = new Date();
      d.setHours(parseInt(hh, 10));
      d.setMinutes(parseInt(mm, 10));
      d.setSeconds(0);
      d.setMilliseconds(0);
      return Timestamp.fromDate(d);
    } catch {
      return Timestamp.fromDate(new Date());
    }
  };

  const openForm = (campaign?: any) => {
    setFormError("");
    if (campaign) {
      setIsEditMode(true);
      setFormData({
        id: campaign.id || campaign.ad_id,
        is_active: campaign.is_active ?? true,
        ad_type: campaign.ad_type || "image",
        title: campaign.title || "",
        media_url: campaign.media_url || campaign.image_url || "",
        target_url: campaign.target_url || "",
        weight: campaign.weight || 50,
        open_target_in: campaign.open_target_in || "internal",
        button_text: campaign.button_text || "Daftar Sekarang",
        schedule_start: parseTimeFromField(campaign.schedule_start),
        schedule_end: parseTimeFromField(campaign.schedule_end),
      });
    } else {
      setIsEditMode(false);
      setFormData({
        id: `ad_${Date.now()}`,
        is_active: true,
        ad_type: "image",
        title: "",
        media_url: "",
        target_url: "",
        weight: 50,
        open_target_in: "internal",
        button_text: "Daftar Sekarang",
        schedule_start: "00:00",
        schedule_end: "23:59",
      });
    }
    setIsFormOpen(true);
  };

  useEffect(() => {
    if (window.location.hash.startsWith('#edit-') && campaigns.length > 0 && !isFormOpen) {
      const idToEdit = window.location.hash.replace('#edit-', '');
      const target = campaigns.find(c => c.id === idToEdit);
      if (target) {
        openForm(target);
        window.history.replaceState(null, '', '/campaigns');
      }
    }
  }, [campaigns]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.media_url) {
      setFormError("Judul dan Media URL wajib diisi.");
      return;
    }

    setIsSaving(true);
    setFormError("");

    try {
      const finalDoc = {
        ad_id: formData.id,
        is_active: formData.is_active,
        ad_type: formData.ad_type,
        title: formData.title,
        media_url: formData.media_url,
        target_url: formData.target_url,
        weight: Number(formData.weight),
        open_target_in: formData.open_target_in,
        button_text: formData.button_text,
        schedule_start: createTimestampFromTime(formData.schedule_start),
        schedule_end: createTimestampFromTime(formData.schedule_end),
      };

      await setDoc(doc(db, "campaigns", formData.id), finalDoc, { merge: true });
      setIsFormOpen(false);
    } catch (err: any) {
      setFormError("Gagal menyimpan data: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Hapus campaign ini? Promo tidak akan terlihat lagi oleh user.")) {
      await deleteDoc(doc(db, "campaigns", id));
    }
  };

  const toggleStatus = async (kampanye: any) => {
    try {
      await updateDoc(doc(db, "campaigns", kampanye.id), {
        is_active: !kampanye.is_active
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Campaigns</h1>
          <p className="text-foreground/70">Kelola banner promosi dan iklan custom lainnya.</p>
        </div>
        
        <button 
          onClick={() => openForm()}
          className="w-full md:w-auto px-6 py-3 bg-indigo-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-600 transition-colors shadow-[0_0_15px_rgba(99,102,241,0.3)]"
        >
          <Plus className="w-5 h-5" /> Buat Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {campaigns.length === 0 ? (
           <p className="text-foreground/50 py-12 col-span-full text-center border-2 border-dashed border-card-border rounded-2xl">
             Belum ada campaign. Klik "Buat Campaign" untuk menambah baru.
           </p>
        ) : (
          campaigns.map((camp) => (
            <div key={camp.id} className={`glass-panel rounded-2xl relative overflow-hidden flex flex-col ${camp.is_active ? 'border-card-border' : 'border-red-500/20 opacity-80 grayscale'}`}>
              
              {/* Media Preview (Simulated height) */}
              <div className="h-40 w-full bg-black/50 relative overflow-hidden">
                 {/* Try to show image, if error just show gradient */}
                 {camp.ad_type === 'image' && camp.media_url ? (
                   <img src={camp.media_url} alt={camp.title} className="w-full h-full object-cover opacity-80" onError={(e) => { e.currentTarget.style.display='none'; }}/>
                 ) : (
                   <div className="w-full h-full bg-gradient-to-br from-indigo-500/20 to-gold-500/20 flex items-center justify-center">
                     <Megaphone className="w-10 h-10 text-white/30" />
                   </div>
                 )}
                 <div className="absolute inset-0 bg-gradient-to-t from-[#131416] to-transparent" />
                 
                 <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded border border-white/10 text-[10px] font-bold text-white uppercase tracking-wider">
                   {camp.ad_type}
                 </div>
                 <div className="absolute top-3 right-3 z-10 shadow-lg rounded-full">
                   <button 
                     onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleStatus(camp); }}
                     className={`w-12 h-6 rounded-full border transition-colors relative flex items-center shrink-0 ${camp.is_active ? 'bg-emerald-500 border-emerald-400' : 'bg-background border-card-border'}`}
                     title={camp.is_active ? "Nonaktifkan" : "Aktifkan"}
                   >
                     <span className={`text-[8px] font-bold absolute ${camp.is_active ? 'left-2.5 text-white' : 'right-2.5 text-foreground/50'}`}>{camp.is_active ? 'ON' : 'OFF'}</span>
                     <div className={`w-4 h-4 bg-white rounded-full absolute shadow-sm transition-transform ${camp.is_active ? "translate-x-[26px]" : "translate-x-1"}`} />
                   </button>
                 </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-lg leading-tight mb-1">{camp.title}</h3>
                
                <div className="flex items-center gap-2 text-xs text-foreground/50 mb-4 mt-auto pt-4">
                  <div className="flex bg-card-bg px-2 py-1 rounded border border-card-border items-center gap-1">
                     <span className="font-bold text-gold-500">Peluang Muncul: {camp.weight}%</span>
                  </div>
                  <div className="flex bg-card-bg px-2 py-1 rounded border border-card-border flex-1 truncate">
                    {parseTimeFromField(camp.schedule_start)} <MoveRight className="w-3 h-3 mx-1 inline" /> {parseTimeFromField(camp.schedule_end)}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => openForm(camp)}
                    className="flex-1 bg-card-bg border border-card-border p-2 rounded-lg text-sm font-semibold hover:bg-gold-500/10 hover:text-gold-500 transition-colors flex items-center justify-center gap-2"
                  >
                    <Pencil className="w-4 h-4" /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(camp.id)}
                    className="px-3 bg-red-500/10 border border-red-500/20 p-2 rounded-lg text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex justify-end">
          <div className="bg-card-bg w-full max-w-lg h-full border-l border-card-border shadow-2xl animate-in slide-in-from-right flex flex-col">
             
             <div className="p-6 border-b border-card-border flex items-center justify-between bg-card-bg/95 backdrop-blur z-10">
               <h2 className="text-xl font-bold bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
                 {isEditMode ? "Edit Campaign" : "Buat Campaign Baru"}
               </h2>
               <button onClick={() => setIsFormOpen(false)} className="p-2 bg-card-border/50 rounded-full hover:bg-card-border text-foreground/60 transition-colors">
                  <X className="w-5 h-5" />
               </button>
             </div>

             <div className="p-6 overflow-y-auto flex-1 space-y-5">
                {formError && (
                  <div className="p-3 border border-red-500/50 bg-red-500/10 text-red-500 text-sm rounded-xl flex items-start gap-2">
                    <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p>{formError}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border border-card-border rounded-xl bg-card-bg/50">
                    <div>
                      <p className="font-semibold text-sm">Status Campaign</p>
                      <p className="text-[10px] text-foreground/50">Campaign yang tidak aktif tidak akan muncul.</p>
                    </div>
                    <button 
                      onClick={() => setFormData(p => ({...p, is_active: !p.is_active}))}
                      className={`w-10 h-5 rounded-full transition-colors relative flex items-center shrink-0 ${formData.is_active ? "bg-emerald-500" : "bg-card-border"}`}
                    >
                      <div className={`w-3.5 h-3.5 bg-white rounded-full absolute transition-transform ${formData.is_active ? "translate-x-6" : "translate-x-1"}`} />
                    </button>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground/70 mb-1.5 block">Judul (Internal)</label>
                    <input 
                      type="text" 
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full bg-background border border-card-border rounded-lg p-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="Promo Gajian Maret"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-foreground/70 mb-1.5 block">Tipe Iklan</label>
                      <select 
                        value={formData.ad_type}
                        onChange={(e) => setFormData({...formData, ad_type: e.target.value})}
                        className="w-full bg-background border border-card-border rounded-lg p-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
                      >
                        <option value="image">Gambar (Image)</option>
                        <option value="video">Video</option>
                        <option value="webview">Web View</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-foreground/70 mb-1.5 block">Peluang Muncul (%)</label>
                      <input 
                        type="number" 
                        value={formData.weight}
                        onChange={(e) => setFormData({...formData, weight: parseInt(e.target.value) || 0})}
                        className="w-full bg-background border border-card-border rounded-lg p-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                        max={100}
                        min={0}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground/70 mb-1.5 block flex items-center justify-between">
                      <span>Media URL</span>
                      <span className="text-[10px] text-foreground/40 font-normal">Gambar/Video/Web Link</span>
                    </label>
                    <input 
                      type="url" 
                      value={formData.media_url}
                      onChange={(e) => setFormData({...formData, media_url: e.target.value})}
                      className="w-full bg-background border border-card-border rounded-lg p-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground/70 mb-1.5 block flex items-center justify-between">
                      <span>Target URL</span>
                      <span className="text-[10px] text-foreground/40 font-normal">Link tujuan jika di-klik</span>
                    </label>
                    <div className="relative">
                      <Link className="w-4 h-4 text-foreground/30 absolute left-3 top-3.5" />
                      <input 
                        type="url" 
                        value={formData.target_url}
                        onChange={(e) => setFormData({...formData, target_url: e.target.value})}
                        className="w-full bg-background border border-card-border rounded-lg p-3 pl-9 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-foreground/70 mb-1.5 block">Buka Target Di</label>
                      <select 
                        value={formData.open_target_in}
                        onChange={(e) => setFormData({...formData, open_target_in: e.target.value})}
                        className="w-full bg-background border border-card-border rounded-lg p-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
                      >
                        <option value="internal">Dalam Aplikasi (Internal)</option>
                        <option value="external">Browser HP (External)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-foreground/70 mb-1.5 block">Teks Tombol</label>
                      <input 
                        type="text" 
                        value={formData.button_text}
                        onChange={(e) => setFormData({...formData, button_text: e.target.value})}
                        className="w-full bg-background border border-card-border rounded-lg p-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                        placeholder="Daftar Sekarang"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl space-y-4">
                     <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-bold text-indigo-400 capitalize">Jadwal Tayang (Jam)</p>
                     </div>

                     <div className="flex flex-wrap gap-2 mb-2">
                       <button 
                         type="button" 
                         onClick={(e) => { e.preventDefault(); setFormData({...formData, schedule_start: "00:00", schedule_end: "23:59"}); }}
                         className="px-2.5 py-1 text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md hover:bg-indigo-500/20 hover:border-indigo-500/40 transition-colors"
                       >
                          24 Jam
                       </button>
                       <button 
                         type="button" 
                         onClick={(e) => { e.preventDefault(); setFormData({...formData, schedule_start: "06:00", schedule_end: "18:00"}); }}
                         className="px-2.5 py-1 text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-md hover:bg-amber-500/20 hover:border-amber-500/40 transition-colors"
                       >
                          Siang (06-18)
                       </button>
                       <button 
                         type="button" 
                         onClick={(e) => { e.preventDefault(); setFormData({...formData, schedule_start: "18:00", schedule_end: "06:00"}); }}
                         className="px-2.5 py-1 text-[10px] font-bold bg-slate-500/10 text-slate-300 border border-slate-500/20 rounded-md hover:bg-slate-500/20 hover:border-slate-500/40 transition-colors"
                       >
                          Malam (18-06)
                       </button>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-foreground/60 mb-1 block uppercase">Waktu Mulai</label>
                          <input 
                            type="time" 
                            value={formData.schedule_start}
                            onChange={(e) => setFormData({...formData, schedule_start: e.target.value})}
                            className="w-full bg-background/50 border border-card-border rounded-lg p-2 text-sm focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-foreground/60 mb-1 block uppercase">Waktu Berakhir</label>
                          <input 
                            type="time" 
                            value={formData.schedule_end}
                            onChange={(e) => setFormData({...formData, schedule_end: e.target.value})}
                            className="w-full bg-background/50 border border-card-border rounded-lg p-2 text-sm focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                     </div>
                     <p className="text-[10px] text-foreground/50">Tanggal diabaikan. Iklan tayang setiap hari di rentang waktu ini.</p>
                  </div>

                </div>
             </div>

             <div className="p-6 border-t border-card-border bg-card-bg/95 backdrop-blur z-10">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full bg-indigo-500 text-white font-bold p-4 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-600 transition-colors shadow-[0_0_15px_rgba(99,102,241,0.3)] disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  {isSaving ? "Menyimpan..." : "Simpan Campaign"}
                </button>
             </div>

          </div>
        </div>
      )}

    </div>
  );
}

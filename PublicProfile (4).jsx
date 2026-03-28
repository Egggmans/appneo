import { useState, useRef, useEffect, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";

const PenIcon = ({ size = 18, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

function QRPopup({ url, name, onClose }) {
  return (
    <div onClick={onClose} style={{
      position:"fixed",inset:0,
      background:"rgba(0,0,0,0.85)",
      backdropFilter:"blur(20px)",
      WebkitBackdropFilter:"blur(20px)",
      zIndex:500,
      display:"flex",flexDirection:"column",
      alignItems:"center",justifyContent:"center",
      padding:32,
      animation:"qrFadeIn 0.25s ease"
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        background:"#111",
        borderRadius:32,
        padding:28,
        display:"flex",flexDirection:"column",alignItems:"center",gap:20,
        border:"1px solid rgba(255,255,255,0.1)",
        animation:"qrPop 0.4s cubic-bezier(0.34,1.56,0.64,1)",
        maxWidth:300,width:"100%"
      }}>
        {/* N badge */}
        <div style={{
          width:44,height:44,borderRadius:"50%",
          background:"rgba(255,255,255,0.08)",
          border:"1px solid rgba(255,255,255,0.15)",
          display:"flex",alignItems:"center",justifyContent:"center",
          fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:600,color:"#fff"
        }}>N</div>

        {/* QR Code */}
        <div style={{
          background:"#fff",
          borderRadius:20,
          padding:16,
          display:"flex",alignItems:"center",justifyContent:"center"
        }}>
          <QRCodeSVG
            value={url}
            size={180}
            bgColor="#ffffff"
            fgColor="#0a0a0a"
            level="M"
            imageSettings={{
              src:"",
              excavate:false
            }}
          />
        </div>

        {/* Name & URL */}
        <div style={{textAlign:"center"}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:600,color:"#fff",marginBottom:6}}>
            {name}
          </div>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.35)",letterSpacing:"0.04em"}}>
            {url}
          </div>
        </div>

        {/* Close hint */}
        <div style={{fontSize:11,color:"rgba(255,255,255,0.25)",letterSpacing:"0.08em",textTransform:"uppercase"}}>
          tap anywhere to close
        </div>
      </div>
    </div>
  );
}

const defaultProfile = {
  name: "Ege Can Alparslan",
  university: "HSLU",
  year: "2028",
  status: "Open to internships",
  program: "IntB",
  photo: null,
  links: {
    linkedin: "https://linkedin.com/in/egecanalparslan",
    email: "ege@neologist.ch",
    whatsapp: "+41000000000",
  },
  memories: [
    { src: null, label: "ETH Zürich" },
    { src: null, label: "Luzern" },
    { src: null, label: "Summer '24" },
    { src: null, label: "Startup Week" },
    { src: null, label: "Alps Trip" },
    { src: null, label: "Graduation" },
  ],
};

const placeholderColors = ["#1a2a1a","#2a1a2a","#1a1a2a","#2a2a1a","#1a2a2a","#2a1a1a"];

function MemoryPopup({ memory, index, onClose, onUpdate, onDelete, color, onPhotoClick }) {
  const [label, setLabel] = useState(memory.label);
  const save = () => { onUpdate(index, { ...memory, label }); onClose(); };
  return (
    <div style={{
      position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",backdropFilter:"blur(12px)",
      zIndex:300,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      padding:24,animation:"fadeIn 0.2s ease"
    }} onClick={onClose}>
      <div style={{
        width:"100%",maxWidth:320,background:"#111",borderRadius:24,overflow:"hidden",
        border:"1px solid rgba(255,255,255,0.1)",animation:"popUp 0.3s cubic-bezier(0.34,1.56,0.64,1)"
      }} onClick={e=>e.stopPropagation()}>
        <div style={{
          width:"100%",aspectRatio:"4/3",background:color,position:"relative",
          cursor:"pointer",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"
        }} onClick={onPhotoClick}>
          {memory.src
            ? <img src={memory.src} alt={label} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}} />
            : <span style={{fontSize:40,opacity:0.15,color:"#fff"}}>◈</span>
          }
          <div style={{
            position:"absolute",inset:0,background:"rgba(0,0,0,0.38)",
            display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8
          }}>
            <div style={{
              width:56,height:56,borderRadius:"50%",
              background:"rgba(255,255,255,0.08)",border:"2px solid rgba(255,255,255,0.3)",
              display:"flex",alignItems:"center",justifyContent:"center"
            }}>
              <PenIcon size={24} color="rgba(255,255,255,0.7)" />
            </div>
            <span style={{fontSize:11,color:"rgba(255,255,255,0.65)",letterSpacing:"0.06em"}}>tap to change photo</span>
          </div>
        </div>
        <div style={{padding:"16px 18px 20px"}}>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>Label</div>
          <input value={label} onChange={e=>setLabel(e.target.value)}
            style={{width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.12)",
              borderRadius:10,padding:"11px 14px",fontFamily:"'DM Sans',sans-serif",
              fontSize:15,color:"#fff",outline:"none",marginBottom:14}}
            placeholder="e.g. Alps Trip" autoFocus />
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>{onDelete(index);onClose();}} style={{
              flex:1,padding:12,borderRadius:100,border:"1px solid rgba(255,80,80,0.3)",
              background:"rgba(255,50,50,0.08)",color:"rgba(255,120,120,0.85)",
              fontFamily:"'DM Sans',sans-serif",fontSize:13,cursor:"pointer"
            }}>Delete</button>
            <button onClick={save} style={{
              flex:2,padding:12,borderRadius:100,border:"none",background:"#fff",
              fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:500,cursor:"pointer",color:"#0a0a0a"
            }}>Done</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PublicProfile() {
  const [profile, setProfile]             = useState(defaultProfile);
  const [page, setPage]                   = useState("profile");
  const [screen, setScreen]               = useState("public");
  const [saved, setSaved]                 = useState(false);
  const [showLinks, setShowLinks]         = useState(false);
  const [memoriesVisible, setMemoriesVisible] = useState([]);
  const [memPopup, setMemPopup]           = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [editingName, setEditingName]     = useState(false);
  const [showQR, setShowQR]               = useState(false);

  const leftClickTimes   = useRef([]);
  const centerTapTimes   = useRef([]);
  const touchStartY      = useRef(null);
  const touchStartX      = useRef(null);
  const memTouchStartY   = useRef(null);
  const heroPhotoRef     = useRef(null);
  const memPopupRef      = useRef(null);
  const nameInputRef     = useRef(null);

  useEffect(() => {
    if (page !== "memories") return;
    setMemoriesVisible([]);
    profile.memories.forEach((_, i) =>
      setTimeout(() => setMemoriesVisible(p => [...p, i]), 200 + i * 260)
    );
  }, [page]);

  useEffect(() => {
    if (editingName && nameInputRef.current) nameInputRef.current.focus();
  }, [editingName]);

  const handleLeftZone = useCallback(() => {
    const now = Date.now();
    leftClickTimes.current = [...leftClickTimes.current.filter(t => now-t < 700), now];
    if (leftClickTimes.current.length >= 3) {
      leftClickTimes.current = [];
      setScreen(s => s === "public" ? "edit" : "public");
      setActiveSection(null); setEditingName(false);
    }
  }, []);

  const handleCenterZone = useCallback(() => {
    if (page !== "profile") return;
    const now = Date.now();
    centerTapTimes.current = [...centerTapTimes.current.filter(t => now-t < 800), now];
    if (centerTapTimes.current.length >= 4) {
      centerTapTimes.current = [];
      setShowQR(true);
    }
  }, [page]);

  const handleTouchStart = (e) => {
    if (page !== "profile") return;
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (!touchStartY.current || page !== "profile") return;
    const dy = touchStartY.current - e.changedTouches[0].clientY;
    const dx = Math.abs(touchStartX.current - e.changedTouches[0].clientX);
    if (dy > 60 && dx < 50) triggerSwipeUp();
    touchStartY.current = null;
  };
  const handleWheel = (e) => {
    if (screen === "public" && page === "profile" && e.deltaY > 40) triggerSwipeUp();
  };

  const triggerSwipeUp = () => {
    setPage("transitioning");
    setTimeout(() => setPage("memories"), 700);
  };

  const triggerSwipeDown = () => {
    setMemoriesVisible([]);
    setPage("profile");
  };

  const updateField  = (f, v) => setProfile(p => ({...p,[f]:v}));
  const updateLink   = (k, v) => setProfile(p => ({...p,links:{...p.links,[k]:v}}));
  const updateMemory = (i, m) => setProfile(p => { const ms=[...p.memories]; ms[i]=m; return {...p,memories:ms}; });
  const deleteMemory = (i)    => setProfile(p => ({...p,memories:p.memories.filter((_,idx)=>idx!==i)}));
  const addMemory    = ()     => setProfile(p => ({...p,memories:[...p.memories,{src:null,label:"New Memory"}]}));

  const handleHeroPhoto = (e) => {
    const f = e.target.files[0]; if (!f) return;
    updateField("photo", URL.createObjectURL(f));
  };
  const handleMemPhoto = (e, i) => {
    const f = e.target.files[0]; if (!f) return;
    updateMemory(i, { ...profile.memories[i], src: URL.createObjectURL(f) });
  };

  const handleSaveContact = () => {
    const v = `BEGIN:VCARD\nVERSION:3.0\nFN:${profile.name}\nEMAIL:${profile.links.email}\nURL:https://neologist.ch/ege\nNOTE:${profile.university}·${profile.program}·${profile.year}\nEND:VCARD`;
    const blob = new Blob([v],{type:"text/vcard"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download=`${profile.name.replace(/ /g,"_")}.vcf`; a.click();
    URL.revokeObjectURL(url);
    setSaved(true); setTimeout(()=>setSaved(false),3000);
  };

  const inp = {
    background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)",
    borderRadius:10, padding:"11px 14px", fontFamily:"'DM Sans',sans-serif",
    fontSize:14, color:"#fff", outline:"none", width:"100%", marginBottom:8,
    transition:"border-color 0.2s"
  };

  const SectionCard = ({ id, title, children }) => {
    const open = activeSection === id;
    return (
      <div style={{
        background:"rgba(255,255,255,0.04)",
        border:`1px solid ${open?"rgba(255,255,255,0.08)":"rgba(255,255,255,0.07)"}`,
        borderRadius:18, padding:16, marginBottom:14, transition:"border-color 0.25s"
      }}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:open?14:0}}>
          <span style={{fontSize:10,color:"rgba(255,255,255,0.3)",letterSpacing:"0.1em",textTransform:"uppercase"}}>{title}</span>
          <button onClick={()=>setActiveSection(open?null:id)} style={{
            width:36,height:36,borderRadius:"50%",cursor:"pointer",
            background:open?"rgba(255,255,255,0.08)":"rgba(255,255,255,0.07)",
            border:open?"1.5px solid rgba(255,255,255,0.25)":"1px solid rgba(255,255,255,0.1)",
            display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"
          }}>
            <PenIcon size={15} color={open?"rgba(255,255,255,0.8)":"rgba(255,255,255,0.55)"} />
          </button>
        </div>
        {open && children}
        {!open && (
          <div style={{cursor:"pointer",paddingTop:10}} onClick={()=>setActiveSection(id)}>
            {id==="info" && (
              <>
                <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(255,255,255,0.09)",borderRadius:100,padding:"4px 11px",marginBottom:8}}>
                  <div style={{width:5,height:5,borderRadius:"50%",background:"#fff"}}/>
                  <span style={{fontSize:11,color:"#fff"}}>{profile.status}</span>
                </div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>{profile.university} · {profile.program} · {profile.year}</div>
              </>
            )}
            {id==="links" && (
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>✉ {profile.links.email}</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>in LinkedIn</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>W WhatsApp</div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        *{margin:0;padding:0;box-sizing:border-box;}
        html,body,#root{width:100%;height:100%;overflow:hidden;background:#0a0a0a;}
        .app{width:100vw;height:100dvh;position:relative;overflow:hidden;font-family:'DM Sans',sans-serif;background:#0a0a0a;}
        .lz{position:absolute;top:0;left:0;width:44px;height:100%;z-index:50;}

        .screen-public{position:absolute;inset:0;transition:transform 0.42s cubic-bezier(0.4,0,0.2,1),opacity 0.42s ease;}
        .screen-public.away{transform:translateX(-100%);opacity:0;pointer-events:none;}

        .screen-edit{position:absolute;inset:0;overflow-y:auto;scrollbar-width:none;transition:transform 0.42s cubic-bezier(0.4,0,0.2,1),opacity 0.42s ease;transform:translateX(100%);opacity:0;pointer-events:none;background:#0a0a0a;}
        .screen-edit::-webkit-scrollbar{display:none;}
        .screen-edit.here{transform:translateX(0);opacity:1;pointer-events:all;}

        .p1{position:absolute;inset:0;transition:opacity 0.7s ease,transform 0.7s ease;opacity:1;transform:translateY(0);}
        .p1.exit{opacity:0;transform:translateY(-70px);}
        .bg-photo{position:absolute;inset:0;background-size:cover;background-position:center top;background-color:#2a3a2a;}
        .bg-photo::after{content:'';position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.05) 0%,rgba(0,0,0,0) 25%,rgba(0,0,0,0.5) 65%,rgba(0,0,0,0.92) 100%);}
        .p1c{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:0 24px 48px;}
        .pill{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,0.13);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.18);border-radius:100px;padding:6px 14px;font-size:12px;color:#fff;margin-bottom:14px;width:fit-content;animation:fadeUp 0.5s ease 0.1s both;}
        .pill-dot{width:6px;height:6px;border-radius:50%;background:#fff;flex-shrink:0;}
        .p-name{font-family:'Playfair Display',serif;font-size:clamp(30px,8vw,40px);font-weight:600;color:#fff;line-height:1.1;letter-spacing:-0.01em;margin-bottom:6px;animation:fadeUp 0.5s ease 0.2s both;}
        .p-sub{font-size:13px;color:rgba(255,255,255,0.5);font-weight:300;letter-spacing:0.06em;margin-bottom:36px;animation:fadeUp 0.5s ease 0.3s both;}
        .swipe-hint{display:flex;flex-direction:column;align-items:center;gap:6px;cursor:pointer;animation:fadeUp 0.5s ease 0.5s both;}
        .swipe-text{font-size:11px;color:rgba(255,255,255,0.4);letter-spacing:0.12em;text-transform:uppercase;}
        .swipe-arrow{animation:bounceUp 1.6s ease-in-out infinite;}
        .swipe-arrow svg{width:28px;height:28px;opacity:0.55;}
        .n-badge{position:absolute;top:52px;right:20px;width:34px;height:34px;background:rgba(0,0,0,0.35);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.15);border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:15px;font-weight:600;color:#fff;z-index:5;}

        .p2{position:absolute;inset:0;background:#0a0a0a;overflow-y:auto;-webkit-overflow-scrolling:touch;touch-action:pan-y;transition:opacity 0.5s ease,transform 0.5s ease;opacity:0;transform:translateY(80px);pointer-events:none;scrollbar-width:none;}
        .p2::-webkit-scrollbar{display:none;}
        .p2.enter{opacity:1;transform:translateY(0);pointer-events:all;}
        .p2.enter{opacity:1;transform:translateY(0);pointer-events:all;}
        .mh{padding:60px 24px 20px;display:flex;align-items:baseline;gap:10px;}
        .mt{font-family:'Playfair Display',serif;font-size:26px;font-weight:600;color:#fff;}
        .mc{font-size:13px;color:rgba(255,255,255,0.3);}
        .mgrid{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:0 16px;}
        .mwrap:first-child{grid-column:span 2;}
        .mcard{border-radius:16px;overflow:hidden;position:relative;aspect-ratio:3/4;opacity:0;transform:translateY(24px) scale(0.95);transition:opacity 0.5s ease,transform 0.5s ease;}
        .mcard.v{opacity:1;transform:translateY(0) scale(1);}
        .mwrap:first-child .mcard{aspect-ratio:16/9;}
        .mimg{width:100%;height:100%;object-fit:cover;}
        .mph{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:28px;opacity:0.2;color:#fff;}
        .mlbl{position:absolute;bottom:10px;left:12px;font-size:12px;color:rgba(255,255,255,0.8);text-shadow:0 1px 4px rgba(0,0,0,0.5);}
        .cta{position:relative;margin-top:-80px;padding-top:100px;padding-bottom:52px;background:linear-gradient(to bottom,rgba(10,10,10,0) 0%,rgba(10,10,10,0.8) 35%,rgba(10,10,10,0.98) 65%,#0a0a0a 100%);}
        .cta-i{padding:0 24px;display:flex;flex-direction:column;gap:10px;}
        .cta-l{text-align:center;font-size:11px;color:rgba(255,255,255,0.28);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:6px;}
        .bsave{width:100%;padding:16px;border-radius:100px;border:none;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:500;cursor:pointer;transition:all 0.25s;background:#fff;color:#0a0a0a;}
        .bsave.sv{background:#fff;}
        .blinks{width:100%;padding:14px;border-radius:100px;border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.06);font-family:'DM Sans',sans-serif;font-size:14px;color:rgba(255,255,255,0.8);cursor:pointer;}
        .ldr{overflow:hidden;transition:max-height 0.4s ease,opacity 0.3s ease;}
        .lrow{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08);text-decoration:none;color:#fff;font-size:13px;}
        .lrow:last-child{border-bottom:none;}
        .lic{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:500;flex-shrink:0;}

        /* edit page */
        .edit-hero{position:relative;width:100%;aspectRatio:"4/5";overflow:hidden;cursor:pointer;}
        .edit-mem-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
        .emc{border-radius:14px;overflow:hidden;position:relative;aspect-ratio:3/4;cursor:pointer;display:flex;align-items:center;justify-content:center;}
        .emc:first-child{grid-column:span 2;aspect-ratio:16/9;}
        .emc-pen{position:absolute;inset:0;background:rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 0.2s;border-radius:14px;}
        .emc:hover .emc-pen{opacity:1;}
        .emc-pc{width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,0.08);border:1.5px solid rgba(255,255,255,0.25);display:flex;align-items:center;justify-content:center;}

        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes bounceUp{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
        @keyframes bounceDown{0%,100%{transform:translateY(0)}50%{transform:translateY(9px)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes popUp{from{opacity:0;transform:scale(0.88) translateY(16px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes qrFadeIn{from{opacity:0}to{opacity:1}}
        @keyframes qrPop{from{opacity:0;transform:scale(0.7) translateY(40px)}to{opacity:1;transform:scale(1) translateY(0)}}
      `}</style>

      <input ref={heroPhotoRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleHeroPhoto} />
      <input ref={memPopupRef} type="file" accept="image/*" style={{display:"none"}}
        onChange={e => { if (memPopup!==null) handleMemPhoto(e, memPopup); }} />

      <div className="app" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onWheel={handleWheel}>
        <div className="lz" onClick={handleLeftZone} />

        {/* Centre zone — 4 taps opens QR, only on profile page */}
        {page === "profile" && (
          <div onClick={handleCenterZone} style={{
            position:"absolute",
            top:"25%",left:"25%",
            width:"50%",height:"50%",
            zIndex:49
          }} />
        )}

        {/* ══ PUBLIC ══ */}
        <div className={`screen-public ${screen==="edit"?"away":""}`}>
          <div className={`p1 ${page!=="profile"?"exit":""}`}>
            <div className="bg-photo" style={{backgroundImage:profile.photo?`url(${profile.photo})`:"none"}} />
            <div className="n-badge">N</div>
            <div className="p1c">
              <div className="pill"><span className="pill-dot"/>{profile.status} · {profile.university} · {profile.program} · {profile.year}</div>
              <h1 className="p-name">{profile.name}</h1>
              <p className="p-sub">{profile.university} · {profile.year}</p>
              <div className="swipe-hint" onClick={triggerSwipeUp}>
                <div className="swipe-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12l7 7 7-7"/>
                  </svg>
                </div>
                <span className="swipe-text">swipe up</span>
              </div>
            </div>
          </div>

          <div className={`p2 ${page==="memories"?"enter":""}`}
            onTouchStart={e => { memTouchStartY.current = e.touches[0].clientY; }}
            onTouchEnd={e => {
              if (memTouchStartY.current === null) return;
              const dy = memTouchStartY.current - e.changedTouches[0].clientY;
              const el = e.currentTarget;
              memTouchStartY.current = null;
              if (dy > 70 && el.scrollTop <= 0) triggerSwipeDown();
            }}
          >
            <div className="mh"><span className="mt">Memories</span><span className="mc">{profile.memories.length} moments</span></div>
            <div className="mgrid">
              {profile.memories.map((mem,i)=>(
                <div key={i} className="mwrap">
                  <div className={`mcard ${memoriesVisible.includes(i)?"v":""}`} style={{background:placeholderColors[i%placeholderColors.length]}}>
                    {mem.src?<img src={mem.src} alt={mem.label} className="mimg"/>:<div className="mph">◈</div>}
                    <span className="mlbl">{mem.label}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="cta"><div className="cta-i">
              <p className="cta-l">Connect with {profile.name.split(" ")[0]}</p>
              <div className="ldr" style={{maxHeight:showLinks?"280px":"0",opacity:showLinks?1:0}}>
                <a href={`mailto:${profile.links.email}`} className="lrow"><div className="lic" style={{background:"rgba(255,255,255,0.1)"}}>✉</div><span>{profile.links.email}</span></a>
                <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className="lrow"><div className="lic" style={{background:"#0077b5"}}>in</div><span>LinkedIn</span></a>
                <a href={`https://wa.me/${profile.links.whatsapp.replace(/\D/g,"")}`} className="lrow"><div className="lic" style={{background:"#25D366"}}>W</div><span>WhatsApp</span></a>
              </div>
              <button className={`bsave ${saved?"sv":""}`} onClick={handleSaveContact}>{saved?"✓ Saved":"Save Contact"}</button>
              <button className="blinks" onClick={()=>setShowLinks(s=>!s)}>{showLinks?"Hide links":"View links"}</button>
            </div></div>
          </div>
        </div>

        {/* ══ EDIT ══ */}
        <div className={`screen-edit ${screen==="edit"?"here":""}`}>
          {/* Hero */}
          <div style={{position:"relative",width:"100%",aspectRatio:"4/5",overflow:"hidden",cursor:"pointer"}}
            onClick={()=>heroPhotoRef.current?.click()}>
            <div style={{
              position:"absolute",inset:0,backgroundSize:"cover",backgroundPosition:"center top",
              backgroundImage:profile.photo?`url(${profile.photo})`:"none",
              backgroundColor:"#1e2e1e"
            }}>
              {!profile.photo && <div style={{width:"100%",height:"100%",background:"linear-gradient(160deg,#4a6a5a,#1a2a1a)"}}/>}
            </div>
            <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(0,0,0,0) 40%,rgba(0,0,0,0.75) 100%)"}}/>

            {/* Back */}
            <div onClick={e=>{e.stopPropagation();setScreen("public");setActiveSection(null);}} style={{
              position:"absolute",top:52,left:16,width:36,height:36,
              background:"rgba(0,0,0,0.45)",backdropFilter:"blur(8px)",
              border:"1px solid rgba(255,255,255,0.15)",borderRadius:"50%",
              display:"flex",alignItems:"center",justifyContent:"center",
              cursor:"pointer",zIndex:10,color:"#fff",fontSize:18
            }}>←</div>

            {/* Centered pen on hero */}
            <div style={{
              position:"absolute",top:"45%",left:"50%",transform:"translate(-50%,-50%)",
              display:"flex",flexDirection:"column",alignItems:"center",gap:10,pointerEvents:"none"
            }}>
              <div style={{
                width:68,height:68,borderRadius:"50%",
                background:"rgba(255,255,255,0.07)",border:"2px solid rgba(255,255,255,0.25)",
                display:"flex",alignItems:"center",justifyContent:"center"
              }}>
                <PenIcon size={28} color="rgba(255,255,255,0.7)"/>
              </div>
              <span style={{fontSize:12,color:"rgba(255,255,255,0.65)",letterSpacing:"0.06em"}}>tap to change photo</span>
            </div>

            {/* Name editable */}
            <div style={{position:"absolute",bottom:20,left:20,right:20}} onClick={e=>e.stopPropagation()}>
              {editingName
                ? <input ref={nameInputRef} value={profile.name} onChange={e=>updateField("name",e.target.value)}
                    onBlur={()=>setEditingName(false)}
                    style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(26px,7vw,36px)",fontWeight:600,color:"#fff",background:"transparent",border:"none",borderBottom:"2px solid rgba(255,255,255,0.35)",outline:"none",width:"100%",paddingBottom:4}}/>
                : <h1 onClick={()=>setEditingName(true)} style={{
                    fontFamily:"'Playfair Display',serif",fontSize:"clamp(26px,7vw,36px)",fontWeight:600,color:"#fff",lineHeight:1.1,
                    cursor:"pointer",borderBottom:"1px dashed rgba(255,255,255,0.2)",paddingBottom:2,display:"inline-block"
                  }}>{profile.name}</h1>
              }
            </div>
          </div>

          {/* Edit sections */}
          <div style={{padding:"20px 16px 80px"}}>

            <SectionCard id="info" title="Status & Info">
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                <input style={inp} value={profile.status} onChange={e=>updateField("status",e.target.value)} placeholder="Status e.g. Open to internships"/>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  <input style={{...inp,marginBottom:0}} value={profile.university} onChange={e=>updateField("university",e.target.value)} placeholder="University"/>
                  <input style={{...inp,marginBottom:0}} value={profile.year} onChange={e=>updateField("year",e.target.value)} placeholder="Year"/>
                </div>
                <input style={{...inp,marginBottom:0}} value={profile.program} onChange={e=>updateField("program",e.target.value)} placeholder="Program"/>
              </div>
            </SectionCard>

            <SectionCard id="links" title="Links">
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {[
                  {ic:"✉",bg:"rgba(255,255,255,0.1)",key:"email",ph:"Email"},
                  {ic:"in",bg:"#0077b5",key:"linkedin",ph:"LinkedIn URL"},
                  {ic:"W",bg:"#25D366",key:"whatsapp",ph:"WhatsApp number"}
                ].map(({ic,bg,key,ph})=>(
                  <div key={key} style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:32,height:32,borderRadius:"50%",background:bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:500,color:"#fff",flexShrink:0}}>{ic}</div>
                    <input style={{...inp,marginBottom:0}} value={profile.links[key]} onChange={e=>updateLink(key,e.target.value)} placeholder={ph}/>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Memories */}
            <div style={{
              background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",
              borderRadius:18,padding:16,marginBottom:14
            }}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                <span style={{fontSize:10,color:"rgba(255,255,255,0.3)",letterSpacing:"0.1em",textTransform:"uppercase"}}>Memories</span>
                <span style={{fontSize:11,color:"rgba(255,255,255,0.25)"}}>{profile.memories.length} moments · tap to edit</span>
              </div>
              <div className="edit-mem-grid">
                {profile.memories.map((mem,i)=>(
                  <div key={i} className="emc"
                    style={{background:placeholderColors[i%placeholderColors.length]}}
                    onClick={()=>setMemPopup(i)}>
                    {mem.src?<img src={mem.src} alt={mem.label} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}/>
                      :<span style={{fontSize:24,opacity:0.18,color:"#fff"}}>◈</span>}
                    <div className="emc-pen">
                      <div className="emc-pc"><PenIcon size={16} color="rgba(255,255,255,0.7)"/></div>
                    </div>
                    <span style={{position:"absolute",bottom:8,left:10,fontSize:11,color:"rgba(255,255,255,0.75)",textShadow:"0 1px 4px rgba(0,0,0,0.6)"}}>{mem.label}</span>
                  </div>
                ))}
              </div>
              <button onClick={addMemory} style={{
                display:"flex",alignItems:"center",justifyContent:"center",gap:8,
                width:"100%",padding:13,borderRadius:14,marginTop:10,
                border:"1.5px dashed rgba(255,255,255,0.12)",background:"transparent",
                color:"rgba(255,255,255,0.35)",fontFamily:"'DM Sans',sans-serif",fontSize:13,cursor:"pointer"
              }}>+ Add Memory</button>
            </div>

          </div>
        </div>

        {/* ══ MEMORY POPUP ══ */}
        {memPopup!==null && (
          <MemoryPopup
            memory={profile.memories[memPopup]}
            index={memPopup}
            color={placeholderColors[memPopup%placeholderColors.length]}
            onClose={()=>setMemPopup(null)}
            onUpdate={updateMemory}
            onDelete={(i)=>{deleteMemory(i);setMemPopup(null);}}
            onPhotoClick={()=>memPopupRef.current?.click()}
          />
        )}
        {/* ══ QR POPUP ══ */}
        {showQR && (
          <QRPopup
            url={`https://neologist.ch/${profile.name.split(" ")[0].toLowerCase()}`}
            name={profile.name}
            onClose={() => setShowQR(false)}
          />
        )}
      </div>
    </>
  );
}

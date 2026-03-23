import { useState, useEffect, useRef } from "react";

const DARK = { bg:"#0A1A0F",surface:"#0D2416",gold:"#C8A96E",goldLight:"#E2C99A",goldDim:"rgba(200,169,110,0.12)",cream:"#F5EDD8",creamDim:"rgba(245,237,216,0.6)",creamFaint:"rgba(245,237,216,0.05)",border:"rgba(200,169,110,0.18)",text:"#F5EDD8",subtext:"rgba(245,237,216,0.45)",card:"rgba(245,237,216,0.04)",inputBg:"rgba(245,237,216,0.05)" };
const LIGHT = { bg:"#F7F3EC",surface:"#EDE6D6",gold:"#9B7A3A",goldLight:"#7A5E28",goldDim:"rgba(155,122,58,0.12)",cream:"#2C1F0E",creamDim:"rgba(44,31,14,0.65)",creamFaint:"rgba(44,31,14,0.04)",border:"rgba(155,122,58,0.22)",text:"#2C1F0E",subtext:"rgba(44,31,14,0.45)",card:"rgba(44,31,14,0.04)",inputBg:"rgba(44,31,14,0.05)" };

const css=`
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  ::-webkit-scrollbar{width:3px;}
  ::-webkit-scrollbar-thumb{background:rgba(200,169,110,0.3);border-radius:4px;}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
  @keyframes shimmer{0%{opacity:0.5}50%{opacity:1}100%{opacity:0.5}}
  @keyframes slideIn{from{transform:translateX(-100%)}to{transform:translateX(0)}}
  .fi{animation:fadeIn 0.4s ease forwards;}
  .fu{animation:fadeUp 0.45s cubic-bezier(.16,1,.3,1) forwards;}
  input,textarea,select{outline:none;font-family:'Inter',sans-serif;}
  input::placeholder,textarea::placeholder{color:rgba(245,237,216,0.25);}
  button{font-family:'Inter',sans-serif;cursor:pointer;}
  @media(max-width:700px){
    .sd{display:none!important;} .mb{display:flex!important;}
    .main-p{padding:20px 16px!important;}
    .g2{grid-template-columns:1fr!important;}
    .g3{grid-template-columns:1fr 1fr!important;}
    .g4{grid-template-columns:1fr 1fr!important;}
  }
  @media(min-width:701px){.mb{display:none!important;}.mmenu{display:none!important;}}
`;

const DB = {
  get: (k) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } },
  del: (k) => { try { localStorage.removeItem(k); return true; } catch { return false; } },
};

function hash(s){let h=0;for(let i=0;i<s.length;i++)h=(Math.imul(31,h)+s.charCodeAt(i))|0;return h.toString(36);}
const iS=(G)=>({width:"100%",background:G.inputBg,border:`1px solid ${G.border}`,borderRadius:6,padding:"11px 14px",color:G.text,fontSize:13,fontFamily:"Inter,sans-serif"});
const cS=(G)=>({background:G.card,border:`1px solid ${G.border}`,borderRadius:10,padding:22,backdropFilter:"blur(12px)"});
const pBtn=(G,dis=false)=>({background:dis?G.goldDim:`linear-gradient(135deg,${G.gold},#A07840)`,border:"none",color:dis?G.subtext:"#0D0D0D",padding:"12px 24px",borderRadius:6,fontWeight:700,fontSize:13,cursor:dis?"default":"pointer",transition:"all 0.2s"});
const sBtn=(G)=>({background:"transparent",border:`1px solid ${G.border}`,color:G.creamDim,padding:"10px 18px",borderRadius:6,fontSize:13,cursor:"pointer"});

function GL({G,style={}}){return <div style={{height:1,background:`linear-gradient(90deg,transparent,${G.gold},transparent)`,opacity:0.38,...style}}/>;}
function Spin({G,text="Cargando..."}){return<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10,padding:"28px 0"}}><div style={{width:26,height:26,border:`2px solid ${G.goldDim}`,borderTopColor:G.gold,borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/><div style={{fontSize:12,color:G.creamDim,animation:"shimmer 1.5s infinite"}}>{text}</div></div>;}
function Tag({text,G}){return<span style={{fontSize:10,padding:"2px 9px",borderRadius:20,border:`1px solid rgba(200,169,110,0.28)`,background:G.goldDim,color:G.gold,letterSpacing:0.8}}>{text}</span>;}
function CopyBtn({text,G}){const[c,setC]=useState(false);return<button onClick={()=>{navigator.clipboard.writeText(text);setC(true);setTimeout(()=>setC(false),2000);}} style={{background:c?G.goldDim:"transparent",border:`1px solid ${G.border}`,color:c?G.gold:G.creamDim,padding:"6px 14px",borderRadius:6,fontSize:12,transition:"all 0.2s"}}>{c?"✓ Copiado":"Copiar"}</button>;}
function Toast({msg,G}){return<div style={{position:"fixed",bottom:24,right:24,background:G.gold,color:"#0D0D0D",padding:"12px 20px",borderRadius:8,fontWeight:600,fontSize:13,zIndex:9999,animation:"fadeUp 0.3s ease"}}>✓ {msg}</div>;}

async function callAI(prompt,sys){
  const s=sys||"Sos asistente de Joaquin Saggese, chef privado holístico de alto nivel en Argentina. Respondés en español, tono sofisticado y práctico. Respuesta directa, lista para usar.";
  try{
    const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:s,messages:[{role:"user",content:prompt}]})});
    const d=await r.json();return d.content?.[0]?.text||"Error al generar.";
  }catch{return "Error de conexión. Intentá de nuevo.";}
}

const DEF_CLIENTES=[
  {id:1,nombre:"Familia Restrepo",tipo:"Temporada",estado:"Activo",ciudad:"Punta del Este",email:"restrepo@mail.com",telefono:"+54 9 11 4455-6677",personas:6,proxContact:"2025-04-10",intolerancia:"Sin gluten",historial:[{fecha:"Ene 2025",evento:"Temporada verano",nota:"Quedaron conformes. Piden repetir en invierno."}],ingreso:3200,tag:"⭐ VIP"},
  {id:2,nombre:"Yacht Azzurra",tipo:"Charter",estado:"Activo",ciudad:"Ibiza / MDQ",email:"cap@azzurra.com",telefono:"+34 600 123 456",personas:10,proxContact:"2025-05-01",intolerancia:"Mariscos",historial:[{fecha:"Feb 2025",evento:"Travesía 5 días",nota:"Propina extra. Quieren 2 temporadas por año."}],ingreso:4800,tag:"⭐ VIP"},
  {id:3,nombre:"Martina Ruiz",tipo:"Evento",estado:"Cerrado",ciudad:"Buenos Aires",email:"martina.r@corp.com",telefono:"+54 9 11 2233-4455",personas:20,proxContact:"2025-06-01",intolerancia:"Vegetariana",historial:[{fecha:"Dic 2024",evento:"Cena directivos",nota:"Reseña positiva en LinkedIn."}],ingreso:1800,tag:""},
];
const DEF_PERFIL={nombre:"Joaquin",apellido:"Saggese",especialidad:"Private Chef & Holistic Gastronomy",ciudad:"Mar del Plata · Buenos Aires · Internacional",bio:"Chef privado especializado en gastronomía holística de alto nivel. Familias, ejecutivos, yates de lujo y eventos exclusivos.",instagram:"@joaquin.chef",linkedin:"linkedin.com/in/joaquinsaggese",disponible:true};

function AuthScreen({G,onLogin}){
  const[mode,setMode]=useState("login");
  const[form,setForm]=useState({email:"",pass:"",nombre:"",apellido:"",especialidad:"",ciudad:""});
  const[loading,setLoading]=useState(false);
  const[error,setError]=useState("");
  const f=k=>e=>setForm(p=>({...p,[k]:e.target.value}));
  const is=iS(G);

  const login=()=>{
    if(!form.email||!form.pass){setError("Email y contraseña requeridos.");return;}
    setLoading(true);setError("");
    const u=DB.get("user:"+form.email.toLowerCase().trim());
    if(!u){setError("No existe una cuenta con ese email.");setLoading(false);return;}
    if(u.passHash!==hash(form.pass)){setError("Contraseña incorrecta.");setLoading(false);return;}
    DB.set("session:current",{email:u.email,ts:Date.now()});
    onLogin(u);setLoading(false);
  };

  const register=()=>{
    if(!form.email||!form.pass||!form.nombre){setError("Nombre, email y contraseña son obligatorios.");return;}
    if(form.pass.length<6){setError("Contraseña: mínimo 6 caracteres.");return;}
    setLoading(true);setError("");
    const key="user:"+form.email.toLowerCase().trim();
    if(DB.get(key)){setError("Ya existe una cuenta con ese email.");setLoading(false);return;}
    const u={email:form.email.toLowerCase().trim(),passHash:hash(form.pass),nombre:form.nombre,apellido:form.apellido||"",especialidad:form.especialidad||"Chef Privado",ciudad:form.ciudad||"Argentina",createdAt:Date.now()};
    DB.set(key,u);
    DB.set("perfil:"+u.email,{...DEF_PERFIL,nombre:u.nombre,apellido:u.apellido,especialidad:u.especialidad,ciudad:u.ciudad});
    DB.set("clientes:"+u.email,DEF_CLIENTES);
    DB.set("bookings:"+u.email,[]);
    DB.set("session:current",{email:u.email,ts:Date.now()});
    onLogin(u);setLoading(false);
  };

  return(
    <div style={{background:`linear-gradient(160deg,${G.bg},${G.surface})`,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:24,fontFamily:"Inter,sans-serif"}}>
      <style>{css}</style>
      <div style={{width:"100%",maxWidth:420}}>
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:52,color:G.gold,fontWeight:300}}>Chef OS</div>
          <div style={{fontSize:11,color:G.subtext,letterSpacing:2,marginTop:4}}>SISTEMA OPERATIVO DEL CHEF PRIVADO</div>
        </div>
        <div style={{...cS(G),padding:32}}>
          <div style={{display:"flex",gap:4,marginBottom:24,background:G.creamFaint,borderRadius:8,padding:4}}>
            {[["login","Iniciar sesión"],["register","Crear cuenta"]].map(([id,label])=>(
              <button key={id} onClick={()=>{setMode(id);setError("");}} style={{flex:1,padding:"9px",borderRadius:6,border:"none",background:mode===id?G.goldDim:"transparent",color:mode===id?G.gold:G.subtext,fontSize:13,fontWeight:mode===id?600:400,transition:"all 0.2s"}}>{label}</button>
            ))}
          </div>
          {mode==="login"&&(
            <div className="fi">
              {[["Email","email","email","tu@email.com"],["Contraseña","pass","password","••••••••"]].map(([l,k,t,ph])=>(
                <div key={k} style={{marginBottom:12}}>
                  <div style={{fontSize:10,color:G.gold,letterSpacing:2,marginBottom:5}}>{l.toUpperCase()}</div>
                  <input style={is} type={t} placeholder={ph} value={form[k]} onChange={f(k)} onKeyDown={e=>e.key==="Enter"&&login()}/>
                </div>
              ))}
              {error&&<div style={{fontSize:12,color:"#ef4444",marginBottom:10}}>⚠ {error}</div>}
              <button style={{...pBtn(G,loading),width:"100%"}} onClick={login} disabled={loading}>{loading?"Verificando...":"Entrar a Chef OS →"}</button>
              <div style={{textAlign:"center",marginTop:14,fontSize:12,color:G.subtext}}>¿Sin cuenta? <span onClick={()=>setMode("register")} style={{color:G.gold,cursor:"pointer"}}>Registrate</span></div>
            </div>
          )}
          {mode==="register"&&(
            <div className="fi">
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                {[["Nombre *","nombre","Joaquin"],["Apellido","apellido","Saggese"]].map(([l,k,ph])=>(
                  <div key={k}><div style={{fontSize:10,color:G.gold,letterSpacing:2,marginBottom:5}}>{l.toUpperCase()}</div><input style={is} placeholder={ph} value={form[k]} onChange={f(k)}/></div>
                ))}
              </div>
              {[["Especialidad","especialidad","Private Chef & Holistic Gastronomy"],["Ciudad base","ciudad","Mar del Plata, Argentina"],["Email *","email","tu@email.com"],["Contraseña * (mín 6)","pass","••••••••"]].map(([l,k,ph])=>(
                <div key={k} style={{marginBottom:10}}>
                  <div style={{fontSize:10,color:G.gold,letterSpacing:2,marginBottom:5}}>{l.toUpperCase()}</div>
                  <input style={is} type={k==="pass"?"password":k==="email"?"email":"text"} placeholder={ph} value={form[k]} onChange={f(k)}/>
                </div>
              ))}
              {error&&<div style={{fontSize:12,color:"#ef4444",marginBottom:10}}>⚠ {error}</div>}
              <button style={{...pBtn(G,loading),width:"100%"}} onClick={register} disabled={loading}>{loading?"Creando cuenta...":"Crear mi Chef OS →"}</button>
              <div style={{textAlign:"center",marginTop:14,fontSize:12,color:G.subtext}}>¿Ya tenés cuenta? <span onClick={()=>setMode("login")} style={{color:G.gold,cursor:"pointer"}}>Iniciá sesión</span></div>
            </div>
          )}
        </div>
        <div style={{textAlign:"center",marginTop:20,fontSize:11,color:G.subtext,lineHeight:1.7}}>privatechefjoaquin.com · Cada chef tiene su espacio privado.</div>
      </div>
    </div>
  );
}

function ModPerfil({G,user,perfil,onSave}){
  const[form,setForm]=useState(perfil);
  const[saving,setSaving]=useState(false);
  const[saved,setSaved]=useState(false);
  const f=k=>e=>setForm(p=>({...p,[k]:e.target.value}));
  const is=iS(G);
  const save=()=>{setSaving(true);DB.set("perfil:"+user.email,form);onSave(form);setSaving(false);setSaved(true);setTimeout(()=>setSaved(false),2500);};
  return(
    <div className="fi">
      <div style={{marginBottom:24}}><div style={{fontSize:11,color:G.gold,letterSpacing:3,marginBottom:6}}>MI PERFIL</div><h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:36,fontWeight:300,color:G.text}}>Tu <em style={{color:G.gold}}>identidad</em> profesional</h2></div>
      <div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div style={cS(G)}>
          <div style={{fontSize:11,color:G.gold,letterSpacing:2,marginBottom:16}}>DATOS PERSONALES</div>
          {[["Nombre","nombre"],["Apellido","apellido"],["Especialidad","especialidad"],["Ciudad","ciudad"]].map(([l,k])=>(
            <div key={k} style={{marginBottom:12}}><div style={{fontSize:10,color:G.subtext,letterSpacing:1,marginBottom:5}}>{l.toUpperCase()}</div><input style={is} value={form[k]||""} onChange={f(k)}/></div>
          ))}
          <div style={{marginBottom:12}}><div style={{fontSize:10,color:G.subtext,letterSpacing:1,marginBottom:5}}>BIO</div><textarea style={{...is,resize:"none",height:90}} value={form.bio||""} onChange={f("bio")}/></div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={cS(G)}>
            <div style={{fontSize:11,color:G.gold,letterSpacing:2,marginBottom:14}}>REDES SOCIALES</div>
            {[["Instagram","instagram","@tu.usuario"],["LinkedIn","linkedin","linkedin.com/in/tu-perfil"]].map(([l,k,ph])=>(
              <div key={k} style={{marginBottom:10}}><div style={{fontSize:10,color:G.subtext,letterSpacing:1,marginBottom:5}}>{l.toUpperCase()}</div><input style={is} placeholder={ph} value={form[k]||""} onChange={f(k)}/></div>
            ))}
          </div>
          <div style={cS(G)}>
            <div style={{fontSize:11,color:G.gold,letterSpacing:2,marginBottom:12}}>DISPONIBILIDAD</div>
            <div style={{display:"flex",gap:10}}>
              {[true,false].map(val=>(
                <div key={String(val)} onClick={()=>setForm(p=>({...p,disponible:val}))} style={{flex:1,padding:"12px",borderRadius:8,cursor:"pointer",border:`1px solid ${form.disponible===val?G.gold:G.border}`,background:form.disponible===val?G.goldDim:"transparent",textAlign:"center",transition:"all 0.2s"}}>
                  <div style={{fontSize:20,marginBottom:4}}>{val?"🟢":"🔴"}</div>
                  <div style={{fontSize:12,color:form.disponible===val?G.gold:G.subtext}}>{val?"Disponible":"No disponible"}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{...cS(G),background:"rgba(74,222,128,0.06)",border:"1px solid rgba(74,222,128,0.2)"}}>
            <div style={{fontSize:11,color:"rgba(74,222,128,0.8)",letterSpacing:2,marginBottom:6}}>TU LINK PÚBLICO</div>
            <div style={{fontSize:14,color:G.text,marginBottom:4}}>privatechefjoaquin.com</div>
            <div style={{fontSize:11,color:G.subtext}}>Compartí este link con tus clientes.</div>
          </div>
          <button style={{...pBtn(G,saving),width:"100%"}} onClick={save} disabled={saving}>{saving?"Guardando...":saved?"✓ Guardado":"Guardar perfil"}</button>
        </div>
      </div>
    </div>
  );
}

function ModCRM({G,user}){
  const[clientes,setClientes]=useState(()=>DB.get("clientes:"+user.email)||[]);
  const[sub,setSub]=useState("dashboard");
  const[ca,setCa]=useState(null);
  const[nota,setNota]=useState("");
  const[search,setSearch]=useState("");
  const[showForm,setShowForm]=useState(false);
  const[toast,setToast]=useState("");
  const[form,setForm]=useState({nombre:"",tipo:"Evento",estado:"Prospecto",ciudad:"",email:"",telefono:"",personas:"",ingreso:"",intolerancia:"",tag:""});
  const saveC=(d)=>{DB.set("clientes:"+user.email,d);setToast("Guardado");setTimeout(()=>setToast(""),2500);};
  const eColor=e=>{if(e==="Activo")return"#4ade80";if(e==="Frío")return"#94a3b8";if(e==="Prospecto")return"#fbbf24";return G.gold;};
  const is=iS(G);const card=cS(G);
  const agregarNota=()=>{if(!nota.trim()||!ca)return;const hoy=new Date().toLocaleDateString("es",{month:"short",year:"numeric"});const u={...ca,historial:[{fecha:hoy,evento:"Nota",nota},...ca.historial]};const nl=clientes.map(c=>c.id===ca.id?u:c);setClientes(nl);setCa(u);setNota("");saveC(nl);};
  const cambiarEstado=(estado)=>{const u={...ca,estado};const nl=clientes.map(c=>c.id===ca.id?u:c);setClientes(nl);setCa(u);saveC(nl);};
  const addCliente=()=>{if(!form.nombre)return;const n={...form,id:Date.now(),personas:parseInt(form.personas)||1,ingreso:parseInt(form.ingreso)||0,historial:[],proxContact:new Date(Date.now()+7*864e5).toISOString().split("T")[0]};const nl=[...clientes,n];setClientes(nl);setShowForm(false);setForm({nombre:"",tipo:"Evento",estado:"Prospecto",ciudad:"",email:"",telefono:"",personas:"",ingreso:"",intolerancia:"",tag:""});saveC(nl);};
  const fil=clientes.filter(c=>c.nombre.toLowerCase().includes(search.toLowerCase()));
  const total=clientes.reduce((a,c)=>a+(c.ingreso||0),0);
  return(
    <div className="fi">
      {toast&&<Toast msg={toast} G={G}/>}
      <div style={{marginBottom:24}}><div style={{fontSize:11,color:G.gold,letterSpacing:3,marginBottom:6}}>CRM</div><h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:36,fontWeight:300,color:G.text}}>Tus <em style={{color:G.gold}}>clientes</em></h2></div>
      <div style={{display:"flex",gap:6,marginBottom:22,flexWrap:"wrap"}}>
        {[["dashboard","Dashboard"],["clientes","Clientes"],["pipeline","Pipeline"]].map(([id,label])=>(<button key={id} onClick={()=>{setSub(id);setCa(null);}} style={{background:sub===id?G.goldDim:"transparent",border:`1px solid ${sub===id?G.gold:G.border}`,color:sub===id?G.gold:G.creamDim,padding:"8px 18px",borderRadius:20,fontSize:13,transition:"all 0.2s"}}>{label}</button>))}
      </div>
      {sub==="dashboard"&&(<div className="fu"><div className="g4" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:18}}>{[[clientes.filter(c=>c.estado==="Activo").length,"Activos","#4ade80"],[clientes.filter(c=>c.estado==="Prospecto").length,"Prospectos","#fbbf24"],[clientes.filter(c=>new Date(c.proxContact)<new Date()).length,"A contactar","rgba(239,68,68,0.8)"],[`€ ${total.toLocaleString()}`,"Ingresos",G.gold]].map(([v,l,c])=>(<div key={l} style={card}><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,color:c,marginBottom:4}}>{v}</div><div style={{fontSize:10,color:G.subtext,letterSpacing:1}}>{l.toUpperCase()}</div></div>))}</div><div style={card}><div style={{fontSize:11,color:G.gold,letterSpacing:2,marginBottom:14}}>PRÓXIMOS CONTACTOS</div>{clientes.length===0&&<div style={{textAlign:"center",padding:24,color:G.subtext}}>Sin clientes aún.</div>}{[...clientes].sort((a,b)=>new Date(a.proxContact)-new Date(b.proxContact)).map(c=>{const v=new Date(c.proxContact)<new Date();return<div key={c.id} onClick={()=>{setCa(c);setSub("clientes");}} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${G.border}`,cursor:"pointer"}}><div style={{display:"flex",gap:10,alignItems:"center"}}><div style={{width:7,height:7,borderRadius:"50%",background:eColor(c.estado),animation:v?"pulse 1.5s infinite":"none"}}/><div><div style={{fontSize:13,color:G.text}}>{c.nombre}</div><div style={{fontSize:11,color:G.subtext}}>{c.tipo}</div></div></div><span style={{fontSize:12,color:v?"rgba(239,68,68,0.8)":G.subtext}}>{v?"⚠ Vencido":c.proxContact}</span></div>;})}</div></div>)}
      {sub==="clientes"&&!ca&&(<div className="fu"><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><input placeholder="🔍 Buscar..." value={search} onChange={e=>setSearch(e.target.value)} style={{...is,width:200}}/><button style={pBtn(G)} onClick={()=>setShowForm(true)}>+ Nuevo cliente</button></div>{fil.length===0&&<div style={{textAlign:"center",padding:40,color:G.subtext}}>Sin clientes.</div>}<div style={{display:"flex",flexDirection:"column",gap:8}}>{fil.map(c=>(<div key={c.id} onClick={()=>setCa(c)} style={{...card,display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",transition:"all 0.2s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=G.goldLight} onMouseLeave={e=>e.currentTarget.style.borderColor=G.border}><div style={{display:"flex",gap:12,alignItems:"center"}}><div style={{width:36,height:36,borderRadius:"50%",background:G.goldDim,display:"flex",alignItems:"center",justifyContent:"center",color:G.gold,fontFamily:"'Cormorant Garamond',serif",fontSize:18}}>{c.nombre.charAt(0)}</div><div><div style={{fontSize:13,fontWeight:500,color:G.text}}>{c.nombre} {c.tag}</div><div style={{fontSize:11,color:G.subtext}}>{c.tipo} · {c.ciudad}</div></div></div><div style={{textAlign:"right"}}><div style={{fontSize:11,padding:"2px 10px",borderRadius:20,border:`1px solid ${eColor(c.estado)}50`,color:eColor(c.estado),marginBottom:4}}>{c.estado}</div>{c.ingreso>0&&<div style={{fontSize:12,color:G.gold}}>€ {c.ingreso.toLocaleString()}</div>}</div></div>))}</div>{showForm&&(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(8px)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowForm(false)}><div style={{...card,width:440,maxHeight:"85vh",overflow:"auto"}} onClick={e=>e.stopPropagation()}><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,marginBottom:16,color:G.text}}>Nuevo <em style={{color:G.gold}}>cliente</em></div>{[["Nombre","nombre"],["Ciudad","ciudad"],["Email","email"],["Teléfono","telefono"],["Intolerancias","intolerancia"],["Tag","tag"]].map(([ph,k])=>(<input key={k} placeholder={ph} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} style={{...is,marginBottom:10}}/>))}<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}><select value={form.tipo} onChange={e=>setForm(f=>({...f,tipo:e.target.value}))} style={is}>{["Evento","Charter","Temporada","Interino","Prospecto"].map(t=><option key={t}>{t}</option>)}</select><select value={form.estado} onChange={e=>setForm(f=>({...f,estado:e.target.value}))} style={is}>{["Activo","Cerrado","Frío","Prospecto"].map(t=><option key={t}>{t}</option>)}</select></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}><input placeholder="Personas" type="number" value={form.personas} onChange={e=>setForm(f=>({...f,personas:e.target.value}))} style={is}/><input placeholder="Ingreso €" type="number" value={form.ingreso} onChange={e=>setForm(f=>({...f,ingreso:e.target.value}))} style={is}/></div><div style={{display:"flex",gap:8}}><button style={pBtn(G)} onClick={addCliente}>Guardar</button><button style={sBtn(G)} onClick={()=>setShowForm(false)}>Cancelar</button></div></div></div>)}</div>)}
      {sub==="clientes"&&ca&&(<div className="fu"><button style={{...sBtn(G),marginBottom:16,fontSize:12}} onClick={()=>setCa(null)}>← Volver</button><div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}><div style={card}><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,color:G.text,marginBottom:10}}>{ca.nombre}</div>{[["Tipo",ca.tipo],["Ciudad",ca.ciudad],["Personas",ca.personas],["Email",ca.email],["Teléfono",ca.telefono],["Intolerancias",ca.intolerancia||"—"],["Ingreso",ca.ingreso?`€ ${ca.ingreso.toLocaleString()}`:"—"]].map(([k,v])=>(<div key={k} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${G.border}`}}><span style={{fontSize:12,color:G.subtext}}>{k}</span><span style={{fontSize:12,color:G.text}}>{v}</span></div>))}</div><div style={card}><div style={{fontSize:11,color:G.gold,letterSpacing:2,marginBottom:12}}>ACCIONES</div><a href={"mailto:"+ca.email} style={{...sBtn(G),display:"block",textAlign:"center",textDecoration:"none",marginBottom:8}}>📧 Email</a><a href={"https://wa.me/"+(ca.telefono||"").replace(/\D/g,"")} target="_blank" rel="noreferrer" style={{...sBtn(G),display:"block",textAlign:"center",textDecoration:"none",marginBottom:16}}>📱 WhatsApp</a><div style={{fontSize:11,color:G.gold,letterSpacing:2,marginBottom:10}}>CAMBIAR ESTADO</div><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{["Activo","Cerrado","Frío","Prospecto"].map(e=>(<button key={e} onClick={()=>cambiarEstado(e)} style={{background:ca.estado===e?G.goldDim:"transparent",border:`1px solid ${ca.estado===e?G.gold:G.border}`,color:ca.estado===e?G.gold:G.creamDim,padding:"6px 12px",borderRadius:20,fontSize:12,transition:"all 0.2s"}}>{e}</button>))}</div></div></div><div style={card}><div style={{fontSize:11,color:G.gold,letterSpacing:2,marginBottom:14}}>HISTORIAL Y NOTAS</div><div style={{display:"flex",gap:8,marginBottom:14}}><input placeholder="Agregar nota..." value={nota} onChange={e=>setNota(e.target.value)} onKeyDown={e=>e.key==="Enter"&&agregarNota()} style={{...is,flex:1}}/><button style={pBtn(G)} onClick={agregarNota}>+</button></div>{ca.historial.length===0?<div style={{textAlign:"center",padding:20,color:G.subtext,fontSize:13}}>Sin historial.</div>:ca.historial.map((h,i)=>(<div key={i} style={{padding:"12px 0",borderBottom:`1px solid ${G.border}`}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:12,color:G.creamDim,fontWeight:500}}>{h.evento}</span><span style={{fontSize:11,color:G.subtext}}>{h.fecha}</span></div><div style={{fontSize:13,color:G.subtext,fontStyle:"italic"}}>{h.nota}</div></div>))}</div></div>)}
      {sub==="pipeline"&&(<div className="fu" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>{[["Prospecto","rgba(251,191,36,0.15)","rgba(251,191,36,0.4)"],["Activo","rgba(74,222,128,0.08)","rgba(74,222,128,0.35)"],["Cerrado","rgba(200,169,110,0.08)","rgba(200,169,110,0.3)"],["Frío","rgba(148,163,184,0.06)","rgba(148,163,184,0.2)"]].map(([estado,bg,bc])=>{const items=clientes.filter(c=>c.estado===estado);return<div key={estado}><div style={{fontSize:10,letterSpacing:2,marginBottom:10,color:bc}}>{estado.toUpperCase()} · {items.length}</div>{items.map(c=>(<div key={c.id} onClick={()=>{setCa(c);setSub("clientes");}} style={{background:bg,border:`1px solid ${bc}`,borderRadius:8,padding:14,cursor:"pointer",marginBottom:8}}><div style={{fontWeight:500,fontSize:13,color:G.text,marginBottom:3}}>{c.nombre}</div><div style={{fontSize:11,color:G.subtext,marginBottom:4}}>{c.tipo} · {c.ciudad}</div>{c.ingreso>0&&<div style={{fontSize:12,color:G.gold}}>€ {c.ingreso.toLocaleString()}</div>}</div>))}{items.length===0&&<div style={{border:`1px dashed ${bc}`,borderRadius:8,padding:20,textAlign:"center",fontSize:11,color:G.subtext}}>Vacío</div>}</div>;})}</div>)}
    </div>
  );
}

function ModBooking({G,user}){
  const[bookings,setBookings]=useState(()=>DB.get("bookings:"+user.email)||[]);
  const[sub,setSub]=useState("nuevo");
  const[step,setStep]=useState(1);
  const[selSrv,setSelSrv]=useState(null);
  const[selDate,setSelDate]=useState(null);
  const[form,setForm]=useState({name:"",email:"",phone:"",notes:""});
  const[done,setDone]=useState(false);
  const[calMonth,setCalMonth]=useState(new Date().getMonth());
  const[calYear,setCalYear]=useState(new Date().getFullYear());
  const[toast,setToast]=useState("");
  const today=new Date();
  const BLOCKED=[3,7,8,14,15,21,22,28];
  const DAYS=["L","M","M","J","V","S","D"];
  const firstDay=new Date(calYear,calMonth,1).getDay();
  const daysInMonth=new Date(calYear,calMonth+1,0).getDate();
  const offset=firstDay===0?6:firstDay-1;
  const monthName=new Date(calYear,calMonth).toLocaleString("es",{month:"long",year:"numeric"});
  const SERVICIOS=[{id:1,icon:"✦",title:"Chef por día",price:"€ 400 / día",duration:"Jornada completa"},{id:2,icon:"◈",title:"Chef por semana",price:"€ 2.500 / semana",duration:"7 días"},{id:3,icon:"◉",title:"Yacht Chef — Temporada",price:"€ 8.000 / mes",duration:"Temporada completa"},{id:4,icon:"◇",title:"Chef Interino",price:"€ 400 / día",duration:"Flexible"},{id:5,icon:"❋",title:"Evento Privado",price:"A consultar",duration:"Según el evento"}];
  const confirmBooking=()=>{
    if(!form.name||!form.email)return;
    const fecha=selDate?`${selDate.day}/${selDate.month+1}/${selDate.year}`:"A confirmar";
    const b={id:Date.now(),servicio:selSrv.title,precio:selSrv.price,fecha,cliente:form.name,email:form.email,telefono:form.phone||"—",notas:form.notes||"—",estado:"Consulta recibida",createdAt:new Date().toLocaleDateString("es",{day:"numeric",month:"short",year:"numeric"})};
    const nl=[b,...bookings];setBookings(nl);DB.set("bookings:"+user.email,nl);
    const clientes=DB.get("clientes:"+user.email)||[];
    const existe=clientes.find(c=>c.email.toLowerCase()===form.email.toLowerCase());
    if(!existe){const nc={id:Date.now()+1,nombre:form.name,tipo:selSrv.title,estado:"Prospecto",ciudad:"—",email:form.email,telefono:form.phone||"—",personas:1,proxContact:new Date(Date.now()+86400000).toISOString().split("T")[0],intolerancia:"Por consultar",historial:[{fecha:new Date().toLocaleDateString("es",{day:"numeric",month:"short",year:"numeric"}),evento:"Consulta de booking",nota:`Servicio: ${selSrv.title} · Fecha: ${fecha} · ${form.notes||"Sin notas."}`}],ingreso:0,tag:"🔥 Nuevo"};DB.set("clientes:"+user.email,[...clientes,nc]);}
    else{const act=clientes.map(c=>c.email.toLowerCase()===form.email.toLowerCase()?{...c,historial:[{fecha:new Date().toLocaleDateString("es",{day:"numeric",month:"short",year:"numeric"}),evento:"Nueva consulta",nota:`${selSrv.title} · ${fecha}`},...(c.historial||[])],tag:"🔥 Reactivado"}:c);DB.set("clientes:"+user.email,act);}
    setDone(true);setToast("Consulta guardada en CRM");setTimeout(()=>setToast(""),3000);
  };
  const reset=()=>{setStep(1);setSelSrv(null);setSelDate(null);setForm({name:"",email:"",phone:"",notes:""});setDone(false);};
  const is=iS(G);const card=cS(G);
  return(
    <div className="fi">
      {toast&&<Toast msg={toast} G={G}/>}
      <div style={{marginBottom:24}}><div style={{fontSize:11,color:G.gold,letterSpacing:3,marginBottom:6}}>RESERVAS</div><h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:36,fontWeight:300,color:G.text}}>Booking <em style={{color:G.gold}}>y calendario</em></h2></div>
      <div style={{display:"flex",gap:6,marginBottom:22}}>{[["nuevo","Nueva consulta"],["historial","Historial"]].map(([id,label])=>(<button key={id} onClick={()=>{setSub(id);reset();}} style={{background:sub===id?G.goldDim:"transparent",border:`1px solid ${sub===id?G.gold:G.border}`,color:sub===id?G.gold:G.creamDim,padding:"8px 18px",borderRadius:20,fontSize:13,transition:"all 0.2s"}}>{label}</button>))}</div>
      {sub==="nuevo"&&(<div className="fu" style={{maxWidth:540}}>{done?(<div style={{...card,textAlign:"center",padding:40}}><div style={{width:56,height:56,borderRadius:"50%",border:`1px solid ${G.gold}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:22}}>✦</div><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,color:G.gold,marginBottom:8}}>Gracias, {form.name.split(" ")[0]}.</div><div style={{fontSize:15,color:G.creamDim,lineHeight:1.8,marginBottom:20,fontStyle:"italic",fontFamily:"'Cormorant Garamond',serif"}}>"Cada experiencia comienza con una conversación. Me alegra que hayas dado el primer paso."</div><div style={{...cS(G),textAlign:"left",marginBottom:20,background:"rgba(200,169,110,0.07)"}}>{[["Servicio",selSrv?.title],["Fecha",selDate?`${selDate.day}/${selDate.month+1}/${selDate.year}`:"A confirmar"],["Precio",selSrv?.price],["Email",form.email]].map(([k,v])=>(<div key={k} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${G.border}`}}><span style={{fontSize:12,color:G.subtext}}>{k}</span><span style={{fontSize:12,color:k==="Precio"?G.gold:G.text,fontWeight:k==="Precio"?600:400}}>{v}</span></div>))}</div><div style={{fontSize:13,color:G.subtext,marginBottom:24,lineHeight:1.8,padding:"14px 16px",borderRadius:8,border:`1px solid rgba(200,169,110,0.2)`,background:"rgba(200,169,110,0.05)"}}>📬 Recibirás mi respuesta en <strong style={{color:G.gold}}>menos de 24 horas</strong>. Coordinamos una call sin cargo para definir los detalles.</div><button style={pBtn(G)} onClick={reset}>Nueva consulta</button></div>):(<><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:24}}>{["Servicio","Fecha","Confirmar"].map((l,i)=>(<div key={l} style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:26,height:26,borderRadius:"50%",background:step>i?G.gold:G.goldDim,border:`1px solid ${step>i?G.gold:G.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:step>i?"#0D0D0D":G.subtext,fontWeight:600}}>{i+1}</div><span style={{fontSize:12,color:step>i?G.creamDim:G.subtext}}>{l}</span>{i<2&&<span style={{color:G.border,fontSize:12}}>→</span>}</div>))}</div>{step===1&&(<div style={{display:"flex",flexDirection:"column",gap:8}}>{SERVICIOS.map(sv=>(<div key={sv.id} onClick={()=>setSelSrv(sv)} style={{...card,display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",border:`1px solid ${selSrv?.id===sv.id?G.gold:G.border}`,background:selSrv?.id===sv.id?G.goldDim:G.card,transition:"all 0.2s"}}><div style={{display:"flex",gap:12,alignItems:"center"}}><span style={{color:G.gold,fontSize:16}}>{sv.icon}</span><div><div style={{fontSize:13,color:G.text,fontWeight:selSrv?.id===sv.id?600:400}}>{sv.title}</div><div style={{fontSize:11,color:G.subtext}}>{sv.duration}</div></div></div><span style={{color:G.gold,fontSize:13,fontWeight:500}}>{sv.price}</span></div>))}<button style={{...pBtn(G,!selSrv),marginTop:8,width:"100%"}} onClick={()=>selSrv&&setStep(2)}>Continuar →</button></div>)}{step===2&&(<div style={card}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><button onClick={()=>{if(calMonth===0){setCalMonth(11);setCalYear(y=>y-1);}else setCalMonth(m=>m-1);}} style={{background:"none",border:"none",color:G.gold,fontSize:22,cursor:"pointer"}}>‹</button><span style={{fontSize:14,textTransform:"capitalize",color:G.text}}>{monthName}</span><button onClick={()=>{if(calMonth===11){setCalMonth(0);setCalYear(y=>y+1);}else setCalMonth(m=>m+1);}} style={{background:"none",border:"none",color:G.gold,fontSize:22,cursor:"pointer"}}>›</button></div><div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginBottom:6}}>{DAYS.map((d,i)=><div key={i} style={{textAlign:"center",fontSize:10,color:G.subtext}}>{d}</div>)}</div><div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4}}>{Array(offset).fill(null).map((_,i)=><div key={"e"+i}/>)}{Array(daysInMonth).fill(null).map((_,i)=>{const day=i+1,bl=BLOCKED.includes(day),past=new Date(calYear,calMonth,day)<new Date(today.getFullYear(),today.getMonth(),today.getDate()),sel=selDate?.day===day&&selDate?.month===calMonth,isT=day===today.getDate()&&calMonth===today.getMonth();return<div key={day} style={{display:"flex",justifyContent:"center"}}><div onClick={()=>{if(!bl&&!past)setSelDate({day,month:calMonth,year:calYear});}} style={{width:30,height:30,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,cursor:bl||past?"default":"pointer",background:sel?G.gold:"transparent",color:bl||past?"rgba(200,200,200,0.2)":sel?"#0D0D0D":isT?G.gold:G.creamDim,border:isT&&!sel?`1px solid ${G.gold}`:"none",textDecoration:bl&&!past?"line-through":"none"}}>{day}</div></div>;})}</div>{selDate&&<div style={{marginTop:12,textAlign:"center",fontSize:12,color:G.gold}}>📅 {selDate.day}/{selDate.month+1}/{selDate.year}</div>}<div style={{display:"flex",gap:8,marginTop:14}}><button style={sBtn(G)} onClick={()=>setStep(1)}>← Atrás</button><button style={{...pBtn(G,!selDate),flex:1}} onClick={()=>selDate&&setStep(3)}>Continuar →</button></div></div>)}{step===3&&(<div><div style={{...card,marginBottom:12}}>{[["Servicio",selSrv?.title],["Fecha",selDate?`${selDate.day}/${selDate.month+1}/${selDate.year}`:"A confirmar"],["Precio",selSrv?.price]].map(([k,v])=>(<div key={k} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${G.border}`}}><span style={{fontSize:12,color:G.subtext}}>{k}</span><span style={{fontSize:12,color:k==="Precio"?G.gold:G.text,fontWeight:k==="Precio"?600:400}}>{v}</span></div>))}</div>{[["Nombre completo","name","text"],["Email","email","email"],["WhatsApp","phone","tel"]].map(([ph,k,t])=>(<input key={k} type={t} placeholder={ph} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} style={{...is,marginBottom:10}}/>))}<textarea placeholder="Contanos el contexto: cantidad de personas, tipo de evento, fecha tentativa..." value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} style={{...is,resize:"none",height:90,marginBottom:14}}/><div style={{...cS(G),marginBottom:14,background:"rgba(200,169,110,0.06)",border:`1px solid rgba(200,169,110,0.2)`}}><div style={{fontSize:12,color:G.gold,fontWeight:600,marginBottom:4}}>📞 ¿Cómo funciona?</div><div style={{fontSize:12,color:G.creamDim,lineHeight:1.7}}>Enviás esta consulta → Joaquin te responde en menos de 24hs → Call gratuita → Confirmamos el servicio.</div></div><div style={{display:"flex",gap:8}}><button style={sBtn(G)} onClick={()=>setStep(2)}>← Atrás</button><button style={{...pBtn(G,!(form.name&&form.email)),flex:1}} onClick={()=>(form.name&&form.email)&&confirmBooking()}>Enviar consulta →</button></div></div>)}</>)}</div>)}
      {sub==="historial"&&(<div className="fu">{bookings.length===0&&<div style={{...cS(G),textAlign:"center",padding:48,color:G.subtext}}>Sin consultas todavía.</div>}<div style={{display:"flex",flexDirection:"column",gap:10}}>{bookings.map(b=>(<div key={b.id} style={cS(G)}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}><div><div style={{fontWeight:600,fontSize:14,color:G.text,marginBottom:3}}>{b.servicio}</div><div style={{fontSize:12,color:G.subtext}}>{b.cliente} · {b.email}</div></div><div style={{textAlign:"right"}}><div style={{fontSize:11,padding:"2px 10px",borderRadius:20,border:`1px solid rgba(74,222,128,0.4)`,color:"#4ade80",marginBottom:4}}>{b.estado}</div><div style={{fontSize:12,color:G.gold,fontWeight:600}}>{b.precio}</div></div></div><GL G={G} style={{marginBottom:10}}/><div style={{display:"flex",gap:16,flexWrap:"wrap"}}><span style={{fontSize:12,color:G.subtext}}>📅 {b.fecha}</span><span style={{fontSize:12,color:G.subtext}}>📱 {b.telefono}</span><span style={{fontSize:12,color:G.subtext}}>Recibido: {b.createdAt}</span></div>{b.notas&&b.notas!=="—"&&<div style={{fontSize:12,color:G.subtext,marginTop:8,fontStyle:"italic"}}>"{b.notas}"</div>}</div>))}</div></div>)}
    </div>
  );
}

function ModIA({G,user}){
  const[sub,setSub]=useState("outreach");
  const[loading,setLoading]=useState(false);
  const[result,setResult]=useState("");
  const[perfil,setPerfil]=useState("");
  const[canal,setCanal]=useState("");
  const[servicio,setServicio]=useState("");
  const[contexto,setContexto]=useState("");
  const[ctipo,setCtipo]=useState("");
  const[tema,setTema]=useState("");
  const[tono,setTono]=useState("sofisticado");
  const[batch,setBatch]=useState([]);
  const[bLoading,setBLoading]=useState(false);
  const[hist,setHist]=useState(()=>DB.get("ia-hist:"+user.email)||[]);
  const saveHist=(entry)=>{const nl=[entry,...hist].slice(0,20);setHist(nl);DB.set("ia-hist:"+user.email,nl);};
  const PERFILES=[{id:"familia",label:"Familia alto poder",icon:"🏡"},{id:"ejecutivo",label:"Ejecutivo / CEO",icon:"💼"},{id:"gatekeeper",label:"Gatekeeper corporativo",icon:"🏢"},{id:"yacht",label:"Propietario de yacht",icon:"⛵"}];
  const CANALES=[{id:"email",label:"Email",icon:"📧"},{id:"whatsapp",label:"WhatsApp",icon:"📱"},{id:"linkedin",label:"LinkedIn",icon:"💼"},{id:"instagram",label:"Instagram DM",icon:"📸"}];
  const SERVICIOS=["Chef por día (€400)","Chef por semana (€2.500)","Yacht Chef Temporada (€8.000/mes)","Chef Interino","Evento Privado"];
  const genOut=async()=>{if(!perfil||!canal||!servicio)return;setLoading(true);setResult("");const p=PERFILES.find(x=>x.id===perfil),c=CANALES.find(x=>x.id===canal);const prompt=`Mensaje de ${c.label} para ${p.label}. Servicio: ${servicio}. ${contexto?`Contexto: ${contexto}.`:""} ${canal==="email"?"Incluí asunto y cuerpo.":""} ${canal==="whatsapp"?"Corto y directo.":""} Sonar como Joaquin Saggese, chef privado holístico. Precios en euros. CTA concreto.`;const res=await callAI(prompt);setResult(res);saveHist({id:Date.now(),tipo:"Outreach",prompt:prompt.substring(0,80)+"...",res,fecha:new Date().toLocaleDateString("es",{day:"numeric",month:"short"})});setLoading(false);};
  const genContent=async()=>{if(!ctipo)return;setLoading(true);setResult("");const tipos={"post_ig":"Post Instagram con caption y hashtags","post_li":"Post LinkedIn profesional","story":"3 ideas de Story","reel":"Concepto de Reel 30 seg","carrusel":"Carrusel 6 slides"};const prompt=`Generá ${tipos[ctipo]} para Joaquin Saggese, chef privado holístico. ${tema?`Tema: ${tema}.`:""} Tono: ${tono}. Listo para publicar.`;const res=await callAI(prompt);setResult(res);saveHist({id:Date.now(),tipo:"Contenido",prompt:prompt.substring(0,80)+"...",res,fecha:new Date().toLocaleDateString("es",{day:"numeric",month:"short"})});setLoading(false);};
  const genBatch=async()=>{if(!servicio)return;setBLoading(true);setBatch([]);const gen=async(i)=>{if(i>=PERFILES.length){setBLoading(false);return;}const p=PERFILES[i];const texto=await callAI(`WhatsApp para ${p.label}. Servicio: ${servicio}. Breve, directo, como Joaquin. CTA claro. Precios en euros.`);setBatch(prev=>[...prev,{perfil:p,texto}]);await gen(i+1);};await gen(0);};
  const is=iS(G);const card=cS(G);
  return(
    <div className="fi">
      <div style={{marginBottom:24}}><div style={{fontSize:11,color:G.gold,letterSpacing:3,marginBottom:6}}>AGENTE IA</div><h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:36,fontWeight:300,color:G.text}}>Mensajes y contenido <em style={{color:G.gold}}>con IA</em></h2></div>
      <div style={{display:"flex",gap:6,marginBottom:22,flexWrap:"wrap"}}>{[["outreach","✦ Outreach"],["batch","◈ Campaña"],["contenido","◉ Contenido"],["historial","◇ Historial"]].map(([id,label])=>(<button key={id} onClick={()=>{setSub(id);setResult("");setBatch([]);}} style={{background:sub===id?G.goldDim:"transparent",border:`1px solid ${sub===id?G.gold:G.border}`,color:sub===id?G.gold:G.creamDim,padding:"8px 18px",borderRadius:20,fontSize:13,transition:"all 0.2s"}}>{label}</button>))}</div>
      {sub==="outreach"&&(<div className="fu"><div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}><div style={{display:"flex",flexDirection:"column",gap:12}}><div style={card}><div style={{fontSize:11,color:G.gold,letterSpacing:2,marginBottom:12}}>PERFIL</div>{PERFILES.map(p=>(<div key={p.id} onClick={()=>setPerfil(p.id)} style={{display:"flex",gap:10,alignItems:"center",padding:"10px 12px",borderRadius:8,cursor:"pointer",border:`1px solid ${perfil===p.id?G.gold:G.border}`,background:perfil===p.id?G.goldDim:"transparent",marginBottom:6,transition:"all 0.2s"}}><span style={{fontSize:18}}>{p.icon}</span><span style={{fontSize:13,color:perfil===p.id?G.gold:G.text}}>{p.label}</span>{perfil===p.id&&<span style={{marginLeft:"auto",color:G.gold}}>✓</span>}</div>))}</div><div style={card}><div style={{fontSize:11,color:G.gold,letterSpacing:2,marginBottom:12}}>CANAL</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>{CANALES.map(c=>(<div key={c.id} onClick={()=>setCanal(c.id)} style={{padding:"10px",borderRadius:8,cursor:"pointer",border:`1px solid ${canal===c.id?G.gold:G.border}`,background:canal===c.id?G.goldDim:"transparent",textAlign:"center",transition:"all 0.2s"}}><div style={{fontSize:18,marginBottom:3}}>{c.icon}</div><div style={{fontSize:11,color:canal===c.id?G.gold:G.creamDim}}>{c.label}</div></div>))}</div></div></div><div style={{display:"flex",flexDirection:"column",gap:12}}><div style={card}><div style={{fontSize:11,color:G.gold,letterSpacing:2,marginBottom:12}}>SERVICIO</div>{SERVICIOS.map(sv=>(<div key={sv} onClick={()=>setServicio(sv)} style={{padding:"9px 12px",borderRadius:6,cursor:"pointer",border:`1px solid ${servicio===sv?G.gold:G.border}`,background:servicio===sv?G.goldDim:"transparent",fontSize:13,color:servicio===sv?G.gold:G.creamDim,marginBottom:6,transition:"all 0.2s"}}>{servicio===sv?"✓ ":""}{sv}</div>))}</div><div style={card}><div style={{fontSize:11,color:G.gold,letterSpacing:2,marginBottom:8}}>CONTEXTO EXTRA</div><textarea placeholder="Casa en Marbella, temporada de verano..." value={contexto} onChange={e=>setContexto(e.target.value)} style={{...is,resize:"none",height:70}}/></div><button style={{...pBtn(G,!(perfil&&canal&&servicio)||loading),width:"100%"}} onClick={genOut} disabled={!(perfil&&canal&&servicio)||loading}>{loading?"Generando...":"✦ Generar mensaje"}</button></div></div>{loading&&<Spin G={G} text="Generando con IA..."/>}{result&&!loading&&(<div className="fu" style={{...card,marginTop:16}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div style={{fontSize:11,color:G.gold,letterSpacing:2}}>MENSAJE GENERADO</div><div style={{display:"flex",gap:8}}><CopyBtn text={result} G={G}/><button style={{...sBtn(G),padding:"6px 14px",fontSize:12}} onClick={genOut}>↻</button></div></div><GL G={G} style={{marginBottom:12}}/><div style={{whiteSpace:"pre-wrap",lineHeight:1.9,fontSize:14,color:G.creamDim}}>{result}</div></div>)}</div>)}
      {sub==="batch"&&(<div className="fu"><div style={card}><div style={{fontSize:11,color:G.gold,letterSpacing:2,marginBottom:12}}>SERVICIO</div><div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>{SERVICIOS.map(sv=><button key={sv} onClick={()=>setServicio(sv)} style={{background:servicio===sv?G.goldDim:"transparent",border:`1px solid ${servicio===sv?G.gold:G.border}`,color:servicio===sv?G.gold:G.creamDim,padding:"8px 14px",borderRadius:6,fontSize:12,transition:"all 0.2s"}}>{sv}</button>)}</div><button style={{...pBtn(G,!servicio||bLoading),width:"100%"}} onClick={genBatch} disabled={!servicio||bLoading}>{bLoading?`Generando ${batch.length}/4...`:"◈ Generar campaña"}</button></div>{bLoading&&batch.length===0&&<Spin G={G} text="Generando campaña..."/>}<div style={{display:"flex",flexDirection:"column",gap:12,marginTop:16}}>{batch.map((r,i)=>(<div key={i} className="fu" style={card}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><div style={{display:"flex",gap:10,alignItems:"center"}}><span style={{fontSize:20}}>{r.perfil.icon}</span><span style={{fontSize:13,fontWeight:600,color:G.gold}}>{r.perfil.label}</span></div><CopyBtn text={r.texto} G={G}/></div><GL G={G} style={{marginBottom:10}}/><div style={{whiteSpace:"pre-wrap",lineHeight:1.8,fontSize:13,color:G.creamDim}}>{r.texto}</div></div>))}{bLoading&&batch.length>0&&<div style={{...card,textAlign:"center",padding:20}}><div style={{width:22,height:22,border:`2px solid ${G.goldDim}`,borderTopColor:G.gold,borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"0 auto 8px"}}/><div style={{fontSize:12,color:G.creamDim}}>Generando {batch.length+1}/4...</div></div>}</div></div>)}
      {sub==="contenido"&&(<div className="fu"><div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}><div style={card}><div style={{fontSize:11,color:G.gold,letterSpacing:2,marginBottom:12}}>TIPO</div>{[["post_ig","📸","Post Instagram"],["post_li","💼","Post LinkedIn"],["story","⚡","Story"],["reel","🎬","Reel"],["carrusel","📑","Carrusel"]].map(([id,ico,label])=>(<div key={id} onClick={()=>setCtipo(id)} style={{display:"flex",gap:10,alignItems:"center",padding:"10px 12px",borderRadius:8,cursor:"pointer",border:`1px solid ${ctipo===id?G.gold:G.border}`,background:ctipo===id?G.goldDim:"transparent",marginBottom:6,transition:"all 0.2s"}}><span style={{fontSize:18}}>{ico}</span><span style={{fontSize:13,color:ctipo===id?G.gold:G.text}}>{label}</span>{ctipo===id&&<span style={{marginLeft:"auto",color:G.gold}}>✓</span>}</div>))}</div><div style={{display:"flex",flexDirection:"column",gap:12}}><div style={card}><div style={{fontSize:11,color:G.gold,letterSpacing:2,marginBottom:8}}>TEMA</div><textarea placeholder="Cociné un menú en un yate en Ibiza..." value={tema} onChange={e=>setTema(e.target.value)} style={{...is,resize:"none",height:80}}/></div><div style={card}><div style={{fontSize:11,color:G.gold,letterSpacing:2,marginBottom:10}}>TONO</div><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{["sofisticado","inspiracional","educativo","cercano"].map(t=>(<button key={t} onClick={()=>setTono(t)} style={{background:tono===t?G.goldDim:"transparent",border:`1px solid ${tono===t?G.gold:G.border}`,color:tono===t?G.gold:G.creamDim,padding:"7px 14px",borderRadius:20,fontSize:12,textTransform:"capitalize",transition:"all 0.2s"}}>{t}</button>))}</div></div><button style={{...pBtn(G,!ctipo||loading),width:"100%"}} onClick={genContent} disabled={!ctipo||loading}>{loading?"Generando...":"◉ Generar contenido"}</button></div></div>{loading&&<Spin G={G} text="Generando con IA..."/>}{result&&!loading&&(<div className="fu" style={{...card,marginTop:16}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><div style={{fontSize:11,color:G.gold,letterSpacing:2}}>CONTENIDO GENERADO</div><div style={{display:"flex",gap:8}}><CopyBtn text={result} G={G}/><button style={{...sBtn(G),padding:"6px 14px",fontSize:12}} onClick={genContent}>↻</button></div></div><GL G={G} style={{marginBottom:12}}/><div style={{whiteSpace:"pre-wrap",lineHeight:1.9,fontSize:14,color:G.creamDim}}>{result}</div></div>)}</div>)}
      {sub==="historial"&&(<div className="fu">{hist.length===0&&<div style={{...card,textAlign:"center",padding:40,color:G.subtext}}>Sin historial.</div>}{hist.map(h=>(<div key={h.id} style={{...card,marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><div style={{display:"flex",gap:8,alignItems:"center"}}><span style={{fontSize:10,padding:"2px 10px",borderRadius:20,background:G.goldDim,color:G.gold,border:`1px solid rgba(200,169,110,0.3)`}}>{h.tipo.toUpperCase()}</span><span style={{fontSize:11,color:G.subtext}}>{h.prompt}</span></div><div style={{display:"flex",gap:8,alignItems:"center"}}><span style={{fontSize:11,color:G.subtext}}>{h.fecha}</span><CopyBtn text={h.res} G={G}/></div></div><GL G={G} style={{marginBottom:8}}/><div style={{fontSize:13,color:G.creamDim,lineHeight:1.7,whiteSpace:"pre-wrap",maxHeight:120,overflow:"hidden"}}>{h.res}</div></div>))}</div>)}
    </div>
  );
}

function ModBiblioteca({G}){
  const[sub,setSub]=useState("superalimentos");
  const[sel,setSel]=useState(null);
  const[rAI,setRAI]=useState("");
  const[rLoading,setRLoading]=useState(false);
  const[rForm,setRForm]=useState({restriccion:"",personas:"4",estilo:"holístico"});
  const[bActive,setBA]=useState(null);
  const[timer,setTimer]=useState(0);
  const timerRef=useRef(null);
  const SUPER=[{nombre:"Moringa",emoji:"🌿",cat:"Verde",props:"Antiinflamatorio, 9 aminoácidos esenciales, hierro.",uso:"Polvo en smoothies, vinagretas, pastas."},{nombre:"Cúrcuma",emoji:"🟡",cat:"Raíz",props:"Curcumina antiinflamatoria. Activa con pimienta negra.",uso:"Curries, leches doradas. Con grasa y pimienta."},{nombre:"Ashwagandha",emoji:"🌱",cat:"Adaptógeno",props:"Reduce cortisol, mejora energía y sueño.",uso:"Polvo en leches vegetales."},{nombre:"Espirulina",emoji:"🔵",cat:"Alga",props:"Proteína 70%, B12 vegetal, hierro.",uso:"Smoothies verdes, bolas energéticas."},{nombre:"Cacao crudo",emoji:"🍫",cat:"Semilla",props:"Magnesio, teobromina, anandamida.",uso:"Nibs, polvo crudo con dátiles."},{nombre:"Jengibre",emoji:"🫚",cat:"Raíz",props:"Antiinflamatorio, digestivo, circulación.",uso:"Jugos, tés, marinadas. Rallado fresco."},{nombre:"Chía",emoji:"🫘",cat:"Semilla",props:"Omega 3, fibra soluble, calcio.",uso:"Puddings, sobre bowls. Siempre hidratadas."},{nombre:"Kéfir de agua",emoji:"💧",cat:"Fermentado",props:"Probióticos vivos, mejora microbioma.",uso:"Bebida sola, base de aderezos."},{nombre:"Maca andina",emoji:"🟤",cat:"Raíz",props:"Energía sostenida, equilibrio hormonal.",uso:"Polvo en batidos, chocolates."}];
  const BREATH=[{nombre:"Box Breathing",emoji:"◻",nivel:"Principiante",beneficio:"Calma el sistema nervioso antes del servicio.",pasos:["Inhalar: 4 seg","Retener: 4 seg","Exhalar: 4 seg","Retener: 4 seg","5 ciclos"]},{nombre:"4-7-8",emoji:"🌙",nivel:"Principiante",beneficio:"Activa nervio vago. Reduce ansiedad en 2 minutos.",pasos:["Exhalar todo","Inhalar: 4 seg","Retener: 7 seg","Exhalar soplando: 8 seg","4 ciclos"]},{nombre:"Coherencia Cardíaca",emoji:"💚",nivel:"Principiante",beneficio:"Reduce cortisol, mejora foco sostenido.",pasos:["Inhalar suave: 5 seg","Exhalar suave: 5 seg","6 resp./minuto","Foco en el corazón","10 ciclos"]}];
  const toggleBreath=(nombre)=>{if(bActive===nombre){clearInterval(timerRef.current);setBA(null);setTimer(0);return;}setBA(nombre);setTimer(300);clearInterval(timerRef.current);timerRef.current=setInterval(()=>{setTimer(p=>{if(p<=1){clearInterval(timerRef.current);setBA(null);return 0;}return p-1;});},1000);};
  const genReceta=async()=>{setRLoading(true);setRAI("");const res=await callAI(`Receta holística para ${rForm.personas} personas. Restricciones: ${rForm.restriccion||"ninguna"}. Estilo: ${rForm.estilo}. Formato: nombre, descripción, ingredientes con cantidades exactas, preparación paso a paso, maridaje sugerido.`);setRAI(res);setRLoading(false);};
  const is=iS(G);const card=cS(G);
  return(
    <div className="fi">
      <div style={{marginBottom:24}}><div style={{fontSize:11,color:G.gold,letterSpacing:3,marginBottom:6}}>BIBLIOTECA</div><h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:36,fontWeight:300,color:G.text}}>Biblioteca <em style={{color:G.gold}}>holística</em></h2></div>
      <div style={{display:"flex",gap:6,marginBottom:22,flexWrap:"wrap"}}>{[["superalimentos","🌿 Superalimentos"],["recetas","🍽️ Recetas IA"],["respiracion","💨 Respiración"],["bienestar","💪 Bienestar"]].map(([id,label])=>(<button key={id} onClick={()=>{setSub(id);setSel(null);}} style={{background:sub===id?G.goldDim:"transparent",border:`1px solid ${sub===id?G.gold:G.border}`,color:sub===id?G.gold:G.creamDim,padding:"8px 16px",borderRadius:20,fontSize:13,transition:"all 0.2s"}}>{label}</button>))}</div>
      {sub==="superalimentos"&&(<div className="fu" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>{SUPER.map(sf=>(<div key={sf.nombre} onClick={()=>setSel(sel?.nombre===sf.nombre?null:sf)} style={{...card,cursor:"pointer",border:`1px solid ${sel?.nombre===sf.nombre?G.gold:G.border}`,background:sel?.nombre===sf.nombre?G.goldDim:G.card,transition:"all 0.2s"}}><div style={{fontSize:26,marginBottom:8}}>{sf.emoji}</div><div style={{fontWeight:600,fontSize:14,color:G.text,marginBottom:5}}>{sf.nombre}</div><Tag text={sf.cat} G={G}/>{sel?.nombre===sf.nombre?(<div className="fu" style={{marginTop:10}}><GL G={G} style={{marginBottom:8}}/><div style={{fontSize:12,color:G.creamDim,lineHeight:1.6,marginBottom:5}}><strong style={{color:G.cream}}>Propiedades:</strong> {sf.props}</div><div style={{fontSize:12,color:G.creamDim,lineHeight:1.6}}><strong style={{color:G.cream}}>Uso:</strong> {sf.uso}</div></div>):<div style={{fontSize:11,color:G.subtext,marginTop:6,lineHeight:1.5}}>{sf.props.substring(0,48)}...</div>}</div>))}</div>)}
      {sub==="recetas"&&(<div className="fu"><div style={card}><div style={{fontSize:11,color:G.gold,letterSpacing:2,marginBottom:14}}>GENERADOR CON IA</div><div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}><div><div style={{fontSize:10,color:G.subtext,letterSpacing:1,marginBottom:5}}>RESTRICCIONES</div><input style={is} placeholder="Sin gluten, vegano..." value={rForm.restriccion} onChange={e=>setRForm(f=>({...f,restriccion:e.target.value}))}/></div><div><div style={{fontSize:10,color:G.subtext,letterSpacing:1,marginBottom:5}}>PERSONAS</div><select value={rForm.personas} onChange={e=>setRForm(f=>({...f,personas:e.target.value}))} style={is}>{["2","4","6","8","10","20"].map(n=><option key={n}>{n} personas</option>)}</select></div></div><div style={{fontSize:10,color:G.subtext,letterSpacing:1,marginBottom:8}}>ESTILO</div><div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>{["holístico","mediterráneo","asiático","fine dining","crudo"].map(est=>(<button key={est} onClick={()=>setRForm(f=>({...f,estilo:est}))} style={{background:rForm.estilo===est?G.goldDim:"transparent",border:`1px solid ${rForm.estilo===est?G.gold:G.border}`,color:rForm.estilo===est?G.gold:G.creamDim,padding:"7px 14px",borderRadius:20,fontSize:12,textTransform:"capitalize",transition:"all 0.2s"}}>{est}</button>))}</div><button style={{...pBtn(G,rLoading),width:"100%"}} onClick={genReceta} disabled={rLoading}>{rLoading?"Generando...":"🍽️ Generar receta"}</button>{rLoading&&<Spin G={G} text="Creando tu receta..."/>}{rAI&&!rLoading&&(<div className="fu" style={{marginTop:16,padding:16,background:G.goldDim,borderRadius:8,border:`1px solid rgba(200,169,110,0.2)`}}><div style={{display:"flex",justifyContent:"flex-end",marginBottom:8}}><CopyBtn text={rAI} G={G}/></div><div style={{whiteSpace:"pre-wrap",lineHeight:1.9,fontSize:13,color:G.creamDim}}>{rAI}</div></div>)}</div></div>)}
      {sub==="respiracion"&&(<div className="fu" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>{BREATH.map(r=>(<div key={r.nombre} style={card}><div style={{fontSize:28,marginBottom:8}}>{r.emoji}</div><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:G.text,marginBottom:5}}>{r.nombre}</div><Tag text={r.nivel} G={G}/><div style={{fontSize:13,color:G.creamDim,margin:"10px 0",fontStyle:"italic",lineHeight:1.6}}>"{r.beneficio}"</div><GL G={G} style={{marginBottom:10}}/>{r.pasos.map((p,i)=>(<div key={i} style={{display:"flex",gap:8,alignItems:"center",marginBottom:6}}><span style={{width:18,height:18,borderRadius:"50%",background:G.goldDim,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:G.gold,flexShrink:0}}>{i+1}</span><span style={{fontSize:12,color:G.creamDim}}>{p}</span></div>))}<button onClick={()=>toggleBreath(r.nombre)} style={{width:"100%",marginTop:12,padding:"10px",borderRadius:6,border:"none",background:bActive===r.nombre?`linear-gradient(135deg,#ef4444,#b91c1c)`:`linear-gradient(135deg,${G.gold},#A07840)`,color:"#0D0D0D",fontWeight:700,fontSize:13,cursor:"pointer"}}>{bActive===r.nombre?`⏹ Detener (${timer}s)`:"▶ Iniciar práctica"}</button></div>))}</div>)}
      {sub==="bienestar"&&(<div className="fu"><div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><div style={card}><div style={{fontSize:11,color:G.gold,letterSpacing:2,marginBottom:14}}>CALISTENIA</div>{[["💪","Plancha isométrica","Core","3x45 seg"],["🦵","Sentadilla bodyweight","Piernas","4x15 reps"],["🔷","Flexiones diamante","Tríceps","3x10 reps"],["🏋️","Dominadas australianas","Espalda","3x12 reps"],["🪑","L-sit en sillas","Core","3x20 seg"],["🦿","Pistol squat asistida","Piernas","3x8 c/lado"]].map(([ico,nom,grupo,series])=>(<div key={nom} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${G.border}`}}><div style={{display:"flex",gap:10,alignItems:"center"}}><span style={{fontSize:18}}>{ico}</span><div><div style={{fontSize:13,color:G.text}}>{nom}</div><div style={{fontSize:10,color:G.subtext}}>{grupo}</div></div></div><Tag text={series} G={G}/></div>))}</div><div style={card}><div style={{fontSize:11,color:G.gold,letterSpacing:2,marginBottom:14}}>STRETCHING POST-SERVICIO</div>{[["🕊️","Apertura de cadera","Caderas","60 seg c/lado"],["🪑","Extensión torácica","Columna","45 seg"],["↔️","Estiramiento cuello","Cuello","30 seg c/lado"],["🧘","Flexión de cadera","Psoas","45 seg c/lado"],["🌀","Torsión supina","Columna","45 seg c/lado"],["🚪","Apertura pectoral","Pecho","30 seg c/lado"]].map(([ico,nom,zona,dur])=>(<div key={nom} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${G.border}`}}><div style={{display:"flex",gap:10,alignItems:"center"}}><span style={{fontSize:18}}>{ico}</span><div><div style={{fontSize:13,color:G.text}}>{nom}</div><div style={{fontSize:10,color:G.subtext}}>{zona}</div></div></div><Tag text={dur} G={G}/></div>))}<div style={{marginTop:12,padding:12,background:"rgba(74,222,128,0.06)",borderRadius:6,border:"1px solid rgba(74,222,128,0.18)"}}><div style={{fontSize:12,color:"rgba(74,222,128,0.8)"}}>✓ 10 minutos post-servicio. Siempre.</div></div></div></div></div>)}
    </div>
  );
}

export default function App(){
  const[theme,setTheme]=useState("dark");
  const[user,setUser]=useState(null);
  const[perfil,setPerfil]=useState(null);
  const[mod,setMod]=useState("perfil");
  const[mobOpen,setMobOpen]=useState(false);
  const[bootLoading,setBootLoading]=useState(true);
  const G=theme==="dark"?DARK:LIGHT;
  useEffect(()=>{try{const sess=DB.get("session:current");if(sess?.email){const u=DB.get("user:"+sess.email);if(u){setUser(u);const p=DB.get("perfil:"+sess.email);setPerfil(p||DEF_PERFIL);}}}catch(e){}setBootLoading(false);},[]);
  const onLogin=(u)=>{setUser(u);const p=DB.get("perfil:"+u.email);setPerfil(p||{...DEF_PERFIL,nombre:u.nombre,apellido:u.apellido});setMod("perfil");};
  const logout=()=>{DB.del("session:current");setUser(null);setPerfil(null);};
  const MODULES=[{id:"perfil",icon:"👤",label:"Mi Perfil"},{id:"crm",icon:"◉",label:"CRM Clientes"},{id:"booking",icon:"📅",label:"Reservas"},{id:"ia",icon:"✦",label:"Agente IA"},{id:"biblioteca",icon:"📚",label:"Biblioteca"}];
  const sbg=theme==="dark"?"rgba(10,26,15,0.95)":"rgba(237,230,214,0.95)";
  if(bootLoading)return(<div style={{background:G.bg,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Inter,sans-serif"}}><style>{css}</style><div style={{textAlign:"center"}}><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:44,color:G.gold,marginBottom:16}}>Chef OS</div><div style={{width:28,height:28,border:`2px solid ${G.goldDim}`,borderTopColor:G.gold,borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"0 auto"}}/></div></div>);
  if(!user)return <AuthScreen G={G} onLogin={onLogin}/>;
  return(
    <div style={{background:`linear-gradient(160deg,${G.bg},${G.surface})`,minHeight:"100vh",color:G.text,fontFamily:"Inter,sans-serif",display:"flex",flexDirection:"column"}}>
      <style>{css}</style>
      <div className="mb" style={{background:sbg,borderBottom:`1px solid ${G.border}`,padding:"0 16px",height:52,alignItems:"center",justifyContent:"space-between",backdropFilter:"blur(12px)",position:"sticky",top:0,zIndex:100}}>
        <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:G.gold,fontWeight:600}}>Chef OS</span>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>setTheme(t=>t==="dark"?"light":"dark")} style={{background:G.goldDim,border:`1px solid ${G.border}`,color:G.gold,padding:"6px 10px",borderRadius:6,fontSize:13}}>{theme==="dark"?"☀️":"🌙"}</button>
          <button onClick={()=>setMobOpen(o=>!o)} style={{background:G.goldDim,border:`1px solid ${G.border}`,color:G.gold,padding:"6px 10px",borderRadius:6,fontSize:16}}>☰</button>
        </div>
      </div>
      {mobOpen&&(<div className="mmenu" style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:200}} onClick={()=>setMobOpen(false)}><div style={{background:G.surface,width:220,height:"100%",padding:"24px 0",animation:"slideIn 0.25s ease"}} onClick={e=>e.stopPropagation()}><div style={{padding:"0 20px 20px",borderBottom:`1px solid ${G.border}`,marginBottom:12}}><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:G.gold}}>Chef OS</div><div style={{fontSize:11,color:G.subtext,marginTop:2}}>{user.nombre} {user.apellido}</div></div>{MODULES.map(m=>(<div key={m.id} onClick={()=>{setMod(m.id);setMobOpen(false);}} style={{display:"flex",gap:10,alignItems:"center",padding:"12px 20px",cursor:"pointer",background:mod===m.id?G.goldDim:"transparent",borderLeft:`2px solid ${mod===m.id?G.gold:"transparent"}`,color:mod===m.id?G.gold:G.creamDim,fontSize:13,marginBottom:2}}><span style={{fontSize:16}}>{m.icon}</span><span>{m.label}</span></div>))}<div style={{padding:"16px 20px",borderTop:`1px solid ${G.border}`,marginTop:16}}><button onClick={logout} style={{...sBtn(G),width:"100%",fontSize:12}}>Cerrar sesión</button></div></div></div>)}
      <div style={{display:"flex",flex:1,overflow:"hidden"}}>
        <aside className="sd" style={{width:220,background:sbg,borderRight:`1px solid ${G.border}`,padding:"24px 0",display:"flex",flexDirection:"column",position:"sticky",top:0,height:"100vh",backdropFilter:"blur(20px)"}}>
          <div style={{padding:"0 20px 24px",borderBottom:`1px solid ${G.border}`}}><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:G.gold,fontWeight:600,letterSpacing:1}}>Chef OS</div><div style={{fontSize:10,color:G.subtext,letterSpacing:2,marginTop:3}}>SISTEMA OPERATIVO</div></div>
          <div style={{flex:1,paddingTop:16}}>{MODULES.map(m=>(<div key={m.id} onClick={()=>setMod(m.id)} style={{display:"flex",gap:10,alignItems:"center",padding:"11px 20px",cursor:"pointer",transition:"all 0.2s",background:mod===m.id?G.goldDim:"transparent",borderLeft:`2px solid ${mod===m.id?G.gold:"transparent"}`,color:mod===m.id?G.gold:G.creamDim,fontSize:13,fontWeight:mod===m.id?500:400,marginBottom:2}}><span style={{fontSize:16}}>{m.icon}</span><span>{m.label}</span></div>))}</div>
          <div style={{padding:"16px 20px",borderTop:`1px solid ${G.border}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><span style={{fontSize:10,color:G.subtext,letterSpacing:1}}>MODO</span><button onClick={()=>setTheme(t=>t==="dark"?"light":"dark")} style={{background:G.goldDim,border:`1px solid ${G.border}`,color:G.gold,padding:"4px 10px",borderRadius:6,fontSize:12}}>{theme==="dark"?"☀️":"🌙"}</button></div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}><div style={{width:30,height:30,borderRadius:"50%",background:G.goldDim,border:`1px solid ${G.gold}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>👨‍🍳</div><div><div style={{fontSize:12,color:G.text,fontWeight:500}}>{user.nombre} {user.apellido}</div><div style={{fontSize:10,color:G.subtext,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:110}}>{user.email}</div></div></div>
            <button onClick={logout} style={{...sBtn(G),width:"100%",fontSize:12,padding:"8px"}}>Cerrar sesión</button>
          </div>
        </aside>
        <main className="main-p" style={{flex:1,overflow:"auto",padding:"40px"}}>
          {mod==="perfil"&&perfil&&<ModPerfil G={G} user={user} perfil={perfil} onSave={setPerfil}/>}
          {mod==="crm"&&<ModCRM G={G} user={user}/>}
          {mod==="booking"&&<ModBooking G={G} user={user}/>}
          {mod==="ia"&&<ModIA G={G} user={user}/>}
          {mod==="biblioteca"&&<ModBiblioteca G={G}/>}
        </main>
      </div>
    </div>
  );
}

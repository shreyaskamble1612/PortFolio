import { useState, useEffect, useRef, useCallback } from "react";

const NAV_LINKS = ["home", "about", "services", "work", "contact"];

const SERVICES = [
  { icon: "⚡", title: "Full-Stack Development", desc: "End-to-end web apps with React, Next.js, Spring Boot & Node.js — built for scale and speed." },
  { icon: "🤖", title: "AI / ML Integration", desc: "RAG pipelines, Gemini Vision, LLM-powered features woven seamlessly into production apps." },
  { icon: "☁️", title: "Cloud & DevOps", desc: "AWS deployments, Docker containerization, CI/CD pipelines and Linux system administration." },
  { icon: "🎨", title: "UI/UX Engineering", desc: "Pixel-perfect, animated interfaces that convert — Tailwind, Framer Motion & custom CSS." },
  { icon: "🔗", title: "Real-Time Systems", desc: "WebRTC video, Socket.IO events, live dashboards and bi-directional data streaming." },
  { icon: "🛡️", title: "Backend Architecture", desc: "RESTful APIs, microservices, JWT auth, role-based access and optimized database schemas." },
];

const PROJECTS = [
  {
    num: "01", title: "HealthConnect", cat: "Telemedicine · AI · WebRTC",
    desc: "Real-time telemedicine with WebRTC video, AI medical chatbot (RAG), and automated WhatsApp scheduling via Twilio.",
    stack: ["Next.js","WebRTC","Socket.IO","FastAPI","ChromaDB","AWS"],
    stat: "20+ concurrent sessions · 90% AI accuracy",
    color: "#00D4FF", img: "🏥",
  },
  {
    num: "02", title: "ExpenSync", cat: "Finance · Gemini AI · Analytics",
    desc: "Gemini AI receipt scanner, automated recurring transactions via cron jobs, real-time analytics dashboard.",
    stack: ["Next.js","PostgreSQL","Gemini AI","Prisma","Inngest"],
    stat: "1K+ records · 85% OCR accuracy",
    color: "#FFB347", img: "💸",
  },
  {
    num: "03", title: "Inventory Manager", cat: "Full-Stack · Spring Boot · JWT",
    desc: "Multi-user inventory system with role-based access, live search and real-time quantity management.",
    stack: ["React.js","Spring Boot","MongoDB","JWT"],
    stat: "16+ APIs · Role-based auth · Live tracking",
    color: "#B39DFF", img: "📦",
  },
];



/* ── Particle canvas ── */
function Particles() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let W = window.innerWidth, H = window.innerHeight;
    canvas.width = W; canvas.height = H;
    const pts = Array.from({length:80},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4,r:Math.random()*1.8+.4,a:Math.random()*.45+.1}));
    let mx=W/2,my=H/2;
    const mm=e=>{mx=e.clientX;my=e.clientY;};
    window.addEventListener("mousemove",mm);
    let raf;
    const draw=()=>{
      raf=requestAnimationFrame(draw);
      ctx.clearRect(0,0,W,H);
      pts.forEach((p,i)=>{
        pts.slice(i+1).forEach(q=>{const dx=p.x-q.x,dy=p.y-q.y,d=Math.sqrt(dx*dx+dy*dy);if(d<130){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.strokeStyle=`rgba(0,212,255,${.12*(1-d/130)})`;ctx.lineWidth=.5;ctx.stroke();}});
        const dx=p.x-mx,dy=p.y-my,d=Math.sqrt(dx*dx+dy*dy);
        if(d<100){p.vx+=dx/d*.07;p.vy+=dy/d*.07;}
        p.x+=p.vx;p.y+=p.vy;p.vx*=.99;p.vy*=.99;
        if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(0,212,255,${p.a})`;ctx.fill();
      });
    };
    draw();
    const onR=()=>{W=window.innerWidth;H=window.innerHeight;canvas.width=W;canvas.height=H;};
    window.addEventListener("resize",onR);
    return()=>{cancelAnimationFrame(raf);window.removeEventListener("mousemove",mm);window.removeEventListener("resize",onR);};
  },[]);
  return <canvas ref={ref} style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none"}}/>;
}

/* ── Rotating badge ── */
function RotatingBadge({text="VIEW MY WORK • VIEW MY WORK • ",size=128,onClick}){
  return(
    <div onClick={onClick} style={{width:size,height:size,position:"relative",cursor:"pointer",animation:"spin 12s linear infinite",flexShrink:0}}>
      <svg viewBox={`0 0 ${size} ${size}`} style={{width:size,height:size}}>
        <defs><path id="cbadge" d={`M ${size/2},${size/2} m -${size/2-12},0 a ${size/2-12},${size/2-12} 0 1,1 ${size-24},0 a ${size/2-12},${size/2-12} 0 1,1 -${size-24},0`}/></defs>
        <text fill="#00D4FF" fontSize="9" fontFamily="'Orbitron',sans-serif" letterSpacing="2.8"><textPath href="#cbadge">{text}</textPath></text>
      </svg>
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",animation:"spin-rev 12s linear infinite"}}>
        <div style={{width:46,height:46,borderRadius:"50%",background:"linear-gradient(135deg,#00D4FF,#00F5C4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,color:"#050914",boxShadow:"0 0 30px rgba(0,212,255,.6)",fontWeight:900}}>↗</div>
      </div>
    </div>
  );
}

/* ── Custom cursor ── */
function Cursor(){
  const dot=useRef(null),ring=useRef(null),pos=useRef({x:-100,y:-100}),rp=useRef({x:-100,y:-100});
  const [big,setBig]=useState(false);
  useEffect(()=>{
    const mm=e=>{pos.current={x:e.clientX,y:e.clientY};};
    const mo=e=>{if(e.target.matches("a,button,input,textarea,[data-hover]"))setBig(true);};
    const ml=()=>setBig(false);
    window.addEventListener("mousemove",mm);window.addEventListener("mouseover",mo);window.addEventListener("mouseout",ml);
    let raf;
    const tick=()=>{raf=requestAnimationFrame(tick);rp.current.x+=(pos.current.x-rp.current.x)*.1;rp.current.y+=(pos.current.y-rp.current.y)*.1;if(dot.current){dot.current.style.left=pos.current.x+"px";dot.current.style.top=pos.current.y+"px";}if(ring.current){ring.current.style.left=rp.current.x+"px";ring.current.style.top=rp.current.y+"px";}};
    tick();
    return()=>{window.removeEventListener("mousemove",mm);window.removeEventListener("mouseover",mo);window.removeEventListener("mouseout",ml);cancelAnimationFrame(raf);};
  },[]);
  return(<>
    <div ref={dot} style={{position:"fixed",width:7,height:7,borderRadius:"50%",background:"#00D4FF",transform:"translate(-50%,-50%)",pointerEvents:"none",zIndex:9999,boxShadow:"0 0 12px #00D4FF"}}/>
    <div ref={ring} style={{position:"fixed",width:big?52:38,height:big?52:38,borderRadius:"50%",border:`1.5px solid rgba(0,212,255,${big?.9:.5})`,transform:"translate(-50%,-50%)",pointerEvents:"none",zIndex:9999,transition:"width .3s,height .3s",background:big?"rgba(0,212,255,.07)":"transparent"}}/>
  </>);
}

/* ── Nav ── */
function Nav({active,setActive,scrollTo}){
  const [scrolled,setScrolled]=useState(false);
  useEffect(()=>{const h=()=>setScrolled(window.scrollY>50);window.addEventListener("scroll",h);return()=>window.removeEventListener("scroll",h);},[]);
  return(
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:200,height:70,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 clamp(16px,4vw,56px)",background:scrolled?"rgba(5,9,20,.88)":"transparent",backdropFilter:scrolled?"blur(24px)":"none",borderBottom:scrolled?"1px solid rgba(255,255,255,.05)":"none",transition:"all .4s"}}>
      <div onClick={()=>scrollTo("home")} style={{fontFamily:"'Orbitron',sans-serif",fontSize:26,fontWeight:900,color:"#fff",letterSpacing:4,cursor:"pointer",textShadow:"0 0 30px rgba(0,212,255,.4)"}}>SK<span style={{color:"#00D4FF"}}>.</span></div>
      <div style={{display:"flex",gap:2}}>
        {NAV_LINKS.map(l=>(
          <button key={l} onClick={()=>{setActive(l);scrollTo(l);}} style={{background:"none",border:"none",cursor:"pointer",fontFamily:"'Orbitron',sans-serif",fontSize:8,letterSpacing:2,textTransform:"capitalize",color:active===l?"#00D4FF":"rgba(255,255,255,.4)",padding:"8px 14px",borderRadius:4,transition:"color .2s",position:"relative"}}>
            {l}{active===l&&<span style={{position:"absolute",bottom:2,left:"50%",transform:"translateX(-50%)",width:4,height:4,borderRadius:"50%",background:"#00D4FF",display:"block"}}/>}
          </button>
        ))}
      </div>
      <a href="mailto:shreyaskamble6671@gmail.com" style={{fontFamily:"'Orbitron',sans-serif",fontSize:9,letterSpacing:2,color:"#050914",background:"linear-gradient(135deg,#00D4FF,#00F5C4)",padding:"10px 22px",borderRadius:4,textDecoration:"none",fontWeight:700,boxShadow:"0 0 24px rgba(0,212,255,.4)",transition:"all .2s"}}
        onMouseEnter={e=>{e.target.style.boxShadow="0 0 44px rgba(0,212,255,.8)";e.target.style.transform="translateY(-2px)";}}
        onMouseLeave={e=>{e.target.style.boxShadow="0 0 24px rgba(0,212,255,.4)";e.target.style.transform="";}}>
        HIRE ME
      </a>
    </nav>
  );
}

/* ── Social sidebar ── */
function Socials(){
  return(
    <div style={{position:"fixed",left:20,bottom:0,zIndex:100,display:"flex",flexDirection:"column",alignItems:"center",gap:18}}>
      {[["GH","https://github.com/shreyaskamble1612"],["IN","https://www.linkedin.com/in/shreyas-kamble-aa465922a/"],["{ }","#"],["✉","mailto:shreyaskamble6671@gmail.com"]].map(([icon,href])=>(
        <a key={icon} href={href} target="_blank" rel="noreferrer" style={{fontFamily:"'Orbitron',sans-serif",fontSize:9,color:"rgba(255,255,255,.28)",textDecoration:"none",transition:"color .2s,transform .2s"}}
          onMouseEnter={e=>{e.target.style.color="#00D4FF";e.target.style.transform="translateX(3px)";}}
          onMouseLeave={e=>{e.target.style.color="rgba(255,255,255,.28)";e.target.style.transform="";}}>
          {icon}
        </a>
      ))}
      <div style={{width:1,height:72,background:"linear-gradient(180deg,rgba(0,212,255,.4),transparent)"}}/>
    </div>
  );
}

/* ── Section wrapper ── */
function Section({id,children,bg=false}){
  const [vis,setVis]=useState(id==="home");
  const ref=useRef(null);
  useEffect(()=>{
    if(id==="home")return;
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting)setVis(true);},{threshold:.08});
    if(ref.current)obs.observe(ref.current);
    return()=>obs.disconnect();
  },[id]);
  return(
    <section id={id} ref={ref} style={{minHeight:id==="home"?"100vh":"auto",padding:id==="home"?"0":"96px clamp(20px,6vw,100px)",position:"relative",zIndex:10,background:bg?"rgba(0,5,15,.55)":"transparent",opacity:vis?1:0,transform:vis?"none":"translateY(40px)",transition:"opacity .9s ease,transform .9s ease"}}>
      {children}
    </section>
  );
}

/* ── Section heading ── */
function Heading({eyebrow,title,accent}){
  return(
    <div style={{textAlign:"center",marginBottom:68}}>
      <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:9,color:"#00D4FF",letterSpacing:5,marginBottom:14}}>{eyebrow}</div>
      <h2 style={{fontFamily:"'Orbitron',sans-serif",fontSize:"clamp(26px,4.5vw,54px)",fontWeight:900,color:"#fff",letterSpacing:3,margin:0,lineHeight:1.1}}>
        {title} <span style={{color:"#00D4FF"}}>{accent}</span>
      </h2>
      <div style={{width:56,height:2,background:"linear-gradient(90deg,transparent,#00D4FF,transparent)",margin:"18px auto 0"}}/>
    </div>
  );
}

/* ══════════════════════════════════════════
   HOME
══════════════════════════════════════════ */
function Home({scrollTo,setActive}){
  const [typed,setTyped]=useState("");
  const [idx,setIdx]=useState(0);
  const [del,setDel]=useState(false);
  const roles=["Full-Stack Developer","Spring Boot Engineer","Next.js Architect","AI / ML Integrator","Open Source Lead"];
  useEffect(()=>{
    const cur=roles[idx%roles.length];
    const t=setTimeout(()=>{
      if(!del){if(typed.length<cur.length)setTyped(cur.slice(0,typed.length+1));else setTimeout(()=>setDel(true),2000);}
      else{if(typed.length>0)setTyped(typed.slice(0,-1));else{setDel(false);setIdx(i=>i+1);}}
    },del?28:58);
    return()=>clearTimeout(t);
  },[typed,del,idx]);

  return(
    <Section id="home">
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",padding:"0 clamp(20px,8vw,130px)",position:"relative"}}>
        {/* top-left decorative blob — mirrors reference site */}
        <div style={{position:"absolute",top:-80,left:-80,width:500,height:500,background:"radial-gradient(ellipse at top left,rgba(0,212,255,.16) 0%,rgba(0,80,160,.06) 45%,transparent 70%)",filter:"blur(48px)",pointerEvents:"none",borderRadius:"50%"}}/>
        <div style={{position:"absolute",top:40,left:20,width:260,height:260,border:"1px solid rgba(0,212,255,.07)",borderRadius:"50%",pointerEvents:"none"}}/>
        <div style={{position:"absolute",top:80,left:60,width:170,height:170,border:"1px solid rgba(0,212,255,.05)",borderRadius:"50%",pointerEvents:"none"}}/>

        {/* LEFT text */}
        <div style={{flex:1,maxWidth:580,zIndex:2}}>
          <div style={{animation:"up .8s ease .1s both"}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:10,marginBottom:28,background:"rgba(0,212,255,.05)",border:"1px solid rgba(0,212,255,.16)",borderRadius:30,padding:"7px 20px"}}>
              <span style={{width:7,height:7,borderRadius:"50%",background:"#00F5C4",boxShadow:"0 0 12px #00F5C4",display:"block",animation:"pulse 2s ease-in-out infinite"}}/>
              <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:8,color:"#00F5C4",letterSpacing:3}}>AVAILABLE FOR HIRE</span>
            </div>
          </div>

          <div style={{animation:"up .8s ease .2s both"}}>
            <h1 style={{fontFamily:"'Orbitron',sans-serif",fontSize:"clamp(38px,6vw,84px)",fontWeight:900,color:"#fff",lineHeight:1.06,letterSpacing:2,margin:"0 0 14px",textShadow:"0 0 60px rgba(0,212,255,.12)"}}>
              Transforming<br/><span style={{color:"#00D4FF"}}>Ideas</span> Into<br/>Digital Reality
            </h1>
          </div>

          <div style={{animation:"up .8s ease .32s both",marginBottom:24,display:"flex",alignItems:"center",gap:10}}>
            <span style={{color:"#00D4FF",fontSize:10}}>◈</span>
            <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:"clamp(9px,1.1vw,12px)",color:"rgba(255,255,255,.38)",letterSpacing:3}}>
              {typed}<span style={{color:"#00D4FF",animation:"blink .9s step-end infinite"}}>|</span>
            </span>
          </div>

          <p style={{fontFamily:"'Exo 2',sans-serif",fontSize:15,lineHeight:1.95,color:"rgba(180,205,230,.68)",maxWidth:480,marginBottom:44,animation:"up .8s ease .44s both",borderLeft:"2px solid rgba(0,212,255,.18)",paddingLeft:18}}>
            Final-year IT student at <span style={{color:"#00D4FF"}}>Walchand College of Engineering, Sangli</span>. Building production-grade apps with real-time systems, AI integrations, and cloud-native architectures.
          </p>

          <div style={{display:"flex",gap:14,flexWrap:"wrap",animation:"up .8s ease .54s both"}}>
            <button onClick={()=>{setActive("work");scrollTo("work");}} style={{fontFamily:"'Orbitron',sans-serif",fontSize:9,letterSpacing:2,color:"#050914",background:"linear-gradient(135deg,#00D4FF,#00F5C4)",border:"none",padding:"14px 32px",borderRadius:4,fontWeight:700,boxShadow:"0 0 40px rgba(0,212,255,.45)",cursor:"pointer",transition:"all .25s"}}
              onMouseEnter={e=>{e.target.style.transform="translateY(-3px)";e.target.style.boxShadow="0 0 65px rgba(0,212,255,.75)";}}
              onMouseLeave={e=>{e.target.style.transform="";e.target.style.boxShadow="0 0 40px rgba(0,212,255,.45)";}}>
              VIEW MY WORK
            </button>
            <button onClick={()=>{setActive("contact");scrollTo("contact");}} style={{fontFamily:"'Orbitron',sans-serif",fontSize:9,letterSpacing:2,color:"rgba(255,255,255,.65)",background:"transparent",border:"1px solid rgba(255,255,255,.11)",padding:"14px 32px",borderRadius:4,cursor:"pointer",transition:"all .25s",backdropFilter:"blur(10px)"}}
              onMouseEnter={e=>{e.target.style.borderColor="rgba(0,212,255,.4)";e.target.style.color="#00D4FF";}}
              onMouseLeave={e=>{e.target.style.borderColor="rgba(255,255,255,.11)";e.target.style.color="rgba(255,255,255,.65)";}}>
              CONTACT ME
            </button>
          </div>

          <div style={{display:"flex",gap:36,marginTop:56,paddingTop:28,borderTop:"1px solid rgba(255,255,255,.05)",animation:"up .8s ease .65s both"}}>
            {[["500+","LeetCode"],["3+","Projects"],["1K+","Students"],["2★","CodeChef"]].map(([v,l])=>(
              <div key={l}>
                <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:"clamp(18px,2.5vw,30px)",fontWeight:900,color:"#fff",textShadow:"0 0 18px rgba(0,212,255,.3)"}}>{v}</div>
                <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:7,color:"rgba(255,255,255,.22)",letterSpacing:2,marginTop:4}}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — avatar */}
        <div style={{position:"absolute",right:"clamp(24px,7vw,110px)",bottom:0,display:"flex",flexDirection:"column",alignItems:"center",animation:"up .9s ease .28s both"}}>
          {/* Rotating badge top-right of card */}
          <div style={{position:"absolute",top:50,right:-22,zIndex:5}}>
            <RotatingBadge size={118} onClick={()=>{setActive("work");scrollTo("work");}}/>
          </div>

          {/* Avatar card */}
          <div style={{position:"relative"}}>
            <div style={{position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",width:340,height:300,background:"radial-gradient(ellipse at bottom,rgba(0,212,255,.22) 0%,transparent 70%)",filter:"blur(32px)",pointerEvents:"none"}}/>
            <div style={{width:270,height:390,background:"linear-gradient(155deg,rgba(0,28,58,.92) 0%,rgba(0,8,24,.96) 100%)",border:"1px solid rgba(0,212,255,.14)",borderRadius:"130px 130px 0 0",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end",position:"relative",overflow:"hidden",boxShadow:"0 0 80px rgba(0,212,255,.1),inset 0 1px 0 rgba(0,212,255,.1)"}}>
              <div style={{position:"absolute",top:-50,left:"50%",transform:"translateX(-50%)",width:220,height:220,background:"radial-gradient(circle,rgba(0,212,255,.12) 0%,transparent 70%)"}}/>
              <div style={{fontSize:118,lineHeight:1,filter:"drop-shadow(0 0 28px rgba(0,212,255,.38))"}}>🧑‍💻</div>
              <div style={{width:"100%",background:"rgba(0,212,255,.07)",borderTop:"1px solid rgba(0,212,255,.11)",padding:"14px",textAlign:"center"}}>
                <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:12,fontWeight:700,color:"#fff",letterSpacing:2}}>SHREYAS KAMBLE</div>
                <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:7,color:"#00D4FF",letterSpacing:2,marginTop:3}}>WCE SANGLI · IT</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{position:"absolute",bottom:26,left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:8,animation:"float 2.5s ease-in-out infinite"}}>
          <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:7,color:"rgba(0,212,255,.32)",letterSpacing:3}}>SCROLL</span>
          <div style={{width:1,height:38,background:"linear-gradient(180deg,rgba(0,212,255,.45),transparent)"}}/>
        </div>
      </div>
    </Section>
  );
}

/* ══════════════════════════════════════════
   ABOUT
══════════════════════════════════════════ */
function About(){
  return(
    <Section id="about">
      <Heading eyebrow="// WHO I AM" title="About" accent="Me"/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:72,alignItems:"center",maxWidth:1080,margin:"0 auto"}}>
        {/* Card */}
        <div style={{position:"relative"}}>
          <div style={{background:"rgba(0,8,22,.8)",backdropFilter:"blur(28px)",border:"1px solid rgba(0,212,255,.11)",borderRadius:22,padding:"44px 36px",boxShadow:"0 30px 80px rgba(0,0,0,.55),0 0 60px rgba(0,212,255,.05)",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:-60,right:-60,width:180,height:180,borderRadius:"50%",background:"radial-gradient(circle,rgba(0,212,255,.09),transparent 70%)",pointerEvents:"none"}}/>
            <div style={{position:"absolute",top:0,left:0,width:3,height:"100%",background:"linear-gradient(180deg,#00D4FF,transparent)",borderRadius:3}}/>
            <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:9,color:"#00D4FF",letterSpacing:3,marginBottom:20,paddingLeft:14}}>PROFILE</div>
            <div style={{paddingLeft:14}}>
              {[["Name","Shreyas Kamble"],["Role","Full-Stack Developer"],["College","WCE Sangli (IT, Final Year)"],["Email","shreyaskamble6671@gmail.com"],["Phone","+91 8767206376"],["Status","✅ Open to Opportunities"]].map(([k,v])=>(
                <div key={k} style={{display:"flex",gap:16,marginBottom:14,borderBottom:"1px solid rgba(255,255,255,.04)",paddingBottom:12}}>
                  <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:7,color:"rgba(255,255,255,.28)",letterSpacing:2,minWidth:60,paddingTop:2}}>{k}</div>
                  <div style={{fontFamily:"'Exo 2',sans-serif",fontSize:13.5,color:"rgba(200,225,245,.83)"}}>{v}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{position:"absolute",bottom:-18,right:-18,background:"linear-gradient(135deg,#00D4FF,#00F5C4)",borderRadius:14,padding:"15px 22px",textAlign:"center",boxShadow:"0 0 40px rgba(0,212,255,.5)"}}>
            <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:26,fontWeight:900,color:"#050914"}}>3+</div>
            <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:7,color:"#050914",letterSpacing:1,marginTop:2}}>PROJECTS</div>
          </div>
        </div>
        {/* Text */}
        <div>
          <h3 style={{fontFamily:"'Orbitron',sans-serif",fontSize:"clamp(20px,2.8vw,34px)",fontWeight:900,color:"#fff",letterSpacing:2,marginBottom:22,lineHeight:1.2}}>Building the <span style={{color:"#00D4FF"}}>future</span><br/>one commit at a time</h3>
          <p style={{fontFamily:"'Exo 2',sans-serif",fontSize:14.5,lineHeight:1.95,color:"rgba(180,205,230,.7)",marginBottom:16}}>Final-year IT student at Walchand College of Engineering, Sangli — passionate about high-performance, scalable web applications.</p>
          <p style={{fontFamily:"'Exo 2',sans-serif",fontSize:14.5,lineHeight:1.95,color:"rgba(180,205,230,.7)",marginBottom:30}}>From real-time telemedicine with WebRTC to AI-powered expense trackers with Gemini Vision — I bring ideas to production with clean architecture and beautiful UIs.</p>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {[{org:"Walchand Linux Users' Group",role:"Technical Lead — Open Source",color:"#00D4FF"},{org:"Student Association of IT (SAIT)",role:"Web Developer",color:"#B39DFF"}].map(item=>(
              <div key={item.org} style={{display:"flex",gap:14,alignItems:"center",background:"rgba(0,8,22,.7)",border:"1px solid rgba(255,255,255,.05)",borderRadius:10,padding:"14px 16px",transition:"all .25s"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=item.color+"33";e.currentTarget.style.transform="translateX(4px)";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,.05)";e.currentTarget.style.transform="";}}>
                <div style={{width:3,height:34,background:item.color,borderRadius:2,flexShrink:0,boxShadow:`0 0 10px ${item.color}`}}/>
                <div>
                  <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:9,fontWeight:700,color:"#fff",letterSpacing:1}}>{item.role}</div>
                  <div style={{fontFamily:"'Exo 2',sans-serif",fontSize:12,color:item.color,marginTop:3}}>{item.org}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ══════════════════════════════════════════
   SERVICES
══════════════════════════════════════════ */
function Services(){
  return(
    <Section id="services" bg>
      <Heading eyebrow="// WHAT I DO" title="My" accent="Services"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(295px,1fr))",gap:18,maxWidth:1080,margin:"0 auto"}}>
        {SERVICES.map((s,i)=>(
          <div key={s.title} style={{background:"rgba(0,8,22,.8)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,.06)",borderRadius:16,padding:"32px 26px",position:"relative",overflow:"hidden",transition:"all .3s",cursor:"default"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(0,212,255,.28)";e.currentTarget.style.transform="translateY(-8px)";e.currentTarget.style.boxShadow="0 24px 60px rgba(0,0,0,.65),0 0 48px rgba(0,212,255,.09)";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,.06)";e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}>
            <div style={{position:"absolute",top:0,right:0,fontFamily:"'Orbitron',sans-serif",fontSize:58,fontWeight:900,color:"rgba(0,212,255,.04)",lineHeight:1,padding:"6px 12px"}}>0{i+1}</div>
            <div style={{fontSize:34,marginBottom:18}}>{s.icon}</div>
            <h3 style={{fontFamily:"'Orbitron',sans-serif",fontSize:12,fontWeight:700,color:"#fff",letterSpacing:1,marginBottom:12,lineHeight:1.4}}>{s.title}</h3>
            <p style={{fontFamily:"'Exo 2',sans-serif",fontSize:13.5,color:"rgba(180,205,230,.63)",lineHeight:1.82}}>{s.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ══════════════════════════════════════════
   WORK
══════════════════════════════════════════ */
function Work(){
  const [sel,setSel]=useState(0);
  const p=PROJECTS[sel];
  return(
    <Section id="work">
      <Heading eyebrow="// SELECTED WORKS" title="Featured" accent="Projects"/>
      <div style={{maxWidth:1080,margin:"0 auto",display:"grid",gridTemplateColumns:"260px 1fr",gap:28}}>
        {/* List */}
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {PROJECTS.map((proj,i)=>(
            <button key={proj.title} onClick={()=>setSel(i)} style={{background:sel===i?"rgba(0,212,255,.08)":"rgba(0,8,22,.7)",border:`1px solid ${sel===i?"rgba(0,212,255,.28)":"rgba(255,255,255,.05)"}`,borderRadius:12,padding:"18px",cursor:"pointer",textAlign:"left",transition:"all .25s",display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:42,height:42,borderRadius:10,fontSize:20,display:"flex",alignItems:"center",justifyContent:"center",background:`${proj.color}10`,border:`1px solid ${proj.color}26`,flexShrink:0}}>{proj.img}</div>
              <div style={{flex:1}}>
                <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:10,fontWeight:700,color:sel===i?"#fff":"rgba(255,255,255,.44)",letterSpacing:1}}>{proj.title}</div>
                <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:7,color:sel===i?proj.color:"rgba(255,255,255,.2)",marginTop:4,letterSpacing:1}}>{proj.num}</div>
              </div>
              {sel===i&&<span style={{color:"#00D4FF",fontSize:14}}>→</span>}
            </button>
          ))}
        </div>
        {/* Detail */}
        <div key={p.title} style={{background:"rgba(0,8,22,.88)",backdropFilter:"blur(28px)",border:`1px solid ${p.color}1A`,borderRadius:20,overflow:"hidden",animation:"fadeIn .4s ease",boxShadow:`0 30px 80px rgba(0,0,0,.65),0 0 60px ${p.color}08`}}>
          <div style={{height:3,background:`linear-gradient(90deg,${p.color},${p.color}44,transparent)`}}/>
          <div style={{height:190,display:"flex",alignItems:"center",justifyContent:"center",background:`linear-gradient(135deg,${p.color}07 0%,transparent 100%)`,position:"relative",borderBottom:"1px solid rgba(255,255,255,.04)"}}>
            <div style={{fontSize:88,filter:`drop-shadow(0 0 36px ${p.color}55)`}}>{p.img}</div>
            <div style={{position:"absolute",top:14,right:18,fontFamily:"'Orbitron',sans-serif",fontSize:38,fontWeight:900,color:`${p.color}0F`,letterSpacing:2}}>{p.num}</div>
          </div>
          <div style={{padding:"28px 34px"}}>
            <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:7,color:p.color,letterSpacing:3,marginBottom:9}}>{p.cat}</div>
            <h3 style={{fontFamily:"'Orbitron',sans-serif",fontSize:24,fontWeight:900,color:"#fff",letterSpacing:2,marginBottom:14}}>{p.title}</h3>
            <p style={{fontFamily:"'Exo 2',sans-serif",fontSize:13.5,lineHeight:1.85,color:"rgba(180,205,230,.7)",marginBottom:22}}>{p.desc}</p>
            <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:8,color:p.color,background:`${p.color}09`,border:`1px solid ${p.color}1E`,borderRadius:7,padding:"9px 14px",marginBottom:22,letterSpacing:1}}>{p.stat}</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
              {p.stack.map(s=><span key={s} style={{fontFamily:"'Orbitron',sans-serif",fontSize:7,letterSpacing:1,padding:"4px 12px",borderRadius:20,border:`1px solid ${p.color}26`,color:p.color,background:`${p.color}07`}}>{s}</span>)}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ══════════════════════════════════════════
   SKILLS MARQUEE
══════════════════════════════════════════ */
function SkillsMarquee(){
  const sk=["Java","JavaScript","React.js","Next.js","Spring Boot","Node.js","FastAPI","PostgreSQL","MongoDB","AWS","Docker","WebRTC","Gemini AI","RAG","Tailwind","Socket.IO","ChromaDB","JWT","Prisma","Linux"];
  return(
    <div style={{padding:"44px 0",overflow:"hidden",position:"relative",zIndex:10,borderTop:"1px solid rgba(255,255,255,.04)",borderBottom:"1px solid rgba(255,255,255,.04)",background:"rgba(0,5,15,.6)"}}>
      <div style={{display:"flex",animation:"marquee 24s linear infinite",gap:44,width:"max-content"}}>
        {[...sk,...sk].map((s,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:14,flexShrink:0}}>
            <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:12,fontWeight:700,color:"rgba(255,255,255,.13)",letterSpacing:3,whiteSpace:"nowrap"}}>{s}</span>
            <span style={{color:"#00D4FF",opacity:.25,fontSize:7}}>◆</span>
          </div>
        ))}
      </div>
    </div>
  );
}


/* ══════════════════════════════════════════
   CONTACT
══════════════════════════════════════════ */
function Contact(){
  const [sent,setSent]=useState(false);
  const [sending,setSending]=useState(false);
  const [error,setError]=useState("");
  const [form,setForm]=useState({name:"",email:"",msg:""});
  const inp={width:"100%",background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.08)",borderRadius:8,padding:"13px 15px",fontFamily:"'Exo 2',sans-serif",fontSize:14,color:"#fff",outline:"none",transition:"border-color .2s"};

  const handleSubmit=async(e)=>{
    e.preventDefault();
    if(sending) return;

    setError("");
    setSending(true);
    try{
      const res=await fetch("https://formsubmit.co/ajax/shreyaskamble6671@gmail.com",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          Accept:"application/json"
        },
        body:JSON.stringify({
          name:form.name,
          email:form.email,
          message:form.msg,
          _subject:"New portfolio contact message",
          _captcha:"false",
          _template:"table"
        })
      });

      const data=await res.json();
      if(!res.ok || data?.success!=="true"){
        throw new Error(data?.message || "Failed to send message");
      }

      setSent(true);
      setForm({name:"",email:"",msg:""});
    }catch(err){
      setError("Message could not be sent. Please try again or email me directly at shreyaskamble6671@gmail.com.");
    }finally{
      setSending(false);
    }
  };

  return(
    <Section id="contact">
      <Heading eyebrow="// GET IN TOUCH" title="Contact" accent="Me"/>
      <div style={{maxWidth:980,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:44}}>
        {/* Info */}
        <div>
          <h3 style={{fontFamily:"'Orbitron',sans-serif",fontSize:"clamp(18px,2.5vw,30px)",fontWeight:900,color:"#fff",letterSpacing:2,marginBottom:20,lineHeight:1.2}}>Let's Work <span style={{color:"#00D4FF"}}>Together</span></h3>
          <p style={{fontFamily:"'Exo 2',sans-serif",fontSize:14.5,lineHeight:1.95,color:"rgba(180,205,230,.67)",marginBottom:32}}>Actively seeking internships, full-time roles, and exciting collaborations. Drop a message and I'll get back within 24 hours.</p>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {[["📧","Email","shreyaskamble6671@gmail.com"],["📱","Phone","+91 8767206376"],["📍","Location","Sangli, Maharashtra, India"]].map(([ic,l,v])=>(
              <div key={l} style={{display:"flex",alignItems:"center",gap:14,background:"rgba(0,8,22,.7)",border:"1px solid rgba(255,255,255,.05)",borderRadius:10,padding:"14px 18px"}}>
                <span style={{fontSize:18}}>{ic}</span>
                <div>
                  <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:7,color:"rgba(255,255,255,.26)",letterSpacing:2}}>{l}</div>
                  <div style={{fontFamily:"'Exo 2',sans-serif",fontSize:13.5,color:"rgba(200,225,245,.82)",marginTop:3}}>{v}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Form */}
        <div style={{background:"rgba(0,8,22,.88)",backdropFilter:"blur(28px)",border:"1px solid rgba(0,212,255,.09)",borderRadius:20,padding:"38px 32px",boxShadow:"0 28px 80px rgba(0,0,0,.55)"}}>
          {sent?(
            <div style={{textAlign:"center",padding:"56px 0"}}>
              <div style={{fontSize:56,marginBottom:18}}>✅</div>
              <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:13,color:"#00F5C4",letterSpacing:2,marginBottom:10}}>MESSAGE SENT!</div>
              <div style={{fontFamily:"'Exo 2',sans-serif",fontSize:13.5,color:"rgba(180,205,230,.62)"}}>I'll reply within 24 hours.</div>
            </div>
          ):(
            <form onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column",gap:16}}>
              {[{k:"name",l:"YOUR NAME",ph:"Shreyas Kamble"},{k:"email",l:"YOUR EMAIL",ph:"hello@example.com"}].map(f=>(
                <div key={f.k}>
                  <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:7,color:"rgba(255,255,255,.26)",letterSpacing:2,marginBottom:7}}>{f.l}</div>
                  <input type={f.k==="email"?"email":"text"} required value={form[f.k]} onChange={e=>setForm(p=>({...p,[f.k]:e.target.value}))} placeholder={f.ph} style={inp}
                    onFocus={e=>e.target.style.borderColor="rgba(0,212,255,.4)"}
                    onBlur={e=>e.target.style.borderColor="rgba(255,255,255,.08)"}/>
                </div>
              ))}
              <div>
                <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:7,color:"rgba(255,255,255,.26)",letterSpacing:2,marginBottom:7}}>MESSAGE</div>
                <textarea required value={form.msg} onChange={e=>setForm(p=>({...p,msg:e.target.value}))} placeholder="Tell me about your project..." rows={4} style={{...inp,resize:"vertical"}}
                  onFocus={e=>e.target.style.borderColor="rgba(0,212,255,.4)"}
                  onBlur={e=>e.target.style.borderColor="rgba(255,255,255,.08)"}/>
              </div>
              {error&&<div style={{fontFamily:"'Exo 2',sans-serif",fontSize:12.5,color:"#ff7c7c",lineHeight:1.5}}>{error}</div>}
              <button type="submit" disabled={sending} style={{fontFamily:"'Orbitron',sans-serif",fontSize:9,letterSpacing:2,fontWeight:700,color:"#050914",background:"linear-gradient(135deg,#00D4FF,#00F5C4)",border:"none",padding:"15px",borderRadius:8,cursor:sending?"not-allowed":"pointer",opacity:sending?.72:1,boxShadow:"0 0 38px rgba(0,212,255,.4)",transition:"all .25s"}}
                onMouseEnter={e=>{e.target.style.boxShadow="0 0 62px rgba(0,212,255,.75)";e.target.style.transform="translateY(-2px)";}}
                onMouseLeave={e=>{e.target.style.boxShadow="0 0 38px rgba(0,212,255,.4)";e.target.style.transform="";}}>
                {sending?"SENDING...":"SEND MESSAGE ✉"}
              </button>
            </form>
          )}
        </div>
      </div>
      <div style={{textAlign:"center",marginTop:72,paddingTop:28,borderTop:"1px solid rgba(255,255,255,.04)"}}>
        <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:7,color:"rgba(255,255,255,.13)",letterSpacing:3}}>© 2025 SHREYAS KAMBLE · WALCHAND COLLEGE OF ENGINEERING, SANGLI</div>
      </div>
    </Section>
  );
}

/* ══════════════════════════════════════════
   ROOT
══════════════════════════════════════════ */
export default function Portfolio(){
  const [nav,setNav]=useState("home");
  const scrollTo=useCallback(id=>{const el=document.getElementById(id);if(el)el.scrollIntoView({behavior:"smooth"});},[]);

  useEffect(()=>{
    const h=()=>{for(let i=NAV_LINKS.length-1;i>=0;i--){const el=document.getElementById(NAV_LINKS[i]);if(el&&window.scrollY>=el.offsetTop-130){setNav(NAV_LINKS[i]);break;}}};
    window.addEventListener("scroll",h,{passive:true});
    return()=>window.removeEventListener("scroll",h);
  },[]);

  return(<>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:ital,wght@0,300;0,400;0,500;1,400&display=swap');
      *{box-sizing:border-box;margin:0;padding:0;}
      html{scroll-behavior:smooth;}
      body{background:#050914;cursor:none;overflow-x:hidden;}
      a,button,input,textarea{cursor:none;}
      input::placeholder,textarea::placeholder{color:rgba(255,255,255,.18);}
      ::-webkit-scrollbar{width:2px;}
      ::-webkit-scrollbar-track{background:#050914;}
      ::-webkit-scrollbar-thumb{background:rgba(0,212,255,.22);border-radius:2px;}
      ::selection{background:rgba(0,212,255,.18);color:#fff;}
      @keyframes up{from{opacity:0;transform:translateY(28px);}to{opacity:1;transform:none;}}
      @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
      @keyframes float{0%,100%{transform:translateX(-50%) translateY(0);}50%{transform:translateX(-50%) translateY(-9px);}}
      @keyframes blink{0%,100%{opacity:1;}50%{opacity:0;}}
      @keyframes pulse{0%,100%{box-shadow:0 0 12px #00F5C4,0 0 28px #00F5C488;}50%{box-shadow:0 0 22px #00F5C4,0 0 50px #00F5C4AA;}}
      @keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
      @keyframes spin-rev{from{transform:rotate(0deg);}to{transform:rotate(-360deg);}}
      @keyframes marquee{from{transform:translateX(0);}to{transform:translateX(-50%);}}
    `}</style>

    <div style={{position:"fixed",inset:0,zIndex:0,background:"radial-gradient(ellipse at 18% 18%,rgba(0,28,58,.75) 0%,#050914 58%)"}}/>
    <Particles/>
    <Cursor/>
    <div style={{position:"fixed",inset:0,zIndex:1,pointerEvents:"none",background:"radial-gradient(ellipse 80% 80% at 50% 50%,transparent 48%,rgba(5,9,20,.5) 100%)"}}/>
    <Socials/>
    <Nav active={nav} setActive={setNav} scrollTo={scrollTo}/>
    <div style={{position:"relative",zIndex:10}}>
      <Home scrollTo={scrollTo} setActive={setNav}/>
      <About/>
      <Services/>
      <Work/>
      <SkillsMarquee/>
      <Contact/>
    </div>
  </>);
}
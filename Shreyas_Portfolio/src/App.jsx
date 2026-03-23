import { useState, useEffect, useRef, useCallback } from "react";

const C = {
  bg: "#03070D",
  card: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.08)",
  cyan: "#63D2FF",
  teal: "#00F5C4",
  amber: "#FFB347",
  rose: "#FF6B9D",
  lavender: "#B39DFF",
  text: "#D4E5F7",
  muted: "#5C7A92",
  white: "#FFFFFF",
};

const SKILLS = [
  { cat: "Languages", items: ["Java", "JavaScript", "C", "C++", "SQL"], color: C.cyan },
  {
    cat: "Backend",
    items: ["Spring Boot", "Node.js", "Express.js", "FastAPI", "REST APIs", "Microservices"],
    color: C.teal,
  },
  { cat: "Frontend", items: ["React.js", "Next.js", "Tailwind CSS", "HTML", "CSS"], color: C.lavender },
  { cat: "Databases", items: ["MongoDB", "PostgreSQL", "ChromaDB", "Prisma ORM"], color: C.amber },
  { cat: "DevOps/Cloud", items: ["AWS", "Docker", "Git", "GitHub", "Linux"], color: C.rose },
  {
    cat: "AI / ML",
    items: ["Gemini AI", "Together AI", "RAG Pipeline", "Inngest", "WebRTC", "Socket.IO"],
    color: C.teal,
  },
];

const PROJECTS = [
  {
    id: "health",
    title: "HealthConnect",
    tag: "Telemedicine Platform",
    emoji: "🏥",
    color: C.cyan,
    grad: "linear-gradient(135deg,#63D2FF22,#00F5C420)",
    stack: ["Next.js", "Node.js", "WebRTC", "Socket.IO", "FastAPI", "ChromaDB", "AWS"],
    metrics: [
      { val: "20+", label: "Concurrent video sessions" },
      { val: "~90%", label: "AI chatbot intent accuracy" },
      { val: "200+", label: "Monthly bookings automated" },
    ],
    desc: "Scalable telemedicine platform with real-time video via WebRTC, AI medical chatbot (RAG pipeline) at sub-2s latency, and automated WhatsApp appointment workflows via Twilio.",
  },
  {
    id: "expen",
    title: "ExpenSync",
    tag: "Expense Management",
    emoji: "💸",
    color: C.amber,
    grad: "linear-gradient(135deg,#FFB34722,#FF6B9D15)",
    stack: ["Next.js", "PostgreSQL", "Prisma", "Gemini AI", "Inngest"],
    metrics: [
      { val: "1K+", label: "Expense records" },
      { val: "~85%", label: "OCR extraction accuracy" },
      { val: "-40%", label: "Query latency reduced" },
    ],
    desc: "Full-stack expense tracker with Gemini AI receipt scanning, automated recurring transactions via cron jobs, and real-time analytics dashboards.",
  },
  {
    id: "inv",
    title: "Inventory Manager",
    tag: "Inventory System",
    emoji: "📦",
    color: C.lavender,
    grad: "linear-gradient(135deg,#B39DFF22,#63D2FF15)",
    stack: ["React.js", "Spring Boot", "MongoDB", "JWT"],
    metrics: [
      { val: "16+", label: "RESTful APIs built" },
      { val: "RBAC", label: "Role-based JWT auth" },
      { val: "Live", label: "Real-time inventory" },
    ],
    desc: "Full-stack inventory system with role-based JWT auth, live search, and real-time quantity tracking for secure multi-user environments.",
  },
];

function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setVisible(true);
    }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, visible];
}

function Particles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext("2d");
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    const pts = Array.from({ length: 65 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.4 + 0.3,
      a: Math.random() * 0.6 + 0.2,
    }));

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      pts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99,210,255,${p.a * 0.45})`;
        ctx.fill();
      });

      for (let i = 0; i < pts.length; i += 1) {
        for (let j = i + 1; j < pts.length; j += 1) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d = Math.hypot(dx, dy);
          if (d < 130) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(99,210,255,${(1 - d / 130) * 0.1})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />;
}

function Aurora() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: "80vw",
          height: "80vw",
          borderRadius: "50%",
          top: "-30%",
          left: "-20%",
          background: "radial-gradient(ellipse,rgba(99,210,255,0.07) 0%,transparent 70%)",
          animation: "auroraA 18s ease-in-out infinite alternate",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "70vw",
          height: "70vw",
          borderRadius: "50%",
          bottom: "-20%",
          right: "-15%",
          background: "radial-gradient(ellipse,rgba(0,245,196,0.055) 0%,transparent 70%)",
          animation: "auroraB 22s ease-in-out infinite alternate",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "50vw",
          height: "50vw",
          borderRadius: "50%",
          top: "40%",
          left: "40%",
          background: "radial-gradient(ellipse,rgba(179,157,255,0.045) 0%,transparent 70%)",
          animation: "auroraC 15s ease-in-out infinite alternate",
        }}
      />
    </div>
  );
}

function TiltCard({ children, style, intensity = 8, ...rest }) {
  const ref = useRef(null);

  const onMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) translateZ(10px)`;
  }, [intensity]);

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(900px) rotateY(0) rotateX(0) translateZ(0)";
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transition: "transform 0.15s ease", willChange: "transform", ...style }}
      {...rest}
    >
      {children}
    </div>
  );
}

function Typed({ strings, speed = 55, pause = 1800 }) {
  const [display, setDisplay] = useState("");
  const [si, setSi] = useState(0);
  const [del, setDel] = useState(false);

  useEffect(() => {
    const cur = strings[si % strings.length];
    const t = setTimeout(() => {
      if (!del) {
        if (display.length < cur.length) setDisplay(cur.slice(0, display.length + 1));
        else setTimeout(() => setDel(true), pause);
      } else if (display.length > 0) {
        setDisplay(display.slice(0, -1));
      } else {
        setDel(false);
        setSi((s) => s + 1);
      }
    }, del ? speed / 2 : speed);

    return () => clearTimeout(t);
  }, [display, del, si, strings, speed, pause]);

  return (
    <span>
      {display}
      <span style={{ color: C.cyan, animation: "blink 1s step-end infinite" }}>▋</span>
    </span>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: "0 clamp(20px,5vw,80px)",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: scrolled ? "rgba(3,7,13,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.border}` : "none",
        transition: "all 0.4s ease",
      }}
    >
      <div
        style={{
          fontFamily: "'Bebas Neue',cursive",
          fontSize: 22,
          letterSpacing: 4,
          color: C.cyan,
          textShadow: `0 0 20px ${C.cyan}66`,
        }}
      >
        SHREYAS.DEV
      </div>
      <div style={{ display: "flex", gap: 36 }}>
        {[
          ["About", "#about"],
          ["Skills", "#skills"],
          ["Projects", "#projects"],
          ["Contact", "#contact"],
        ].map(([l, h]) => (
          <a
            key={l}
            href={h}
            style={{
              fontFamily: "'DM Mono',monospace",
              fontSize: 12,
              color: C.muted,
              textDecoration: "none",
              letterSpacing: 1,
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = C.cyan;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = C.muted;
            }}
          >
            {l}
          </a>
        ))}
      </div>
      <a
        href="mailto:shreyaskamble6671@gmail.com"
        style={{
          fontFamily: "'DM Mono',monospace",
          fontSize: 11,
          fontWeight: 700,
          color: C.bg,
          background: `linear-gradient(135deg,${C.cyan},${C.teal})`,
          padding: "7px 20px",
          borderRadius: 5,
          textDecoration: "none",
          letterSpacing: 1,
          boxShadow: `0 0 24px ${C.cyan}55`,
          transition: "box-shadow 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = `0 0 40px ${C.cyan}99`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = `0 0 24px ${C.cyan}55`;
        }}
      >
        HIRE ME
      </a>
    </nav>
  );
}

function Heading({ eyebrow, title, sub }) {
  const [ref, vis] = useInView();

  return (
    <div
      ref={ref}
      style={{
        textAlign: "center",
        marginBottom: 64,
        opacity: vis ? 1 : 0,
        transform: vis ? "none" : "translateY(30px)",
        transition: "all 0.7s ease",
      }}
    >
      <div
        style={{
          display: "inline-block",
          fontFamily: "'DM Mono',monospace",
          fontSize: 11,
          color: C.cyan,
          letterSpacing: 3,
          textTransform: "uppercase",
          border: `1px solid ${C.cyan}40`,
          borderRadius: 20,
          padding: "5px 18px",
          marginBottom: 18,
          background: `${C.cyan}0A`,
        }}
      >
        {eyebrow}
      </div>
      <h2
        style={{
          fontFamily: "'Bebas Neue',cursive",
          fontSize: "clamp(40px,6vw,72px)",
          color: C.white,
          letterSpacing: 2,
          margin: "0 0 16px",
          lineHeight: 1,
        }}
      >
        {title}
      </h2>
      {sub && <p style={{ color: C.muted, fontSize: 15, maxWidth: 480, margin: "0 auto", lineHeight: 1.8 }}>{sub}</p>}
    </div>
  );
}

function Pill({ label, color }) {
  const [h, setH] = useState(false);

  return (
    <span
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        fontFamily: "'DM Mono',monospace",
        fontSize: 11,
        padding: "4px 12px",
        borderRadius: 20,
        border: `1px solid ${h ? color : C.border}`,
        color: h ? color : C.muted,
        background: h ? `${color}14` : "transparent",
        transition: "all 0.2s",
        cursor: "default",
        letterSpacing: 0.5,
      }}
    >
      {label}
    </span>
  );
}

function Hero() {
  return (
    <section
      id="about"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        padding: "80px clamp(20px,5vw,80px) 60px",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: "4%",
          top: "12%",
          width: "min(520px,48vw)",
          height: "min(520px,48vw)",
          borderRadius: "50%",
          border: `1px solid ${C.cyan}12`,
          boxShadow: `0 0 80px ${C.cyan}05`,
          animation: "spinSlow 35s linear infinite",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: "7%",
          top: "15%",
          width: "min(400px,37vw)",
          height: "min(400px,37vw)",
          borderRadius: "50%",
          border: `1px dashed ${C.teal}16`,
          animation: "spinSlow 22s linear infinite reverse",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: "10%",
          top: "18%",
          width: "min(280px,26vw)",
          height: "min(280px,26vw)",
          borderRadius: "50%",
          border: `1px solid ${C.lavender}10`,
          animation: "spinSlow 14s linear infinite",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 700, position: "relative", zIndex: 1 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 9,
            background: `${C.teal}12`,
            border: `1px solid ${C.teal}28`,
            borderRadius: 30,
            padding: "7px 18px",
            marginBottom: 32,
            animation: "fadeUp 0.6s ease 0.1s both",
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: C.teal,
              boxShadow: `0 0 10px ${C.teal}`,
            }}
          />
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: C.teal, letterSpacing: 1.5 }}>
            AVAILABLE FOR OPPORTUNITIES
          </span>
        </div>

        <h1
          style={{
            fontFamily: "'Bebas Neue',cursive",
            fontSize: "clamp(60px,10vw,120px)",
            color: C.white,
            lineHeight: 0.9,
            letterSpacing: 2,
            margin: "0 0 10px",
            animation: "fadeUp 0.6s ease 0.2s both",
          }}
        >
          SHREYAS
          <br />
          <span style={{ WebkitTextStroke: `2px ${C.cyan}`, color: "transparent", filter: `drop-shadow(0 0 30px ${C.cyan}44)` }}>
            KAMBLE
          </span>
        </h1>

        <div
          style={{
            fontFamily: "'DM Mono',monospace",
            fontSize: "clamp(14px,1.4vw,17px)",
            color: C.muted,
            marginBottom: 28,
            minHeight: 30,
            animation: "fadeUp 0.6s ease 0.35s both",
          }}
        >
          <span style={{ color: C.cyan }}>$ </span>
          <Typed
            strings={["Full-Stack Developer", "Spring Boot Engineer", "Next.js Builder", "Open Source Lead", "AI/ML Integrator"]}
          />
        </div>

        <p style={{ fontSize: 16, lineHeight: 1.9, color: C.text, maxWidth: 560, marginBottom: 40, animation: "fadeUp 0.6s ease 0.45s both" }}>
          Final-year IT student at <span style={{ color: C.cyan }}>Walchand College of Engineering, Sangli</span>. I build
          production-grade apps - telemedicine with real-time video, AI-powered finance tools, and scalable backend systems.
          Technical Lead at WLUG, 500+ LeetCode problems solved.
        </p>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", animation: "fadeUp 0.6s ease 0.55s both" }}>
          <a
            href="#projects"
            style={{
              fontFamily: "'DM Mono',monospace",
              fontSize: 13,
              fontWeight: 700,
              color: C.bg,
              background: `linear-gradient(135deg,${C.cyan},${C.teal})`,
              padding: "13px 30px",
              borderRadius: 6,
              textDecoration: "none",
              letterSpacing: 1,
              boxShadow: `0 0 32px ${C.cyan}44`,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `0 0 50px ${C.cyan}88`;
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = `0 0 32px ${C.cyan}44`;
              e.currentTarget.style.transform = "";
            }}
          >
            VIEW PROJECTS -&gt;
          </a>
          <a
            href="https://linkedin.com/in/shreyaskamble"
            target="_blank"
            rel="noreferrer"
            style={{
              fontFamily: "'DM Mono',monospace",
              fontSize: 13,
              color: C.text,
              border: `1px solid ${C.border}`,
              padding: "13px 30px",
              borderRadius: 6,
              textDecoration: "none",
              letterSpacing: 1,
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(10px)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = C.cyan;
              e.currentTarget.style.color = C.cyan;
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = C.border;
              e.currentTarget.style.color = C.text;
              e.currentTarget.style.transform = "";
            }}
          >
            LINKEDIN ↗
          </a>
          <a
            href="https://github.com/shreyaskamble1612"
            target="_blank"
            rel="noreferrer"
            style={{
              fontFamily: "'DM Mono',monospace",
              fontSize: 13,
              color: C.text,
              border: `1px solid ${C.border}`,
              padding: "13px 30px",
              borderRadius: 6,
              textDecoration: "none",
              letterSpacing: 1,
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(10px)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = C.lavender;
              e.currentTarget.style.color = C.lavender;
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = C.border;
              e.currentTarget.style.color = C.text;
              e.currentTarget.style.transform = "";
            }}
          >
            GITHUB ↗
          </a>
        </div>

        <div
          style={{
            display: "flex",
            gap: 0,
            marginTop: 56,
            borderTop: `1px solid ${C.border}`,
            paddingTop: 36,
            animation: "fadeUp 0.6s ease 0.65s both",
          }}
        >
          {[
            { val: "500+", label: "LeetCode" },
            { val: "3+", label: "Projects" },
            { val: "1K+", label: "Workshops" },
            { val: "2★", label: "CodeChef" },
          ].map(({ val, label }, i) => (
            <div key={label} style={{ flex: 1, textAlign: "center", borderRight: i < 3 ? `1px solid ${C.border}` : "none", padding: "0 16px" }}>
              <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 40, color: C.white, letterSpacing: 1, lineHeight: 1, textShadow: `0 0 30px ${C.cyan}33` }}>
                {val}
              </div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: C.muted, marginTop: 5, letterSpacing: 1.5 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Skills() {
  const [ref, vis] = useInView();

  return (
    <section id="skills" style={{ padding: "100px clamp(20px,5vw,80px)" }}>
      <Heading eyebrow="What I work with" title="TECHNICAL SKILLS" />
      <div ref={ref} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
        {SKILLS.map(({ cat, items, color }, i) => (
          <TiltCard
            key={cat}
            style={{
              background: C.card,
              backdropFilter: "blur(16px)",
              border: `1px solid ${C.border}`,
              borderRadius: 16,
              padding: "28px 28px 24px",
              overflow: "hidden",
              position: "relative",
              boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
              opacity: vis ? 1 : 0,
              transform: vis ? "none" : "translateY(32px)",
              transition: `all 0.6s ease ${i * 0.07}s`,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -50,
                right: -50,
                width: 130,
                height: 130,
                borderRadius: "50%",
                background: `radial-gradient(circle,${color}18,transparent 70%)`,
                pointerEvents: "none",
              }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div
                style={{
                  width: 3,
                  height: 22,
                  borderRadius: 2,
                  background: `linear-gradient(180deg,${color},${color}44)`,
                  boxShadow: `0 0 12px ${color}88`,
                }}
              />
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color, letterSpacing: 2, textTransform: "uppercase" }}>{cat}</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {items.map((item) => (
                <Pill key={item} label={item} color={color} />
              ))}
            </div>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project: p, index }) {
  const [ref, vis] = useInView(0.1);
  const [hov, setHov] = useState(false);

  return (
    <div
      ref={ref}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "none" : "translateY(50px)",
        transition: `all 0.7s ease ${index * 0.12}s`,
      }}
    >
      <TiltCard
        intensity={4}
        style={{
          background: C.card,
          backdropFilter: "blur(20px)",
          border: `1px solid ${hov ? `${p.color}44` : C.border}`,
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: hov ? `0 24px 70px rgba(0,0,0,0.7),0 0 70px ${p.color}18` : "0 8px 40px rgba(0,0,0,0.5)",
          transition: "border-color 0.3s,box-shadow 0.3s",
        }}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
      >
        <div style={{ height: 3, background: `linear-gradient(90deg,${p.color},${p.color}44,transparent)` }} />

        <div data-proj-grid style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          <div style={{ padding: "36px 36px", borderRight: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  background: p.grad,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                  border: `1px solid ${p.color}28`,
                  boxShadow: `0 0 24px ${p.color}22`,
                }}
              >
                {p.emoji}
              </div>
              <div>
                <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 28, color: C.white, letterSpacing: 1, lineHeight: 1 }}>{p.title}</div>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: p.color, marginTop: 4, letterSpacing: 1 }}>{p.tag}</div>
              </div>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: C.text, marginBottom: 24 }}>{p.desc}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {p.stack.map((s) => (
                <Pill key={s} label={s} color={p.color} />
              ))}
            </div>
          </div>

          <div style={{ padding: "36px 32px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 18 }}>
            {p.metrics.map(({ val, label }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  padding: "16px 20px",
                  borderRadius: 12,
                  background: `${p.color}08`,
                  border: `1px solid ${p.color}18`,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `${p.color}12`;
                  e.currentTarget.style.borderColor = `${p.color}35`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `${p.color}08`;
                  e.currentTarget.style.borderColor = `${p.color}18`;
                }}
              >
                <div
                  style={{
                    fontFamily: "'Bebas Neue',cursive",
                    fontSize: 38,
                    color: p.color,
                    letterSpacing: 1,
                    lineHeight: 1,
                    minWidth: 72,
                    textAlign: "center",
                    textShadow: `0 0 24px ${p.color}88`,
                  }}
                >
                  {val}
                </div>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: C.text, letterSpacing: 0.5, lineHeight: 1.5 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </TiltCard>
    </div>
  );
}

function Projects() {
  return (
    <section id="projects" style={{ padding: "100px clamp(20px,5vw,80px)" }}>
      <Heading eyebrow="What I've built" title="FEATURED PROJECTS" />
      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}

function Experience() {
  const items = [
    {
      role: "Technical Lead - Open Source & Linux",
      org: "Walchand Linux Users' Group",
      period: "2022 - Present",
      color: C.cyan,
      points: [
        "Led Linux & open-source workshops for 1,000+ participants across 5+ events",
        "Coordinated technical event logistics, speaker sessions, and hands-on labs",
      ],
    },
    {
      role: "Web Developer",
      org: "Student Association of IT (SAIT)",
      period: "2022 - Present",
      color: C.lavender,
      points: [
        "Optimized official site wcesait.in for performance & uptime reliability",
        "Built 3+ event registration platforms, doubling prior-year participation registrations",
      ],
    },
  ];

  return (
    <section style={{ padding: "60px clamp(20px,5vw,80px) 100px" }}>
      <Heading eyebrow="Where I've led" title="EXPERIENCE & LEADERSHIP" />
      <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 820, margin: "0 auto" }}>
        {items.map((item, i) => {
          const [ref, vis] = useInView();
          return (
            <TiltCard
              key={item.role}
              intensity={3}
              style={{
                background: C.card,
                backdropFilter: "blur(16px)",
                border: `1px solid ${C.border}`,
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
                opacity: vis ? 1 : 0,
                transform: vis ? "none" : "translateY(30px)",
                transition: `all 0.6s ease ${i * 0.15}s`,
              }}
            >
              <div ref={ref} style={{ display: "flex" }}>
                <div style={{ width: 3, flexShrink: 0, background: `linear-gradient(180deg,${item.color},${item.color}22)` }} />
                <div style={{ padding: "28px 32px", flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      gap: 10,
                      marginBottom: 16,
                    }}
                  >
                    <div>
                      <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 22, color: C.white, letterSpacing: 1 }}>{item.role}</div>
                      <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: item.color, marginTop: 4, letterSpacing: 1 }}>{item.org}</div>
                    </div>
                    <div
                      style={{
                        fontFamily: "'DM Mono',monospace",
                        fontSize: 11,
                        color: C.muted,
                        border: `1px solid ${C.border}`,
                        padding: "4px 14px",
                        borderRadius: 20,
                        letterSpacing: 1,
                      }}
                    >
                      {item.period}
                    </div>
                  </div>
                  {item.points.map((pt) => (
                    <div key={pt} style={{ display: "flex", gap: 12, fontSize: 14, color: C.text, marginBottom: 8, lineHeight: 1.7 }}>
                      <span style={{ color: item.color, flexShrink: 0, marginTop: 2 }}>◈</span>
                      {pt}
                    </div>
                  ))}
                </div>
              </div>
            </TiltCard>
          );
        })}
      </div>
    </section>
  );
}

function CompetitiveProgramming() {
  const [ref, vis] = useInView();
  const items = [
    { platform: "LeetCode", val: "500+", sub: "Problems solved", color: "#FFA116", icon: "⚡" },
    { platform: "CodeChef", val: "2★", sub: "Rating 1552", color: C.amber, icon: "👨‍🍳" },
    { platform: "GitHub", val: "Active", sub: "Public repos", color: C.lavender, icon: "🐙" },
  ];

  return (
    <section style={{ padding: "0 clamp(20px,5vw,80px) 80px" }}>
      <Heading eyebrow="Competitive Programming" title="CODING PROFILES" />
      <div ref={ref} style={{ display: "flex", gap: 20, flexWrap: "wrap", maxWidth: 820, margin: "0 auto" }}>
        {items.map(({ platform, val, sub, color, icon }, i) => (
          <TiltCard
            key={platform}
            intensity={6}
            style={{
              flex: "1 1 220px",
              background: C.card,
              backdropFilter: "blur(16px)",
              border: `1px solid ${C.border}`,
              borderRadius: 16,
              padding: "24px 28px",
              display: "flex",
              alignItems: "center",
              gap: 20,
              boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
              position: "relative",
              overflow: "hidden",
              opacity: vis ? 1 : 0,
              transform: vis ? "none" : "translateY(30px)",
              transition: `all 0.6s ease ${i * 0.1}s`,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -30,
                right: -30,
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: `radial-gradient(circle,${color}15,transparent 70%)`,
                pointerEvents: "none",
              }}
            />
            <span style={{ fontSize: 32 }}>{icon}</span>
            <div>
              <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 40, color: C.white, letterSpacing: 1, lineHeight: 1, textShadow: `0 0 20px ${color}44` }}>{val}</div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color, letterSpacing: 1.5, marginTop: 2 }}>{platform}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>{sub}</div>
            </div>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  const [ref, vis] = useInView();

  return (
    <section id="contact" style={{ padding: "80px clamp(20px,5vw,80px) 80px" }}>
      <div
        ref={ref}
        style={{
          maxWidth: 740,
          margin: "0 auto",
          textAlign: "center",
          opacity: vis ? 1 : 0,
          transform: vis ? "none" : "translateY(40px)",
          transition: "all 0.8s ease",
        }}
      >
        <TiltCard
          intensity={3}
          style={{
            background: C.card,
            backdropFilter: "blur(24px)",
            border: `1px solid ${C.border}`,
            borderRadius: 24,
            padding: "64px 48px",
            position: "relative",
            overflow: "hidden",
            boxShadow: `0 0 120px ${C.cyan}0C,0 40px 80px rgba(0,0,0,0.7)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -80,
              left: "50%",
              transform: "translateX(-50%)",
              width: 400,
              height: 200,
              background: `radial-gradient(ellipse,${C.cyan}16,transparent 70%)`,
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -60,
              right: -60,
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: `radial-gradient(circle,${C.teal}10,transparent 70%)`,
              pointerEvents: "none",
            }}
          />

          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: C.cyan, letterSpacing: 3, marginBottom: 16, position: "relative" }}>
            // LET'S BUILD SOMETHING TOGETHER
          </div>
          <h2
            style={{
              fontFamily: "'Bebas Neue',cursive",
              fontSize: "clamp(42px,6vw,76px)",
              color: C.white,
              letterSpacing: 2,
              margin: "0 0 18px",
              lineHeight: 1,
              position: "relative",
            }}
          >
            GET IN TOUCH
          </h2>
          <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.8, maxWidth: 440, margin: "0 auto 40px", position: "relative" }}>
            I'm actively looking for new opportunities - internships, full-time roles, or freelance projects. My inbox is
            always open.
          </p>
          <a
            href="mailto:shreyaskamble6671@gmail.com"
            style={{
              display: "inline-block",
              fontFamily: "'DM Mono',monospace",
              fontSize: 14,
              fontWeight: 700,
              color: C.bg,
              background: `linear-gradient(135deg,${C.cyan},${C.teal})`,
              padding: "15px 38px",
              borderRadius: 8,
              textDecoration: "none",
              letterSpacing: 1,
              boxShadow: `0 0 40px ${C.cyan}55`,
              transition: "all 0.2s",
              position: "relative",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `0 0 60px ${C.cyan}99`;
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = `0 0 40px ${C.cyan}55`;
              e.currentTarget.style.transform = "";
            }}
          >
            shreyaskamble6671@gmail.com ✉
          </a>

          <div style={{ display: "flex", justifyContent: "center", gap: 36, marginTop: 36, flexWrap: "wrap", position: "relative" }}>
            {[
              { label: "+91 8767206376", href: "tel:+918767206376", external: false },
              { label: "LinkedIn", href: "https://linkedin.com/in/shreyaskamble", external: true },
              { label: "GitHub", href: "https://github.com/shreyaskamble1612", external: true },
            ].map(({ label, href, external }) => (
              <a
                key={label}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
                style={{
                  fontFamily: "'DM Mono',monospace",
                  fontSize: 12,
                  color: C.muted,
                  textDecoration: "none",
                  letterSpacing: 0.5,
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = C.cyan;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = C.muted;
                }}
              >
                {label}
              </a>
            ))}
          </div>
        </TiltCard>
      </div>

      <div
        style={{
          textAlign: "center",
          marginTop: 52,
          fontFamily: "'DM Mono',monospace",
          fontSize: 11,
          color: C.muted,
          letterSpacing: 1.5,
        }}
      >
        © 2025 SHREYAS KAMBLE - WALCHAND COLLEGE OF ENGINEERING, SANGLI
      </div>
    </section>
  );
}

export default function Portfolio() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        body{background:${C.bg};}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-track{background:${C.bg};}
        ::-webkit-scrollbar-thumb{background:${C.cyan}44;border-radius:2px;}
        ::selection{background:${C.cyan}33;color:${C.white};}

        @keyframes fadeUp{from{opacity:0;transform:translateY(26px);}to{opacity:1;transform:translateY(0);}}
        @keyframes blink{0%,100%{opacity:1;}50%{opacity:0;}}
        @keyframes spinSlow{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
        @keyframes auroraA{0%{transform:translate(0,0) scale(1);}100%{transform:translate(6%,6%) scale(1.12);}}
        @keyframes auroraB{0%{transform:translate(0,0) scale(1);}100%{transform:translate(-6%,-4%) scale(1.18);}}
        @keyframes auroraC{0%{transform:translate(0,0) scale(1);}100%{transform:translate(-9%,6%) scale(0.88);}}

        @media(max-width:980px){
          nav > div:nth-child(2){gap:18px!important;}
        }

        @media(max-width:880px){
          [data-proj-grid]{grid-template-columns:1fr!important;}
          [data-proj-grid] > div:first-child{border-right:none!important;border-bottom:1px solid ${C.border};}
        }

        @media(max-width:760px){
          nav{height:auto!important;padding-top:12px!important;padding-bottom:12px!important;align-items:flex-start!important;gap:12px!important;flex-wrap:wrap!important;}
          nav > div:nth-child(2){width:100%;justify-content:flex-start;overflow-x:auto;white-space:nowrap;}
        }

        @media(max-width:680px){
          section{scroll-margin-top:90px;}
        }
      `}</style>

      <div style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: "'DM Sans',sans-serif", position: "relative" }}>
        <Aurora />
        <Particles />
        <div style={{ position: "relative", zIndex: 1 }}>
          <Nav />
          <Hero />
          <Skills />
          <Projects />
          <Experience />
          <CompetitiveProgramming />
          <Contact />
        </div>
      </div>
    </>
  );
}

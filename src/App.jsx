import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import Lenis from 'lenis';
import './index.css';

// 1. Custom Cursor Component
const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e) => {
      if (
        e.target.tagName.toLowerCase() === 'a' ||
        e.target.tagName.toLowerCase() === 'button' ||
        e.target.closest('.interactive')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <motion.div
      className={`custom-cursor ${isHovering ? 'hover' : ''}`}
      style={{
        translateX: cursorXSpring,
        translateY: cursorYSpring,
      }}
    />
  );
};

// 2. Kinetic Text Component
const MaskText = ({ phrases, delay = 0 }) => {
  const animation = {
    initial: { y: "100%" },
    enter: i => ({ y: "0", transition: { duration: 1, ease: [0.33, 1, 0.68, 1], delay: delay + (i * 0.1) } })
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {phrases.map((phrase, index) => {
        return (
          <div key={index} className="mask-wrap">
            <motion.div custom={index} variants={animation} initial="initial" whileInView="enter" viewport={{ once: true }}>
              {phrase}
            </motion.div>
          </div>
        )
      })}
    </div>
  );
}

// 3. Magnetic Button Component
const MagneticButton = ({ children, href }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width/2);
    const middleY = clientY - (top + height/2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  }

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  }

  return (
    <motion.a 
      href={href}
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className="magnetic-btn interactive"
    >
      <span className="magnetic-btn-text">{children}</span>
    </motion.a>
  )
}

// 4. Parallax Image Component
const ParallaxImage = ({ src, speed = 1 }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <div ref={ref} className="project-img-wrapper interactive">
      <motion.img 
        src={src} 
        style={{ y }} 
        className="project-img" 
      />
    </div>
  );
}

// 5. Terminal Component
const TerminalBlock = () => {
  const commands = [
    { cmd: "whoami", out: "Senior Software Engineer specialized in highly scalable Node/React architectures." },
    { cmd: "ls ./skills", out: "react  next.js  typescript  node.js  express  mongodb  postgresql  redis  docker  aws" },
    { cmd: "cat ./mission.txt", out: "Build resilient, performant, and beautiful software that scales to millions." }
  ];

  return (
    <div className="terminal-window interactive">
      <div className="terminal-header">
        <div className="terminal-dot r"></div>
        <div className="terminal-dot y"></div>
        <div className="terminal-dot g"></div>
      </div>
      <div className="terminal-body">
        {commands.map((c, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.4, duration: 0.5 }}
          >
            <div><span className="term-prompt">~</span><span className="term-cmd">{c.cmd}</span></div>
            <div className="term-output">{c.out}</div>
          </motion.div>
        ))}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: commands.length * 0.4 }}
        >
          <span className="term-prompt">~</span><motion.span 
            animate={{ opacity: [0, 1, 0] }} 
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="term-cmd"
          >_</motion.span>
        </motion.div>
      </div>
    </div>
  );
};

// Main App
function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  const projects = [
    {
      title: "Fintech Platform",
      client: "Enterprise",
      roles: ["React", "Node.js", "Redis"],
      img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop",
      desc: "Architected a highly secure, high-frequency trading dashboard. Implemented complex real-time WebSockets to ensure sub-millisecond data delivery."
    },
    {
      title: "Global E-Comm",
      client: "Retail",
      roles: ["MongoDB", "Express", "React"],
      img: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=2000&auto=format&fit=crop",
      desc: "Engineered a headless commerce solution capable of handling 50k concurrent users during flash sales. Completely decoupled the frontend for maximum performance."
    }
  ];

  const experience = [
    { role: "Senior Engineer", company: "TechNova", year: "2022 - Present", desc: "Leading the core architecture team. Mentoring junior developers and defining the stack for new enterprise products." },
    { role: "Full Stack Dev", company: "WebScale Inc", year: "2019 - 2022", desc: "Built and scaled 3 flagship products from ground zero. Handled DevOps pipelines and database optimization." },
    { role: "Frontend Dev", company: "Creative Studio", year: "2017 - 2019", desc: "Award-winning interactive websites. Focused on WebGL, Framer Motion, and GSAP animations." }
  ];

  const features = [
    { title: "Real-time WebSocket Grid", icon: "⚡", desc: "Engineered a custom React data grid that handles 10,000+ real-time row updates per second without dropping frames using Canvas API." },
    { title: "Custom Auth Service", icon: "🔒", desc: "Built an OAuth2 & JWT based microservice with Redis caching, handling secure sessions and rate-limiting for 1M+ users." },
    { title: "Automated CI/CD", icon: "🚀", desc: "Architected GitHub Actions pipelines with Docker & AWS ECS, cutting deployment time from 20 minutes to under 3 minutes." }
  ];

  const timeline = [
    { step: "Discovery & Arch", desc: "Analyzing requirements, drawing C4 models, and defining API contracts before writing a single line of code." },
    { step: "Development", desc: "Writing clean, type-safe, and self-documenting code in TypeScript, utilizing modern hooks and patterns." },
    { step: "Testing", desc: "Ensuring stability with strict unit tests (Jest) and end-to-end user flows (Cypress/Playwright)." },
    { step: "CI/CD & Deploy", desc: "Automating builds via GitHub Actions/Gitlab CI, containerizing with Docker, and scaling via AWS/Kubernetes." }
  ];

  const skills = [
    "JavaScript (ES6+)", "TypeScript", "React.js", "Next.js", "Node.js", "Express.js", 
    "MongoDB", "PostgreSQL", "Redis", "GraphQL", "REST APIs", "Tailwind CSS",
    "Framer Motion", "GSAP", "Docker", "AWS", "CI/CD", "Jest & Cypress"
  ];

  return (
    <>
      <CustomCursor />
      
      <nav className="nav">
        <div className="nav-logo interactive">Folio.</div>
        <div className="nav-links">
          <a href="#about" className="interactive">About</a>
          <a href="#engineering" className="interactive">Engineering</a>
          <a href="#work" className="interactive">Work</a>
          <a href="#contact" className="interactive">Contact</a>
        </div>
      </nav>

      <main>
        {/* Hero */}
        <section className="section hero">
          <h1 style={{ display: 'flex', flexDirection: 'column' }}>
            <MaskText phrases={["Senior", "Full Stack", "Engineer"]} delay={0.2} />
          </h1>
          <div className="hero-subtitle">
            <MaskText phrases={[
              "Specializing in highly scalable",
              "architectures and premium",
              "digital experiences."
            ]} delay={0.8} />
            <br />
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 1.5, duration: 1 }}
              style={{ marginTop: '2rem' }}
            >
              <MagneticButton href="#work">View Projects</MagneticButton>
            </motion.div>
          </div>
        </section>

        {/* About & Stats */}
        <section id="about" className="section" style={{ paddingBottom: 0 }}>
          <TerminalBlock />
          <div className="spacer-sm"></div>

          <div className="info-grid">
            <div>
              <h3><MaskText phrases={["About Me"]} /></h3>
              <p style={{ marginBottom: '1.5rem', maxWidth: '500px' }}>
                With over 7 years of deep-dive experience, I don't just write code—I engineer solutions. I bridge the gap between heavy-duty backend logic and hyper-smooth frontend interactions. 
              </p>
              <p style={{ maxWidth: '500px' }}>
                My philosophy is simple: technology should be invisible. The user should only feel the speed, reliability, and beauty of the product.
              </p>
            </div>
            
            <div className="info-col-right">
              <div className="stat-box">
                <span className="mono">Years Exp</span>
                <div className="stat-number">07+</div>
              </div>
              <div className="stat-box">
                <span className="mono">GitHub Commits (YTD)</span>
                <div className="stat-number">1,240+</div>
              </div>
            </div>
          </div>

          {/* Experience List */}
          <div className="spacer-sm"></div>
          <h3><MaskText phrases={["Experience"]} /></h3>
          <div className="exp-list">
            {experience.map((exp, i) => (
              <div key={i} className="exp-item interactive">
                <div className="exp-title">{exp.role}</div>
                <div>
                  <span className="mono">{exp.company}</span>
                  <p style={{ fontSize: '1rem', marginTop: '0.25rem' }}>{exp.desc}</p>
                </div>
                <div className="mono">{exp.year}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Engineering Process Section */}
        <section id="engineering" className="section">
          <div className="spacer"></div>
          <h3><MaskText phrases={["Engineering Process"]} /></h3>
          <div className="spacer-sm"></div>
          <div className="timeline">
            {timeline.map((item, i) => (
              <motion.div 
                key={i}
                className={`timeline-item ${i % 2 === 0 ? 'left' : 'right'}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
              >
                <div className="timeline-content interactive">
                  <h4>{item.step}</h4>
                  <p>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features / Micro-Gallery */}
        <section className="section" style={{ paddingBottom: 0 }}>
          <div className="spacer-sm"></div>
          <h3><MaskText phrases={["Engineering Highlights"]} /></h3>
          <p style={{ marginBottom: '3rem', maxWidth: '600px' }}>
            Beyond standard CRUD apps, I focus on solving complex engineering problems at scale.
          </p>
          <div className="features-grid">
            {features.map((feat, i) => (
              <motion.div 
                key={i} 
                className="feature-card interactive"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <div className="feature-icon">{feat.icon}</div>
                <h4>{feat.title}</h4>
                <p>{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="section" style={{ paddingBottom: 0 }}>
          <div className="spacer"></div>
          <h3><MaskText phrases={["Tech Stack"]} /></h3>
          <div className="skills-container">
            {skills.map((skill, i) => (
              <div key={i} className="skill-pill interactive">
                {skill}
              </div>
            ))}
          </div>
        </section>

        {/* Work Section */}
        <section id="work" className="section">
          <div className="spacer"></div>
          <h3><MaskText phrases={["Selected Works"]} /></h3>
          <div className="spacer-sm"></div>
          
          <div className="project-container">
            {projects.map((project, i) => (
              <div key={i} className="project-item">
                <ParallaxImage src={project.img} />
                <div className="project-info">
                  <h2 className="project-title">{project.title}</h2>
                  <div className="project-tags">
                    {project.roles.map(role => (
                      <span key={role} className="tag">{role}</span>
                    ))}
                  </div>
                  <p style={{ marginBottom: '2rem' }}>{project.desc}</p>
                  <MagneticButton href="#">View Source</MagneticButton>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <section id="contact" style={{ paddingBottom: 0 }} className="section">
          <div className="spacer"></div>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: 'clamp(2rem, 5vw, 5rem)' }}>Let's Build It.</h2>
          <div style={{ textAlign: 'center', marginBottom: '10vh' }}>
            <MagneticButton href="mailto:hello@example.com">hello@example.com</MagneticButton>
          </div>
          
          <div className="marquee-container interactive">
            <motion.div 
              className="marquee-inner"
              animate={{ x: [0, -1035] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 10 }}
            >
              AVAILABLE FOR HIRE — AVAILABLE FOR HIRE — AVAILABLE FOR HIRE — 
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}

export default App;

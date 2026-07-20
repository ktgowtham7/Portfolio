import React, { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
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
const MaskText = ({ phrases, delay = 0, className = "" }) => {
  const animation = {
    initial: { y: "100%" },
    enter: i => ({ y: "0", transition: { duration: 1, ease: [0.33, 1, 0.68, 1], delay: delay + (i * 0.1) } })
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {phrases.map((phrase, index) => {
        return (
          <div key={index} style={{ overflow: 'hidden', paddingBottom: '0.1em' }}>
            <motion.div custom={index} variants={animation} initial="initial" whileInView="enter" viewport={{ once: true }} className={className}>
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
      <span>{children}</span>
    </motion.a>
  )
}

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

  const technicalSkills = {
    Languages: "JavaScript (ES6+), TypeScript (familiar), SQL, HTML5, CSS3",
    Frontend: "React.js, Next.js, Tailwind CSS, Bootstrap, Responsive Web Design",
    Backend: "Node.js, Express.js, REST API Design, Prisma ORM, JWT Authentication",
    Databases: "PostgreSQL, MySQL, MongoDB",
    "Tools & Practices": "Git, GitHub, Postman, VS Code, Vercel, Render, Agile/Scrum, Code Review",
    "Also worked with": "WordPress, Shopify, WooCommerce (freelance/client sites)"
  };

  const experience = [
    { 
      role: "Web Developer", 
      company: "RDS Digital, Bengaluru", 
      year: "Nov 2025 - Present", 
      bullets: [
        "Architected and built an enterprise agency-management dashboard (React.js, Node.js, Express.js, PostgreSQL, Prisma ORM) — now spanning 38 relational data models across 22 backend route modules, exposing 100+ REST API endpoints, used daily by the full agency team.",
        "Implemented Role-Based Access Control (RBAC) for 4 user types (Admin, Account Manager, Team Member, Management), eliminating unauthorized data access across every module and reducing manual permission-handling overhead.",
        "Built core business modules — Statement of Work (SOW) tracking, task management, communication logs, meetings, client health scoring, and campaign performance reporting — consolidating workflows previously spread across spreadsheets and email.",
        "Designed a normalized PostgreSQL schema supporting granular tracking entities (asset versioning, annotations, onboarding checklists), keeping the data model scalable as new modules were added without requiring schema rewrites.",
        "Built a reusable React component library and responsive UI layer, cutting development time for new dashboard modules by reusing shared components instead of building from scratch.",
        "Owned project delivery end-to-end — gathering requirements directly from stakeholders, architecting solutions, and deploying to production independently.",
        "Delivered and maintained WordPress and Shopify sites for clients, including performance optimization, security remediation, and migrations."
      ] 
    },
    { 
      role: "WordPress Developer Intern", 
      company: "Amika Softwares, Remote", 
      year: "May 2025 - Jul 2025", 
      bullets: [
        "Customized dynamic WordPress sites using Elementor, custom CSS, and JavaScript, improving responsiveness across desktop, tablet, and mobile.",
        "Diagnosed and resolved layout issues, deprecated PHP warnings, and plugin compatibility problems; configured SSL for secure deployments."
      ] 
    },
  ];

  const projects = [
    {
      title: "Agency Operations & Client Management Dashboard",
      tech: "React.js · Node.js · Express.js · PostgreSQL · Prisma ORM · Tailwind CSS",
      bullets: [
        "Full architecture and schema design for a 38-model relational database supporting client management, SOWs, tasks, and reporting.",
        "Built 22 modular route files exposing 100+ REST endpoints, each supporting full CRUD plus custom actions (health-score calculation, file uploads, annotations).",
        "Designed and implemented RBAC middleware to enforce per-role permissions across all API routes."
      ]
    },
    {
      title: "Visa Consultancy Website — Freelance Client Project",
      tech: "HTML5 · CSS3 · JavaScript · WordPress",
      bullets: [
        "Designed and deployed a responsive business website for a visa consultancy client (SIAM Thai Visa), including navigation structure and cross-device layout, delivered on time as a solo freelance engagement."
      ]
    }
  ];

  const coreCompetencies = [
    "Full-Stack Web Development", "React Development", "Node.js & Express APIs", 
    "SQL & PostgreSQL Database Design", "RBAC & Auth Workflows", "REST API Architecture", 
    "Responsive Web Design", "Website Performance Optimization", "Version Control (Git & GitHub)", 
    "Client Requirement Analysis", "Agile Collaboration", "Problem Solving"
  ];

  return (
    <>
      <CustomCursor />
      
      <nav className="nav">
        <div className="nav-logo interactive">KTG.</div>
        <div className="nav-links">
          <a href="#summary" className="interactive">Summary</a>
          <a href="#experience" className="interactive">Experience</a>
          <a href="#projects" className="interactive">Projects</a>
          <a href="#contact" className="interactive">Contact</a>
        </div>
      </nav>

      <main style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Hero */}
        <section className="section hero" style={{ paddingTop: '25vh' }}>
          <h1>
            <MaskText phrases={["K T GOWTHAM"]} delay={0.2} />
          </h1>
          <h1 className="accent-text" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
            <MaskText phrases={["Full-Stack Developer"]} delay={0.4} />
          </h1>
          <div style={{ marginTop: '2rem', maxWidth: '600px' }}>
            <MaskText className="desc-text" phrases={[
              "React.js & Node.js",
            ]} delay={0.6} />
            <br />
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 1, duration: 0.8 }}
              style={{ marginTop: '1.5rem' }}
            >
              <MagneticButton href="#summary">View Profile</MagneticButton>
            </motion.div>
          </div>
        </section>

        {/* Professional Summary */}
        <section id="summary" className="section glass-panel" style={{ marginTop: '5vh', marginBottom: '5vh', padding: '4rem' }}>
          <h3><MaskText phrases={["Professional Summary"]} /></h3>
          <p className="desc-text" style={{ marginTop: '1.5rem', maxWidth: '900px' }}>
            Full-Stack Developer with hands-on production experience across React.js, Node.js, and PostgreSQL, currently solely responsible for architecting and delivering an enterprise agency-management platform end-to-end — spanning 38 relational data models, 100+ REST API endpoints, and role-based access control for 4 distinct user types. Comfortable owning a feature independently from stakeholder requirements through database design, API implementation, and production deployment. Strong foundation in scalable schema design, REST API architecture, and building reusable frontend systems that speed up delivery across a growing codebase.
          </p>
        </section>

        {/* Technical Skills */}
        <section id="skills" className="section">
          <h3><MaskText phrases={["Technical Skills"]} /></h3>
          <div className="skills-grid" style={{ marginTop: '2rem' }}>
            {Object.entries(technicalSkills).map(([category, skills], i) => (
              <motion.div 
                key={i} 
                className="skill-row glass-panel interactive" 
                style={{ padding: '1.5rem 2rem' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="skill-category">{category}</div>
                <div className="desc-text">{skills}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Professional Experience */}
        <section id="experience" className="section">
          <h3><MaskText phrases={["Professional Experience"]} /></h3>
          <div className="exp-list" style={{ marginTop: '2rem' }}>
            {experience.map((exp, i) => (
              <motion.div 
                key={i} 
                className="exp-item glass-panel interactive"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
              >
                <div className="exp-role-wrap">
                  <div className="exp-role">{exp.role}</div>
                </div>
                <div className="exp-content-wrap">
                  <span className="exp-company">{exp.company}</span>
                  <ul className="exp-bullets desc-text">
                    {exp.bullets.map((bullet, idx) => (
                      <li key={idx}>{bullet}</li>
                    ))}
                  </ul>
                </div>
                <div className="exp-year-wrap">
                  <span className="exp-year">{exp.year}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="section">
          <h3><MaskText phrases={["Projects"]} /></h3>
          <div className="project-container" style={{ marginTop: '2rem' }}>
            {projects.map((project, i) => (
              <motion.div 
                key={i} 
                className="glass-panel interactive"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
              >
                <h2 className="project-title">{project.title}</h2>
                <div className="project-tech">{project.tech}</div>
                <ul className="exp-bullets desc-text" style={{ maxWidth: '900px' }}>
                  {project.bullets.map((bullet, idx) => (
                    <li key={idx}>{bullet}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Education & Certs */}
        <section id="education" className="section">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
            <motion.div 
              className="glass-panel"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3><MaskText phrases={["Education"]} /></h3>
              <div style={{ marginTop: '2rem' }}>
                <div style={{ marginBottom: '2.5rem' }}>
                  <h4 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.5rem' }}>Bachelor of Engineering, Computer Science</h4>
                  <div className="desc-text">Atria Institute of Technology, Bengaluru — CGPA: 7.4/10</div>
                  <div className="exp-year" style={{ marginTop: '0.5rem' }}>2021 – 2025</div>
                </div>
                <div>
                  <h4 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.5rem' }}>Pre-University (PCMC)</h4>
                  <div className="desc-text">BGS PU College, Gauribidanur — 86%</div>
                  <div className="exp-year" style={{ marginTop: '0.5rem' }}>2021</div>
                </div>
              </div>
            </motion.div>
            <motion.div 
              className="glass-panel"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3><MaskText phrases={["Certifications"]} /></h3>
              <ul className="exp-bullets desc-text" style={{ marginTop: '2rem' }}>
                <li style={{ marginBottom: '1.5rem' }}>Java Foundation Certification — Infosys Springboard</li>
                <li>SQL and Relational Databases 101 — IBM</li>
              </ul>
            </motion.div>
          </div>
        </section>

        {/* Core Competencies */}
        <section id="competencies" className="section">
          <h3><MaskText phrases={["Core Competencies"]} /></h3>
          <div className="competency-container" style={{ marginTop: '2rem' }}>
            {coreCompetencies.map((comp, i) => (
              <motion.div 
                key={i} 
                className="competency-pill interactive"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                {comp}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <section id="contact" className="section" style={{ textAlign: 'center', paddingBottom: '10vh' }}>
          <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', marginBottom: '3rem' }}>Let's Build It.</h2>
          <div style={{ marginBottom: '4rem' }}>
            <MagneticButton href="mailto:ktgowtham89@gmail.com">ktgowtham89@gmail.com</MagneticButton>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <a href="tel:9535305049" className="nav-links interactive" style={{ fontSize: '1.2rem', color: 'var(--text-muted)', textDecoration: 'none' }}>+91 9535305049</a>
            <a href="https://linkedin.com/in/ktgowtham7" target="_blank" rel="noreferrer" className="nav-links interactive" style={{ fontSize: '1.2rem', color: 'var(--text-muted)', textDecoration: 'none' }}>LinkedIn</a>
            <a href="https://github.com/ktgowtham7" target="_blank" rel="noreferrer" className="nav-links interactive" style={{ fontSize: '1.2rem', color: 'var(--text-muted)', textDecoration: 'none' }}>GitHub</a>
          </div>
        </section>
      </main>
    </>
  );
}

export default App;

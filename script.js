/**
 * BIOKURI // PORTFÓLIO DE LUCAS AØSF
 * Biólogo · Gestor Ambiental · Taxonomista & Especialista em Anfíbios Anuros
 * Ecologia Computacional, Automação & Programação
 */

document.addEventListener('DOMContentLoaded', () => {
    initAudioSystem();
    initBioCanvas();
    initStationWelcome();
    initJumpingFrog();
    initBioScanner();
    initProjectFilters();
    initScrollReveal();
    initLanguageSystem();
    initMetricsCounter();
    initAvatarToggle();
});

/* ==========================================================================
   1. SOUND EFFECTS & FROG CROAK (Web Audio API)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = true;

function initAudioSystem() {
    const soundToggle = document.getElementById('sound-toggle');
    if (!soundToggle) return;

    soundToggle.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        soundToggle.innerHTML = soundEnabled 
            ? '<i class="fa-solid fa-volume-high"></i>' 
            : '<i class="fa-solid fa-volume-xmark"></i>';
        soundToggle.style.color = soundEnabled ? 'var(--bio-emerald)' : 'var(--text-dim)';
        if (soundEnabled) playFrogCroak();
    });
}

function playBioBeep(freq = 440, duration = 0.06, type = 'sine') {
    if (!soundEnabled) return;
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        if (!audioCtx) audioCtx = new AudioContext();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.4, audioCtx.currentTime + duration);

        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
        // Audio policy or unsupported
    }
}

// Synthesize a realistic soft treefrog / anuran chirp (coaxar de perereca)
function playFrogCroak() {
    if (!soundEnabled) return;
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        if (!audioCtx) audioCtx = new AudioContext();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const now = audioCtx.currentTime;
        [0, 0.08].forEach(offset => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(280, now + offset);
            osc.frequency.linearRampToValueAtTime(190, now + offset + 0.07);

            gain.gain.setValueAtTime(0.035, now + offset);
            gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.07);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start(now + offset);
            osc.stop(now + offset + 0.07);
        });
    } catch (e) {
        // Audio policy
    }
}

function playScanTone(step = 1) {
    if (!soundEnabled) return;
    const freqs = [340, 480, 620, 780, 960];
    const freq = freqs[step % freqs.length] || 440;
    playBioBeep(freq, 0.12, 'triangle');
}

/* ==========================================================================
   2. BIO-CANVAS: FLOATING SPORES & ANURAN TAXA
   ========================================================================== */
function initBioCanvas() {
    const canvas = document.getElementById('bio-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(width > 768 ? 50 : 25, 60);
    const taxaLabels = [
        'Melanophryniscus moreirae', 'Bothrops atrox', 'Bothrops bilineatus',
        'Leptodactylus paranaru', 'Puma concolor', 'CRBio 127233/01-D',
        'CEMAVE: #7723874', 'Gestão Ambiental', 'Raven Pro: 44.1kHz'
    ];

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = -Math.random() * 0.55 - 0.2; // drift upward
            this.size = Math.random() * 2.8 + 1;
            this.alpha = Math.random() * 0.5 + 0.2;
            this.pulseSpeed = Math.random() * 0.02 + 0.01;
            this.isLabel = Math.random() < 0.2;
            this.label = taxaLabels[Math.floor(Math.random() * taxaLabels.length)];
            this.color = Math.random() > 0.4 ? 'rgba(78, 204, 163,' : 'rgba(197, 160, 89,';
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.alpha += Math.sin(Date.now() * this.pulseSpeed) * 0.006;

            if (this.y < -30 || this.x < -40 || this.x > width + 40) {
                this.y = height + 20;
                this.x = Math.random() * width;
            }
        }

        draw() {
            ctx.save();
            if (this.isLabel) {
                ctx.font = '10px "Roboto Mono", monospace';
                ctx.fillStyle = `${this.color} ${Math.max(0.1, Math.min(this.alpha * 0.65, 0.45))})`;
                ctx.fillText(this.label, this.x, this.y);
            } else {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `${this.color} ${Math.max(0.1, Math.min(this.alpha, 0.75))})`;
                ctx.shadowBlur = 10;
                ctx.shadowColor = 'rgba(78, 204, 163, 0.6)';
                ctx.fill();
            }
            ctx.restore();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

/* ==========================================================================
   3. SCIENTIFIC STATION WELCOME SEQUENCE (Clean, elegant, no strange symbols)
   ========================================================================== */
function initStationWelcome() {
    const output = document.getElementById('terminal-output');
    if (!output) return;

    const messages = [
        { text: '🌿 Bem-vindo ao acervo científico e portfólio profissional de Lucas Aøsf', gold: true },
        { text: '🐸 Biólogo (CRBio-01 nº 127233/01-D) · Gestor Ambiental (Especialista UNOPAR) · Taxonomista', ok: true },
        { text: '🔬 Foco primário: Taxonomia & Sistemática Filogenética, com ênfase em Anfíbios Anuros e Répteis' },
        { text: '💻 Ecologia Computacional, Automação em R e Python, e Engenharia de Softwares de Campo (PWAs)' },
        { text: '📍 Mais de uma década de experiência da amostragem em campo ao laudo e publicação científica', ok: true }
    ];

    let idx = 0;

    function renderNextLine() {
        if (idx >= messages.length) return;

        const item = messages[idx];
        const row = document.createElement('div');
        row.style.marginBottom = '0.55rem';
        row.style.lineHeight = '1.6';

        let className = 'terminal-output-text';
        if (item.ok) className += ' terminal-output-ok';
        if (item.gold) className += ' terminal-output-gold';

        row.className = className;
        output.appendChild(row);

        // Natural typing effect for header welcome
        let charIdx = 0;
        const text = item.text;
        const timer = setInterval(() => {
            if (charIdx < text.length) {
                row.textContent += text.charAt(charIdx);
                charIdx++;
            } else {
                clearInterval(timer);
                idx++;
                playBioBeep(520, 0.03);
                setTimeout(renderNextLine, 350);
            }
        }, 18);

        output.scrollTop = output.scrollHeight;
    }

    setTimeout(renderNextLine, 400);
}

/* ==========================================================================
   4. INTERACTIVE LIVING TREEFROG (Anuro Articulado - Hylidae)
      - Patas articuladas com extensão no salto e amortecimento no pouso
      - PC: Salta onde o mouse passar com rotação balística
      - Celular: Salta exatamente onde o usuário clicar/tocar com o dedo
      - Pousa nas letras de "Lucas Aøsf" com animação de impacto elástico
   ========================================================================== */
function initJumpingFrog() {
    const frog = document.getElementById('jumping-frog');
    const letters = document.querySelectorAll('.hop-char');
    if (!frog) return;

    let frogX = 0;
    let frogY = 0;
    let isJumping = false;
    let isPerchedOnName = true;
    let currentLetterIdx = 0;
    let autoHopTimer = null;
    let idleTimer = null;
    let lastCroakTime = 0;
    let lastMouseJumpTime = 0;

    // Rate-limited croak to keep audio natural and pleasant
    function triggerCroak(force = false) {
        const now = Date.now();
        if (force || now - lastCroakTime > 850) {
            playFrogCroak();
            lastCroakTime = now;
        }
    }

    // Spawn green bio-ripple shockwave at landing spot
    function spawnRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.className = 'frog-landing-ripple';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        document.body.appendChild(ripple);
        setTimeout(() => ripple.remove(), 480);
    }

    // Core jump execution with physics, angle calculation, leg extension & landing squash
    function jumpTo(targetX, targetY, options = {}) {
        if (isJumping) return;
        isJumping = true;

        const {
            letterEl = null,
            isLetterHop = false,
            forceCroak = false,
            onComplete = null
        } = options;

        const dx = targetX - frogX;
        const dy = targetY - frogY;
        const dist = Math.hypot(dx, dy);

        // Calculate heading angle (0 deg = facing up)
        let rotDeg = 0;
        if (dist > 8) {
            const angleRad = Math.atan2(dy, dx);
            rotDeg = (angleRad * 180 / Math.PI) + 90;
        }

        // Phase 1: Crouch & Aim (40ms)
        frog.style.transform = `translate3d(${frogX}px, ${frogY}px, 0) rotate(${rotDeg}deg) scale(1.14, 0.86)`;

        setTimeout(() => {
            // Phase 2: In-Flight propulsion with legs kicking back (300ms)
            frog.classList.add('in-flight');
            frog.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) rotate(${rotDeg}deg)`;
            triggerCroak(forceCroak);

            setTimeout(() => {
                // Phase 3: Touchdown cushion & landing squash
                frog.classList.remove('in-flight');
                frog.classList.add('landing');
                frogX = targetX;
                frogY = targetY;

                spawnRipple(targetX + 24, targetY + 24);

                if (letterEl) {
                    letterEl.classList.remove('letter-bounce');
                    void letterEl.offsetWidth; // trigger reflow
                    letterEl.classList.add('letter-bounce');
                    setTimeout(() => letterEl.classList.remove('letter-bounce'), 450);
                }

                // Phase 4: Settle back to resting pose
                setTimeout(() => {
                    frog.classList.remove('landing');
                    frog.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) rotate(0deg)`;
                    isJumping = false;
                    if (onComplete) onComplete();
                }, 130);
            }, 300);
        }, 40);
    }

    // Hop to a specific letter in the name "Lucas Aøsf"
    function hopToLetter(index, isUserAction = false) {
        if (index < 0 || index >= letters.length) return;
        currentLetterIdx = index;
        isPerchedOnName = true;

        const targetLetter = letters[index];
        const rect = targetLetter.getBoundingClientRect();
        const targetX = rect.left + window.scrollX + (rect.width / 2) - 24;
        const targetY = rect.top + window.scrollY - 34;

        jumpTo(targetX, targetY, {
            letterEl: targetLetter,
            isLetterHop: true,
            forceCroak: isUserAction
        });
    }

    // Set initial position atop first letter 'L'
    function setInitialPerch() {
        if (letters.length > 0) {
            const rect = letters[0].getBoundingClientRect();
            frogX = rect.left + window.scrollX + (rect.width / 2) - 24;
            frogY = rect.top + window.scrollY - 34;
            frog.style.transform = `translate3d(${frogX}px, ${frogY}px, 0)`;
            startIdleHop();
        }
    }

    // Initial positioning after layout
    setTimeout(setInitialPerch, 450);

    // Keep perched position synced if window resizes or zooms
    window.addEventListener('resize', () => {
        if (isPerchedOnName && letters[currentLetterIdx] && !isJumping) {
            const rect = letters[currentLetterIdx].getBoundingClientRect();
            frogX = rect.left + window.scrollX + (rect.width / 2) - 24;
            frogY = rect.top + window.scrollY - 34;
            frog.style.transform = `translate3d(${frogX}px, ${frogY}px, 0)`;
        }
    });

    // Idle timer: Hop gently between letters if no user interaction for 5 seconds
    function startIdleHop() {
        if (autoHopTimer) clearInterval(autoHopTimer);
        autoHopTimer = setInterval(() => {
            if (isPerchedOnName && window.scrollY < 450 && !isJumping) {
                const nextIdx = (currentLetterIdx + 1) % letters.length;
                hopToLetter(nextIdx, false);
            }
        }, 3200);
    }

    function resetIdleTimer() {
        if (autoHopTimer) clearInterval(autoHopTimer);
        if (idleTimer) clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
            if (window.scrollY < 400 && !isJumping) {
                hopToLetter(0, false);
            }
            startIdleHop();
        }, 5500);
    }

    // -------------------------------------------------------------
    // DESKTOP (PC): Leap wherever the mouse moves ("onde o mouse passar")
    // -------------------------------------------------------------
    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        // Cooldown between continuous hops to simulate natural locomotion
        if (now - lastMouseJumpTime < 380) return;

        const targetX = e.pageX - 24;
        const targetY = e.pageY - 24;
        const dist = Math.hypot(targetX - frogX, targetY - frogY);

        // Only leap if mouse has moved beyond close proximity
        if (dist > 52) {
            lastMouseJumpTime = now;
            isPerchedOnName = false;
            jumpTo(targetX, targetY, { forceCroak: false });
            resetIdleTimer();
        }
    });

    // -------------------------------------------------------------
    // MOBILE: Leap wherever the user taps with finger ("onde a pessoa clicar com o dedo")
    // -------------------------------------------------------------
    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener('pointerdown', (e) => {
        touchStartX = e.pageX;
        touchStartY = e.pageY;
    }, { passive: true });

    document.addEventListener('pointerup', (e) => {
        // Measure movement distance to differentiate tap from scroll/swipe
        const moveDist = Math.hypot(e.pageX - touchStartX, e.pageY - touchStartY);
        if (moveDist > 14) return; // User was scrolling, not tapping

        // If user tapped directly on the frog, do an excited backflip hop!
        if (frog.contains(e.target) || e.target === frog) {
            triggerCroak(true);
            jumpTo(frogX, frogY - 45, {
                forceCroak: true,
                onComplete: () => {
                    setTimeout(() => jumpTo(frogX, frogY + 45, { forceCroak: false }), 120);
                }
            });
            resetIdleTimer();
            return;
        }

        // Frog leaps directly to tapped coordinate!
        const targetX = e.pageX - 24;
        const targetY = e.pageY - 24;
        isPerchedOnName = false;
        jumpTo(targetX, targetY, { forceCroak: true });
        resetIdleTimer();
    }, { passive: true });

    // -------------------------------------------------------------
    // Letter interactions: Click or hover over name letters
    // -------------------------------------------------------------
    letters.forEach((charEl, idx) => {
        charEl.addEventListener('click', (e) => {
            e.stopPropagation();
            hopToLetter(idx, true);
            resetIdleTimer();
        });
        charEl.addEventListener('mouseenter', () => {
            if (!isJumping && currentLetterIdx !== idx) {
                hopToLetter(idx, false);
                resetIdleTimer();
            }
        });
    });

    // Clicking directly on frog
    frog.addEventListener('click', (e) => {
        e.stopPropagation();
        triggerCroak(true);
        const nextIdx = (currentLetterIdx + 1) % letters.length;
        hopToLetter(nextIdx, true);
        resetIdleTimer();
    });
}

/* ==========================================================================
   4.1 INTERACTIVE AVATAR SAGE MODE TOGGLE (Currículo Real <-> Modo Sábio)
   ========================================================================== */
function initAvatarToggle() {
    const toggleBtn = document.getElementById('avatar-mode-toggle');
    const profileImg = document.getElementById('main-profile-img');
    const labelSpan = document.getElementById('avatar-mode-label');
    if (!toggleBtn || !profileImg) return;

    let isSage = false;
    const realImgSrc = 'assets/lucas-profile-lattes.jpg';
    const sageImgSrc = 'assets/invocacao-sapo.gif';

    toggleBtn.addEventListener('click', () => {
        isSage = !isSage;
        if (isSage) {
            profileImg.src = sageImgSrc;
            profileImg.classList.add('sage-active');
            toggleBtn.classList.add('active-sage');
            if (labelSpan) labelSpan.textContent = document.documentElement.lang === 'en' ? 'Real Photo' : 'Foto Real';
            const icon = toggleBtn.querySelector('i');
            if (icon) icon.className = 'fa-solid fa-user';
            playFrogCroak();
            playBioBeep(880, 0.15, 'sawtooth');
        } else {
            profileImg.src = realImgSrc;
            profileImg.classList.remove('sage-active');
            toggleBtn.classList.remove('active-sage');
            if (labelSpan) labelSpan.textContent = document.documentElement.lang === 'en' ? 'Sage Mode' : 'Modo Sábio';
            const icon = toggleBtn.querySelector('i');
            if (icon) icon.className = 'fa-solid fa-bolt';
            playBioBeep(520, 0.08);
        }
    });
}

/* ==========================================================================
   5. BIODIVERSITY SCANNER & PROJECTS UNLOCKER
   ========================================================================== */
function initBioScanner() {
    const btnHack = document.getElementById('btn-hack');
    const miniTerminal = document.getElementById('mini-terminal');
    const projectsContent = document.getElementById('projects-content');

    if (!btnHack || !miniTerminal || !projectsContent) return;

    btnHack.addEventListener('click', () => {
        btnHack.disabled = true;
        btnHack.style.opacity = '0.7';
        miniTerminal.style.display = 'block';
        miniTerminal.innerHTML = '';

        const scanLogs = [
            '● Conectando ao repositório faunístico Biokuri...',
            '● Sincronizando ocorrências no banco de dados GBIF... [23.418 registros validados]',
            '● Carregando acervo bioacústico de anfíbios anuros da Mantiqueira e Bocaina...',
            '● Consultando diagnoses taxonômicas do clado Bothrops e anurofauna neotropical...',
            '● Integrando matrizes de gestão ambiental, laudos e ferramentas de campo...',
            '● Acervo taxonômico e projetos de engenharia liberados com sucesso!'
        ];

        let i = 0;
        function logNext() {
            if (i < scanLogs.length) {
                const line = document.createElement('div');
                line.style.margin = '0.35rem 0';
                line.innerHTML = scanLogs[i];
                miniTerminal.appendChild(line);
                playScanTone(i + 1);
                i++;
                setTimeout(logNext, 360);
            } else {
                projectsContent.classList.remove('locked-content');
                projectsContent.style.animation = 'fadeInUp 0.8s ease forwards';
                playFrogCroak();

                setTimeout(() => {
                    const firstCard = projectsContent.querySelector('.project-card');
                    if (firstCard) {
                        firstCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 400);
            }
        }
        logNext();
    });
}

/* ==========================================================================
   6. PROJECT CATEGORY FILTERS
   ========================================================================== */
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-filter');
            playBioBeep(600, 0.04);

            projectCards.forEach(card => {
                const cardCat = card.getAttribute('data-category');
                if (category === 'all' || cardCat === category) {
                    card.style.display = 'flex';
                    card.style.animation = 'fadeInUp 0.4s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* ==========================================================================
   7. SCROLL REVEAL (FADE-IN OBSERVER)
   ========================================================================== */
function initScrollReveal() {
    const fadeElements = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersectEvent || entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.12
    });

    fadeElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   8. METRICS IMPACT COUNTER ANIMATION
   ========================================================================== */
function initMetricsCounter() {
    const numbers = document.querySelectorAll('.metric-number');
    let triggered = false;

    window.addEventListener('scroll', () => {
        if (triggered) return;
        const strip = document.querySelector('.metrics-strip');
        if (!strip) return;

        const rect = strip.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.9) {
            triggered = true;
            numbers.forEach(el => {
                const target = parseInt(el.getAttribute('data-target'), 10) || 10;
                let current = 0;
                const increment = Math.ceil(target / 25);
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        el.innerText = target === 100 ? '100%' : target + '+';
                        clearInterval(timer);
                    } else {
                        el.innerText = current + '+';
                    }
                }, 40);
            });
        }
    });
}

/* ==========================================================================
   9. COMPLETE BILINGUAL SYSTEM (PT / EN)
   ========================================================================== */
const translations = {
    pt: {
        tag_identity: "Identidade & Liderança",
        header_roles: "&lt;Biólogo · Gestor Ambiental · Taxonomista · Fundador Biokuri&gt;",
        desc_bio: "Biólogo (UNIFATEA) e <strong>Especialista em Gestão Ambiental (UNOPAR)</strong>, anilhador CEMAVE/ICMBio. Atua há mais de uma década na vanguarda da <strong>Taxonomia & Sistemática Filogenética</strong> (com ênfase apaixonada em <strong>anfíbios anuros</strong> e répteis), ecologia de campo em todos os biomas brasileiros e <strong>automação científica em R e Python</strong> para modelagem de biodiversidade e gestão de grandes empreendimentos.",
        header_focus: "Atuação & Foco Central",
        intro_focus: "Integração pioneira entre o rigor taxonômico de museu e campo, a gestão ambiental corporativa e a engenharia de dados ecológicos.",
        focus_taxo_title: "Taxonomia & Sistemática de Anuros e Répteis (Foco Primário)",
        focus_taxo_desc: "Especialista em anfíbios anuros (sapinhos-da-serra Melanophryniscus, pererecas Boana, rãs Leptodactylus) e serpentes (clado Bothrops atrox). Diagnose morfológica, bioacústica de vocalizações, chaves dicotômicas e redescobertas históricas.",
        focus_gestao_title: "Gestão Ambiental & Licenciamento de Grandes Obras",
        focus_gestao_desc: "Especialista em Gestão Ambiental (UNOPAR). Responsabilidade técnica em duplicações de rodovias, ferrovias, hidrelétricas e indústrias, elaborando diagnósticos para EIA/RIMA, laudos CETESB e programas de mitigação de impacto.",
        focus_prog_title: "Ecologia Computacional & Programação em R",
        focus_prog_desc: "Pipelines avançados para mineração do GBIF (Global Biodiversity Information Facility), análise estatística multivariada de comunidades faunísticas, bioestatística e modelagem ecológica (apresentada na COP30).",
        focus_apps_title: "Engenharia de Softwares de Campo (PWAs)",
        focus_apps_desc: "Idealizador e arquiteto de PWAs como a Caderneta de Campo (georreferenciamento offline, listas de Mackinnon, exportação instantânea Excel) e Cubagem Florestal Smalian.",
        metric_years: "Anos em Campo & Taxonomia",
        metric_papers: "Artigos Científicos & Obras",
        metric_projects: "Empreendimentos Atendidos",
        metric_biomes: "Biomas & Zonas Costeiras",
        metric_passion: "Rigor Metodológico & Conservação",
        header_stack: "Bio-Tech & Scientific Stack",
        intro_stack: "Ferramentas de computação, protocolos de amostragem zoológica e frameworks de análise ambiental aplicados rotineiramente.",
        stack_prog: "Linguagens & Ecossistema Dev",
        stack_bio: "Ciência de Dados & Biodiversidade",
        stack_field: "Amostragem Faunística & Licenciamento",
        header_projects: "Soluções Desenvolvidas, Softwares & Labs",
        filter_all: "Todos",
        filter_software: "Softwares & PWAs",
        filter_scripts: "Scripts & Automação",
        filter_science: "Pesquisa & Ecologia",
        btn_scan: "Explorar Acervo Faunístico & Projetos",
        btn_open_app: "Abrir App",
        btn_code: "Código",
        btn_view_script: "Ver Script R",
        desc_caderneta: "Aplicativo mobile PWA completo para levantamento e monitoramento de fauna e flora em campo. Funciona 100% offline, com marcação de coordenadas GPS, listas de Mackinnon, contagem de abundância, histórico de espécies e exportação direta para planilhas Excel estruturadas.",
        desc_cubagem: "Ferramenta digital de alta precisão para cálculo volumétrico de toras de madeira pelo método rigoroso de Smalian. Inclui banco de dados dendrológico de espécies nativas, interface otimizada para campo e geração automática de laudos e planilhas técnicas.",
        desc_moreirae: "Pipeline em linguagem R para mineração automatizada de ocorrências georreferenciadas na base global do GBIF do sapinho-da-serra (Melanophryniscus moreirae). Integração de dados de ciência cidadã com modelagem biogeográfica que fundamentou artigo aceito em periódico internacional.",
        desc_consultoria: "Framework de scripts e automação para ingestão e conversão de dados brutos coletados em campo para matrizes consolidadas. Agiliza a produção de diagnósticos para EIA/RIMA, gerando curvas de acumulação de espécies, índices ecológicos e tabelas taxonômicas.",
        desc_imbio: "Script de análise temporal de dados ecológicos (2019-2024) comprovando que o reflorestamento reduziu a temperatura de superfície e elevou a riqueza da avifauna de 42 para 131 espécies no Parque das Nascentes (Guaratinguetá/SP), apresentado na 30ª Conferência do Clima da ONU.",
        desc_xprize: "Pesquisador integrante da equipe brasileira na competição global XPRIZE Rainforest (Projeto 104437). Responsável pela instalação e calibração de gravadores autônomos para captação contínua e análise bioacústica de vocalizações em floresta tropical.",
        header_publications: "Produção Bibliográfica & Contribuições Taxonômicas",
        intro_pubs: "Artigos completos em periódicos científicos internacionais e nacionais, com foco em sistemática, anfíbios anuros, répteis, história natural e redescobertas.",
        abstract_bothrops: "Registro e confirmação morfológica/taxonômica da víbora-verde após 30 anos sem ocorrências documentadas no Espírito Santo, preenchendo lacunas críticas de biogeografia e conservação da Mata Atlântica.",
        abstract_moreirae: "Expansão e atualização dos limites de distribuição geográfica do sapinho-da-serra (espécie endêmica de altitude de anfíbio anuro), aliando curadoria taxonômica a dados massivos de ciência cidadã validados.",
        abstract_feigning: "Primeiros relatos detalhados de tanatose (simulação de morte) em serpentes do clado Bothrops atrox, discutindo implicações etológicas e caracteres comportamentais em viperídeos neotropicais.",
        abstract_hoplias: "Primeiro registro formal de predação da rã Leptodactylus paranaru pela traíra, documentando interações tróficas aquático-terrestres em áreas ciliares de Mata Atlântica.",
        abstract_atrox_combat: "Investigação pioneira sobre locomoção copulatória bimodal, mecânica reprodutiva e combate ritualizado macho-macho na jararaca-do-norte, correlacionando o dimorfismo sexual de tamanho ao conflito sexual em viperídeos neotropicais.",
        abstract_cop30: "Estudo ecológico e microclimático demonstrando que a recomposição florestal reduziu a temperatura de superfície e promoveu a recuperação da comunidade de aves (de 42 para 131 espécies) no Vale do Paraíba.",
        abstract_guia: "Contribuição fotográfica integral e identificação taxonômica da herpetofauna: fotografias de alta resolução de anfíbios e répteis que compõem quase todo o acervo do guia oficial do ICMBio.",
        header_experience: "Experiência Profissional & Gestão Ambiental",
        intro_experience: "Responsabilidade técnica e consultoria especializada em infraestrutura de grande porte e gestão ambiental em todo o Brasil.",
        exp_caruso: "Responsável pela execução das atividades de campo em monitoramento ambiental (fauna, ruído ambiental e qualidade da água), planejamento de campanhas, aplicação metodológica, inventários, fichas de campo e apoio a relatórios técnicos.",
        exp_engpacto: "RT pelos grupos de herpetofauna e quiropterofauna na duplicação da Rodovia dos Tamoios (Trecho Serra), Contorno Sul de Caraguatatuba e São Sebastião, duplicação de rodovias no Paraná, EIA/RIMA do Complexo Logístico Tatu (Cubatão/SP) e extensão da Rodovia Carvalho Pinto (Taubaté–Aparecida).",
        exp_econservation: "Levantamento e monitoramento contínuo de mamíferos de pequeno, médio e grande porte e quirópteros em traçado de ferrovia nos estados de Goiás e Mato Grosso. Metodologias avançadas de busca ativa, captura em tomahawk, sherman, pitfall, redes de neblina e marcação individual com brinco, além de monitoramento de fauna atropelada.",
        exp_southwild: "Biólogo responsável por pesquisa de campo com grandes felinos, com foco em Puma concolor (onça-parda/suçuarana) na Serra do Mar em Itanhaém/SP (SouthWild). Atuação complementar no monitoramento técnico de vida marinha, orientação e educação ambiental costeira em Ilhabela e São Sebastião (RNT Brasil).",
        exp_imbio: "Pesquisas com fauna na Serra da Mantiqueira, Serra da Bocaina e Serra do Mar. Linhas de investigação em bioacústica e padrões de vocalização de anfíbios e aves, taxonomia, evolução, sistemática filogenética, biogeografia e programas de educação ambiental.",
        exp_ecos: "Monitoramento de herpetofauna e mastofauna para a instalação da Fábrica de Celulose Arauco (Inocência/MS), celulose em Bataguassu/MS, Cargill no MS, portos de areia (Pindamonhangaba, Aparecida e Realmix/Boituva) e empreendimentos industriais.",
        exp_cayman: "Responsável técnico por mastofauna e herpetofauna no monitoramento de fauna da PCH Verde 2 (Rio Verde/GO) e monitoramento de herpetofauna na Mineradora Massari.",
        exp_lt: "Monitoramento de aves suscetíveis à colisão em Linhas de Transmissão de alta tensão (LT 500 kV Estreito–Cachoeira Paulista, LT 230 kV Itumbiara–Paranaíba, LT Fernão Dias, LT Marituba–Tucuruí no bioma Amazônia), ornitofauna portuária no Porto de São Sebastião/SP e parque solar em Janaúba/MG (Caatinga).",
        exp_cesp: "Manejo, reprodução e soltura de Cracídeos e Tinamídeos ameaçados de extinção no viveiro de aves da CESP no reservatório de Paraibuna/SP. Coordenação de projeto de pesquisa faunística financiado pela multinacional BASF e apoio técnico contínuo à Polícia Militar Ambiental e ao CETAS para triagem e soltura de fauna apreendida.",
        header_certs: "Formação Acadêmica & Credenciais",
        subtitle_academic: "Títulos Acadêmicos",
        acad_pos_title: "Especialização em Gestão Ambiental (Pós-Graduação Lato Sensu)",
        acad_pos_desc: "Especialização voltada à governança ambiental, instrumentos de planejamento territorial, licenciamento de grande porte, mitigação de impactos e compliance regulatório.",
        status_pos: "Pós-Graduação • Gestor Ambiental",
        acad_grad_title: "Graduação — Licenciatura em Ciências Biológicas",
        acad_grad_desc: "TCC com mérito acadêmico: “Levantamento da Ornitofauna do Parque Ecológico do Taboão”, Lorena/SP. Bolsista de pesquisa institucional e bolsista PIBID-CAPES de iniciação à docência.",
        status_grad: "Graduação Superior • Biólogo",
        subtitle_licenses: "Registros Oficiais & Qualificações Técnicas",
        cert_crbio_desc: "Biólogo registrado e devidamente habilitado para assunção de Anotações de Responsabilidade Técnica (ART) e laudos de fauna em âmbito nacional.",
        status_active: "Ativo & Regular",
        cert_cemave_desc: "Credencial oficial do Centro Nacional de Pesquisa e Conservação de Aves Silvestres para anilhamento, captura, biometria e marcação de avifauna.",
        status_official_cert: "Credencial Oficial",
        cert_eear_desc: "Capacitação teórica e treinamento de segurança para militares e especialistas em contenção física de répteis peçonhentos e crocodilianos.",
        status_instructor: "Docência / Treinamento",
        cert_symp_desc: "Participação no II International Symposium on Tadpole Evolution (2024), AVISTAR (2024), análise de muda em aves e cursos avançados de herpetologia.",
        status_continuous: "Educação Continuada",
        cert_ibama_desc: "Qualificação em Manejo Florestal Sustentável e Mudança do Clima (IBAMA), Administração de Bancos de Dados e Programação Python aplicada à bio-informação.",
        status_completed_qual: "Qualificação Técnica",
        cert_photo_desc: "Mais de uma década documentando a biodiversidade brasileira com fotografia macro e de fauna, além de guiamento ornitológico especializado em Mata Atlântica.",
        status_field_master: "10+ Anos de Acervo",
        header_stats: "GitHub & Atividade Aberta",
        btn_explore_gh: "Explorar Todos os Repositórios (@lucasaosf)",
        header_manifesto: "Manifesto Científico",
        header_sage_mode: "Modo Sábio // Invocação dos Sapos",
        desc_sage_intro: "Animação do avatar oficial do GitHub: uma homenagem lúdica ao fascínio e à dedicação aos anfíbios anuros. Empregando a clássica invocação ninja (Kuchiyose no Jutsu), o selo no chão canaliza energia elétrica convocando o sapo gigante guardião e os mestres anfíbios da floresta.",
        btn_toggle_sage: "Modo Sábio",
        btn_toggle_real: "Foto Real",
        footer_text: "Desenvolvido por Lucas Aøsf // Biokuri — Soluções Ambientais & Ecologia Computacional"
    },
    en: {
        tag_identity: "Identity & Leadership",
        header_roles: "&lt;Biologist · Environmental Manager · Taxonomist · Biokuri Founder&gt;",
        desc_bio: "Biologist (UNIFATEA) and <strong>Environmental Management Specialist (UNOPAR)</strong>, CEMAVE/ICMBio bird bander. Over a decade leading <strong>Taxonomy & Phylogenetic Systematics</strong> (with deep passion for <strong>anuran amphibians</strong> and reptiles), field ecology across all Brazilian biomes, and <strong>computational science in R & Python</strong> for biodiversity modeling and environmental governance.",
        header_focus: "Focus & Core Expertise",
        intro_focus: "Pioneering integration of classical museum & field taxonomy, corporate environmental management, and ecological data science.",
        focus_taxo_title: "Anuran & Reptilian Taxonomy and Systematics (Core Focus)",
        focus_taxo_desc: "Specialist in anuran amphibians (Melanophryniscus redbelly toads, Boana treefrogs, Leptodactylus frogs) and vipers (Bothrops atrox clade). Morphological diagnosis, vocalization bioacoustics, dichotomous keys, and historical rediscoveries.",
        focus_gestao_title: "Environmental Management & Major Project Licensing",
        focus_gestao_desc: "Specialist in Environmental Management (UNOPAR). Technical Lead across highways, railways, hydroelectric dams, and pulp mills, preparing EIA/RIMA diagnoses and mitigation programs.",
        focus_prog_title: "Computational Ecology & R Programming",
        focus_prog_desc: "Advanced automated pipelines for GBIF data mining, multivariate statistical community ecology, and ecological modeling (presented at UN COP30).",
        focus_apps_title: "Field Software Engineering (PWAs)",
        focus_apps_desc: "Creator and software architect of offline-first PWAs such as Caderneta de Campo (GPS geotagging, Mackinnon lists, automated Excel export) and Smalian Timber Scaler.",
        metric_years: "Years in Field & Taxonomy",
        metric_papers: "Scientific Papers & Works",
        metric_projects: "Enterprise Projects Handled",
        metric_biomes: "Biomes & Coastal Zones",
        metric_passion: "Scientific Rigor & Conservation",
        header_stack: "Bio-Tech & Scientific Stack",
        intro_stack: "Computational tools, zoological sampling standards, and data frameworks routinely utilized.",
        stack_prog: "Coding & Dev Ecosystem",
        stack_bio: "Data Science & Biodiversity",
        stack_field: "Field Sampling & Environmental Licensing",
        header_projects: "Developed Software, Tools & Research Labs",
        filter_all: "All",
        filter_software: "Software & PWAs",
        filter_scripts: "Scripts & Automation",
        filter_science: "Research & Ecology",
        btn_scan: "Explore Fauna Database & Projects",
        btn_open_app: "Launch App",
        btn_code: "Code",
        btn_view_script: "View R Script",
        desc_caderneta: "Complete offline-first mobile PWA for field wildlife and vegetation surveying. Operates 100% offline with GPS coordinates, Mackinnon lists, abundance counting, and instant export to structured Excel spreadsheets.",
        desc_cubagem: "High-precision digital tool for commercial log volume calculations using the Smalian formula. Features native dendrological species database and automated technical report generation.",
        desc_moreirae: "Automated R pipeline for mining and validating georeferenced GBIF occurrences of the high-altitude toad (Melanophryniscus moreirae). Fuses citizen science with biogeographical modeling, resulting in a peer-reviewed publication.",
        desc_consultoria: "Automation framework for transforming raw field survey sheets into clean analytical matrices, generating species accumulation curves, ecological diversity indices, and taxonomic tables.",
        desc_imbio: "Temporal ecological data analysis (2019-2024) demonstrating that reforestation reduced surface temperature while increasing bird species richness from 42 to 131 at Parque das Nascentes, presented at UN COP30.",
        desc_xprize: "Researcher in the Brazilian Team for the global XPRIZE Rainforest competition (Project 104437). Installed and calibrated autonomous acoustic recorders for continuous rainforest soundscape monitoring.",
        header_publications: "Scientific Publications & Taxonomic Contributions",
        intro_pubs: "Full peer-reviewed papers in international and national scientific journals focusing on systematics, anurans, herpetology, natural history, and rediscoveries.",
        abstract_bothrops: "Taxonomic and morphological confirmation of the green jararaca after 30 years without documented occurrences in Espírito Santo, filling crucial biogeographical and conservation gaps.",
        abstract_moreirae: "Expansion and revision of the geographical distribution of the high-altitude redbelly toad (anuran amphibian) using curated and validated mass citizen science datasets.",
        abstract_feigning: "First detailed reports of death feigning (thanatosis) in pitvipers of the Bothrops atrox clade, addressing ethological and behavioral characters in Neotropical vipers.",
        abstract_hoplias: "First documented predation of the frog Leptodactylus paranaru by trahira fish, capturing aquatic-terrestrial trophic interactions in Atlantic Forest riparian zones.",
        abstract_atrox_combat: "Pioneering investigation on bimodal copulatory locomotion, reproductive mechanics, and ritualized male-male combat in the Amazonian lancehead, linking sexual size dimorphism to sexual conflict in Neotropical pitvipers.",
        abstract_cop30: "Ecological and microclimatic study demonstrating that forest restoration reduced land surface temperature and drove bird community recovery (from 42 to 131 species) in the Paraíba Valley.",
        abstract_guia: "Comprehensive photographic contribution and taxonomic identification: high-resolution imagery of amphibians and reptiles composing nearly the entire herpetofauna section of the official ICMBio guide.",
        header_experience: "Professional Experience & Environmental Management",
        intro_experience: "Technical responsibility (RT) and specialized environmental consulting for major infrastructure across Brazil.",
        exp_caruso: "Field execution of environmental monitoring (wildlife, environmental noise, and water quality), survey campaign design, sampling methodologies, and technical reporting support.",
        exp_engpacto: "Technical Lead for herpetofauna and bats on the Rodovia dos Tamoios highway duplication (mountain section), Caraguatatuba bypass, Paraná highways, Tatu Logistics EIA/RIMA, and Carvalho Pinto Highway extension.",
        exp_econservation: "Survey and continuous monitoring of small, medium, and large mammals and bats along railway corridors across Goiás and Mato Grosso states. Advanced methodologies including active search, live trapping (tomahawk, sherman, pitfall), mist netting, individual ear-tagging, and roadkill fauna monitoring.",
        exp_southwild: "Field biologist leading wild feline research focusing on Puma concolor (mountain lion/cougar) in the coastal Serra do Mar mountains (SouthWild USA). Complementary technical monitoring of marine life, environmental orientation, and coastal conservation at Ilhabela and São Sebastião (RNT Brasil).",
        exp_imbio: "Wildlife research across Mantiqueira, Bocaina, and Serra do Mar ranges. Focused on bioacoustics, vocalization patterns of amphibians and birds, evolutionary systematics, phylogenetics, and conservation education.",
        exp_ecos: "Herpetofauna and mammal monitoring for Arauco Pulp Mill construction (MS), Bataguassu pulp mill, Cargill MS operations, sand mining ports, and industrial developments.",
        exp_cayman: "Technical lead for herpetofauna and mastozoology on PCH Verde 2 hydroelectric plant (GO) and herpetological surveys for Massari Mining.",
        exp_lt: "Bird collision risk monitoring along high-voltage transmission lines (500 kV Estreito–Cachoeira Paulista, 230 kV Itumbiara–Paranaíba, Fernão Dias, Marituba–Tucuruí in Amazon biome), port avifauna at São Sebastião, and solar farm in Caatinga.",
        exp_cesp: "Management, ex-situ breeding, and reintroduction of endangered Cracid and Tinamid birds at the CESP wildlife center in the Paraibuna reservoir. Wildlife research coordination funded by chemical multinational BASF, and continuous technical support for the Environmental Military Police and CETAS wildlife rescue.",
        header_certs: "Academic Education & Credentials",
        subtitle_academic: "Academic Degrees",
        acad_pos_title: "Postgraduate Specialization in Environmental Management",
        acad_pos_desc: "Specialization in environmental governance, spatial planning instruments, major infrastructure licensing, impact mitigation, and regulatory compliance.",
        status_pos: "Postgraduate Degree • Environmental Manager",
        acad_grad_title: "Bachelor's Degree in Biological Sciences",
        acad_grad_desc: "Honor thesis: 'Avifauna Survey of Taboão Ecological Park', Lorena/SP. Institutional research grantee and CAPES-PIBID teaching fellow.",
        status_grad: "Higher Education Degree • Biologist",
        subtitle_licenses: "Official Licenses & Technical Qualifications",
        cert_crbio_desc: "Licensed Biologist qualified for Technical Responsibility (ART) and official environmental wildlife assessments nationwide.",
        status_active: "Active & Certified",
        cert_cemave_desc: "Official credential from ICMBio National Center for Wild Bird Research for scientific mist netting, banding, and biometrics.",
        status_official_cert: "Official Credential",
        cert_eear_desc: "Theoretical training and field safety instruction for military personnel on venomous snakes, spiders, scorpions, and crocodilians.",
        status_instructor: "Instruction / Training",
        cert_symp_desc: "Active participant in the II International Symposium on Tadpole Evolution (2024), AVISTAR (2024), and advanced zoological seminars.",
        status_continuous: "Continuing Education",
        cert_ibama_desc: "Certified qualification in Sustainable Forest Management and Climate Change (IBAMA), Database Administration, and Python programming for biological data science.",
        status_completed_qual: "Technical Qualification",
        cert_photo_desc: "Over a decade documenting Brazilian biodiversity with macro and wildlife photography, paired with specialized ornithological and herpetological guided expeditions.",
        status_field_master: "10+ Years of Archive",
        header_stats: "GitHub & Open Science",
        btn_explore_gh: "Explore All Repositories (@lucasaosf)",
        header_manifesto: "Scientific Manifesto",
        header_sage_mode: "Sage Mode // Toad Summoning",
        desc_sage_intro: "Animation of the official GitHub avatar: a playful homage to the lifelong fascination and dedication to anuran amphibians. Utilizing the classic summoning jutsu (Kuchiyose no Jutsu), the floor seal channels electric energy to summon the giant guardian toad and forest amphibian masters.",
        btn_toggle_sage: "Sage Mode",
        btn_toggle_real: "Real Photo",
        footer_text: "Developed by Lucas Aøsf // Biokuri — Environmental Solutions & Computational Ecology"
    }
};

function initLanguageSystem() {
    const langBtn = document.getElementById('lang-toggle');
    const ptSpan = document.getElementById('lang-pt');
    const enSpan = document.getElementById('lang-en');
    if (!langBtn) return;

    let currentLang = 'pt';

    langBtn.addEventListener('click', () => {
        currentLang = currentLang === 'pt' ? 'en' : 'pt';
        applyLanguage(currentLang);
        playBioBeep(700, 0.04);
    });

    function applyLanguage(lang) {
        if (lang === 'pt') {
            ptSpan.classList.add('active');
            enSpan.classList.remove('active');
            document.documentElement.lang = 'pt-BR';
        } else {
            ptSpan.classList.remove('active');
            enSpan.classList.add('active');
            document.documentElement.lang = 'en';
        }

        const dict = translations[lang];
        if (!dict) return;

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key]) {
                el.innerHTML = dict[key];
            }
        });
    }
}

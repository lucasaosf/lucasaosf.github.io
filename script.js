/**
 * BIOKURI // PORTFÓLIO DE LUCAS AØSF
 * Biólogo · Gestor Ambiental · Taxonomista & Especialista em Anfíbios Anuros
 * Ecologia Computacional, Automação & Programação
 */

document.addEventListener('DOMContentLoaded', () => {
    initAudioSystem();
    initBioCanvas();
    initStationWelcome();
    initBioScanner();
    initProjectFilters();
    initScrollReveal();
    initLanguageSystem();
    initMetricsCounter();
    initAvatarToggle();
    initDronePlayer();
    initDroneLightbox();
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
   2. BIO-CANVAS: METAMORFOSE ANURA REALISTA (Girinos, Imagos e Pererecas)
   Ciclo biolÃ³gico completo de anuros (Tabela de Gosner) em tempo real:
   - EstÃ¡gio 0: Girino clÃ¡ssico Ã¡pode (espiral visceral, cauda longa e nadadeira translÃºcida)
   - EstÃ¡gio 1: Girino com patas posteriores (fÃªmur, tÃ­bia, tarsos e dedinhos natatÃ³rios)
   - EstÃ¡gio 2: Imago com 4 patas funcionais e cauda em regressÃ£o ativa
   - EstÃ¡gio 3: Pererequinha adulta (sem cauda, discos adesivos/ventosas e pernada anura)
   PopulaÃ§Ã£o viva com profundidade 3D, ondulaÃ§Ã£o fÃ­sica e dispersÃ£o orgÃ¢nica
   ========================================================================== */
function initBioCanvas() {
    const canvas = document.getElementById('bio-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    function updateCanvasDimensions() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', updateCanvasDimensions);
    window.addEventListener('orientationchange', () => {
        setTimeout(updateCanvasDimensions, 150);
    });

    const pondZone = document.getElementById('tadpole-pond-zone');
    let mouseInPond = false;
    let mouseX = -1000;
    let mouseY = -1000;
    let isTouchInteraction = false;
    let touchResetTimer = null;
    const shockwaves = [];

    function isInsidePond(cx, cy) {
        if (!pondZone) return false;
        const rect = pondZone.getBoundingClientRect();
        return cx >= rect.left && cx <= rect.right && cy >= rect.top && cy <= rect.bottom;
    }

    // OndulaÃ§Ã£o suave de Ã¡gua (raio sutil e dispersÃ£o natural)
    function triggerShockwave(x, y) {
        shockwaves.push({
            x: x,
            y: y,
            radius: 4,
            maxRadius: 65,
            speed: 3.2,
            alpha: 0.85
        });
        setTimeout(() => {
            shockwaves.push({
                x: x,
                y: y,
                radius: 3,
                maxRadius: 45,
                speed: 2.2,
                alpha: 0.48
            });
        }, 75);
    }

    if (pondZone) {
        pondZone.addEventListener('mousemove', (e) => {
            if (isTouchInteraction) return;
            mouseInPond = true;
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        pondZone.addEventListener('mouseenter', (e) => {
            if (isTouchInteraction) return;
            mouseInPond = true;
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        pondZone.addEventListener('mouseleave', () => {
            mouseInPond = false;
            mouseX = -1000;
            mouseY = -1000;
        });

        pondZone.addEventListener('click', (e) => {
            if (isTouchInteraction) return;
            triggerShockwave(e.clientX, e.clientY);
        });

        pondZone.addEventListener('touchstart', (e) => {
            isTouchInteraction = true;
            mouseInPond = false;
            mouseX = -1000;
            mouseY = -1000;

            clearTimeout(touchResetTimer);
            touchResetTimer = setTimeout(() => {
                isTouchInteraction = false;
            }, 800);

            if (e.touches && e.touches.length > 0) {
                const touch = e.touches[0];
                triggerShockwave(touch.clientX, touch.clientY);
            }
        }, { passive: true });

        pondZone.addEventListener('touchend', () => {
            mouseInPond = false;
            mouseX = -1000;
            mouseY = -1000;
        }, { passive: true });

        pondZone.addEventListener('touchcancel', () => {
            mouseInPond = false;
            mouseX = -1000;
            mouseY = -1000;
        }, { passive: true });
    }

    window.addEventListener('scroll', () => {
        if (mouseInPond && !isInsidePond(mouseX, mouseY)) {
            mouseInPond = false;
            mouseX = -1000;
            mouseY = -1000;
        }
    }, { passive: true });

    const organisms = [];
    // PopulaÃ§Ã£o densa e fluida (60 FPS travado com zero GC)
    const count = width > 1024 ? 1200 : (width > 600 ? 800 : 500);

    class Organism {
        constructor(id, total) {
            this.id = id;
            this.total = total;
            this.reset(true);
        }

        reset(initial = false) {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.angle = Math.random() * Math.PI * 2;
            this.targetAngle = this.angle;
            this.speed = Math.random() * 1.3 + 1.15; // Velocidade base dinamica e vivaz (sem lentidao)

            // Ciclo de Metamorfose Anura Realista:
            // 0: Girino clÃ¡ssico Ã¡pode (~40%)
            // 1: Girino com patas traseiras mÃ³veis (~30%)
            // 2: Imago com 4 patas e cauda regredindo (~18%)
            // 3: Pererequinha adulta jovem com ventosas e pernada anura (~12%)
            const stageRatio = this.id / this.total;
            if (stageRatio < 0.40) {
                this.stage = 0;
            } else if (stageRatio < 0.70) {
                this.stage = 1;
            } else if (stageRatio < 0.88) {
                this.stage = 2;
            } else {
                this.stage = 3;
            }

            const depth = Math.random();
            this.isDeep = depth < 0.46; // Camada de fundo suave para tridimensionalidade
            if (this.isDeep) {
                this.size = Math.random() * 1.3 + 2.5;
                this.alpha = Math.random() * 0.16 + 0.12;
            } else if (depth < 0.82) {
                this.size = Math.random() * 1.8 + 4.2;
                this.alpha = Math.random() * 0.20 + 0.25;
            } else {
                this.size = Math.random() * 2.2 + 5.8;
                this.alpha = Math.random() * 0.22 + 0.38;
            }

            this.tailLength = this.stage === 2 ? this.size * 1.5 : this.size * 3.4;
            this.wigglePhase = Math.random() * Math.PI * 2;
            this.wiggleSpeed = this.stage === 3 ? (Math.random() * 0.12 + 0.13) : (Math.random() * 0.18 + 0.20);
            this.turnTimer = Math.floor(Math.random() * 90) + 35;
            this.scatterTimer = 0;
            this.isGold = Math.random() < 0.16;

            // Ciclo de pernada anura sincronizada (kick & glide)
            this.kickPhase = Math.random() * Math.PI * 2;
            this.kickSpeed = Math.random() * 0.07 + 0.08;

            // Cores prÃ©-computadas por organismo (evita gargalo de GC no canvas)
            const aStr = this.alpha.toFixed(2);
            const aFinStr = (this.alpha * 0.36).toFixed(2);
            const aViscStr = (this.alpha * 0.28).toFixed(2);
            const aIrisStr = (this.alpha * 0.75).toFixed(2);

            this.baseColor = this.isGold
                ? 'rgba(212, 175, 55, ' + aStr + ')'
                : 'rgba(78, 204, 163, ' + aStr + ')';
            this.finColor = this.isGold
                ? 'rgba(212, 175, 55, ' + aFinStr + ')'
                : 'rgba(46, 184, 114, ' + aFinStr + ')';
            this.viscColor = this.isGold
                ? 'rgba(240, 205, 90, ' + aViscStr + ')'
                : 'rgba(32, 120, 82, ' + aViscStr + ')';
            this.irisColor = this.isGold
                ? 'rgba(255, 230, 130, ' + aIrisStr + ')'
                : 'rgba(125, 245, 195, ' + aIrisStr + ')';
            this.pupilColor = 'rgba(7, 20, 11, 0.88)';
        }

        update(dt = 1.0) {
            // 1. Reacao a perturbacoes na agua (toque / clique com dispersao agil)
            for (let s = 0; s < shockwaves.length; s++) {
                const sw = shockwaves[s];
                const dx = this.x - sw.x;
                const dy = this.y - sw.y;
                const dist = Math.hypot(dx, dy);

                if (dist < sw.radius + 20 && dist > sw.radius - 16) {
                    const awayAngle = Math.atan2(dy, dx);
                    this.angle = awayAngle + (Math.random() - 0.5) * 1.5;
                    this.targetAngle = this.angle + (Math.random() - 0.5) * 0.8;
                    this.speed = Math.max(this.speed, 2.8 + Math.random() * 1.0);
                    this.scatterTimer = Math.floor(Math.random() * 80) + 40;
                    break;
                }
            }

            // 2. Comportamento natatorio organico e navegacao fluida
            if (this.scatterTimer > 0) {
                this.scatterTimer -= dt;
                this.angle += (Math.random() - 0.5) * 0.10 * dt;
            } else if (mouseInPond && !isTouchInteraction) {
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const dist = Math.hypot(dx, dy);

                if (dist < 380 && dist > 55) {
                    const toMouse = Math.atan2(dy, dx);
                    let diff = toMouse - this.angle;
                    while (diff < -Math.PI) diff += Math.PI * 2;
                    while (diff > Math.PI) diff -= Math.PI * 2;

                    const steer = Math.max(0.04, 0.14 * (1 - dist / 380));
                    this.angle += diff * Math.min(1.0, steer * dt);
                    this.speed = Math.min(this.speed + 0.08 * dt, 2.8);
                } else {
                    this.naturalSteer(dt);
                }
            } else {
                this.naturalSteer(dt);
            }

            // 3. Propulsao biomecanica real escalada por delta-time (120 FPS nativo)
            if (this.stage === 3) {
                // Pererequinha adulta: nado por pernada sincronizada (kick & glide)
                this.kickPhase += this.kickSpeed * dt;
                const kickCycle = Math.sin(this.kickPhase);
                const burst = kickCycle > 0.20 ? (kickCycle - 0.20) * 1.8 : 0;
                const currentSpeed = this.speed * (0.80 + burst);
                this.x += Math.cos(this.angle) * currentSpeed * dt;
                this.y += Math.sin(this.angle) * currentSpeed * dt;
                this.wigglePhase += this.wiggleSpeed * 0.75 * dt;
            } else {
                // Girinos e Imagos: propulsao ondulante vigorosa com cauda
                this.x += Math.cos(this.angle) * this.speed * dt;
                this.y += Math.sin(this.angle) * this.speed * dt;
                this.wigglePhase += this.wiggleSpeed * (this.speed * 1.15) * dt;
                this.kickPhase += this.kickSpeed * dt;
            }

            // Damping suave de velocidade alta independente da taxa de quadros
            if (this.speed > 1.8) {
                this.speed = 1.8 + (this.speed - 1.8) * Math.pow(0.93, dt);
            }

            // Retorno infinito continuo pelas bordas da tela
            if (this.x < -60) this.x = width + 60;
            if (this.x > width + 60) this.x = -60;
            if (this.y < -60) this.y = height + 60;
            if (this.y > height + 60) this.y = -60;
        }

        naturalSteer(dt = 1.0) {
            this.turnTimer -= dt;
            if (this.turnTimer <= 0) {
                this.targetAngle += (Math.random() - 0.5) * 1.6;
                this.turnTimer = Math.floor(Math.random() * 95) + 35;
                this.speed = Math.random() * 1.3 + 1.15;
            }

            let diff = this.targetAngle - this.angle;
            while (diff < -Math.PI) diff += Math.PI * 2;
            while (diff > Math.PI) diff -= Math.PI * 2;
            this.angle += diff * Math.min(1.0, 0.05 * dt);
        }
        draw() {
            const cos = Math.cos(this.angle);
            const sin = Math.sin(this.angle);
            ctx.setTransform(cos, sin, -sin, cos, this.x, this.y);

            if (this.isDeep) {
                this.drawDeep();
                return;
            }

            if (this.stage === 3) {
                this.drawAdultFrog();
            } else if (this.stage === 2) {
                this.drawImago();
            } else if (this.stage === 1) {
                this.drawTwoLeggedTadpole();
            } else {
                this.drawClassicTadpole();
            }
        }

        // Camada de profundidade: silhueta suave e leve
        drawDeep() {
            const wave = Math.sin(this.wigglePhase) * 1.8;
            if (this.stage === 3) {
                // Pererequinha no fundo
                ctx.beginPath();
                ctx.ellipse(0, 0, this.size * 1.25, this.size * 0.88, 0, 0, Math.PI * 2);
                ctx.fillStyle = this.baseColor;
                ctx.fill();

                const kick = Math.sin(this.kickPhase);
                const ext = kick > 0 ? kick * (this.size * 1.2) : 0;
                ctx.strokeStyle = this.baseColor;
                ctx.lineWidth = 1.1;
                ctx.beginPath();
                ctx.moveTo(-this.size * 0.4, -this.size * 0.55);
                ctx.lineTo(-this.size * 1.2 - ext, -this.size * 0.95);
                ctx.moveTo(-this.size * 0.4, this.size * 0.55);
                ctx.lineTo(-this.size * 1.2 - ext, this.size * 0.95);
                ctx.stroke();
            } else {
                // Girino no fundo
                ctx.beginPath();
                ctx.moveTo(-this.size * 0.6, 0);
                const tailLen = this.stage === 2 ? this.size * 1.5 : this.size * 3.3;
                ctx.quadraticCurveTo(-tailLen * 0.6, wave, -tailLen, wave * 1.3);
                ctx.strokeStyle = this.baseColor;
                ctx.lineWidth = 1.1;
                ctx.stroke();

                ctx.beginPath();
                ctx.ellipse(0, 0, this.size * 1.3, this.size * 0.88, 0, 0, Math.PI * 2);
                ctx.fillStyle = this.baseColor;
                ctx.fill();
            }
        }

        // Cauda ondulante com notocorda e nadadeiras dorsal/ventral translÃºcidas
        drawTail(length, segments = 5, finScale = 1.0) {
            const segLen = length / segments;
            const pts = [{ x: -this.size * 0.72, y: 0 }];
            for (let i = 1; i <= segments; i++) {
                const wave = Math.sin(this.wigglePhase - i * 0.58) * (i * 1.45);
                pts.push({ x: -this.size * 0.72 - (i * segLen), y: wave });
            }

            // Membrana natatÃ³ria (dorsal e ventral contÃ­nuas)
            ctx.beginPath();
            ctx.moveTo(pts[0].x, pts[0].y);
            for (let i = 1; i < pts.length; i++) {
                const finWidth = Math.sin((i / segments) * Math.PI) * (this.size * 0.88 * finScale);
                ctx.lineTo(pts[i].x, pts[i].y - finWidth);
            }
            for (let i = pts.length - 1; i >= 0; i--) {
                const finWidth = Math.sin((i / segments) * Math.PI) * (this.size * 0.88 * finScale);
                ctx.lineTo(pts[i].x, pts[i].y + finWidth);
            }
            ctx.closePath();
            ctx.fillStyle = this.finColor;
            ctx.fill();

            // Notocorda muscular afunilando para a ponta
            ctx.beginPath();
            ctx.moveTo(pts[0].x, pts[0].y);
            for (let i = 1; i < pts.length; i++) {
                ctx.lineTo(pts[i].x, pts[i].y);
            }
            ctx.strokeStyle = this.baseColor;
            ctx.lineWidth = Math.max(1.1, this.size * 0.22);
            ctx.stroke();
        }

        // Anatomia do corpo de girino: contorno em gota, espiral visceral e olhos
        drawTadpoleBody() {
            // Corpo em gota anura
            ctx.beginPath();
            ctx.ellipse(0, 0, this.size * 1.35, this.size * 0.92, 0, 0, Math.PI * 2);
            ctx.fillStyle = this.baseColor;
            ctx.fill();

            // Espiral visceral interna (tubo digestÃ³rio em espiral / gut coil de anuros)
            ctx.strokeStyle = this.viscColor;
            ctx.lineWidth = Math.max(0.8, this.size * 0.14);
            ctx.beginPath();
            ctx.arc(-this.size * 0.15, 0, this.size * 0.42, 0.4, Math.PI * 1.6);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(-this.size * 0.12, 0, this.size * 0.22, 0.8, Math.PI * 1.8);
            ctx.stroke();

            // Olhos dorso-laterais com Ã­ris brilhante e pupila
            this.drawEyes(this.size * 0.45, this.size * 0.48, this.size * 0.22);
        }

        // Olhos anuros com pupila e halo de Ã­ris
        drawEyes(eyeX, eyeY, eyeRadius) {
            for (let side = -1; side <= 1; side += 2) {
                const y = side * eyeY;
                // Ãris
                ctx.fillStyle = this.irisColor;
                ctx.beginPath();
                ctx.arc(eyeX, y, eyeRadius, 0, Math.PI * 2);
                ctx.fill();

                // Pupila
                ctx.fillStyle = this.pupilColor;
                ctx.beginPath();
                ctx.arc(eyeX, y, eyeRadius * 0.62, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Patas posteriores (Membros traseiros - Gosner 36-39)
        drawHindLegs(scale = 1.0, isAdult = false) {
            const kick = Math.sin(this.wigglePhase) * (this.size * 0.22);
            ctx.strokeStyle = this.baseColor;
            ctx.lineWidth = Math.max(1.2, this.size * 0.24);
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            for (let side = -1; side <= 1; side += 2) {
                const hipX = -this.size * 0.52;
                const hipY = side * (this.size * 0.70);

                // Coxa / FÃªmur
                const kneeX = -this.size * (1.10 * scale) + kick * 0.4;
                const kneeY = side * (this.size * (1.38 * scale) + Math.abs(kick) * 0.25);

                // Perna / TÃ­bia-fÃ­bula
                const ankleX = -this.size * (1.70 * scale) + kick * 0.8;
                const ankleY = side * (this.size * (0.82 * scale));

                // Tarso / AutopÃ³dio
                const toeX = -this.size * (2.20 * scale) + kick * 1.1;
                const toeY = side * (this.size * (0.62 * scale));

                ctx.beginPath();
                ctx.moveTo(hipX, hipY);
                ctx.lineTo(kneeX, kneeY);
                ctx.lineTo(ankleX, ankleY);
                ctx.lineTo(toeX, toeY);
                ctx.stroke();

                // Dedinhos posteriores (5 dÃ­gitos com membrana natatÃ³ria)
                ctx.lineWidth = Math.max(0.8, this.size * 0.15);
                ctx.beginPath();
                ctx.moveTo(ankleX, ankleY);
                ctx.lineTo(toeX - side * 1.3, toeY - side * (this.size * 0.22));
                ctx.moveTo(ankleX, ankleY);
                ctx.lineTo(toeX + 1.1, toeY + side * (this.size * 0.20));
                ctx.stroke();

                if (isAdult) {
                    // Discos adesivos (ventosas) na ponta dos dedos de perereca
                    ctx.fillStyle = this.baseColor;
                    ctx.beginPath();
                    ctx.arc(toeX, toeY, Math.max(1.1, this.size * 0.13), 0, Math.PI * 2);
                    ctx.arc(toeX - side * 1.3, toeY - side * (this.size * 0.22), Math.max(1.0, this.size * 0.12), 0, Math.PI * 2);
                    ctx.arc(toeX + 1.1, toeY + side * (this.size * 0.20), Math.max(1.0, this.size * 0.12), 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.lineWidth = Math.max(1.2, this.size * 0.24);
            }
        }

        // Patas anteriores (Membros dianteiros - Gosner 41+)
        drawFrontArms(isAdult = false) {
            ctx.strokeStyle = this.baseColor;
            ctx.lineWidth = Math.max(1.0, this.size * 0.19);
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            for (let side = -1; side <= 1; side += 2) {
                const shX = this.size * 0.22;
                const shY = side * (this.size * 0.72);

                const elbowX = this.size * 0.02;
                const elbowY = side * (this.size * 1.18);

                const handX = this.size * 0.32;
                const handY = side * (this.size * 1.42);

                ctx.beginPath();
                ctx.moveTo(shX, shY);
                ctx.lineTo(elbowX, elbowY);
                ctx.lineTo(handX, handY);
                ctx.stroke();

                // 4 Dedos na mÃ£o anterior (anatomia exata de anuro)
                ctx.lineWidth = Math.max(0.7, this.size * 0.13);
                for (let d = -1; d <= 1; d += 2) {
                    const fingerX = handX + (d * this.size * 0.18);
                    const fingerY = handY + side * (this.size * 0.22);
                    ctx.beginPath();
                    ctx.moveTo(handX, handY);
                    ctx.lineTo(fingerX, fingerY);
                    ctx.stroke();

                    if (isAdult) {
                        ctx.fillStyle = this.baseColor;
                        ctx.beginPath();
                        ctx.arc(fingerX, fingerY, Math.max(1.0, this.size * 0.12), 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
                ctx.lineWidth = Math.max(1.0, this.size * 0.19);
            }
        }

        // EstÃ¡gio 0: Girino clÃ¡ssico (Ã¡pode, cauda longa)
        drawClassicTadpole() {
            this.drawTail(this.tailLength, 5);
            this.drawTadpoleBody();
        }

        // EstÃ¡gio 1: Girino com patas posteriores em desenvolvimento
        drawTwoLeggedTadpole() {
            this.drawTail(this.tailLength, 5);
            this.drawHindLegs(1.0, false);
            this.drawTadpoleBody();
        }

        // EstÃ¡gio 2: Imago metamorfo (4 patas e cauda regredindo)
        drawImago() {
            // Cauda curta em regressÃ£o ativa
            this.drawTail(this.tailLength, 4, 0.55);
            this.drawFrontArms(false);
            this.drawHindLegs(1.15, false);

            // Corpo anuro intermediÃ¡rio
            ctx.beginPath();
            ctx.ellipse(0, 0, this.size * 1.30, this.size * 0.94, 0, 0, Math.PI * 2);
            ctx.fillStyle = this.baseColor;
            ctx.fill();

            // Espiral visceral ainda visÃ­vel
            ctx.strokeStyle = this.viscColor;
            ctx.lineWidth = Math.max(0.7, this.size * 0.12);
            ctx.beginPath();
            ctx.arc(-this.size * 0.1, 0, this.size * 0.28, 0.6, Math.PI * 1.6);
            ctx.stroke();

            // Olhos mais protuberantes
            this.drawEyes(this.size * 0.42, this.size * 0.52, this.size * 0.24);
        }

        // EstÃ¡gio 3: Pererequinha adulta jovem (sem cauda, discos adesivos e pernada anura)
        drawAdultFrog() {
            const kickCycle = Math.sin(this.kickPhase);
            const kickExt = kickCycle > 0.25 ? (kickCycle - 0.25) * 1.4 : 0;

            // Bracinhos com ventosas
            this.drawFrontArms(true);

            // Pernas traseiras longas de Hylidae com pernada sincronizada
            ctx.strokeStyle = this.baseColor;
            ctx.lineWidth = Math.max(1.3, this.size * 0.25);
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            for (let side = -1; side <= 1; side += 2) {
                const hipX = -this.size * 0.44;
                const hipY = side * (this.size * 0.62);

                const kneeX = -this.size * (0.92 + kickExt * 0.65);
                const kneeY = side * (this.size * (1.52 - kickExt * 0.45));

                const ankleX = -this.size * (1.70 + kickExt * 1.30);
                const ankleY = side * (this.size * (0.82 - kickExt * 0.42));

                const footX = -this.size * (2.35 + kickExt * 1.65);
                const footY = side * (this.size * (0.58 - kickExt * 0.35));

                ctx.beginPath();
                ctx.moveTo(hipX, hipY);
                ctx.lineTo(kneeX, kneeY);
                ctx.lineTo(ankleX, ankleY);
                ctx.lineTo(footX, footY);
                ctx.stroke();

                // Dedinhos longos com ventosas
                ctx.lineWidth = Math.max(0.8, this.size * 0.15);
                for (let d = -1; d <= 1; d++) {
                    const toeAngle = (d * 0.35);
                    const toeLen = this.size * 0.42;
                    const tipX = footX - Math.cos(toeAngle) * toeLen;
                    const tipY = footY + side * Math.sin(toeAngle) * toeLen;

                    ctx.beginPath();
                    ctx.moveTo(footX, footY);
                    ctx.lineTo(tipX, tipY);
                    ctx.stroke();

                    // Discos adesivos circulares (ventosas de Hylidae)
                    ctx.fillStyle = this.baseColor;
                    ctx.beginPath();
                    ctx.arc(tipX, tipY, Math.max(1.1, this.size * 0.13), 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.lineWidth = Math.max(1.3, this.size * 0.25);
            }

            // Corpo esguio de perereca (cabeÃ§a triangular + cintura)
            ctx.beginPath();
            ctx.moveTo(this.size * 1.35, 0);
            ctx.quadraticCurveTo(this.size * 0.75, -this.size * 0.88, -this.size * 0.15, -this.size * 0.82);
            ctx.quadraticCurveTo(-this.size * 0.65, -this.size * 0.55, -this.size * 0.85, 0);
            ctx.quadraticCurveTo(-this.size * 0.65, this.size * 0.55, -this.size * 0.15, this.size * 0.82);
            ctx.quadraticCurveTo(this.size * 0.75, this.size * 0.88, this.size * 1.35, 0);
            ctx.closePath();
            ctx.fillStyle = this.baseColor;
            ctx.fill();

            // Olhos grandes e proeminentes
            this.drawEyes(this.size * 0.40, this.size * 0.56, this.size * 0.26);
        }
    }

    for (let i = 0; i < count; i++) {
        organisms.push(new Organism(i, count));
    }

    let lastTime = performance.now();

    function animate(currentTime) {
        if (!currentTime) currentTime = performance.now();
        let deltaMs = currentTime - lastTime;
        lastTime = currentTime;

        // Normalizacao delta-time: dt = 1.0 a 60 FPS, dt = 0.5 a 120 FPS
        // Previne saltos bruscos em alternancia de aba ou congelamento
        if (deltaMs > 60 || deltaMs < 1) deltaMs = 16.667;
        const dt = deltaMs / 16.667;

        ctx.resetTransform();
        ctx.clearRect(0, 0, width, height);

        // Ondas de choque da lagoa calibradas por delta-time
        for (let i = shockwaves.length - 1; i >= 0; i--) {
            const sw = shockwaves[i];
            sw.radius += sw.speed * dt;
            sw.alpha *= Math.pow(0.94, dt);

            ctx.beginPath();
            ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(78, 204, 163, ' + (sw.alpha * 0.65) + ')';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            if (sw.radius >= sw.maxRadius || sw.alpha <= 0.02) {
                shockwaves.splice(i, 1);
            }
        }

        // Renderizacao de todos os organismos no ciclo de metamorfose com fisica normalizada
        for (let i = 0; i < organisms.length; i++) {
            const o = organisms[i];
            o.update(dt);
            o.draw();
        }

        ctx.resetTransform();
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
        { text: '\u{1F33F} Bem-vindo ao acervo cient\u00EDfico e portf\u00F3lio profissional de Lucas A\u00F8sf', gold: true },
        { text: '\u{1F7E2} Bi\u00F3logo (CRBio-01 n\u00BA 127233/01-D) \u00B7 Gestor Ambiental (Especialista UNOPAR) \u00B7 Pesquisador & Taxonomista', ok: true },
        { text: '\u{1F52C} Foco em Fauna: Especialista em Anf\u00EDbios Anuros, Mastofauna (m\u00E9dios/grandes e morcegos), Ornitologia e Entomologia' },
        { text: '\u{1F4BB} Programador Entusiasta: RStudio, Python, JavaScript, Java e HTML (PWAs de campo, bioestat\u00EDstica e modelagem)' },
        { text: '\u{1F4CD} Ampla experi\u00EAncia de campo, taxonomia cl\u00E1ssica, automa\u00E7\u00E3o de dados, laudos t\u00E9cnicos e publica\u00E7\u00F5es cient\u00EDficas', ok: true }
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
   4. INTERACTIVE AVATAR SAGE MODE TOGGLE (Currículo Real <-> Modo Sábio)
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
   4.5. DRONE FLIGHT PLAYER & HUD CONTROLLER
   ========================================================================== */
function initDronePlayer() {
    const video = document.getElementById('drone-main-video');
    const hudLoc = document.getElementById('drone-hud-location');
    const clipBtns = document.querySelectorAll('.drone-clip-btn');
    const soundBtn = document.getElementById('drone-sound-btn');
    if (!video || !clipBtns.length) return;

    clipBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            clipBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const newSrc = btn.getAttribute('data-src');
            const newLoc = btn.getAttribute('data-loc');
            if (newSrc && video.getAttribute('data-current') !== newSrc) {
                video.setAttribute('data-current', newSrc);
                video.src = newSrc;
                video.play().catch(() => {});
                if (hudLoc && newLoc) hudLoc.textContent = newLoc;
            }
        });
    });

    if (soundBtn) {
        soundBtn.addEventListener('click', () => {
            video.muted = !video.muted;
            soundBtn.innerHTML = video.muted 
                ? '<i class="fa-solid fa-volume-xmark"></i>' 
                : '<i class="fa-solid fa-volume-high"></i>';
        });
    }
}


function initDroneLightbox() {
    const cards = document.querySelectorAll('.drone-photo-card');
    const modal = document.getElementById('drone-lightbox-modal');
    const modalImg = document.getElementById('drone-lightbox-img');
    const modalCap = document.getElementById('drone-lightbox-caption');
    const modalClose = document.getElementById('drone-lightbox-close');

    if (!cards.length || !modal || !modalImg) return;

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const fullSrc = card.getAttribute('data-full');
            const caption = card.getAttribute('data-caption');
            if (fullSrc) {
                modalImg.src = fullSrc;
                if (modalCap) modalCap.innerHTML = caption || '';
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => { modalImg.src = ''; }, 280);
    };

    if (modalClose) modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('lightbox-backdrop')) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
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
            '● Conectando ao repositório de Lucas Aøsf...',
            '● Sincronizando ocorrências no banco de dados GBIF... [23.418 registros validados]',
            '● Carregando acervo bioacústico de anfíbios anuros da Mantiqueira e Bocaina...',
            '● Consultando diagnoses taxonômicas e leis do código...',
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
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.12
    });

    fadeElements.forEach(el => {
        observer.observe(el);
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            el.classList.add('visible');
        }
    });
}

/* ==========================================================================
   8. METRICS IMPACT COUNTER ANIMATION
   ========================================================================== */
function initMetricsCounter() {
    const numbers = document.querySelectorAll('.metric-number');
    let triggered = false;

    function checkMetrics() {
        if (triggered) return;
        const strip = document.querySelector('.metrics-strip');
        if (!strip) return;

        const rect = strip.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.95) {
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
    }

    window.addEventListener('scroll', checkMetrics, { passive: true });
    checkMetrics();
}

/* ==========================================================================
   9. COMPLETE BILINGUAL SYSTEM (PT / EN)
   ========================================================================== */
const translations = {
    pt: {
        pond_badge: "Lagoa dos Girinos",
        pond_instructions: "<span class=\"desktop-only\"><i class=\"fa-solid fa-arrow-pointer\"></i> Passe o mouse para atrair em cardume &bull; <i class=\"fa-solid fa-hand-pointer\"></i> Clique para dispersar</span><span class=\"mobile-only\"><i class=\"fa-solid fa-hand-pointer\"></i> Toque na água para dispersar os girinos</span>",
        tag_identity: "Identidade & Liderança",
        header_roles: "&lt;Pesquisador &middot; Taxonomista &middot; Gestor Ambiental &middot; Programador Entusiasta &middot; BioKuri&gt;",
        desc_bio: "Bi&oacute;logo (UNIFATEA), <strong>Especialista em Gest&atilde;o Ambiental (UNOPAR)</strong> e anilhador CEMAVE/ICMBio. <strong>Pesquisador, taxonomista e programador entusiasta</strong>. Especialista em fauna com foco central em <strong>Taxonomia &amp; Sistem&aacute;tica de Anf&iacute;bios Anuros</strong> e r&eacute;pteis, ampla atua&ccedil;&atilde;o em <strong>Mastofauna</strong> (m&eacute;dios e grandes mam&iacute;feros e quir&oacute;pteros/morcegos), <strong>Ornitologia</strong> e incurs&otilde;es em <strong>Entomologia</strong>. No universo tecnol&oacute;gico, atua ativamente com <strong>RStudio, Python, JavaScript, Java e HTML</strong>, desenvolvendo softwares de campo (PWAs), pipelines de bioestat&iacute;stica e modelagem de biodiversidade.",
        header_focus: "Atuação & Foco Central",
        intro_focus: "Integração pioneira entre o rigor taxonômico de museu e campo, a gestão ambiental corporativa e a engenharia de dados ecológicos.",
        focus_taxo_title: "Taxonomia, Sistem&aacute;tica &amp; Diagn&oacute;stico de Fauna Silvestre",
        focus_taxo_desc: "Especialista em <strong>anf&iacute;bios anuros</strong> (foco prim&aacute;rio em diagnose morfol&oacute;gica, bioac&uacute;stica e chaves taxon&ocirc;micas). Atua&ccedil;&atilde;o s&oacute;lida em <strong>mastofauna</strong> (m&eacute;dios e grandes mam&iacute;feros e morcegos), <strong>ornitofauna</strong> (anilhador CEMAVE/ICMBio) e amostragem de <strong>entomofauna</strong>.",
        focus_gestao_title: "Gestão Ambiental & Licenciamento de Grandes Obras",
        focus_gestao_desc: "Especialista em Gestão Ambiental (UNOPAR). Responsabilidade técnica em duplicações de rodovias, ferrovias, hidrelétricas e indústrias, elaborando diagnósticos para EIA/RIMA e laudos para órgãos ambientais estaduais (CETESB, INEA, IEMA, SEMAD, IAT, IMA, IMASUL, SEMA) e federal (IBAMA), além de programas de mitigação de impacto.",
        focus_prog_title: "Programa&ccedil;&atilde;o &amp; Ecologia Computacional (R, Python, JS, Java, HTML)",
        focus_prog_desc: "Programador entusiasta integrando <strong>RStudio e Python</strong> para minera&ccedil;&atilde;o do GBIF e an&aacute;lise multivariada de comunidades, al&eacute;m de <strong>JavaScript, Java e HTML</strong> para arquitetura de PWAs de campo, ferramentas offline e solu&ccedil;&otilde;es ambientais orientadas a dados.",
        focus_apps_title: "Engenharia de Softwares de Campo (PWAs)",
        focus_apps_desc: "Idealizador e arquiteto de PWAs como a Caderneta de Campo (georreferenciamento offline, listas de Mackinnon, exportação instantânea Excel) e Cubagem Florestal Smalian.",
        focus_drone_title: "Pilotagem de Drones & Sensoriamento Remoto (DJI Mini ao Pro & Termal)",
        focus_drone_desc: "Piloto e operador t&eacute;cnico de RPA/drones, atuando desde a linha DJI Mini at&eacute; modelos Pro e com c&acirc;mera termal para sensoriamento remoto, mapeamento a&eacute;reo de fitofisionomias, monitoramento t&eacute;rmico de fauna e inspe&ccedil;&atilde;o ambiental em &aacute;reas de dif&iacute;cil acesso.",
        drone_showcase_tag: "Aerolevantamento &amp; Imagens A&eacute;reas Reais",
drone_showcase_badge: "DJI Mini &bull; Pro &bull; C&acirc;mera Termal",
        drone_btn_showreel: "Showreel Geral",
        drone_btn_amazonia: "AmazÃ´nia",
        drone_btn_caatinga: "Caatinga",
        drone_btn_cerrado: "Cerrado",
        drone_btn_itatiaia: "Mata AtlÃ¢ntica",
        drone_btn_ilhabela: "Ilhabela",
        drone_btn_macintir: "SÃ­tio Mac Intir",
        drone_gallery_tag: "Registros FotogrÃ¡ficos AÃ©reos em Alta ResoluÃ§Ã£o",
        drone_gallery_hint: "Clique para ampliar",
        metric_years: "Anos de experiência na área",
        metric_papers: "Artigos Científicos",
        metric_projects: "Empreendimentos Atendidos",
        metric_biomes: "Biomas",
        metric_passion: "Rigor Metodológico & Conservação",
        header_stack: "Bio-Tech & Scientific Stack",
        intro_stack: "Ferramentas de computação, protocolos de amostragem zoológica e frameworks de análise ambiental aplicados rotineiramente.",
        stack_prog: "Linguagens & Ecossistema Dev",
        stack_bio: "Ciência de Dados & Biodiversidade",
        stack_field: "Amostragem Faunística & Licenciamento",
        header_projects: "Soluções Desenvolvidas & Softwares",
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
        desc_xprize: "Pesquisador colaborador com a equipe brasileira na competição global XPRIZE Rainforest (Projeto 104437). Responsável pela instalação e calibração de gravadores autônomos para captação contínua e análise bioacústica de vocalizações em floresta tropical.",
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
        exp_southwild: "Biólogo responsável por pesquisa de campo com grandes felinos, com foco em Puma concolor (onça-parda/suçuarana) e mastofauna na Serra do Mar em Itanhaém/SP, realizando amostragem com armadilhas fotográficas e levantamento de rastros e indícios.",
        exp_rnt: "Atuação no monitoramento técnico de vida marinha, acompanhamento de ecossistemas costeiros, orientação técnica e ações de educação ambiental marinha e conservação costeira em Ilhabela e São Sebastião/SP.",
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
        manifesto_quote: "&ldquo;A verdadeira conserva&ccedil;&atilde;o come&ccedil;a no ch&atilde;o da mata, reconhecendo cada esp&eacute;cie por sua voz e sua identidade. Quando unimos o rigor da taxonomia cl&aacute;ssica &agrave; intelig&ecirc;ncia dos dados e da gest&atilde;o ambiental, transformamos o conhecimento cient&iacute;fico em legado para a biodiversidade.&rdquo;",
        manifesto_cite: "&mdash; Lucas A&oslash;sf, Bi&oacute;logo, Gestor Ambiental &amp; S&oacute;cio Fundador da BioKuri",
        header_sage_mode: "Modo Sábio // Invocação dos Sapos",
        desc_sage_intro: "Animação do avatar oficial do GitHub: uma homenagem lúdica ao fascínio e à dedicação aos anfíbios anuros. Empregando a clássica invocação ninja (Kuchiyose no Jutsu), o selo no chão canaliza energia elétrica convocando o sapo gigante guardião e os mestres anfíbios da floresta.",
        btn_toggle_sage: "Modo Sábio",
        btn_toggle_real: "Foto Real",
        footer_copy: "&copy; 2026 Lucas A&oslash;sf &middot; Bi&oacute;logo (CRBio-01 n&ordm; 127233/01-D) &amp; Gestor Ambiental &middot; Todos os direitos reservados."
    },
    en: {
                pond_badge: "Tadpole Lagoon",
        pond_instructions: "<span class=\"desktop-only\"><i class=\"fa-solid fa-arrow-pointer\"></i> Hover cursor to attract in a school &bull; <i class=\"fa-solid fa-hand-pointer\"></i> Click to scatter</span><span class=\"mobile-only\"><i class=\"fa-solid fa-hand-pointer\"></i> Tap water to scatter tadpoles</span>",
        tag_identity: "Identity & Leadership",
        header_roles: "&lt;Researcher &middot; Taxonomist &middot; Environmental Manager &middot; Enthusiast Programmer &middot; BioKuri&gt;",
        desc_bio: "Biologist (UNIFATEA), <strong>Environmental Management Specialist (UNOPAR)</strong> and CEMAVE/ICMBio bird bander. <strong>Researcher, taxonomist, and enthusiast programmer</strong>. Wildlife specialist with core focus on <strong>Anuran Amphibian &amp; Reptile Taxonomy and Systematics</strong>, extensive field experience in <strong>Mammalogy</strong> (medium/large mammals and bats/chiropterans), <strong>Ornithology</strong>, and field expeditions in <strong>Entomology</strong>. In technology, actively codes in <strong>RStudio, Python, JavaScript, Java, and HTML</strong>, engineering offline field software (PWAs), biostatistical pipelines, and biodiversity modeling.",
        header_focus: "Focus & Core Expertise",
        intro_focus: "Pioneering integration of classical museum & field taxonomy, corporate environmental management, and ecological data science.",
        focus_taxo_title: "Wildlife Taxonomy, Systematics &amp; Field Monitoring",
        focus_taxo_desc: "Specialist in <strong>anuran amphibians</strong> (core focus in morphological diagnosis, bioacoustics, and taxonomic keys). Extensive field practice in <strong>mammalogy</strong> (medium/large mammals and bats), <strong>ornithology</strong> (CEMAVE/ICMBio bander), and <strong>entomology</strong> field surveys.",
        focus_gestao_title: "Environmental Management & Major Project Licensing",
        focus_gestao_desc: "Specialist in Environmental Management (UNOPAR). Technical Lead across highways, railways, hydroelectric dams, and pulp mills, preparing EIA/RIMA diagnoses and technical reports for state environmental agencies (CETESB, INEA, IEMA, SEMAD, IAT, IMA, IMASUL, SEMA) and federal IBAMA, alongside impact mitigation programs.",
        focus_prog_title: "Programming &amp; Computational Ecology (R, Python, JS, Java, HTML)",
        focus_prog_desc: "Enthusiast programmer pairing <strong>RStudio and Python</strong> for GBIF data mining and multivariate community ecology, alongside <strong>JavaScript, Java, and HTML</strong> for offline field PWAs and data-driven environmental solutions.",
        focus_apps_title: "Field Software Engineering (PWAs)",
        focus_apps_desc: "Creator and software architect of offline-first PWAs such as Caderneta de Campo (GPS geotagging, Mackinnon lists, automated Excel export) and Smalian Timber Scaler.",
        focus_drone_title: "Drone Piloting & Remote Sensing (DJI Mini to Pro & Thermal)",
        focus_drone_desc: "Technical RPA/drone pilot and operator, ranging from DJI Mini to Pro models and thermal sensor cameras for remote sensing, aerial vegetation mapping, thermal wildlife surveys, and environmental inspection of rugged terrain.",
        drone_showcase_tag: "Real Aerial Surveys & High-Altitude Drone Footage",
drone_showcase_badge: "DJI Mini &bull; Pro &bull; Thermal Sensors",
        drone_btn_showreel: "General Showreel",
        drone_btn_amazonia: "Amazon Rainforest",
        drone_btn_caatinga: "Caatinga",
        drone_btn_cerrado: "Cerrado",
        drone_btn_itatiaia: "Atlantic Forest",
        drone_btn_ilhabela: "Ilhabela Island",
        drone_btn_macintir: "Mac Intir Site",
        drone_gallery_tag: "High-Resolution Aerial Drone Photo Collection",
        drone_gallery_hint: "Click to enlarge",
        metric_years: "Years of experience in the field",
        metric_papers: "Scientific Articles",
        metric_projects: "Enterprise Projects Handled",
        metric_biomes: "Biomes",
        metric_passion: "Scientific Rigor & Conservation",
        header_stack: "Bio-Tech & Scientific Stack",
        intro_stack: "Computational tools, zoological sampling standards, and data frameworks routinely utilized.",
        stack_prog: "Coding & Dev Ecosystem",
        stack_bio: "Data Science & Biodiversity",
        stack_field: "Field Sampling & Environmental Licensing",
        header_projects: "Developed Solutions & Software",
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
        desc_xprize: "Collaborating researcher with the Brazilian Team in the global XPRIZE Rainforest competition (Project 104437). Responsible for installing and calibrating autonomous acoustic recorders for continuous rainforest soundscape monitoring.",
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
        exp_southwild: "Field biologist leading wild feline research focusing on Puma concolor (mountain lion/cougar) and associated mammals in the Serra do Mar coastal mountains in Itanhaém/SP, utilizing camera traps and track surveys.",
        exp_rnt: "Technical monitoring of marine life, coastal ecosystem assessments, environmental orientation, and coastal conservation actions in Ilhabela and São Sebastião/SP.",
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
        manifesto_quote: "&ldquo;True conservation begins on the forest floor, identifying every species by its voice and its identity. By bridging the rigor of classical taxonomy with data intelligence and environmental management, we turn scientific knowledge into an enduring legacy for biodiversity.&rdquo;",
        manifesto_cite: "&mdash; Lucas A&oslash;sf, Biologist, Environmental Manager &amp; Co-founder of BioKuri",
        header_sage_mode: "Sage Mode // Toad Summoning",
        desc_sage_intro: "Animation of the official GitHub avatar: a playful homage to the lifelong fascination and dedication to anuran amphibians. Utilizing the classic summoning jutsu (Kuchiyose no Jutsu), the floor seal channels electric energy to summon the giant guardian toad and forest amphibian masters.",
        btn_toggle_sage: "Sage Mode",
        btn_toggle_real: "Real Photo",
        footer_copy: "&copy; 2026 Lucas A&oslash;sf &middot; Biologist (CRBio-01 no. 127233/01-D) &amp; Environmental Manager &middot; All rights reserved."
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

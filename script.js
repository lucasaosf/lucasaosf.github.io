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
    initFieldMap();
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
            // Velocidade calibrada: cadencia biologica equilibrada (nem rapido, nem lento)
            this.speed = Math.random() * 0.35 + 0.65;

            // Metamorfose Anura Realista (Gosner 25 - 46):
            // 0: Girino apode com espiral intestinal, miotomos e nadadeiras (Gosner 25) (~40%)
            // 1: Girino com membros posteriores e membrana natatoria (Gosner 37-39) (~30%)
            // 2: Imago metamorfico com 4 membros e cauda em reabsorcao (Gosner 42-44) (~18%)
            // 3: Jovem perereca Hylidae com ventosas, sem cauda e pernada sincrona (Gosner 46) (~12%)
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
            this.isDeep = depth < 0.44; // Camada de fundo suave para profundidade optica
            if (this.isDeep) {
                this.size = Math.random() * 1.4 + 2.8;
                this.alpha = Math.random() * 0.16 + 0.14;
            } else if (depth < 0.82) {
                this.size = Math.random() * 1.8 + 4.6;
                this.alpha = Math.random() * 0.20 + 0.28;
            } else {
                this.size = Math.random() * 2.2 + 6.6;
                this.alpha = Math.random() * 0.20 + 0.40;
            }

            this.tailLength = this.stage === 2 ? this.size * 1.6 : this.size * 3.4;
            this.wigglePhase = Math.random() * Math.PI * 2;
            // Frequencia de batimento caudal e pernada calibradas de forma natural
            this.wiggleSpeed = this.stage === 3 ? (Math.random() * 0.05 + 0.055) : (Math.random() * 0.08 + 0.085);
            this.turnTimer = Math.floor(Math.random() * 110) + 40;
            this.scatterTimer = 0;
            this.isGold = Math.random() < 0.16;

            // Ciclo de pernada anura sincronizada (kick & glide)
            this.kickPhase = Math.random() * Math.PI * 2;
            this.kickSpeed = Math.random() * 0.035 + 0.038;

            // Cores pre-computadas por organismo (evita GC allocations)
            const aStr = this.alpha.toFixed(2);
            const aFinStr = (this.alpha * 0.35).toFixed(2);
            const aViscStr = (this.alpha * 0.42).toFixed(2);
            const aCoreStr = (this.alpha * 0.26).toFixed(2);
            const aIrisStr = (this.alpha * 0.85).toFixed(2);
            const aSpotStr = (this.alpha * 0.48).toFixed(2);
            const aWebStr = (this.alpha * 0.30).toFixed(2);
            const aMyoStr = (this.alpha * 0.32).toFixed(2);

            // Paleta biologica de Mata Atlantica (tons olivaceos / dourados-bronze)
            this.baseColor = this.isGold
                ? 'rgba(214, 178, 70, ' + aStr + ')'
                : 'rgba(64, 185, 140, ' + aStr + ')';
            this.finColor = this.isGold
                ? 'rgba(225, 195, 100, ' + aFinStr + ')'
                : 'rgba(50, 165, 120, ' + aFinStr + ')';
            this.viscColor = this.isGold
                ? 'rgba(180, 135, 45, ' + aViscStr + ')'
                : 'rgba(18, 80, 52, ' + aViscStr + ')';
            this.coreColor = this.isGold
                ? 'rgba(235, 205, 120, ' + aCoreStr + ')'
                : 'rgba(80, 210, 160, ' + aCoreStr + ')';
            this.irisColor = this.isGold
                ? 'rgba(255, 225, 110, ' + aIrisStr + ')'
                : 'rgba(140, 245, 200, ' + aIrisStr + ')';
            this.pupilColor = 'rgba(5, 15, 10, 0.95)';
            this.spotColor = this.isGold
                ? 'rgba(130, 90, 25, ' + aSpotStr + ')'
                : 'rgba(15, 52, 34, ' + aSpotStr + ')';
            this.webColor = this.isGold
                ? 'rgba(214, 178, 70, ' + aWebStr + ')'
                : 'rgba(64, 185, 140, ' + aWebStr + ')';
            this.myoColor = this.isGold
                ? 'rgba(150, 110, 35, ' + aMyoStr + ')'
                : 'rgba(20, 72, 48, ' + aMyoStr + ')';
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
                    this.angle = awayAngle + (Math.random() - 0.5) * 1.4;
                    this.targetAngle = this.angle + (Math.random() - 0.5) * 0.8;
                    this.speed = Math.max(this.speed, 2.0 + Math.random() * 0.5);
                    this.scatterTimer = Math.floor(Math.random() * 60) + 30;
                    break;
                }
            }

            // 2. Comportamento natatorio organico e navegacao equilibrada
            if (this.scatterTimer > 0) {
                this.scatterTimer -= dt;
                this.angle += (Math.random() - 0.5) * 0.08 * dt;
            } else if (mouseInPond && !isTouchInteraction) {
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const dist = Math.hypot(dx, dy);

                if (dist < 380 && dist > 55) {
                    const toMouse = Math.atan2(dy, dx);
                    let diff = toMouse - this.angle;
                    while (diff < -Math.PI) diff += Math.PI * 2;
                    while (diff > Math.PI) diff -= Math.PI * 2;

                    const steer = Math.max(0.025, 0.10 * (1 - dist / 380));
                    this.angle += diff * Math.min(1.0, steer * dt);
                    this.speed = Math.min(this.speed + 0.04 * dt, 1.40);
                } else {
                    this.naturalSteer(dt);
                }
            } else {
                this.naturalSteer(dt);
            }

            // 3. Propulsao biomecanica real escalada por delta-time
            if (this.stage === 3) {
                // Pererequinha adulta: nado por pernada sincronizada (kick & glide)
                this.kickPhase += this.kickSpeed * dt;
                const kickCycle = Math.sin(this.kickPhase);
                const burst = kickCycle > 0.20 ? (kickCycle - 0.20) * 1.35 : 0;
                const currentSpeed = this.speed * (0.85 + burst);
                this.x += Math.cos(this.angle) * currentSpeed * dt;
                this.y += Math.sin(this.angle) * currentSpeed * dt;
                this.wigglePhase += this.wiggleSpeed * 0.70 * dt;
            } else {
                // Girinos e Imagos: propulsao ondulante moderada e suave com cauda
                this.x += Math.cos(this.angle) * this.speed * dt;
                this.y += Math.sin(this.angle) * this.speed * dt;
                this.wigglePhase += this.wiggleSpeed * (this.speed * 1.05 + 0.25) * dt;
                this.kickPhase += this.kickSpeed * dt;
            }

            // Damping suave para velocidade de cruzeiro equilibrada (nem muito rapido nem lento)
            if (this.speed > 0.95) {
                this.speed = 0.95 + (this.speed - 0.95) * Math.pow(0.92, dt);
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
                this.targetAngle += (Math.random() - 0.5) * 1.5;
                this.turnTimer = Math.floor(Math.random() * 110) + 40;
                this.speed = Math.random() * 0.35 + 0.65;
            }

            let diff = this.targetAngle - this.angle;
            while (diff < -Math.PI) diff += Math.PI * 2;
            while (diff > Math.PI) diff -= Math.PI * 2;
            this.angle += diff * Math.min(1.0, 0.04 * dt);
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
            const wave = Math.sin(this.wigglePhase) * 1.4;
            if (this.stage === 3) {
                // Pererequinha no fundo
                ctx.beginPath();
                ctx.ellipse(0, 0, this.size * 1.25, this.size * 0.85, 0, 0, Math.PI * 2);
                ctx.fillStyle = this.baseColor;
                ctx.fill();

                const kick = Math.sin(this.kickPhase);
                const ext = kick > 0 ? kick * (this.size * 1.1) : 0;
                ctx.strokeStyle = this.baseColor;
                ctx.lineWidth = 1.1;
                ctx.beginPath();
                ctx.moveTo(-this.size * 0.4, -this.size * 0.55);
                ctx.lineTo(-this.size * 1.1 - ext, -this.size * 0.90);
                ctx.moveTo(-this.size * 0.4, this.size * 0.55);
                ctx.lineTo(-this.size * 1.1 - ext, this.size * 0.90);
                ctx.stroke();
            } else {
                // Girino no fundo
                ctx.beginPath();
                ctx.moveTo(-this.size * 0.6, 0);
                const tailLen = this.stage === 2 ? this.size * 1.5 : this.size * 3.3;
                ctx.quadraticCurveTo(-tailLen * 0.55, wave, -tailLen, wave * 1.2);
                ctx.strokeStyle = this.baseColor;
                ctx.lineWidth = 1.1;
                ctx.stroke();

                ctx.beginPath();
                ctx.ellipse(0, 0, this.size * 1.28, this.size * 0.86, 0, 0, Math.PI * 2);
                ctx.fillStyle = this.baseColor;
                ctx.fill();
            }
        }

        // Cauda ondulante realista com notocorda, miotomos em chevron e nadadeiras translucidas
        drawTail(length, segments = 6, finScale = 1.0) {
            const segLen = length / segments;
            const pts = [{ x: -this.size * 0.72, y: 0 }];
            for (let i = 1; i <= segments; i++) {
                const wave = Math.sin(this.wigglePhase - i * 0.52) * (i * 1.30);
                pts.push({ x: -this.size * 0.72 - (i * segLen), y: wave });
            }

            // 1. Nadadeira dorsal e ventral (membrana caudal translucida de anuro)
            // A nadadeira dorsal em Hylidae se estende anterior sobre o terco posterior do corpo
            ctx.beginPath();
            ctx.moveTo(-this.size * 0.35, 0);
            for (let i = 1; i < pts.length; i++) {
                const arch = Math.sin((i / segments) * Math.PI);
                const finHeight = arch * (this.size * 0.95 * finScale);
                ctx.lineTo(pts[i].x, pts[i].y - finHeight);
            }
            const lastPt = pts[pts.length - 1];
            ctx.lineTo(lastPt.x - 1.5, lastPt.y);

            // Nadadeira ventral
            for (let i = pts.length - 1; i >= 1; i--) {
                const arch = Math.sin((i / segments) * Math.PI);
                const finHeight = arch * (this.size * 0.85 * finScale);
                ctx.lineTo(pts[i].x, pts[i].y + finHeight);
            }
            ctx.lineTo(-this.size * 0.70, 0);
            ctx.closePath();
            ctx.fillStyle = this.finColor;
            ctx.fill();

            // 2. Pontuacoes de melanoforos na nadadeira (padrao de camuflagem de girino)
            if (this.size > 4.5) {
                ctx.fillStyle = this.spotColor;
                for (let i = 2; i < pts.length - 1; i += 2) {
                    const arch = Math.sin((i / segments) * Math.PI);
                    const fh = arch * (this.size * 0.50 * finScale);
                    ctx.beginPath();
                    ctx.arc(pts[i].x, pts[i].y - fh, Math.max(0.6, this.size * 0.08), 0, Math.PI * 2);
                    ctx.arc(pts[i].x + 1.2, pts[i].y + fh * 0.7, Math.max(0.5, this.size * 0.07), 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            // 3. Musculatura Caudal / Notocorda (feixe muscular robusto afunilado)
            ctx.beginPath();
            ctx.moveTo(pts[0].x, pts[0].y);
            for (let i = 1; i < pts.length; i++) {
                ctx.lineTo(pts[i].x, pts[i].y);
            }
            ctx.strokeStyle = this.baseColor;
            ctx.lineWidth = Math.max(1.2, this.size * 0.32);
            ctx.lineCap = 'round';
            ctx.stroke();

            // 4. Miotomos (linhas mioseptais em chevron '>' ao longo do eixo muscular)
            if (this.size > 4.2) {
                ctx.strokeStyle = this.myoColor;
                ctx.lineWidth = Math.max(0.6, this.size * 0.10);
                for (let i = 1; i < pts.length - 1; i++) {
                    const px = pts[i].x;
                    const py = pts[i].y;
                    const armLen = this.size * 0.22;
                    ctx.beginPath();
                    ctx.moveTo(px - armLen * 0.7, py - armLen);
                    ctx.lineTo(px, py);
                    ctx.lineTo(px - armLen * 0.7, py + armLen);
                    ctx.stroke();
                }
            }
        }

        // Anatomia biologica do corpo de girino: contorno em gota/ovoide, espiral visceral, espiraculo e olhos
        drawTadpoleBody() {
            // 1. Contorno biologico realista do corpo em vista dorsal (ovoide deprimido)
            ctx.beginPath();
            ctx.moveTo(this.size * 1.38, 0); // Focinho arredondado
            ctx.quadraticCurveTo(this.size * 1.15, -this.size * 0.65, this.size * 0.45, -this.size * 0.88); // Bochechas / arco orbitario
            ctx.quadraticCurveTo(-this.size * 0.10, -this.size * 0.95, -this.size * 0.55, -this.size * 0.68); // Flanco lateral
            ctx.quadraticCurveTo(-this.size * 0.78, -this.size * 0.35, -this.size * 0.78, 0); // Insercao caudal
            ctx.quadraticCurveTo(-this.size * 0.78, this.size * 0.35, -this.size * 0.55, this.size * 0.68);
            ctx.quadraticCurveTo(-this.size * 0.10, this.size * 0.95, this.size * 0.45, this.size * 0.88);
            ctx.quadraticCurveTo(this.size * 1.15, this.size * 0.65, this.size * 1.38, 0);
            ctx.closePath();
            ctx.fillStyle = this.baseColor;
            ctx.fill();

            // 2. Transparencia visceral / Anatomia interna (tipica de descricoes taxonomicas)
            ctx.fillStyle = this.coreColor;
            ctx.beginPath();
            ctx.ellipse(this.size * 0.30, 0, this.size * 0.42, this.size * 0.38, 0, 0, Math.PI * 2);
            ctx.fill();

            // Espiral visceral intestinal (gut coil / dupla alca espiralada concentrica)
            ctx.strokeStyle = this.viscColor;
            ctx.lineWidth = Math.max(0.8, this.size * 0.15);
            ctx.beginPath();
            ctx.arc(-this.size * 0.18, 0, this.size * 0.44, 0.35, Math.PI * 1.65);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(-this.size * 0.16, 0, this.size * 0.24, 0.75, Math.PI * 1.85);
            ctx.stroke();

            // 3. Espiraculo sinistro (tubo espiracular no flanco esquerdo)
            ctx.strokeStyle = this.spotColor;
            ctx.lineWidth = Math.max(0.6, this.size * 0.10);
            ctx.beginPath();
            ctx.moveTo(-this.size * 0.08, -this.size * 0.88);
            ctx.lineTo(-this.size * 0.22, -this.size * 0.96);
            ctx.stroke();

            // 4. Narinas (pequenas fendas anterodorsais)
            ctx.fillStyle = this.spotColor;
            ctx.beginPath();
            ctx.arc(this.size * 1.05, -this.size * 0.18, Math.max(0.5, this.size * 0.06), 0, Math.PI * 2);
            ctx.arc(this.size * 1.05, this.size * 0.18, Math.max(0.5, this.size * 0.06), 0, Math.PI * 2);
            ctx.fill();

            // 5. Melanoforos dorsais sutis (manchas de pigmento dermico)
            if (this.size > 4.2) {
                ctx.fillStyle = this.spotColor;
                ctx.beginPath();
                ctx.arc(this.size * 0.65, -this.size * 0.25, Math.max(0.6, this.size * 0.08), 0, Math.PI * 2);
                ctx.arc(this.size * 0.65, this.size * 0.25, Math.max(0.6, this.size * 0.08), 0, Math.PI * 2);
                ctx.arc(-this.size * 0.45, -this.size * 0.22, Math.max(0.7, this.size * 0.09), 0, Math.PI * 2);
                ctx.arc(-this.size * 0.45, this.size * 0.22, Math.max(0.7, this.size * 0.09), 0, Math.PI * 2);
                ctx.fill();
            }

            // 6. Olhos dorsolaterais proeminentes salientes do contorno
            this.drawEyes(this.size * 0.48, this.size * 0.52, this.size * 0.24);
        }

        // Olhos anuros com iris metalica, pupila e reflexo corneal
        drawEyes(eyeX, eyeY, eyeRadius) {
            for (let side = -1; side <= 1; side += 2) {
                const y = side * eyeY;
                ctx.fillStyle = this.irisColor;
                ctx.beginPath();
                ctx.arc(eyeX, y, eyeRadius, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = this.pupilColor;
                ctx.beginPath();
                ctx.arc(eyeX, y, eyeRadius * 0.60, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = 'rgba(255, 255, 255, 0.70)';
                ctx.beginPath();
                ctx.arc(eyeX + eyeRadius * 0.22, y - side * eyeRadius * 0.22, eyeRadius * 0.24, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Patas posteriores com 5 dedos e membrana natatoria (Gosner 37-39)
        drawHindLegs(scale = 1.0, isAdult = false) {
            const kick = Math.sin(this.wigglePhase) * (this.size * 0.22);
            ctx.strokeStyle = this.baseColor;
            ctx.lineWidth = Math.max(1.2, this.size * 0.24);
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            for (let side = -1; side <= 1; side += 2) {
                const hipX = -this.size * 0.52;
                const hipY = side * (this.size * 0.68);

                // Coxa / Femur
                const kneeX = -this.size * (1.10 * scale) + kick * 0.35;
                const kneeY = side * (this.size * (1.38 * scale) + Math.abs(kick) * 0.20);

                // Perna / Tibia-fibula
                const ankleX = -this.size * (1.68 * scale) + kick * 0.75;
                const ankleY = side * (this.size * (0.80 * scale));

                // Tarso e Pe
                const footX = -this.size * (2.15 * scale) + kick * 1.05;
                const footY = side * (this.size * (0.60 * scale));

                ctx.beginPath();
                ctx.moveTo(hipX, hipY);
                ctx.lineTo(kneeX, kneeY);
                ctx.lineTo(ankleX, ankleY);
                ctx.lineTo(footX, footY);
                ctx.stroke();

                // 5 Digitos posteriores com hierarquia anura real (IV > III > V > II > I)
                const toeAngles = [-0.48, -0.24, 0.0, 0.26, 0.50];
                const toeLengths = [
                    this.size * 0.32 * scale,
                    this.size * 0.44 * scale,
                    this.size * 0.62 * scale,
                    this.size * 0.75 * scale,
                    this.size * 0.54 * scale
                ];

                const toePts = [];
                for (let d = 0; d < 5; d++) {
                    const ang = toeAngles[d];
                    const tLen = toeLengths[d];
                    const tx = footX - Math.cos(ang) * tLen;
                    const ty = footY + side * Math.sin(ang) * tLen;
                    toePts.push({ x: tx, y: ty });
                }

                // Membrana interdigital translucida
                ctx.fillStyle = this.webColor;
                ctx.beginPath();
                ctx.moveTo(footX, footY);
                for (let d = 0; d < 5; d++) {
                    ctx.lineTo(toePts[d].x, toePts[d].y);
                }
                ctx.closePath();
                ctx.fill();

                // Ossos dos dedos e ventosas
                ctx.strokeStyle = this.baseColor;
                ctx.lineWidth = Math.max(0.7, this.size * 0.12);
                for (let d = 0; d < 5; d++) {
                    ctx.beginPath();
                    ctx.moveTo(footX, footY);
                    ctx.lineTo(toePts[d].x, toePts[d].y);
                    ctx.stroke();

                    if (isAdult) {
                        ctx.fillStyle = this.baseColor;
                        ctx.beginPath();
                        ctx.arc(toePts[d].x, toePts[d].y, Math.max(1.1, this.size * 0.13), 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
                ctx.lineWidth = Math.max(1.2, this.size * 0.24);
            }
        }

        // Patas anteriores com 4 dedos livres (Gosner 41+)
        drawFrontArms(isAdult = false) {
            ctx.strokeStyle = this.baseColor;
            ctx.lineWidth = Math.max(1.0, this.size * 0.20);
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            for (let side = -1; side <= 1; side += 2) {
                const shX = this.size * 0.28;
                const shY = side * (this.size * 0.74);

                const elbowX = this.size * 0.08;
                const elbowY = side * (this.size * 1.20);

                const wristX = this.size * 0.38;
                const wristY = side * (this.size * 1.45);

                ctx.beginPath();
                ctx.moveTo(shX, shY);
                ctx.lineTo(elbowX, elbowY);
                ctx.lineTo(wristX, wristY);
                ctx.stroke();

                // 4 Dedos na mao anterior (anatomia estrita de Anura)
                const armAngles = [-0.40, -0.12, 0.15, 0.42];
                const armLens = [this.size * 0.28, this.size * 0.35, this.size * 0.36, this.size * 0.26];
                ctx.lineWidth = Math.max(0.7, this.size * 0.12);

                for (let d = 0; d < 4; d++) {
                    const fx = wristX + Math.sin(armAngles[d]) * armLens[d];
                    const fy = wristY + side * Math.cos(armAngles[d]) * armLens[d];

                    ctx.beginPath();
                    ctx.moveTo(wristX, wristY);
                    ctx.lineTo(fx, fy);
                    ctx.stroke();

                    if (isAdult) {
                        ctx.fillStyle = this.baseColor;
                        ctx.beginPath();
                        ctx.arc(fx, fy, Math.max(1.0, this.size * 0.12), 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
                ctx.lineWidth = Math.max(1.0, this.size * 0.20);
            }
        }

        // Estagio 0: Girino classico apode (Gosner 25)
        drawClassicTadpole() {
            this.drawTail(this.tailLength, 6);
            this.drawTadpoleBody();
        }

        // Estagio 1: Girino com patas posteriores em desenvolvimento (Gosner 37-39)
        drawTwoLeggedTadpole() {
            this.drawTail(this.tailLength, 6);
            this.drawHindLegs(1.0, false);
            this.drawTadpoleBody();
        }

        // Estagio 2: Imago metamorfico (4 patas e cauda regredindo) (Gosner 42-44)
        drawImago() {
            // Cauda curta em reabsorcao ativa (apoptose tecidual)
            this.drawTail(this.tailLength, 5, 0.50);
            this.drawFrontArms(false);
            this.drawHindLegs(1.15, false);

            // Corpo anuro intermediario
            ctx.beginPath();
            ctx.moveTo(this.size * 1.40, 0);
            ctx.quadraticCurveTo(this.size * 1.05, -this.size * 0.75, 0, -this.size * 0.88);
            ctx.quadraticCurveTo(-this.size * 0.60, -this.size * 0.60, -this.size * 0.82, 0);
            ctx.quadraticCurveTo(-this.size * 0.60, this.size * 0.60, 0, this.size * 0.88);
            ctx.quadraticCurveTo(this.size * 1.05, this.size * 0.75, this.size * 1.40, 0);
            ctx.closePath();
            ctx.fillStyle = this.baseColor;
            ctx.fill();

            // Espiral visceral ainda visivel em regressao
            ctx.strokeStyle = this.viscColor;
            ctx.lineWidth = Math.max(0.7, this.size * 0.12);
            ctx.beginPath();
            ctx.arc(-this.size * 0.12, 0, this.size * 0.28, 0.6, Math.PI * 1.6);
            ctx.stroke();

            // Olhos mais protuberantes
            this.drawEyes(this.size * 0.44, this.size * 0.54, this.size * 0.25);
        }

        // Estagio 3: Jovem pererequinha adulta (Gosner 46 - sem cauda, ventosas e pernada anura)
        drawAdultFrog() {
            const kickCycle = Math.sin(this.kickPhase);
            const kickExt = kickCycle > 0.20 ? (kickCycle - 0.20) * 1.45 : 0;

            // 1. Membros anteriores com ventosas
            this.drawFrontArms(true);

            // 2. Membros posteriores longos e ageis em Z-fold
            ctx.strokeStyle = this.baseColor;
            ctx.lineWidth = Math.max(1.3, this.size * 0.26);
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            for (let side = -1; side <= 1; side += 2) {
                const hipX = -this.size * 0.46;
                const hipY = side * (this.size * 0.58);

                const kneeX = -this.size * (0.95 + kickExt * 0.65);
                const kneeY = side * (this.size * (1.52 - kickExt * 0.48));

                const ankleX = -this.size * (1.72 + kickExt * 1.30);
                const ankleY = side * (this.size * (0.80 - kickExt * 0.42));

                const footX = -this.size * (2.35 + kickExt * 1.65);
                const footY = side * (this.size * (0.55 - kickExt * 0.35));

                ctx.beginPath();
                ctx.moveTo(hipX, hipY);
                ctx.lineTo(kneeX, kneeY);
                ctx.lineTo(ankleX, ankleY);
                ctx.lineTo(footX, footY);
                ctx.stroke();

                // 5 Dedos longos com membrana natatoria e ventosas de Hylidae
                const toeAngles = [-0.50, -0.25, 0.0, 0.25, 0.50];
                const toeLens = [
                    this.size * 0.35,
                    this.size * 0.48,
                    this.size * 0.68,
                    this.size * 0.82,
                    this.size * 0.58
                ];
                const toePts = [];
                for (let d = 0; d < 5; d++) {
                    const ang = toeAngles[d];
                    const tLen = toeLens[d];
                    const tipX = footX - Math.cos(ang) * tLen;
                    const tipY = footY + side * Math.sin(ang) * tLen;
                    toePts.push({ x: tipX, y: tipY });
                }

                // Membrana interdigital translucida
                ctx.fillStyle = this.webColor;
                ctx.beginPath();
                ctx.moveTo(footX, footY);
                for (let d = 0; d < 5; d++) {
                    ctx.lineTo(toePts[d].x, toePts[d].y);
                }
                ctx.closePath();
                ctx.fill();

                // Dedos e discos adesivos
                ctx.strokeStyle = this.baseColor;
                ctx.lineWidth = Math.max(0.7, this.size * 0.13);
                for (let d = 0; d < 5; d++) {
                    ctx.beginPath();
                    ctx.moveTo(footX, footY);
                    ctx.lineTo(toePts[d].x, toePts[d].y);
                    ctx.stroke();

                    ctx.fillStyle = this.baseColor;
                    ctx.beginPath();
                    ctx.arc(toePts[d].x, toePts[d].y, Math.max(1.1, this.size * 0.13), 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.lineWidth = Math.max(1.3, this.size * 0.26);
            }

            // 3. Tronco esguio de Hylidae com crista sacral e cintura nitida
            ctx.beginPath();
            ctx.moveTo(this.size * 1.45, 0); // Focinho triangular proeminente
            ctx.quadraticCurveTo(this.size * 0.95, -this.size * 0.88, -this.size * 0.15, -this.size * 0.82);
            ctx.quadraticCurveTo(-this.size * 0.50, -this.size * 0.52, -this.size * 0.90, 0);
            ctx.quadraticCurveTo(-this.size * 0.50, this.size * 0.52, -this.size * 0.15, this.size * 0.82);
            ctx.quadraticCurveTo(this.size * 0.95, this.size * 0.88, this.size * 1.45, 0);
            ctx.closePath();
            ctx.fillStyle = this.baseColor;
            ctx.fill();

            // 4. Mancha criptica dorsal sutil
            if (this.size > 4.5) {
                ctx.fillStyle = this.spotColor;
                ctx.beginPath();
                ctx.ellipse(this.size * 0.20, 0, this.size * 0.55, this.size * 0.28, 0, 0, Math.PI * 2);
                ctx.fill();
            }

            // 5. Olhos grandes e protuberantes laterais de perereca
            this.drawEyes(this.size * 0.45, this.size * 0.58, this.size * 0.28);
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
        btn_view_paper: "Ver Artigo",
        btn_view_cases: "Casos em Campo",
        btn_view_cop30: "Ver Estudo COP30",
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
        btn_whatsapp_cta: "Conversar no WhatsApp",
        sub_whatsapp_cta: "Atendimento direto para consultorias ambientais, laudos e parcerias",
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
        btn_view_paper: "View Publication",
        btn_view_cases: "Field Cases",
        btn_view_cop30: "View COP30 Study",
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
        trust_partners_label: "Global Consultancies & Premier Clients",
        exp_arcadis_ee: "Wildlife diagnostics, environmental impact assessments (EIA/RIMA, PCA, PBA), and mitigation plans for large-scale energy and infrastructure players with global consultancies Arcadis and Ecology and Environment (E&E). Technical assignments on utility-scale solar farms (UFVs), high-voltage transmission lines, and hydroelectric developments.",
        exp_econatur_vale: "Wildlife surveys, monitoring programs (herpetofauna, mammals, and birds), fauna scare/rescue protocols, and technical reports for Vale S.A. mining complexes and linear infrastructure through Econatur across Atlantic Forest and Amazon biomes.",
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
        header_field_map: "Field Expeditions &amp; Brazil Georeferenced Mapping",
        badge_georref: "GEOREFERENCED",
        intro_field_map: "Georeferenced spatial mapping of scientific expeditions, taxonomic fauna inventories, and environmental management contracts conducted by Lucas A&oslash;sf across Brazilian biomes.",
        map_kpi_gps: "Real Field GPS &amp; KML Waypoints",
        filter_all: "All (25)",
        btn_whatsapp_cta: "Chat on WhatsApp",
        sub_whatsapp_cta: "Direct contact for environmental consulting, surveys, and partnerships",
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



/* ==========================================================================
   10. BRAZIL EXPEDITIONS INTERACTIVE MAP (Leaflet.js)
   ========================================================================== */
const expeditionPoints = [
    {
        id: "mantiqueira",
        title: "Serra da Mantiqueira — P. boticariana",
        locality: "Santo Antônio do Pinhal & Campos do Jordão, SP",
        coords: [-22.894452, -45.996946],
        category: "herpeto",
        categoryLabel: "Herpetofauna & Taxonomia",
        state: "SP",
        biome: "Mata Atlântica (1.411m)",
        project: "Redescoberta e Taxonomia de Anfíbios Raros",
        client: "BioKuri // Pesquisa Acadêmica",
        desc: "Coleta e diagnóstico georreferenciado da rara perereca-das-folhagens (Phrynomedusa boticariana), estudo morfológico de girinos e bioacústica em riachos de altitude.",
        icon: "fa-frog",
        isHighlight: true
    },
    {
        id: "patos_pb",
        title: "Fazenda Tamanduá & Açude Conceição",
        locality: "Patos & Santa Terezinha, PB",
        coords: [-7.0158, -37.3908],
        category: "masto",
        categoryLabel: "Mastofauna & Quirópteros",
        state: "PB",
        biome: "Caatinga Hiperxerófila",
        project: "Bioacústica de Morcegos e Herpetofauna do Semiárido",
        client: "Expedição de Campo // Pesquisa",
        desc: "Monitoramento com detectores ultrassônicos de quirópteros, inventário herpetofaunístico e amostragem de fauna em corpos d'água temporários no sertão paraibano.",
        icon: "fa-paw",
        isHighlight: true
    },
    {
        id: "pch_verde2",
        title: "PCH Verde 2 & Linha de Transmissão 138 kV",
        locality: "Rio Verde & Montividiu, GO",
        coords: [-17.2939, -50.8501],
        category: "energy",
        categoryLabel: "Energia & Hidrelétricas",
        state: "GO",
        biome: "Cerrado Sentido Restrito",
        project: "Resgate e Monitoramento de Fauna na PCH Verde 2",
        client: "Setor Energético // Consultoria",
        desc: "Coordenação de resgate e afugentamento de herpetofauna e mastofauna durante o enchimento do reservatório e abertura da faixa de servidão da LT 138 kV.",
        icon: "fa-water",
        isHighlight: true
    },
    {
        id: "carajas_vale",
        title: "Complexo Minerário de Carajás (S11D / N4)",
        locality: "Parauapebas & Canaã dos Carajás, PA",
        coords: [-6.0674, -50.1584],
        category: "mining",
        categoryLabel: "Mineração (Vale) & Herpeto",
        state: "PA",
        biome: "Floresta Amazônica & Cangas",
        project: "Diagnóstico e Monitoramento de Fauna Silvestre",
        client: "Vale S.A. // Consultoria Ambiental",
        desc: "Inventário de herpetofauna e mamíferos em áreas de canga hematítica e floresta ombrófila densa na Amazônia Oriental, avaliação de impacto e mitigação.",
        icon: "fa-mountain",
        isHighlight: true
    },
    {
        id: "solar_ba",
        title: "Complexo Solar Fotovoltaico (UFV)",
        locality: "Bom Jesus da Lapa & Caetité, BA",
        coords: [-13.2550, -43.4210],
        category: "energy",
        categoryLabel: "Energia Solar & UFVs",
        state: "BA",
        biome: "Caatinga & Cerrado",
        project: "Licenciamento de Usina Fotovoltaica de Grande Porte",
        client: "Setor Solar & Renováveis",
        desc: "Inventário de vertebrados terrestres em parques solares fotovoltaicos de grande escala, afugentamento pré-supressão e planos de manejo de fauna adaptados ao semiárido.",
        icon: "fa-solar-panel",
        isHighlight: true
    },
    {
        id: "pardinho_cuesta",
        title: "Cuesta de Botucatu & Pardinho",
        locality: "Pardinho, SP",
        coords: [-23.0841, -48.3772],
        category: "masto",
        categoryLabel: "Mastofauna & Campo",
        state: "SP",
        biome: "Mata Atlântica & Cerrado",
        project: "Monitoramento de Médios e Grandes Mamíferos",
        client: "BioKuri // Gestão Ambiental",
        desc: "Pontos de monitoramento georreferenciados de capivaras (Hydrochoerus hydrochaeris) e mesocarnívoros, análise de corredores ecológicos na Cuesta Basáltica.",
        icon: "fa-paw",
        isHighlight: false
    },
    {
        id: "piracicaba_esalq",
        title: "Polo Científico & Laboratório de Girinos",
        locality: "Piracicaba & Rio Claro, SP",
        coords: [-22.7253, -47.6492],
        category: "herpeto",
        categoryLabel: "Taxonomia & Sistemática",
        state: "SP",
        biome: "Mata Atlântica Interiorana",
        project: "Mestrado em Sistemática & Morfologia de Girinos",
        client: "UNESP Rio Claro / ESALQ USP // BioKuri",
        desc: "Sede de pesquisas taxonômicas, chaves dicotômicas interativas, descrição morfológica de girinos em estágios de Gosner e modelagem estatística em RStudio e Python.",
        icon: "fa-frog",
        isHighlight: true
    },
    {
        id: "pantanal_corumba",
        title: "Pantanal da Nhecolândia & Rio Paraguai",
        locality: "Corumbá & Miranda, MS",
        coords: [-19.0076, -57.6534],
        category: "masto",
        categoryLabel: "Mastofauna & Pantanal",
        state: "MS",
        biome: "Pantanal & Chaco",
        project: "Expedições Mastofaunísticas e Comunidades de Anuros",
        client: "Expedições Científicas // Consultoria",
        desc: "Armadilhamento fotográfico de grandes mamíferos (Onça-pintada, Anta, Tamanduá-bandeira) e levantamento acústico de assembleias de anuros em corixos e vazantes pantaneiras.",
        icon: "fa-paw",
        isHighlight: false
    },
    {
        id: "transmissao_ms_sp",
        title: "Linhas de Transmissão LT 500 kV & Subestações",
        locality: "Três Lagoas & Castilho, MS/SP",
        coords: [-20.8034, -51.7058],
        category: "energy",
        categoryLabel: "Linhas de Transmissão",
        state: "MS",
        biome: "Cerrado do Alto Paraná",
        project: "Supervisão Ambiental & Afugentamento LT 500 kV",
        client: "Ecology and Environment / Arcadis",
        desc: "Vistoria e resgate de fauna silvestre ao longo de centenas de quilômetros de faixa de servidão de Linha de Transmissão de extra-alta tensão, com foco em herpeto e masto.",
        icon: "fa-bolt",
        isHighlight: false
    },
    {
        id: "serra_cipo",
        title: "Serra do Cipó & Parque Nacional",
        locality: "Santana do Riacho & Jaboticatubas, MG",
        coords: [-19.3456, -43.6128],
        category: "herpeto",
        categoryLabel: "Herpetofauna & Endemismos",
        state: "MG",
        biome: "Campos Rupestres (Espinhaço)",
        project: "Especialização em Anfíbios Endêmicos do Espinhaço",
        client: "Pesquisa Herpetológica",
        desc: "Estudos taxonômicos e bioacústicos de pererecas e sapos restritos a afloramentos quartzíticos (Bokermannohyla martinsi, Pithecopus ayeaye) e córregos de altitude.",
        icon: "fa-frog",
        isHighlight: false
    },
    {
        id: "ubatuba_costa",
        title: "Litoral Norte Paulista & Ilhabela",
        locality: "Ubatuba & São Sebastião, SP",
        coords: [-23.4332, -45.0834],
        category: "ornito",
        categoryLabel: "Ornitologia & Fauna Costeira",
        state: "SP",
        biome: "Mata Atlântica Litorânea",
        project: "Inventário de Aves Marinhas e Anfíbios Bromelígenas",
        client: "BioKuri // Consultoria Litoral",
        desc: "Amostragem de aves marinhas e costeiras (anilhamento CEMAVE), monitoramento de Phyllodytes e girinos fitotelmatais associados a bromélias de encosta.",
        icon: "fa-dove",
        isHighlight: false
    },
    {
        id: "cananeia_iguape",
        title: "Complexo Estuarino Lagunar & Ilha do Cardoso",
        locality: "Cananéia & Ilha Comprida, SP",
        coords: [-25.0147, -47.9267],
        category: "ornito",
        categoryLabel: "Vida Marinha & Ornitologia",
        state: "SP",
        biome: "Manguezais & Restinga",
        project: "Monitoramento de Aves Migratórias e Fauna Estuarina",
        client: "Gestão Costeira // BioKuri",
        desc: "Censos de aves limícolas migratórias, diagnóstico ambiental em ecossistemas de manguezal e restinga do mosaico de unidades de conservação do Lagamar.",
        icon: "fa-dove",
        isHighlight: false
    },
    {
        id: "paranapiacaba_serra",
        title: "Serra do Mar & Reserva de Paranapiacaba",
        locality: "Santo André & Cubatão, SP",
        coords: [-23.7781, -46.3025],
        category: "herpeto",
        categoryLabel: "Herpetofauna de Riacho",
        state: "SP",
        biome: "Floresta Ombrófila Densa",
        project: "Bioacústica e Taxonomia de Anfíbios de Correnteza",
        client: "Pesquisa Acadêmica",
        desc: "Gravação de cantos de anúncio e diagnose de espécies do gênero Hylodes e Crossodactylus em riachos pedregosos com alto ruído hidrodinâmico.",
        icon: "fa-frog",
        isHighlight: false
    },
    {
        id: "botucatu_cuesta",
        title: "Cuesta de Botucatu & Rubião Júnior",
        locality: "Botucatu, SP",
        coords: [-22.8858, -48.4450],
        category: "herpeto",
        categoryLabel: "Taxonomia & Ecologia",
        state: "SP",
        biome: "Transição Cerrado / Mata Atlântica",
        project: "Amostragem de Formas Larvais & Taxonomia",
        client: "BioKuri // Coleções Zoológicas",
        desc: "Amostragens sistemáticas em poças temporárias e riachos, análise ontogenética de girinos com microscopia estereoscópica e fotografias de espécimes vivos.",
        icon: "fa-frog",
        isHighlight: false
    },
    {
        id: "vale_paraiba_rodovia",
        title: "Eixo Rodoviário & Industrial do Vale do Paraíba",
        locality: "Taubaté, Pinda & Guaratinguetá, SP",
        coords: [-22.9535, -45.4608],
        category: "mining",
        categoryLabel: "Rodovias & Condomínios",
        state: "SP",
        biome: "Mata Atlântica & Várzeas",
        project: "Licenciamento de Empreendimentos, Dutos e Rodovias",
        client: "Econatur / Arcadis // Consultoria",
        desc: "Monitoramento de atropelamento de fauna em rodovias, licenciamento de condomínios urbanísticos e planos de manejo de áreas de preservação permanente (APP).",
        icon: "fa-road",
        isHighlight: false
    },
    {
        id: "itatiaia_parna",
        title: "Parque Nacional do Itatiaia & Agulhas Negras",
        locality: "Itatiaia & Resende, RJ",
        coords: [-22.4542, -44.6067],
        category: "herpeto",
        categoryLabel: "Herpetofauna Altimontana",
        state: "RJ",
        biome: "Campos de Altitude (2.200m+)",
        project: "Inventários em Climas Extremos Altimontanos",
        client: "Expedições Científicas",
        desc: "Levantamento de anfíbios e répteis adaptados a temperaturas negativas e geadas nos topos da Mantiqueira, com registros fotográficos e bioacústicos.",
        icon: "fa-frog",
        isHighlight: false
    },
    {
        id: "angra_paraty_uhe",
        title: "Costa Verde & Baía da Ilha Grande",
        locality: "Angra dos Reis & Paraty, RJ",
        coords: [-23.0067, -44.3181],
        category: "energy",
        categoryLabel: "Infraestrutura Costeira",
        state: "RJ",
        biome: "Mata Atlântica de Costão",
        project: "Gestão Ambiental de Empreendimentos Costeiros",
        client: "Consultoria Ambiental",
        desc: "Vistoria faunística para empreendimentos de infraestrutura costeira, programas de resgate de fauna e salvaguarda de ecossistemas insulares e costeiros.",
        icon: "fa-water",
        isHighlight: false
    },
    {
        id: "pocos_caldas",
        title: "Planalto Vulcânico de Poços de Caldas",
        locality: "Poços de Caldas, MG",
        coords: [-21.7895, -46.5626],
        category: "herpeto",
        categoryLabel: "Mata Atlântica & Brejos",
        state: "MG",
        biome: "Mata Atlântica Interiorana",
        project: "Inventário Herpetofaunístico em Áreas Alagadas",
        client: "BioKuri // Estudos Faunísticos",
        desc: "Diagnóstico taxonômico de pererecas e rãs de brejos de altitude da caldeira vulcânica, caracterização de sítios reprodutivos e bioacústica.",
        icon: "fa-frog",
        isHighlight: false
    },
    {
        id: "quadrilatero_ferrifero",
        title: "Quadrilátero Ferrífero & Minas Gerais",
        locality: "Nova Lima & Brumadinho, MG",
        coords: [-19.9858, -43.8467],
        category: "mining",
        categoryLabel: "Mineração (Vale) & Arcadis",
        state: "MG",
        biome: "Transição Mata Atlântica / Cerrado",
        project: "Monitoramento e Mitigação de Impactos Minerários",
        client: "Vale S.A. / Arcadis",
        desc: "Supervisão ambiental e inventários faunísticos para grandes complexos de mineração de ferro, estruturação de planos de emergência e resgate de fauna silvestre.",
        icon: "fa-mountain",
        isHighlight: true
    },
    {
        id: "chapada_guimaraes",
        title: "Canyons da Chapada dos Guimarães",
        locality: "Chapada dos Guimarães, MT",
        coords: [-15.4607, -55.7497],
        category: "masto",
        categoryLabel: "Mastofauna & Cerrado",
        state: "MT",
        biome: "Cerrado Rupestre & Veredas",
        project: "Levantamento de Fauna em Ambientes Areníticos",
        client: "Expedições Científicas",
        desc: "Mapeamento e armadilhamento fotográfico de predadores de topo e ungulados em áreas de paredões rochosos e veredas com buritis.",
        icon: "fa-paw",
        isHighlight: false
    },
    {
        id: "chapada_veadeiros",
        title: "Parque Nacional da Chapada dos Veadeiros",
        locality: "Alto Paraíso de Goiás, GO",
        coords: [-14.1311, -47.5147],
        category: "herpeto",
        categoryLabel: "Cerrado & Anuros Reófilos",
        state: "GO",
        biome: "Cerrado de Altitude",
        project: "Bioacústica e Taxonomia de Anfíbios de Corredeira",
        client: "Pesquisa Acadêmica",
        desc: "Amostragem de espécies reófilas (Bokermannohyla pseudopseudis) adaptadas a cachoeiras e leitos rochosos de alta energia nas cabeceiras da Bacia Tocantins-Araguaia.",
        icon: "fa-frog",
        isHighlight: false
    },
    {
        id: "foz_iguacu",
        title: "Parque Nacional do Iguaçu & Bacia do Paraná",
        locality: "Foz do Iguaçu, PR",
        coords: [-25.5957, -54.4367],
        category: "ornito",
        categoryLabel: "Ornitologia & Mastofauna",
        state: "PR",
        biome: "Floresta Estacional Semidecidual",
        project: "Monitoramento de Aves Raras e Mamíferos Florestais",
        client: "BioKuri // Pesquisa de Campo",
        desc: "Redes de neblina para anilhamento de aves da Mata Atlântica do interior e detecção de mamíferos florestais no corredor trinacional de biodiversidade.",
        icon: "fa-dove",
        isHighlight: false
    },
    {
        id: "serra_graciosa",
        title: "Serra da Graciosa & Antonina",
        locality: "Morretes & Antonina, PR",
        coords: [-25.4287, -48.7121],
        category: "herpeto",
        categoryLabel: "Herpetofauna da Serra do Mar Sul",
        state: "PR",
        biome: "Floresta Ombrófila Densa Montana",
        project: "Taxonomia de Anfíbios de Folhiço e Riachos",
        client: "Pesquisa Herpetológica",
        desc: "Inventário taxonômico de espécies de folhiço (Brachycephalus, Ischnocnema) e anuros de riacho sob altíssima pluviosidade na encosta atlântica paranaense.",
        icon: "fa-frog",
        isHighlight: false
    },
    {
        id: "reserva_linhares",
        title: "Reserva Natural Vale Linhares",
        locality: "Linhares & Sooretama, ES",
        coords: [-19.1481, -40.0658],
        category: "mining",
        categoryLabel: "Mata de Tabuleiros (Vale)",
        state: "ES",
        biome: "Floresta de Tabuleiros",
        project: "Pesquisas Herpetológicas em Floresta de Baixada",
        client: "Vale S.A. // Estudos Ambientais",
        desc: "Amostragens herpetológicas em um dos maiores remanescentes contínuos de Mata de Tabuleiro do Brasil, com inventário de serpentes e anuros de lagoas sazonais.",
        icon: "fa-mountain",
        isHighlight: false
    },
    {
        id: "vale_itajai",
        title: "Vale do Itajaí & Bacia Hidrográfica",
        locality: "Itajaí & Blumenau, SC",
        coords: [-26.9078, -48.6619],
        category: "ornito",
        categoryLabel: "Ornitologia & Recursos Hídricos",
        state: "SC",
        biome: "Mata Atlântica Sul",
        project: "Diagnóstico Faunístico para Bacias e Portos",
        client: "BioKuri // Consultoria Ambiental",
        desc: "Levantamento integrado de avifauna e fauna límnica em áreas fluviais e estuarinas do Vale do Itajaí, subsidiando planos de manejo e licenciamento.",
        icon: "fa-dove",
        isHighlight: false
    }
];

function initFieldMap() {
    const mapContainer = document.getElementById('brazil-expedition-map');
    if (!mapContainer || typeof L === 'undefined') return;

    // Brazil center & optimal zoom
    const brazilCenter = [-15.2, -51.8];
    const initialZoom = window.innerWidth < 768 ? 3.8 : 4.4;

    const map = L.map('brazil-expedition-map', {
        center: brazilCenter,
        zoom: initialZoom,
        minZoom: 3.5,
        maxZoom: 18,
        scrollWheelZoom: false
    });

    // Enable scroll wheel zoom on click to avoid trap while scrolling page
    map.on('click', () => { map.scrollWheelZoom.enable(); });
    mapContainer.addEventListener('mouseleave', () => { map.scrollWheelZoom.disable(); });

    // Basemaps: CartoDB Dark Matter & Esri World Imagery
    const darkTileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CARTO &copy; OpenStreetMap',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);

    const satTileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; Esri, Maxar, Earthstar Geographics',
        maxZoom: 18
    });

    // Basemap toggle buttons
    const btnDark = document.getElementById('btn-layer-dark');
    const btnSat = document.getElementById('btn-layer-sat');
    const btnReset = document.getElementById('btn-map-reset');

    if (btnDark && btnSat) {
        btnDark.addEventListener('click', () => {
            if (!map.hasLayer(darkTileLayer)) {
                map.removeLayer(satTileLayer);
                map.addLayer(darkTileLayer);
                btnDark.classList.add('active');
                btnSat.classList.remove('active');
            }
        });
        btnSat.addEventListener('click', () => {
            if (!map.hasLayer(satTileLayer)) {
                map.removeLayer(darkTileLayer);
                map.addLayer(satTileLayer);
                btnSat.classList.add('active');
                btnDark.classList.remove('active');
            }
        });
    }

    if (btnReset) {
        btnReset.addEventListener('click', () => {
            map.flyTo(brazilCenter, initialZoom, { duration: 1.2 });
            document.querySelectorAll('.map-expedition-card').forEach(c => c.classList.remove('active'));
        });
    }

    // Marker Layer Group
    const markersLayer = L.layerGroup().addTo(map);
    const markerMap = new Map();

    function renderPoints(category = 'all') {
        markersLayer.clearLayers();
        markerMap.clear();

        const filtered = category === 'all' 
            ? expeditionPoints 
            : expeditionPoints.filter(p => p.category === category);

        // Update counter badge
        const counterEl = document.getElementById('map-counter-points');
        if (counterEl) {
            counterEl.textContent = filtered.length;
        }

        filtered.forEach(pt => {
            const isHighlight = pt.isHighlight ? 'gold' : '';
            const pinIcon = L.divIcon({
                className: 'custom-leaflet-pin',
                html: `<div class="custom-pin-marker ${isHighlight}" title="${pt.title}">
                         <i class="fa-solid ${pt.icon}"></i>
                       </div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 15],
                popupAnchor: [0, -18]
            });

            const marker = L.marker(pt.coords, { icon: pinIcon });

            const popupHtml = `
                <div class="custom-map-popup">
                    <span class="popup-tag">${pt.categoryLabel}</span>
                    <h4 class="popup-title">${pt.title}</h4>
                    <div class="popup-meta">
                        <i class="fa-solid fa-location-dot"></i> ${pt.locality} &bull; ${pt.state}
                    </div>
                    <p class="popup-desc">${pt.desc}</p>
                    <div class="popup-footer">
                        <span><i class="fa-solid fa-leaf"></i> ${pt.biome}</span>
                        <span><i class="fa-solid fa-crosshairs"></i> ${pt.coords[0].toFixed(4)}, ${pt.coords[1].toFixed(4)}</span>
                    </div>
                </div>
            `;

            marker.bindPopup(popupHtml, {
                maxWidth: 320,
                className: 'bio-leaflet-popup'
            });

            marker.on('click', () => {
                highlightCard(pt.id);
            });

            markersLayer.addLayer(marker);
            markerMap.set(pt.id, marker);
        });

        renderCarousel(filtered);
    }

    // Expeditions bottom horizontal cards
    const scrollContainer = document.getElementById('map-expeditions-scroll');

    function renderCarousel(pointsList) {
        if (!scrollContainer) return;
        scrollContainer.innerHTML = '';

        pointsList.forEach(pt => {
            const card = document.createElement('div');
            card.className = 'map-expedition-card';
            card.id = `card-exp-${pt.id}`;
            card.innerHTML = `
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.35rem;">
                    <span style="font-size:0.68rem; color:var(--bio-gold); text-transform:uppercase; letter-spacing:0.5px;">${pt.categoryLabel}</span>
                    <span style="background:rgba(78,204,163,0.15); color:var(--bio-emerald); padding:2px 6px; border-radius:4px; font-size:0.65rem; font-weight:700;">${pt.state}</span>
                </div>
                <h5><i class="fa-solid ${pt.icon}" style="color:var(--bio-emerald); margin-right:4px;"></i> ${pt.title}</h5>
                <span style="color:var(--text-muted); font-size:0.73rem; margin-top:2px;"><i class="fa-solid fa-location-dot" style="font-size:0.65rem;"></i> ${pt.locality}</span>
                <span style="color:var(--bio-sage); font-size:0.68rem; margin-top:4px;"><i class="fa-solid fa-leaf" style="font-size:0.65rem;"></i> ${pt.biome}</span>
            `;

            card.addEventListener('click', () => {
                document.querySelectorAll('.map-expedition-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                map.flyTo(pt.coords, 10, { duration: 1.4 });
                const m = markerMap.get(pt.id);
                if (m) {
                    setTimeout(() => { m.openPopup(); }, 1450);
                }
            });

            scrollContainer.appendChild(card);
        });
    }

    function highlightCard(id) {
        document.querySelectorAll('.map-expedition-card').forEach(c => c.classList.remove('active'));
        const card = document.getElementById(`card-exp-${id}`);
        if (card) {
            card.classList.add('active');
            card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
    }

    // Category Filter Buttons
    const filterButtons = document.querySelectorAll('#map-filter-group .map-filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const cat = btn.getAttribute('data-category');
            renderPoints(cat);
        });
    });

    // Initial render
    renderPoints('all');
}

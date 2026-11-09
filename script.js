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
   Ciclo biológico completo de anuros (Tabela de Gosner) em tempo real:
   - Estágio 0: Girino clássico ápode (espiral visceral, cauda longa e nadadeira translúcida)
   - Estágio 1: Girino com patas posteriores (fêmur, tíbia, tarsos e dedinhos natatórios)
   - Estágio 2: Imago com 4 patas funcionais e cauda em regressão ativa
   - Estágio 3: Pererequinha adulta (sem cauda, discos adesivos/ventosas e pernada anura)
   População viva com profundidade 3D, ondulação física e dispersão orgânica
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

    // Ondulação suave de água (raio sutil e dispersão natural)
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
    // População densa e fluida (60 FPS travado com zero GC)
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
        { text: '\u{1F52C} Foco em Fauna: Especialista em Anf\u00EDbios Anuros, Mastofauna (m\u00E9dios/grandes e morcegos), e Ornitologia' },
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
        desc_bio: "Bi&oacute;logo (UNIFATEA), <strong>Especialista em Gest&atilde;o Ambiental (UNOPAR)</strong> e anilhador CEMAVE/ICMBio. <strong>Pesquisador, taxonomista e programador entusiasta</strong>. Especialista em fauna com foco central em <strong>Taxonomia &amp; Sistem&aacute;tica de Anf&iacute;bios Anuros</strong> e r&eacute;pteis, ampla atua&ccedil;&atilde;o em <strong>Mastofauna</strong> (m&eacute;dios e grandes mam&iacute;feros e quir&oacute;pteros/morcegos), e <strong>Ornitologia</strong>. No universo tecnol&oacute;gico, atua ativamente com <strong>RStudio, Python, JavaScript, Java e HTML</strong>, desenvolvendo softwares de campo (PWAs), pipelines de bioestat&iacute;stica e modelagem de biodiversidade.",
        header_focus: "Atuação & Foco Central",
        intro_focus: "Integração pioneira entre o rigor taxonômico de museu e campo, a gestão ambiental corporativa e a engenharia de dados ecológicos.",
        focus_taxo_title: "Taxonomia, Sistem&aacute;tica &amp; Diagn&oacute;stico de Fauna Silvestre",
        focus_taxo_desc: "Especialista em <strong>anf&iacute;bios anuros</strong> (foco prim&aacute;rio em diagnose morfol&oacute;gica, bioac&uacute;stica e chaves taxon&ocirc;micas). Atua&ccedil;&atilde;o s&oacute;lida em <strong>mastofauna</strong> (m&eacute;dios e grandes mam&iacute;feros e morcegos), e <strong>ornitofauna</strong> (anilhador CEMAVE/ICMBio).",
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
        drone_btn_amazonia: "Amazônia",
        drone_btn_caatinga: "Caatinga",
        drone_btn_cerrado: "Cerrado",
        drone_btn_itatiaia: "Mata Atlântica",
        drone_btn_ilhabela: "Ilhabela",
        drone_btn_joinville: "Joinville",
        drone_gallery_tag: "Registros Fotográficos Aéreos em Alta Resolução",
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
        contact_card_sub: "VAMOS CONVERSAR?",
        contact_card_title: "Entre em Contato",
        contact_card_desc: "Dispon&iacute;vel para diagn&oacute;sticos e monitoramento de fauna, laudos t&eacute;cnicos com ART, mapeamento a&eacute;reo por drone, solu&ccedil;&otilde;es ecol&oacute;gicas pela BioKuri e consultorias cient&iacute;ficas.",
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
        desc_bio: "Biologist (UNIFATEA), <strong>Environmental Management Specialist (UNOPAR)</strong> and CEMAVE/ICMBio bird bander. <strong>Researcher, taxonomist, and enthusiast programmer</strong>. Wildlife specialist with core focus on <strong>Anuran Amphibian &amp; Reptile Taxonomy and Systematics</strong>, extensive field experience in <strong>Mammalogy</strong> (medium/large mammals and bats/chiropterans), and <strong>Ornithology</strong>. In technology, actively codes in <strong>RStudio, Python, JavaScript, Java, and HTML</strong>, engineering offline field software (PWAs), biostatistical pipelines, and biodiversity modeling.",
        header_focus: "Focus & Core Expertise",
        intro_focus: "Pioneering integration of classical museum & field taxonomy, corporate environmental management, and ecological data science.",
        focus_taxo_title: "Wildlife Taxonomy, Systematics &amp; Field Monitoring",
        focus_taxo_desc: "Specialist in <strong>anuran amphibians</strong> (core focus in morphological diagnosis, bioacoustics, and taxonomic keys). Extensive field practice in <strong>mammalogy</strong> (medium/large mammals and bats), and <strong>ornithology</strong> (CEMAVE/ICMBio bander).",
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
        drone_btn_joinville: "Joinville",
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
        header_field_map: "Distribution of Lucas A&oslash;sf",
        badge_georref: "SATELLITE VIEW",
        intro_field_map: "Biogeographic occurrence mapping: all points, cities, overland routes, and field expeditions traversed by the researcher across Brazil.",
        map_kpi_gps: "Real Field GPS &amp; KML Waypoints",
        filter_all: "All (25)",
        contact_card_sub: "LET'S CONNECT",
        contact_card_title: "Get in Touch",
        contact_card_desc: "Available for wildlife diagnostics &amp; fauna monitoring, certified technical reports (ART), drone aerial mapping, BioKuri ecological solutions, and scientific consultancies.",
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
   10. DISTRIBUICAO GEOGRAFICA DE LUCAS AOSF (Leaflet.js - Satelite Fixo)
   ========================================================================== */
const lucasDistributionPoints = [{"id":"belem","title":"Belém","locality":"Pará · Capital","coords":[-1.4558,-48.4902],"state":"PA","route":"Rota Belém-Tucumã"},{"id":"ananindeua","title":"Ananindeua","locality":"Pará · Região Metropolitana","coords":[-1.3656,-48.3725],"state":"PA","route":"Rota Belém-Tucumã"},{"id":"marituba","title":"Marituba","locality":"Pará · BR-316","coords":[-1.3556,-48.3431],"state":"PA","route":"Rota Belém-Tucumã"},{"id":"benevides","title":"Benevides","locality":"Pará · BR-316","coords":[-1.3614,-48.2450],"state":"PA","route":"Rota Belém-Tucumã"},{"id":"santa_izabel","title":"Santa Izabel do Pará","locality":"Pará · BR-316","coords":[-1.2989,-48.1606],"state":"PA","route":"Rota Belém-Tucumã"},{"id":"castanhal","title":"Castanhal","locality":"Pará · Cidade Modelo","coords":[-1.2975,-47.9250],"state":"PA","route":"Rota Belém-Tucumã"},{"id":"barcarena","title":"Barcarena","locality":"Pará · Polo Portuário","coords":[-1.5058,-48.6258],"state":"PA","route":"Rota Belém-Tucumã"},{"id":"abaetetuba","title":"Abaetetuba","locality":"Pará · Baixo Tocantins","coords":[-1.7219,-48.8828],"state":"PA","route":"Rota Belém-Tucumã"},{"id":"moju","title":"Moju","locality":"Pará · PA-150","coords":[-1.8842,-48.7686],"state":"PA","route":"Rota Belém-Tucumã"},{"id":"tailandia","title":"Tailândia","locality":"Pará · PA-150","coords":[-2.9464,-48.9519],"state":"PA","route":"Rota Belém-Tucumã"},{"id":"goianesia","title":"Goianésia do Pará","locality":"Pará · PA-150","coords":[-3.8456,-49.0967],"state":"PA","route":"Rota Belém-Tucumã"},{"id":"jacunda","title":"Jacundá","locality":"Pará · PA-150","coords":[-4.4519,-49.1167],"state":"PA","route":"Rota Belém-Tucumã"},{"id":"nova_ipixuna","title":"Nova Ipixuna","locality":"Pará · PA-150","coords":[-4.9142,-49.0833],"state":"PA","route":"Rota Belém-Tucumã"},{"id":"maraba","title":"Marabá","locality":"Pará · Rio Tocantins \u0026 Itacaiúnas","coords":[-5.3686,-49.1178],"state":"PA","route":"Rota Belém-Tucumã"},{"id":"sao_geraldo","title":"São Geraldo do Araguaia","locality":"Pará · Serra das Andorinhas","coords":[-6.4006,-48.5550],"state":"PA","route":"Sul do Pará"},{"id":"eldorado_carajas","title":"Eldorado do Carajás","locality":"Pará · BR-155","coords":[-6.1042,-49.3550],"state":"PA","route":"Rota Belém-Tucumã"},{"id":"curionopolis","title":"Curionópolis","locality":"Pará · Serra Pelada","coords":[-6.1039,-49.5989],"state":"PA","route":"Rota Belém-Tucumã"},{"id":"parauapebas","title":"Parauapebas · Serra dos Carajás","locality":"Pará · Complexo Vale Carajás","coords":[-6.0674,-49.9022],"state":"PA","route":"Rota Belém-Tucumã"},{"id":"canaa","title":"Canaã dos Carajás · S11D","locality":"Pará · Complexo S11D Vale","coords":[-6.4969,-49.8761],"state":"PA","route":"Rota Belém-Tucumã"},{"id":"agua_azul","title":"Água Azul do Norte","locality":"Pará · PA-279","coords":[-6.7906,-49.8331],"state":"PA","route":"Rota Belém-Tucumã"},{"id":"xinguara","title":"Xinguara","locality":"Pará · Entroncamento PA-279 / BR-155","coords":[-7.0989,-49.9439],"state":"PA","route":"Rota Belém-Tucumã"},{"id":"sapucaia","title":"Sapucaia","locality":"Pará · Sul do Pará","coords":[-6.9367,-49.4800],"state":"PA","route":"Sul do Pará"},{"id":"rio_maria","title":"Rio Maria","locality":"Pará · BR-155","coords":[-7.3125,-50.0267],"state":"PA","route":"Sul do Pará"},{"id":"bannach","title":"Bannach","locality":"Pará · Sul do Pará","coords":[-7.5850,-50.3956],"state":"PA","route":"Sul do Pará"},{"id":"redencao","title":"Redenção","locality":"Pará · Polo Regional Sul","coords":[-8.0269,-50.0322],"state":"PA","route":"Sul do Pará"},{"id":"pau_darco","title":"Pau D\u0027Arco","locality":"Pará · BR-155","coords":[-7.8319,-50.0436],"state":"PA","route":"Sul do Pará"},{"id":"ourilandia","title":"Ourilândia do Norte","locality":"Pará · PA-279","coords":[-6.7558,-51.0886],"state":"PA","route":"Rota Belém-Tucumã"},{"id":"tucuma","title":"Tucumã","locality":"Pará · PA-279 Polo de Atuação","coords":[-6.7419,-51.1550],"state":"PA","route":"Rota Belém-Tucumã"},{"id":"sao_felix_xingu","title":"São Félix do Xingu","locality":"Pará · Bacia do Rio Xingu","coords":[-6.6447,-51.9950],"state":"PA","route":"Bacia do Xingu"},{"id":"tucurui","title":"Tucuruí","locality":"Pará · UHE Tucuruí","coords":[-3.7661,-49.6725],"state":"PA","route":"Linha de Transmissão"},{"id":"barra_garcas","title":"Barra do Garças","locality":"Mato Grosso · Encontro das Águas","coords":[-15.8900,-52.2567],"state":"MT","route":"Rota Barra do Garças-Manaus"},{"id":"general_carneiro","title":"General Carneiro","locality":"Mato Grosso · BR-070","coords":[-15.7083,-52.7561],"state":"MT","route":"Rota Barra do Garças-Manaus"},{"id":"primavera_leste","title":"Primavera do Leste","locality":"Mato Grosso · Cerrado","coords":[-15.5586,-54.2961],"state":"MT","route":"Rota Barra do Garças-Manaus"},{"id":"campo_verde","title":"Campo Verde","locality":"Mato Grosso · BR-070","coords":[-15.5450,-55.1681],"state":"MT","route":"Rota Barra do Garças-Manaus"},{"id":"cuiaba","title":"Cuiabá","locality":"Mato Grosso · Capital Pantaneira","coords":[-15.6014,-56.0979],"state":"MT","route":"Rota Barra do Garças-Manaus"},{"id":"varzea_grande","title":"Várzea Grande","locality":"Mato Grosso · Conurbação Cuiabá","coords":[-15.6464,-56.1325],"state":"MT","route":"Rota Barra do Garças-Manaus"},{"id":"jangada","title":"Jangada","locality":"Mato Grosso · BR-163/364","coords":[-15.2411,-56.4889],"state":"MT","route":"Rota Barra do Garças-Manaus"},{"id":"rosario_oeste","title":"Rosário Oeste","locality":"Mato Grosso · BR-163","coords":[-14.8361,-56.4275],"state":"MT","route":"Rota Barra do Garças-Manaus"},{"id":"nobres","title":"Nobres","locality":"Mato Grosso · Província Espeleológica","coords":[-14.7206,-56.3275],"state":"MT","route":"Rota Barra do Garças-Manaus"},{"id":"diamantino","title":"Diamantino","locality":"Mato Grosso · Nascentes do Paraguai","coords":[-14.4086,-56.4461],"state":"MT","route":"Rota Barra do Garças-Manaus"},{"id":"nova_mutum","title":"Nova Mutum","locality":"Mato Grosso · BR-163","coords":[-13.8322,-56.0828],"state":"MT","route":"Rota Barra do Garças-Manaus"},{"id":"lucas_rio_verde","title":"Lucas do Rio Verde","locality":"Mato Grosso · BR-163","coords":[-13.0642,-55.9100],"state":"MT","route":"Rota Barra do Garças-Manaus"},{"id":"sorriso","title":"Sorriso","locality":"Mato Grosso · BR-163","coords":[-12.5425,-55.7214],"state":"MT","route":"Rota Barra do Garças-Manaus"},{"id":"sinop","title":"Sinop","locality":"Mato Grosso · Norte Matogrossense","coords":[-11.8606,-55.5097],"state":"MT","route":"Rota Barra do Garças-Manaus"},{"id":"itauba","title":"Itaúba","locality":"Mato Grosso · BR-163","coords":[-11.0667,-55.2833],"state":"MT","route":"Rota Barra do Garças-Manaus"},{"id":"terra_nova","title":"Terra Nova do Norte","locality":"Mato Grosso · BR-163","coords":[-10.5186,-55.2289],"state":"MT","route":"Rota Barra do Garças-Manaus"},{"id":"peixoto_azevedo","title":"Peixoto de Azevedo","locality":"Mato Grosso · Vale do Peixoto","coords":[-10.2228,-54.9806],"state":"MT","route":"Rota Barra do Garças-Manaus"},{"id":"matupa","title":"Matupá","locality":"Mato Grosso · BR-163","coords":[-10.1839,-54.9350],"state":"MT","route":"Rota Barra do Garças-Manaus"},{"id":"guaranta_norte","title":"Guarantã do Norte","locality":"Mato Grosso · Divisa MT/PA","coords":[-9.7892,-54.9083],"state":"MT","route":"Rota Barra do Garças-Manaus"},{"id":"caceres","title":"Cáceres","locality":"Mato Grosso · Pantanal de Cáceres","coords":[-16.0747,-57.6789],"state":"MT","route":"Rota Barra do Garças-Manaus"},{"id":"pontes_lacerda","title":"Pontes e Lacerda","locality":"Mato Grosso · Vale do Guaporé","coords":[-15.2269,-59.3353],"state":"MT","route":"Rota Barra do Garças-Manaus"},{"id":"comodoro","title":"Comodoro","locality":"Mato Grosso · Chapada dos Parecis","coords":[-13.6631,-59.7867],"state":"MT","route":"Rota Barra do Garças-Manaus"},{"id":"humaita","title":"Humaitá","locality":"Amazonas · Calha do Rio Madeira \u0026 BR-319","coords":[-7.5147,-63.0189],"state":"AM","route":"Rota Barra do Garças-Manaus"},{"id":"manicore","title":"Manicoré","locality":"Amazonas · Rio Madeira","coords":[-5.8094,-61.3003],"state":"AM","route":"Rota Barra do Garças-Manaus"},{"id":"borba","title":"Borba","locality":"Amazonas · Médio Madeira","coords":[-4.3886,-59.5939],"state":"AM","route":"Rota Barra do Garças-Manaus"},{"id":"autazes","title":"Autazes","locality":"Amazonas · Várzeas Amazônicas","coords":[-3.5797,-59.1306],"state":"AM","route":"Rota Barra do Garças-Manaus"},{"id":"careiro_castanho","title":"Careiro Castanho","locality":"Amazonas · BR-319","coords":[-3.7681,-60.3697],"state":"AM","route":"Rota Barra do Garças-Manaus"},{"id":"careiro_varzea","title":"Careiro da Várzea","locality":"Amazonas · Encontro das Águas","coords":[-3.1978,-59.8225],"state":"AM","route":"Rota Barra do Garças-Manaus"},{"id":"iranduba","title":"Iranduba","locality":"Amazonas · Ponte Rio Negro","coords":[-3.2847,-60.1864],"state":"AM","route":"Rota Barra do Garças-Manaus"},{"id":"manaus","title":"Manaus","locality":"Amazonas · Coração da Amazônia","coords":[-3.1190,-60.0217],"state":"AM","route":"Rota Barra do Garças-Manaus"},{"id":"presidente_figueiredo","title":"Presidente Figueiredo","locality":"Amazonas · Terra das Cachoeiras","coords":[-2.0522,-60.0250],"state":"AM","route":"Amazônia Norte"},{"id":"itacoatiara","title":"Itacoatiara","locality":"Amazonas · Velha Serpa","coords":[-3.1431,-58.4442],"state":"AM","route":"Médio Amazonas"},{"id":"fortaleza","title":"Fortaleza","locality":"Ceará · Capital \u0026 Litoral","coords":[-3.7319,-38.5267],"state":"CE","route":"Nordeste"},{"id":"sobral","title":"Sobral","locality":"Ceará · Serra da Meruoca","coords":[-3.6880,-40.3497],"state":"CE","route":"Nordeste"},{"id":"juazeiro_norte","title":"Juazeiro do Norte","locality":"Ceará · Cariri","coords":[-7.2132,-39.3151],"state":"CE","route":"Nordeste"},{"id":"crato","title":"Crato · Chapada do Araripe","locality":"Ceará · Floresta Nacional do Araripe","coords":[-7.2342,-39.4094],"state":"CE","route":"Nordeste"},{"id":"quixada","title":"Quixadá","locality":"Ceará · Monólitos \u0026 Caatinga","coords":[-4.9715,-39.0154],"state":"CE","route":"Nordeste"},{"id":"jericoacoara","title":"Jijoca de Jericoacoara","locality":"Ceará · Parque Nacional Jericoacoara","coords":[-2.7936,-40.5142],"state":"CE","route":"Nordeste"},{"id":"aracati","title":"Aracati · Canoa Quebrada","locality":"Ceará · Falésias \u0026 Litoral Leste","coords":[-4.5619,-37.7699],"state":"CE","route":"Nordeste"},{"id":"tiangua","title":"Tianguá · Serra da Ibiapaba","locality":"Ceará · Brejos de Altitude","coords":[-3.7319,-40.9930],"state":"CE","route":"Nordeste"},{"id":"teresina","title":"Teresina","locality":"Piauí · Encontro dos Rios Poti e Parnaíba","coords":[-5.0920,-42.8038],"state":"PI","route":"Nordeste"},{"id":"parnaiba","title":"Parnaíba · Delta do Parnaíba","locality":"Piauí · Único Delta em Mar Aberto","coords":[-2.9032,-41.7766],"state":"PI","route":"Nordeste"},{"id":"luis_correia","title":"Luís Correia","locality":"Piauí · Litoral Piauiense","coords":[-2.8794,-41.6669],"state":"PI","route":"Nordeste"},{"id":"picos","title":"Picos","locality":"Piauí · Caatinga Central","coords":[-7.0772,-41.4669],"state":"PI","route":"Nordeste"},{"id":"serra_capivara","title":"São Raimundo Nonato · Serra da Capivara","locality":"Piauí · Parque Nacional Serra da Capivara","coords":[-9.0153,-42.6994],"state":"PI","route":"Nordeste"},{"id":"floriano","title":"Floriano","locality":"Piauí · Rio Parnaíba","coords":[-6.7669,-43.0225],"state":"PI","route":"Nordeste"},{"id":"piripiri","title":"Piripiri","locality":"Piauí · Parque Nacional de Sete Cidades","coords":[-4.2733,-41.7769],"state":"PI","route":"Nordeste"},{"id":"sao_luis","title":"São Luís","locality":"Maranhão · Ilha Upaon-Açu","coords":[-2.5387,-44.2828],"state":"MA","route":"Nordeste"},{"id":"barreirinhas","title":"Barreirinhas · Lençóis Maranhenses","locality":"Maranhão · Parque Nacional Lençóis","coords":[-2.7486,-42.8258],"state":"MA","route":"Nordeste"},{"id":"imperatriz","title":"Imperatriz","locality":"Maranhão · Rio Tocantins","coords":[-5.5266,-47.4778],"state":"MA","route":"Nordeste"},{"id":"caxias","title":"Caxias","locality":"Maranhão · Leste Maranhense","coords":[-4.8631,-43.3561],"state":"MA","route":"Nordeste"},{"id":"acailandia","title":"Açailândia","locality":"Maranhão · Corredor Carajás","coords":[-4.9472,-47.5028],"state":"MA","route":"Nordeste"},{"id":"balsas","title":"Balsas","locality":"Maranhão · Chapada das Mesas / Sul","coords":[-7.5322,-46.0356],"state":"MA","route":"Nordeste"},{"id":"bacabal","title":"Bacabal","locality":"Maranhão · Médio Mearim","coords":[-4.2372,-44.7919],"state":"MA","route":"Nordeste"},{"id":"santa_ines","title":"Santa Inês","locality":"Maranhão · Estrada de Ferro Carajás","coords":[-3.6669,-45.3800],"state":"MA","route":"Nordeste"},{"id":"recife","title":"Recife","locality":"Pernambuco · Capital \u0026 Manguezais","coords":[-8.0476,-34.8770],"state":"PE","route":"Nordeste"},{"id":"olinda","title":"Olinda","locality":"Pernambuco · Cidade Histórica","coords":[-7.9989,-34.8459],"state":"PE","route":"Nordeste"},{"id":"petrolina","title":"Petrolina","locality":"Pernambuco · Vale do São Francisco","coords":[-9.3891,-40.5028],"state":"PE","route":"Nordeste"},{"id":"caruaru","title":"Caruaru","locality":"Pernambuco · Agreste Pernambucano","coords":[-8.2833,-35.9761],"state":"PE","route":"Nordeste"},{"id":"garanhuns","title":"Garanhuns","locality":"Pernambuco · Suíça Pernambucana / Brejos","coords":[-8.8906,-36.4928],"state":"PE","route":"Nordeste"},{"id":"serra_talhada","title":"Serra Talhada","locality":"Pernambuco · Sertão do Pajeú","coords":[-7.9919,-38.2981],"state":"PE","route":"Nordeste"},{"id":"salgueiro","title":"Salgueiro","locality":"Pernambuco · Encruzilhada do Nordeste","coords":[-8.0744,-39.1197],"state":"PE","route":"Nordeste"},{"id":"araripina","title":"Araripina","locality":"Pernambuco · Chapada do Araripe Sul","coords":[-7.5761,-40.4983],"state":"PE","route":"Nordeste"},{"id":"patos","title":"Patos","locality":"Paraíba · Capital do Sertão","coords":[-7.0158,-37.3908],"state":"PB","route":"Sertão Paraibano"},{"id":"fazenda_tamandua","title":"Santa Terezinha · Fazenda Tamanduá","locality":"Paraíba · Caatinga Hiperxerófila (KML real)","coords":[-7.0983,-37.4489],"state":"PB","route":"Sertão Paraibano"},{"id":"acude_conceicao","title":"Patos · Açude Conceição","locality":"Paraíba · Corpo d\u0027Água Semiárido (KML real)","coords":[-7.0225,-37.3850],"state":"PB","route":"Sertão Paraibano"},{"id":"joao_pessoa","title":"João Pessoa","locality":"Paraíba · Ponto Mais Oriental das Américas","coords":[-7.1195,-34.8450],"state":"PB","route":"Nordeste"},{"id":"campina_grande","title":"Campina Grande","locality":"Paraíba · Planalto da Borborema","coords":[-7.2307,-35.8817],"state":"PB","route":"Nordeste"},{"id":"sousa","title":"Sousa · Vale dos Dinossauros","locality":"Paraíba · Bacia Sedimentar do Rio do Peixe","coords":[-6.7611,-38.2281],"state":"PB","route":"Nordeste"},{"id":"cajazeiras","title":"Cajazeiras","locality":"Paraíba · Sertão Ocidental","coords":[-6.8889,-38.5600],"state":"PB","route":"Nordeste"},{"id":"pombal","title":"Pombal","locality":"Paraíba · Rio Piancó","coords":[-6.7725,-37.7986],"state":"PB","route":"Nordeste"},{"id":"cabedelo","title":"Cabedelo","locality":"Paraíba · Restinga \u0026 Estuário Paraíba","coords":[-6.9811,-34.8339],"state":"PB","route":"Nordeste"},{"id":"natal","title":"Natal","locality":"Rio Grande do Norte · Cidade do Sol \u0026 Dunas","coords":[-5.7945,-35.2110],"state":"RN","route":"Nordeste"},{"id":"pipa","title":"Tibau do Sul · Praia da Pipa","locality":"Rio Grande do Norte · Falésias \u0026 Golfinhos","coords":[-6.2308,-35.0933],"state":"RN","route":"Nordeste"},{"id":"mossoro","title":"Mossoró","locality":"Rio Grande do Norte · Costa Branca / Semiárido","coords":[-5.1878,-37.3442],"state":"RN","route":"Nordeste"},{"id":"caico","title":"Caicó","locality":"Rio Grande do Norte · Seridó Potiguar","coords":[-6.4586,-37.0978],"state":"RN","route":"Nordeste"},{"id":"currais_novos","title":"Currais Novos","locality":"Rio Grande do Norte · Mina Brejuí / Seridó","coords":[-6.2606,-36.5147],"state":"RN","route":"Nordeste"},{"id":"parnamirim","title":"Parnamirim","locality":"Rio Grande do Norte · Maior Cajueiro do Mundo","coords":[-5.9156,-35.2628],"state":"RN","route":"Nordeste"},{"id":"touros","title":"Touros","locality":"Rio Grande do Norte · Esquina do Brasil / Farol do Calcanhar","coords":[-5.1989,-35.4608],"state":"RN","route":"Nordeste"},{"id":"salvador","title":"Salvador","locality":"Bahia · Baía de Todos os Santos","coords":[-12.9777,-38.5016],"state":"BA","route":"Bahia"},{"id":"bom_jesus_lapa","title":"Bom Jesus da Lapa · Parques Solares UFV","locality":"Bahia · Usinas Fotovoltaicas de Grande Porte","coords":[-13.2550,-43.4210],"state":"BA","route":"Bahia"},{"id":"caetite","title":"Caetité","locality":"Bahia · Serra Geral / Complexo Eólico-Solar","coords":[-14.0694,-42.4753],"state":"BA","route":"Bahia"},{"id":"feira_santana","title":"Feira de Santana","locality":"Bahia · Portal do Sertão","coords":[-12.2667,-38.9667],"state":"BA","route":"Bahia"},{"id":"vitoria_conquista","title":"Vitória da Conquista","locality":"Bahia · Planalto da Conquista","coords":[-14.8661,-40.8394],"state":"BA","route":"Bahia"},{"id":"barreiras","title":"Barreiras","locality":"Bahia · Oeste Baiano / Bacia do Rio Grande","coords":[-12.1528,-44.9900],"state":"BA","route":"Bahia"},{"id":"juazeiro_ba","title":"Juazeiro","locality":"Bahia · Margem Sul do Rio São Francisco","coords":[-9.4167,-40.5000],"state":"BA","route":"Bahia"},{"id":"lencois_diamantina","title":"Lençóis · Chapada Diamantina","locality":"Bahia · Parque Nacional Chapada Diamantina","coords":[-12.5631,-41.3894],"state":"BA","route":"Bahia"},{"id":"mantiqueira_kml","title":"Serra da Mantiqueira · Phrynomedusa boticariana","locality":"São Paulo · Santo Antônio do Pinhal (1.411m - KMZ real)","coords":[-22.894452,-45.996946],"state":"SP","route":"Mantiqueira"},{"id":"campos_jordao","title":"Campos do Jordão","locality":"São Paulo · Floresta de Araucárias Altimontana","coords":[-22.7394,-45.5913],"state":"SP","route":"Mantiqueira"},{"id":"pinda","title":"Pindamonhangaba","locality":"São Paulo · Vale do Paraíba","coords":[-22.9247,-45.4614],"state":"SP","route":"Vale do Paraíba"},{"id":"taubate","title":"Taubaté","locality":"São Paulo · Rodovias Dutra \u0026 Carvalho Pinto","coords":[-23.0205,-45.5558],"state":"SP","route":"Vale do Paraíba"},{"id":"guara","title":"Guaratinguetá","locality":"São Paulo · Parque das Nascentes / Restauração","coords":[-22.8164,-45.1925],"state":"SP","route":"Vale do Paraíba"},{"id":"aparecida","title":"Aparecida","locality":"São Paulo · Margens do Rio Paraíba do Sul","coords":[-22.8469,-45.2289],"state":"SP","route":"Vale do Paraíba"},{"id":"sjc","title":"São José dos Campos","locality":"São Paulo · Vale do Paraíba","coords":[-23.1896,-45.8841],"state":"SP","route":"Vale do Paraíba"},{"id":"paraibuna","title":"Paraibuna · Viveiro CESP","locality":"São Paulo · Represa \u0026 Reintrodução de Fauna","coords":[-23.3858,-45.6625],"state":"SP","route":"Vale do Paraíba"},{"id":"ubatuba","title":"Ubatuba · Picinguaba","locality":"São Paulo · Mata Atlântica de Encosta \u0026 Ilhotes","coords":[-23.4332,-45.0834],"state":"SP","route":"Litoral Norte"},{"id":"sao_sebastiao","title":"São Sebastião · Porto \u0026 Canal","locality":"São Paulo · Ornitofauna Portuária","coords":[-23.7600,-45.4100],"state":"SP","route":"Litoral Norte"},{"id":"ilhabela","title":"Ilhabela · Parque Estadual","locality":"São Paulo · Arquipélago \u0026 Anfíbios Bromelígenas","coords":[-23.7781,-45.3581],"state":"SP","route":"Litoral Norte"},{"id":"caraguatatuba","title":"Caraguatatuba · Rodovia dos Tamoios Serra","locality":"São Paulo · RT Fauna Obra Nova Tamoios","coords":[-23.6228,-45.4128],"state":"SP","route":"Litoral Norte"},{"id":"cubatao","title":"Cubatão · Terminal Tatu / Piaçaguera","locality":"São Paulo · Manguezal \u0026 EIA/RIMA Logístico","coords":[-23.8950,-46.4253],"state":"SP","route":"Baixada Santista"},{"id":"paranapiacaba","title":"Paranapiacaba · Serra do Mar","locality":"São Paulo · Reserva Biológica \u0026 Hylodes de Riacho","coords":[-23.7781,-46.3025],"state":"SP","route":"Serra do Mar"},{"id":"itanhaem","title":"Itanhaém · SouthWild Felinos","locality":"São Paulo · Monitoramento de Onça-Parda (Puma concolor)","coords":[-24.1831,-46.7889],"state":"SP","route":"Litoral Sul"},{"id":"santos","title":"Santos","locality":"São Paulo · Complexo Estuarino Portuário","coords":[-23.9608,-46.3331],"state":"SP","route":"Baixada Santista"},{"id":"sao_paulo_cap","title":"São Paulo","locality":"São Paulo · Capital \u0026 Coleções Científicas","coords":[-23.5505,-46.6333],"state":"SP","route":"Capital"},{"id":"piracicaba","title":"Piracicaba · ESALQ USP","locality":"São Paulo · Laboratório de Girinos \u0026 Taxonomia","coords":[-22.7253,-47.6492],"state":"SP","route":"Mestrado \u0026 Pesquisa"},{"id":"rio_claro","title":"Rio Claro · UNESP","locality":"São Paulo · Coleção Herpetológica Célio Haddad","coords":[-22.4114,-47.5614],"state":"SP","route":"Mestrado \u0026 Pesquisa"},{"id":"botucatu","title":"Botucatu · Cuesta Basáltica","locality":"São Paulo · Transição Cerrado-Mata Atlântica","coords":[-22.8858,-48.4450],"state":"SP","route":"Cuesta"},{"id":"pardinho_kml","title":"Pardinho · Capivaras","locality":"São Paulo · Monitoramento de Mastofauna (KMZ real)","coords":[-23.0841,-48.3772],"state":"SP","route":"Cuesta"},{"id":"boituva","title":"Boituva · Porto de Areia Realmix","locality":"São Paulo · Monitoramento Ambiental de Mineração","coords":[-23.2847,-47.6789],"state":"SP","route":"Interior SP"},{"id":"cananeia","title":"Cananéia · Ilha do Cardoso","locality":"São Paulo · Complexo Estuarino Lagunar / Lagamar","coords":[-25.0147,-47.9267],"state":"SP","route":"Lagamar"},{"id":"iguape","title":"Iguape · Ilha Comprida","locality":"São Paulo · Restingas \u0026 Aves Migratórias","coords":[-24.7081,-47.5550],"state":"SP","route":"Lagamar"},{"id":"castilho","title":"Castilho · Subestação LT 500 kV","locality":"São Paulo · Interligação Elétrica Rio Paraná","coords":[-20.8719,-51.4875],"state":"SP","route":"Linhas de Transmissão"},{"id":"resende","title":"Resende","locality":"Rio de Janeiro · Vale do Paraíba Fluminense","coords":[-22.4689,-44.4467],"state":"RJ","route":"Rio de Janeiro"},{"id":"itatiaia","title":"Itatiaia · Parque Nacional do Itatiaia","locality":"Rio de Janeiro · Agulhas Negras / Climas Extremos","coords":[-22.4542,-44.6067],"state":"RJ","route":"Mantiqueira"},{"id":"angra_reis","title":"Angra dos Reis","locality":"Rio de Janeiro · Costa Verde / Baía da Ilha Grande","coords":[-23.0067,-44.3181],"state":"RJ","route":"Costa Verde"},{"id":"paraty","title":"Paraty","locality":"Rio de Janeiro · Bocaina \u0026 Costão Rochoso","coords":[-23.2178,-44.7131],"state":"RJ","route":"Costa Verde"},{"id":"rio_capital","title":"Rio de Janeiro","locality":"Rio de Janeiro · Capital","coords":[-22.9068,-43.1729],"state":"RJ","route":"Rio de Janeiro"},{"id":"niteroi","title":"Niterói","locality":"Rio de Janeiro · Baía de Guanabara","coords":[-22.8833,-43.1036],"state":"RJ","route":"Rio de Janeiro"},{"id":"nova_lima","title":"Nova Lima · Quadrilátero Ferrífero","locality":"Minas Gerais · Mineração de Ferro Vale S.A.","coords":[-19.9858,-43.8467],"state":"MG","route":"Mineração"},{"id":"brumadinho","title":"Brumadinho","locality":"Minas Gerais · Bacia do Rio Paraopeba","coords":[-20.1436,-44.1989],"state":"MG","route":"Mineração"},{"id":"belo_horizonte","title":"Belo Horizonte","locality":"Minas Gerais · Capital","coords":[-19.9167,-43.9345],"state":"MG","route":"Minas Gerais"},{"id":"serra_cipo_mg","title":"Santana do Riacho · Serra do Cipó","locality":"Minas Gerais · Campos Rupestres da Cadeia do Espinhaço","coords":[-19.3456,-43.6128],"state":"MG","route":"Espinhaço"},{"id":"pocos_caldas_mg","title":"Poços de Caldas","locality":"Minas Gerais · Planalto Vulcânico \u0026 Brejos de Altitude","coords":[-21.7895,-46.5626],"state":"MG","route":"Mantiqueira Ocidental"},{"id":"janauba","title":"Janaúba · Complexo Solar","locality":"Minas Gerais · Parque Solar do Norte de Minas","coords":[-15.8025,-43.3089],"state":"MG","route":"Energia Solar"},{"id":"estreito","title":"Estreito / Ibiá","locality":"Minas Gerais · Subestação LT 500 kV Estreito","coords":[-19.6450,-47.0125],"state":"MG","route":"Linhas de Transmissão"},{"id":"rio_verde_kml","title":"Rio Verde · PCH Verde 2","locality":"Goiás · PCH Verde 2 \u0026 LT 138 kV (KMZ real)","coords":[-17.2939,-50.8501],"state":"GO","route":"Setor Hidrelétrico"},{"id":"montividiu","title":"Montividiu","locality":"Goiás · Bacia do Rio Verdão","coords":[-17.4431,-51.1739],"state":"GO","route":"Setor Hidrelétrico"},{"id":"chapada_veadeiros_go","title":"Alto Paraíso · Chapada dos Veadeiros","locality":"Goiás · Cerrado de Altitude \u0026 Anuros Reófilos","coords":[-14.1311,-47.5147],"state":"GO","route":"Cerrado Rupestre"},{"id":"goiania","title":"Goiânia","locality":"Goiás · Capital do Cerrado","coords":[-16.6869,-49.2648],"state":"GO","route":"Goiás"},{"id":"itumbiara","title":"Itumbiara","locality":"Goiás · UHE Itumbiara \u0026 Linhas de Transmissão","coords":[-18.4194,-49.2167],"state":"GO","route":"Setor Hidrelétrico"},{"id":"tres_lagoas","title":"Três Lagoas","locality":"Mato Grosso do Sul · Bacia do Rio Paraná","coords":[-20.7847,-51.7006],"state":"MS","route":"Mato Grosso do Sul"},{"id":"inocencia","title":"Inocência · Fábrica Celulose Arauco","locality":"Mato Grosso do Sul · Licenciamento \u0026 Monitoramento Fauna","coords":[-19.7289,-51.9306],"state":"MS","route":"Mato Grosso do Sul"},{"id":"bataguassu","title":"Bataguassu","locality":"Mato Grosso do Sul · Bacia do Rio Pardo / Celulose","coords":[-21.7139,-52.4222],"state":"MS","route":"Mato Grosso do Sul"},{"id":"corumba","title":"Corumbá · Pantanal Sul","locality":"Mato Grosso do Sul · Nhecolândia \u0026 Rio Paraguai","coords":[-19.0076,-57.6534],"state":"MS","route":"Pantanal"},{"id":"miranda","title":"Miranda · Pantanal","locality":"Mato Grosso do Sul · Bacia do Miranda / Armadilhamento","coords":[-20.2406,-56.3789],"state":"MS","route":"Pantanal"},{"id":"campo_grande","title":"Campo Grande","locality":"Mato Grosso do Sul · Capital","coords":[-20.4697,-54.6201],"state":"MS","route":"Mato Grosso do Sul"},{"id":"paranaiba","title":"Paranaíba","locality":"Mato Grosso do Sul · LT 230 kV Itumbiara-Paranaíba","coords":[-19.6739,-51.1906],"state":"MS","route":"Linhas de Transmissão"},{"id":"chapada_guimaraes_mt","title":"Chapada dos Guimarães · Canyons","locality":"Mato Grosso · Parque Nacional Chapada dos Guimarães","coords":[-15.4607,-55.7497],"state":"MT","route":"Cerrado"},{"id":"curitiba","title":"Curitiba","locality":"Paraná · Primeiro Planalto Paranaense","coords":[-25.4284,-49.2733],"state":"PR","route":"Paraná"},{"id":"morretes","title":"Morretes · Serra da Graciosa","locality":"Paraná · Mata Atlântica Pluvial \u0026 Anuros de Folhiço","coords":[-25.4756,-48.8344],"state":"PR","route":"Serra do Mar Sul"},{"id":"antonina","title":"Antonina","locality":"Paraná · Baía de Antonina \u0026 Manguezais","coords":[-25.4287,-48.7121],"state":"PR","route":"Serra do Mar Sul"},{"id":"maringa","title":"Maringá","locality":"Paraná · Terceiro Planalto Paranaense","coords":[-23.4210,-51.9331],"state":"PR","route":"Paraná"},{"id":"londrina","title":"Londrina","locality":"Paraná · Bacia do Tibagi","coords":[-23.3045,-51.1696],"state":"PR","route":"Paraná"},{"id":"linhares","title":"Linhares · Reserva Natural Vale","locality":"Espírito Santo · Mata de Tabuleiros \u0026 Lagoas Costeiras","coords":[-19.1481,-40.0658],"state":"ES","route":"Mata de Tabuleiros"},{"id":"sooretama","title":"Sooretama · Reserva Biológica","locality":"Espírito Santo · Floresta Atlântica de Baixada","coords":[-19.1975,-40.0911],"state":"ES","route":"Mata de Tabuleiros"},{"id":"vitoria","title":"Vitória","locality":"Espírito Santo · Capital \u0026 Baía de Vitória","coords":[-20.3155,-40.3128],"state":"ES","route":"Espírito Santo"},{"id":"florianopolis","title":"Florianópolis","locality":"Santa Catarina · Ilha de Santa Catarina","coords":[-27.5954,-48.5480],"state":"SC","route":"Santa Catarina"},{"id":"itajai","title":"Itajaí · Foz do Rio Itajaí-Açu","locality":"Santa Catarina · Complexo Portuário \u0026 Fauna Aquática","coords":[-26.9078,-48.6619],"state":"SC","route":"Santa Catarina"},{"id":"blumenau","title":"Blumenau · Médio Vale do Itajaí","locality":"Santa Catarina · Floresta Ombrófila Densa Montana","coords":[-26.9194,-49.0661],"state":"SC","route":"Santa Catarina"},{"id":"joinville","title":"Joinville · Baía da Babitonga","locality":"Santa Catarina · Ecossistemas de Manguezal e Mata Atlântica","coords":[-26.3045,-48.8487],"state":"SC","route":"Santa Catarina"},{"id":"cambara","locality":"Paraná · Rota Cambará-Curitiba","coords":[-23.0456,-50.0736],"route":"Rota Cambará-Curitiba","state":"PR","title":"Cambará"},{"id":"andira","locality":"Paraná · Rota Cambará-Curitiba","coords":[-23.0519,-50.2289],"route":"Rota Cambará-Curitiba","state":"PR","title":"Andirá"},{"id":"bandeirantes","locality":"Paraná · Rota Cambará-Curitiba","coords":[-23.1097,-50.3667],"route":"Rota Cambará-Curitiba","state":"PR","title":"Bandeirantes"},{"id":"santa_mariana","locality":"Paraná · Rota Cambará-Curitiba","coords":[-23.1494,-50.5186],"route":"Rota Cambará-Curitiba","state":"PR","title":"Santa Mariana"},{"id":"cornelio_procopio","locality":"Paraná · Norte Pioneiro","coords":[-23.1814,-50.6469],"route":"Rota Cambará-Curitiba","state":"PR","title":"Cornélio Procópio"},{"id":"jacarezinho_pr","locality":"Paraná · Rota Cambará-Curitiba","coords":[-23.1603,-49.9703],"route":"Rota Cambará-Curitiba","state":"PR","title":"Jacarezinho"},{"id":"sto_antonio_platina","locality":"Paraná · PR-092 / BR-153","coords":[-23.2947,-50.0819],"route":"Rota Cambará-Curitiba","state":"PR","title":"Santo Antônio da Platina"},{"id":"joaquim_tavora","locality":"Paraná · PR-092","coords":[-23.4989,-49.9208],"route":"Rota Cambará-Curitiba","state":"PR","title":"Joaquim Távora"},{"id":"quatigua","locality":"Paraná · PR-092","coords":[-23.5678,-49.9142],"route":"Rota Cambará-Curitiba","state":"PR","title":"Quatiguá"},{"id":"siqueira_campos","locality":"Paraná · PR-092","coords":[-23.6889,-49.8336],"route":"Rota Cambará-Curitiba","state":"PR","title":"Siqueira Campos"},{"id":"wenceslau_braz","locality":"Paraná · PR-092","coords":[-23.8744,-49.8033],"route":"Rota Cambará-Curitiba","state":"PR","title":"Wenceslau Braz"},{"id":"arapoti","locality":"Paraná · PR-092","coords":[-24.1575,-49.8267],"route":"Rota Cambará-Curitiba","state":"PR","title":"Arapoti"},{"id":"jaguariaiva","locality":"Paraná · Parque Estadual do Cerrado","coords":[-24.2508,-49.7058],"route":"Rota Cambará-Curitiba","state":"PR","title":"Jaguariaíva"},{"id":"senges","locality":"Paraná · Vale do Itararé","coords":[-24.1136,-49.4608],"route":"Rota Cambará-Curitiba","state":"PR","title":"Sengés"},{"id":"pirai_sul","locality":"Paraná · PR-151","coords":[-24.5261,-49.9483],"route":"Rota Cambará-Curitiba","state":"PR","title":"Piraí do Sul"},{"id":"castro","locality":"Paraná · Campos Gerais","coords":[-24.7911,-50.0119],"route":"Rota Cambará-Curitiba","state":"PR","title":"Castro"},{"id":"carambei","locality":"Paraná · Parque Histórico","coords":[-24.9197,-50.0989],"route":"Rota Cambará-Curitiba","state":"PR","title":"Carambeí"},{"id":"ponta_grossa","locality":"Paraná · Parque Estadual de Vila Velha","coords":[-25.0944,-50.1633],"route":"Rota Cambará-Curitiba","state":"PR","title":"Ponta Grossa"},{"id":"palmeira","locality":"Paraná · BR-277 / Campos Gerais","coords":[-25.4289,-50.0069],"route":"Rota Cambará-Curitiba","state":"PR","title":"Palmeira"},{"id":"campo_largo","locality":"Paraná · BR-277","coords":[-25.4597,-49.5275],"route":"Rota Cambará-Curitiba","state":"PR","title":"Campo Largo"},{"id":"ourinhos","locality":"São Paulo · Divisa SP/PR","coords":[-22.9794,-49.8706],"route":"Rota Ourinhos-Cachoeira Paulista","state":"SP","title":"Ourinhos"},{"id":"canitar","locality":"São Paulo · SP-270 Raposo Tavares","coords":[-23.0069,-49.7783],"route":"Rota Ourinhos-Cachoeira Paulista","state":"SP","title":"Canitar"},{"id":"chavantes","locality":"São Paulo · Bacia do Paranapanema","coords":[-23.0389,-49.7106],"route":"Rota Ourinhos-Cachoeira Paulista","state":"SP","title":"Chavantes"},{"id":"ipaussu","locality":"São Paulo · SP-270 Raposo Tavares","coords":[-23.0569,-49.6239],"route":"Rota Ourinhos-Cachoeira Paulista","state":"SP","title":"Ipaussu"},{"id":"bernardino_campos","locality":"São Paulo · SP-270","coords":[-23.0139,-49.4744],"route":"Rota Ourinhos-Cachoeira Paulista","state":"SP","title":"Bernardino de Campos"},{"id":"santa_cruz_rio_pardo","locality":"São Paulo · Bacia do Rio Pardo","coords":[-22.8989,-49.6325],"route":"Rota Ourinhos-Cachoeira Paulista","state":"SP","title":"Santa Cruz do Rio Pardo"},{"id":"cerqueira_cesar","locality":"São Paulo · SP-280 / SP-245","coords":[-23.0356,-49.1656],"route":"Rota Ourinhos-Cachoeira Paulista","state":"SP","title":"Cerqueira César"},{"id":"manduri","locality":"São Paulo · SP-280","coords":[-23.0033,-49.3247],"route":"Rota Ourinhos-Cachoeira Paulista","state":"SP","title":"Manduri"},{"id":"aguas_santa_barbara","locality":"São Paulo · Estância Hidromineral","coords":[-22.8808,-49.2389],"route":"Rota Ourinhos-Cachoeira Paulista","state":"SP","title":"Águas de Santa Bárbara"},{"id":"avare","locality":"São Paulo · Represa de Jurumirim","coords":[-23.0989,-48.9256],"route":"Rota Ourinhos-Cachoeira Paulista","state":"SP","title":"Avaré"},{"id":"paranapanema","locality":"São Paulo · SP-270 Raposo Tavares","coords":[-23.3869,-48.7239],"route":"Rota Ourinhos-Cachoeira Paulista","state":"SP","title":"Paranapanema"},{"id":"angatuba","locality":"São Paulo · SP-270 Raposo Tavares","coords":[-23.4914,-48.4128],"route":"Rota Ourinhos-Cachoeira Paulista","state":"SP","title":"Angatuba"},{"id":"itapetininga","locality":"São Paulo · Região Metropolitana de Sorocaba","coords":[-23.5889,-48.0531],"route":"Rota Ourinhos-Cachoeira Paulista","state":"SP","title":"Itapetininga"},{"id":"capela_alto","locality":"São Paulo · SP-270","coords":[-23.4719,-47.7336],"route":"Rota Ourinhos-Cachoeira Paulista","state":"SP","title":"Capela do Alto"},{"id":"tatui","locality":"São Paulo · SP-280 Castello Branco","coords":[-23.3556,-47.8569],"route":"Rota Ourinhos-Cachoeira Paulista","state":"SP","title":"Tatuí"},{"id":"ipero","locality":"São Paulo · Floresta Nacional de Ipanema","coords":[-23.3514,-47.6881],"route":"Rota Ourinhos-Cachoeira Paulista","state":"SP","title":"Iperó"},{"id":"sorocaba","locality":"São Paulo · Polo Regional Sorocaba","coords":[-23.5015,-47.4526],"route":"Rota Ourinhos-Cachoeira Paulista","state":"SP","title":"Sorocaba"},{"id":"votorantim","locality":"São Paulo · Região Metropolitana Sorocaba","coords":[-23.5414,-47.4389],"route":"Rota Ourinhos-Cachoeira Paulista","state":"SP","title":"Votorantim"},{"id":"mairinque","locality":"São Paulo · SP-270 Raposo Tavares","coords":[-23.5461,-47.1836],"route":"Rota Ourinhos-Cachoeira Paulista","state":"SP","title":"Mairinque"},{"id":"sao_roque","locality":"São Paulo · Estância Turística","coords":[-23.5289,-47.135],"route":"Rota Ourinhos-Cachoeira Paulista","state":"SP","title":"São Roque"},{"id":"aracariguama","locality":"São Paulo · SP-280 Castello Branco","coords":[-23.4381,-47.0617],"route":"Rota Ourinhos-Cachoeira Paulista","state":"SP","title":"Araçariguama"},{"id":"barueri","locality":"São Paulo · Região Metropolitana SP","coords":[-23.5106,-46.8761],"route":"Rota Ourinhos-Cachoeira Paulista","state":"SP","title":"Barueri"},{"id":"osasco","locality":"São Paulo · Grande São Paulo","coords":[-23.5325,-46.7917],"route":"Rota Ourinhos-Cachoeira Paulista","state":"SP","title":"Osasco"},{"id":"guarulhos","locality":"São Paulo · Rodovia Presidente Dutra","coords":[-23.4542,-46.5333],"route":"Rota Ourinhos-Cachoeira Paulista","state":"SP","title":"Guarulhos"},{"id":"aruja","locality":"São Paulo · Rodovia Presidente Dutra","coords":[-23.3967,-46.32],"route":"Rota Ourinhos-Cachoeira Paulista","state":"SP","title":"Arujá"},{"id":"santa_isabel_sp","locality":"São Paulo · Rodovia Presidente Dutra","coords":[-23.3156,-46.2231],"route":"Rota Ourinhos-Cachoeira Paulista","state":"SP","title":"Santa Isabel"},{"id":"jacarei","locality":"São Paulo · Vale do Paraíba","coords":[-23.3056,-45.9658],"route":"Rota Ourinhos-Cachoeira Paulista","state":"SP","title":"Jacareí"},{"id":"cacapava","locality":"São Paulo · Rodovia Presidente Dutra","coords":[-23.1006,-45.7072],"route":"Rota Ourinhos-Cachoeira Paulista","state":"SP","title":"Caçapava"},{"id":"tremembe","locality":"São Paulo · Vale do Paraíba","coords":[-22.9589,-45.5489],"route":"Rota Ourinhos-Cachoeira Paulista","state":"SP","title":"Tremembé"},{"id":"roseira","locality":"São Paulo · Rodovia Presidente Dutra","coords":[-22.8989,-45.3056],"route":"Rota Ourinhos-Cachoeira Paulista","state":"SP","title":"Roseira"},{"id":"potim","locality":"São Paulo · Margens do Rio Paraíba","coords":[-22.8436,-45.2508],"route":"Rota Ourinhos-Cachoeira Paulista","state":"SP","title":"Potim"},{"id":"lorena","locality":"São Paulo · Vale do Paraíba","coords":[-22.7331,-45.1242],"route":"Rota Ourinhos-Cachoeira Paulista","state":"SP","title":"Lorena"},{"id":"canas","locality":"São Paulo · Rodovia Presidente Dutra","coords":[-22.71,-45.0567],"route":"Rota Ourinhos-Cachoeira Paulista","state":"SP","title":"Canas"},{"id":"cachoeira_paulista","locality":"São Paulo · Vale do Paraíba","coords":[-22.6639,-45.0097],"route":"Rota Ourinhos-Cachoeira Paulista","state":"SP","title":"Cachoeira Paulista"},{"id":"areias","locality":"São Paulo · Vale Histórico / Bocaina","coords":[-22.5806,-44.6989],"route":"Rota Areias-Três Lagoas","state":"SP","title":"Areias"},{"id":"sao_jose_barreiro","locality":"São Paulo · Serra da Bocaina","coords":[-22.6469,-44.5789],"route":"Rota Areias-Três Lagoas","state":"SP","title":"São José do Barreiro"},{"id":"queluz","locality":"São Paulo · Divisa SP/RJ","coords":[-22.5369,-44.7744],"route":"Rota Areias-Três Lagoas","state":"SP","title":"Queluz"},{"id":"silveiras","locality":"São Paulo · Vale Histórico da Bocaina","coords":[-22.6681,-44.8517],"route":"Rota Areias-Três Lagoas","state":"SP","title":"Silveiras"},{"id":"lavrinhas","locality":"São Paulo · Vale do Paraíba","coords":[-22.5694,-44.9017],"route":"Rota Areias-Três Lagoas","state":"SP","title":"Lavrinhas"},{"id":"cruzeiro","locality":"São Paulo · Garganta do Embaú / Mantiqueira","coords":[-22.5739,-44.9639],"route":"Rota Areias-Três Lagoas","state":"SP","title":"Cruzeiro"},{"id":"jundiai","locality":"São Paulo · Serra do Japi","coords":[-23.1856,-46.8978],"route":"Rota Areias-Três Lagoas","state":"SP","title":"Jundiaí"},{"id":"itupeva","locality":"São Paulo · Região Jundiaí","coords":[-23.1531,-47.0578],"route":"Rota Areias-Três Lagoas","state":"SP","title":"Itupeva"},{"id":"itu","locality":"São Paulo · Estância Turística","coords":[-23.2642,-47.2992],"route":"Rota Areias-Três Lagoas","state":"SP","title":"Itu"},{"id":"salto","locality":"São Paulo · Monumento à Padroeira","coords":[-23.2008,-47.2869],"route":"Rota Areias-Três Lagoas","state":"SP","title":"Salto"},{"id":"porto_feliz","locality":"São Paulo · Terra das Monções","coords":[-23.2156,-47.5239],"route":"Rota Areias-Três Lagoas","state":"SP","title":"Porto Feliz"},{"id":"tiete","locality":"São Paulo · Rio Tietê","coords":[-23.1022,-47.7136],"route":"Rota Areias-Três Lagoas","state":"SP","title":"Tietê"},{"id":"laranjal_paulista","locality":"São Paulo · SP-300 Marechal Rondon","coords":[-23.05,-47.8378],"route":"Rota Areias-Três Lagoas","state":"SP","title":"Laranjal Paulista"},{"id":"conchas","locality":"São Paulo · SP-300 Marechal Rondon","coords":[-22.9881,-48.0097],"route":"Rota Areias-Três Lagoas","state":"SP","title":"Conchas"},{"id":"anhembi","locality":"São Paulo · Represa de Barra Bonita","coords":[-22.7936,-48.1319],"route":"Rota Areias-Três Lagoas","state":"SP","title":"Anhembi"},{"id":"sao_manuel","locality":"São Paulo · SP-300 Marechal Rondon","coords":[-22.7317,-48.5714],"route":"Rota Areias-Três Lagoas","state":"SP","title":"São Manuel"},{"id":"areiopolis","locality":"São Paulo · SP-300 Marechal Rondon","coords":[-22.6658,-48.6656],"route":"Rota Areias-Três Lagoas","state":"SP","title":"Areiópolis"},{"id":"lencois_paulista","locality":"São Paulo · SP-300 Marechal Rondon","coords":[-22.5989,-48.8],"route":"Rota Areias-Três Lagoas","state":"SP","title":"Lençóis Paulista"},{"id":"macatuba","locality":"São Paulo · SP-300","coords":[-22.5028,-48.7119],"route":"Rota Areias-Três Lagoas","state":"SP","title":"Macatuba"},{"id":"agudos","locality":"São Paulo · SP-300 Marechal Rondon","coords":[-22.4694,-48.9839],"route":"Rota Areias-Três Lagoas","state":"SP","title":"Agudos"},{"id":"bauru","locality":"São Paulo · Centro do Estado / Rondon","coords":[-22.3147,-49.0606],"route":"Rota Areias-Três Lagoas","state":"SP","title":"Bauru"},{"id":"piratininga","locality":"São Paulo · Região de Bauru","coords":[-22.4131,-49.1356],"route":"Rota Areias-Três Lagoas","state":"SP","title":"Piratininga"},{"id":"avai","locality":"São Paulo · SP-300 Marechal Rondon","coords":[-22.1469,-49.3361],"route":"Rota Areias-Três Lagoas","state":"SP","title":"Avaí"},{"id":"presidente_alves","locality":"São Paulo · SP-300","coords":[-21.9989,-49.4319],"route":"Rota Areias-Três Lagoas","state":"SP","title":"Presidente Alves"},{"id":"pirajui","locality":"São Paulo · SP-300 Marechal Rondon","coords":[-21.9989,-49.4589],"route":"Rota Areias-Três Lagoas","state":"SP","title":"Pirajuí"},{"id":"cafelandia","locality":"São Paulo · SP-300 Marechal Rondon","coords":[-21.8028,-49.6106],"route":"Rota Areias-Três Lagoas","state":"SP","title":"Cafelândia"},{"id":"lins","locality":"São Paulo · SP-300 Marechal Rondon","coords":[-21.6789,-49.7508],"route":"Rota Areias-Três Lagoas","state":"SP","title":"Lins"},{"id":"guaicara","locality":"São Paulo · SP-300 Marechal Rondon","coords":[-21.6069,-49.7917],"route":"Rota Areias-Três Lagoas","state":"SP","title":"Guaiçara"},{"id":"promissao","locality":"São Paulo · Usina Hidrelétrica de Promissão","coords":[-21.5369,-49.8589],"route":"Rota Areias-Três Lagoas","state":"SP","title":"Promissão"},{"id":"avanhandava","locality":"São Paulo · SP-300 Marechal Rondon","coords":[-21.4608,-49.9508],"route":"Rota Areias-Três Lagoas","state":"SP","title":"Avanhandava"},{"id":"penapolis","locality":"São Paulo · SP-300 Marechal Rondon","coords":[-21.4239,-50.0789],"route":"Rota Areias-Três Lagoas","state":"SP","title":"Penápolis"},{"id":"glicerio","locality":"São Paulo · SP-300 Marechal Rondon","coords":[-21.3667,-50.2033],"route":"Rota Areias-Três Lagoas","state":"SP","title":"Glicério"},{"id":"coroados","locality":"São Paulo · SP-300 Marechal Rondon","coords":[-21.3508,-50.2858],"route":"Rota Areias-Três Lagoas","state":"SP","title":"Coroados"},{"id":"birigui","locality":"São Paulo · SP-300 Marechal Rondon","coords":[-21.2889,-50.34],"route":"Rota Areias-Três Lagoas","state":"SP","title":"Birigui"},{"id":"aracatuba","locality":"São Paulo · Polo do Noroeste Paulista","coords":[-21.2089,-50.4406],"route":"Rota Areias-Três Lagoas","state":"SP","title":"Araçatuba"},{"id":"guararapes","locality":"São Paulo · SP-300 Marechal Rondon","coords":[-21.2608,-50.6528],"route":"Rota Areias-Três Lagoas","state":"SP","title":"Guararapes"},{"id":"bento_abreu","locality":"São Paulo · SP-300 Marechal Rondon","coords":[-21.2725,-50.8142],"route":"Rota Areias-Três Lagoas","state":"SP","title":"Bento de Abreu"},{"id":"valparaiso","locality":"São Paulo · SP-300 Marechal Rondon","coords":[-21.2289,-50.868899999999996],"route":"Rota Areias-Três Lagoas","state":"SP","title":"Valparaíso"},{"id":"lavinia","locality":"São Paulo · SP-300 Marechal Rondon","coords":[-21.1681,-51.0378],"route":"Rota Areias-Três Lagoas","state":"SP","title":"Lavínia"},{"id":"mirandopolis","locality":"São Paulo · SP-300 Marechal Rondon","coords":[-21.1336,-51.1039],"route":"Rota Areias-Três Lagoas","state":"SP","title":"Mirandópolis"},{"id":"guaracai","locality":"São Paulo · SP-300 Marechal Rondon","coords":[-21.0269,-51.2106],"route":"Rota Areias-Três Lagoas","state":"SP","title":"Guaraçaí"},{"id":"murutinga_sul","locality":"São Paulo · SP-300 Marechal Rondon","coords":[-20.9958,-51.2778],"route":"Rota Areias-Três Lagoas","state":"SP","title":"Murutinga do Sul"},{"id":"andradina","locality":"São Paulo · Terra do Rei do Gado / Rondon","coords":[-20.8958,-51.3789],"route":"Rota Areias-Três Lagoas","state":"SP","title":"Andradina"},{"id":"terezopolis_go","locality":"Goiás · BR-153 Belém-Brasília","coords":[-16.4839,-49.0931],"route":"Rota Goiânia-Belém","state":"GO","title":"Terezópolis de Goiás"},{"id":"anapolis","locality":"Goiás · Polo Industrial \u0026 Rodoviário","coords":[-16.3267,-48.9528],"route":"Rota Goiânia-Belém","state":"GO","title":"Anápolis"},{"id":"jaragua_go","locality":"Goiás · BR-153","coords":[-15.7569,-49.3347],"route":"Rota Goiânia-Belém","state":"GO","title":"Jaraguá"},{"id":"rianapolis","locality":"Goiás · Vale do São Patrício","coords":[-15.4439,-49.51],"route":"Rota Goiânia-Belém","state":"GO","title":"Rianápolis"},{"id":"ceres_rialma","locality":"Goiás · Vale do São Patrício / Rio das Almas","coords":[-15.3069,-49.5989],"route":"Rota Goiânia-Belém","state":"GO","title":"Ceres"},{"id":"nova_gloria","locality":"Goiás · BR-153","coords":[-15.1436,-49.5708],"route":"Rota Goiânia-Belém","state":"GO","title":"Nova Glória"},{"id":"sao_luiz_norte","locality":"Goiás · BR-153","coords":[-14.8631,-49.3247],"route":"Rota Goiânia-Belém","state":"GO","title":"São Luiz do Norte"},{"id":"hidrolina","locality":"Goiás · Norte Goiano","coords":[-14.7219,-49.4608],"route":"Rota Goiânia-Belém","state":"GO","title":"Hidrolina"},{"id":"uruacu","locality":"Goiás · Lago de Serra da Mesa","coords":[-14.5247,-49.1417],"route":"Rota Goiânia-Belém","state":"GO","title":"Uruaçu"},{"id":"campinorte","locality":"Goiás · BR-153 Belém-Brasília","coords":[-14.3167,-49.1528],"route":"Rota Goiânia-Belém","state":"GO","title":"Campinorte"},{"id":"mara_rosa","locality":"Goiás · Terra do Açafrão / BR-153","coords":[-14.0156,-49.1761],"route":"Rota Goiânia-Belém","state":"GO","title":"Mara Rosa"},{"id":"estrela_norte","locality":"Goiás · BR-153","coords":[-13.8689,-49.0728],"route":"Rota Goiânia-Belém","state":"GO","title":"Estrela do Norte"},{"id":"santa_tereza_go","locality":"Goiás · BR-153","coords":[-13.7142,-49.0147],"route":"Rota Goiânia-Belém","state":"GO","title":"Santa Tereza de Goiás"},{"id":"porangatu","locality":"Goiás · Portal do Norte Goiano","coords":[-13.4411,-49.1486],"route":"Rota Goiânia-Belém","state":"GO","title":"Porangatu"},{"id":"talisma","locality":"Tocantins · Portal Sul do Tocantins","coords":[-12.7958,-49.0917],"route":"Rota Goiânia-Belém","state":"TO","title":"Talismã"},{"id":"alvorada_to","locality":"Tocantins · Sul do Tocantins / BR-153","coords":[-12.48,-49.1247],"route":"Rota Goiânia-Belém","state":"TO","title":"Alvorada"},{"id":"figueiropolis","locality":"Tocantins · BR-153","coords":[-12.1311,-49.1742],"route":"Rota Goiânia-Belém","state":"TO","title":"Figueirópolis"},{"id":"cariri_to","locality":"Tocantins · BR-153","coords":[-11.8906,-49.1608],"route":"Rota Goiânia-Belém","state":"TO","title":"Cariri do Tocantins"},{"id":"gurupi","locality":"Tocantins · Capital da Amizade / Sul do TO","coords":[-11.7297,-49.0686],"route":"Rota Goiânia-Belém","state":"TO","title":"Gurupi"},{"id":"alianca_to","locality":"Tocantins · BR-153","coords":[-11.3069,-48.9347],"route":"Rota Goiânia-Belém","state":"TO","title":"Aliança do Tocantins"},{"id":"crixas_to","locality":"Tocantins · BR-153","coords":[-11.1008,-48.9167],"route":"Rota Goiânia-Belém","state":"TO","title":"Crixás do Tocantins"},{"id":"santa_rita_to","locality":"Tocantins · BR-153","coords":[-10.8639,-48.9158],"route":"Rota Goiânia-Belém","state":"TO","title":"Santa Rita do Tocantins"},{"id":"fatima_to","locality":"Tocantins · BR-153 Belém-Brasília","coords":[-10.7606,-48.9067],"route":"Rota Goiânia-Belém","state":"TO","title":"Fátima"},{"id":"oliveira_fatima","locality":"Tocantins · BR-153","coords":[-10.7069,-48.9083],"route":"Rota Goiânia-Belém","state":"TO","title":"Oliveira de Fátima"},{"id":"nova_rosalandia","locality":"Tocantins · BR-153","coords":[-10.5658,-48.9128],"route":"Rota Goiânia-Belém","state":"TO","title":"Nova Rosalândia"},{"id":"pugmil","locality":"Tocantins · BR-153","coords":[-10.4247,-48.8958],"route":"Rota Goiânia-Belém","state":"TO","title":"Pugmil"},{"id":"paraiso_to","locality":"Tocantins · Portal do Jalapão e Cantão","coords":[-10.1761,-48.8817],"route":"Rota Goiânia-Belém","state":"TO","title":"Paraíso do Tocantins"},{"id":"palmas_to","locality":"Tocantins · Capital do Tocantins","coords":[-10.1844,-48.3336],"route":"Rota Goiânia-Belém","state":"TO","title":"Palmas"},{"id":"miracema_to","locality":"Tocantins · Primeira Capital do TO","coords":[-9.5619,-48.3967],"route":"Rota Goiânia-Belém","state":"TO","title":"Miracema do Tocantins"},{"id":"miranorte","locality":"Tocantins · BR-153","coords":[-9.5297,-48.5919],"route":"Rota Goiânia-Belém","state":"TO","title":"Miranorte"},{"id":"rio_bois","locality":"Tocantins · BR-153","coords":[-9.3569,-48.5347],"route":"Rota Goiânia-Belém","state":"TO","title":"Rio dos Bois"},{"id":"tabocao","locality":"Tocantins · Fortaleza do Tabocão / BR-153","coords":[-9.0569,-48.5186],"route":"Rota Goiânia-Belém","state":"TO","title":"Tabocão"},{"id":"guarai","locality":"Tocantins · Centro-Norte Tocantinense","coords":[-8.8344,-48.5108],"route":"Rota Goiânia-Belém","state":"TO","title":"Guaraí"},{"id":"presidente_kennedy_to","locality":"Tocantins · BR-153","coords":[-8.5397,-48.5058],"route":"Rota Goiânia-Belém","state":"TO","title":"Presidente Kennedy"},{"id":"colmeia","locality":"Tocantins · Centro-Oeste Tocantinense","coords":[-8.7267,-48.7667],"route":"Rota Goiânia-Belém","state":"TO","title":"Colméia"},{"id":"brasilandia_to","locality":"Tocantins · BR-153","coords":[-8.3889,-48.4817],"route":"Rota Goiânia-Belém","state":"TO","title":"Brasilândia do Tocantins"},{"id":"nova_olinda_to","locality":"Tocantins · BR-153 Belém-Brasília","coords":[-7.6358,-48.4239],"route":"Rota Goiânia-Belém","state":"TO","title":"Nova Olinda"},{"id":"araguaina","locality":"Tocantins · Capital Econômica do Norte","coords":[-7.1917,-48.2078],"route":"Rota Goiânia-Belém","state":"TO","title":"Araguaína"},{"id":"wanderlandia","locality":"Tocantins · BR-153","coords":[-6.8489,-47.9611],"route":"Rota Goiânia-Belém","state":"TO","title":"Wanderlândia"},{"id":"darcinopolis","locality":"Tocantins · BR-153","coords":[-6.7136,-47.7608],"route":"Rota Goiânia-Belém","state":"TO","title":"Darcinópolis"},{"id":"aguiarnopolis","locality":"Tocantins · Ponte sobre o Rio Tocantins","coords":[-6.5606,-47.4667],"route":"Rota Goiânia-Belém","state":"TO","title":"Aguiarnópolis"},{"id":"tocantinopolis","locality":"Tocantins · Bico do Papagaio","coords":[-6.3267,-47.4197],"route":"Rota Goiânia-Belém","state":"TO","title":"Tocantinópolis"},{"id":"araguatins","locality":"Tocantins · Encontro dos Rios Araguaia e Tocantins","coords":[-5.6506,-48.1219],"route":"Rota Goiânia-Belém","state":"TO","title":"Araguatins"},{"id":"estreito_ma","locality":"Maranhão · UHE Estreito / Rio Tocantins","coords":[-6.5631,-47.45],"route":"Rota Goiânia-Belém","state":"MA","title":"Estreito"},{"id":"porto_franco","locality":"Maranhão · BR-010 Belém-Brasília","coords":[-6.3389,-47.3992],"route":"Rota Goiânia-Belém","state":"MA","title":"Porto Franco"},{"id":"campestre_ma","locality":"Maranhão · BR-010","coords":[-6.1769,-47.3606],"route":"Rota Goiânia-Belém","state":"MA","title":"Campestre do Maranhão"},{"id":"ribamar_fiquene","locality":"Maranhão · BR-010","coords":[-5.9289,-47.3858],"route":"Rota Goiânia-Belém","state":"MA","title":"Ribamar Fiquene"},{"id":"gov_edison_lobao","locality":"Maranhão · Ribeirãozinho / BR-010","coords":[-5.7489,-47.3658],"route":"Rota Goiânia-Belém","state":"MA","title":"Governador Edison Lobão"},{"id":"joao_lisboa","locality":"Maranhão · Região de Imperatriz","coords":[-5.4475,-47.3619],"route":"Rota Goiânia-Belém","state":"MA","title":"João Lisboa"},{"id":"itinga_ma","locality":"Maranhão · Divisa MA/PA / BR-010","coords":[-4.4925,-47.5258],"route":"Rota Goiânia-Belém","state":"MA","title":"Itinga do Maranhão"},{"id":"dom_eliseu","locality":"Pará · Entroncamento BR-010 / BR-222","coords":[-4.2858,-47.5056],"route":"Rota Goiânia-Belém","state":"PA","title":"Dom Eliseu"},{"id":"rondon_para","locality":"Pará · BR-222 / Sudeste Paraense","coords":[-4.7761,-48.0678],"route":"Rota Goiânia-Belém","state":"PA","title":"Rondon do Pará"},{"id":"ulianopolis","locality":"Pará · BR-010 Belém-Brasília","coords":[-3.7469,-47.4989],"route":"Rota Goiânia-Belém","state":"PA","title":"Ulianópolis"},{"id":"paragominas","locality":"Pará · Município Verde / BR-010","coords":[-2.9989,-47.3533],"route":"Rota Goiânia-Belém","state":"PA","title":"Paragominas"},{"id":"ipixuna_para","locality":"Pará · BR-010","coords":[-2.5594,-47.4975],"route":"Rota Goiânia-Belém","state":"PA","title":"Ipixuna do Pará"},{"id":"aurora_para","locality":"Pará · BR-010","coords":[-2.1289,-47.5469],"route":"Rota Goiânia-Belém","state":"PA","title":"Aurora do Pará"},{"id":"mae_do_rio","locality":"Pará · Entroncamento BR-010 / PA-252","coords":[-2.0594,-47.5567],"route":"Rota Goiânia-Belém","state":"PA","title":"Mãe do Rio"},{"id":"irituia","locality":"Pará · Rio Irituia","coords":[-1.7708,-47.4389],"route":"Rota Goiânia-Belém","state":"PA","title":"Irituia"},{"id":"sao_miguel_guama","locality":"Pará · Rio Guamá / BR-010","coords":[-1.6269,-47.4839],"route":"Rota Goiânia-Belém","state":"PA","title":"São Miguel do Guamá"},{"id":"santa_maria_para","locality":"Pará · Entroncamento BR-316 / BR-010","coords":[-1.3508,-47.5756],"route":"Rota Goiânia-Belém","state":"PA","title":"Santa Maria do Pará"},{"id":"igarape_acu","locality":"Pará · Nordeste Paraense","coords":[-1.1278,-47.618899999999996],"route":"Rota Goiânia-Belém","state":"PA","title":"Igarapé-Açu"},{"id":"sabara","title":"Sabará","locality":"Minas Gerais · Região Metropolitana de BH","coords":[-19.8917,-43.8058],"state":"MG","route":"Rota BH-Jacinto"},{"id":"caete","title":"Caeté","locality":"Minas Gerais · Serra da Piedade / BR-381","coords":[-19.8800,-43.6689],"state":"MG","route":"Rota BH-Jacinto"},{"id":"barao_cocais","title":"Barão de Cocais","locality":"Minas Gerais · Quadrilátero Ferrífero / BR-381","coords":[-19.9444,-43.4847],"state":"MG","route":"Rota BH-Jacinto"},{"id":"sao_goncalo_rio_abaixo","title":"São Gonçalo do Rio Abaixo","locality":"Minas Gerais · BR-381","coords":[-19.8258,-43.3606],"state":"MG","route":"Rota BH-Jacinto"},{"id":"joao_monlevade","title":"João Monlevade","locality":"Minas Gerais · Polo Siderúrgico / BR-381","coords":[-19.8106,-43.1742],"state":"MG","route":"Rota BH-Jacinto"},{"id":"nova_era","title":"Nova Era","locality":"Minas Gerais · Rio Piracicaba / BR-381","coords":[-19.7583,-43.0336],"state":"MG","route":"Rota BH-Jacinto"},{"id":"antonio_dias","title":"Antônio Dias","locality":"Minas Gerais · Vale do Aço / BR-381","coords":[-19.4975,-42.8717],"state":"MG","route":"Rota BH-Jacinto"},{"id":"coronel_fabriciano","title":"Coronel Fabriciano","locality":"Minas Gerais · Vale do Aço","coords":[-19.5197,-42.6300],"state":"MG","route":"Rota BH-Jacinto"},{"id":"timoteo","title":"Timóteo","locality":"Minas Gerais · Vale do Aço / Rio Doce","coords":[-19.5828,-42.6439],"state":"MG","route":"Rota BH-Jacinto"},{"id":"ipatinga","title":"Ipatinga","locality":"Minas Gerais · Capital do Vale do Aço","coords":[-19.4689,-42.5367],"state":"MG","route":"Rota BH-Jacinto"},{"id":"santana_paraiso","title":"Santana do Paraíso","locality":"Minas Gerais · Vale do Aço","coords":[-19.3647,-42.5583],"state":"MG","route":"Rota BH-Jacinto"},{"id":"belo_oriente","title":"Belo Oriente","locality":"Minas Gerais · Bacia do Rio Doce / BR-381","coords":[-19.2217,-42.4844],"state":"MG","route":"Rota BH-Jacinto"},{"id":"naque","title":"Naque","locality":"Minas Gerais · Bacia do Rio Doce / BR-381","coords":[-19.2069,-42.3486],"state":"MG","route":"Rota BH-Jacinto"},{"id":"periquito","title":"Periquito","locality":"Minas Gerais · BR-381","coords":[-19.1625,-42.1856],"state":"MG","route":"Rota BH-Jacinto"},{"id":"governador_valadares","title":"Governador Valadares","locality":"Minas Gerais · Vale do Rio Doce / Pico da Ibituruna","coords":[-18.8511,-41.9494],"state":"MG","route":"Rota BH-Jacinto"},{"id":"frei_inocencio","title":"Frei Inocêncio","locality":"Minas Gerais · BR-116 Rio-Bahia","coords":[-18.5700,-41.9167],"state":"MG","route":"Rota BH-Jacinto"},{"id":"itambacuri","title":"Itambacuri","locality":"Minas Gerais · Vale do Mucuri / BR-116","coords":[-18.0317,-41.6856],"state":"MG","route":"Rota BH-Jacinto"},{"id":"teofilo_otoni","title":"Teófilo Otoni","locality":"Minas Gerais · Capital das Pedras Preciosas / Vale do Mucuri","coords":[-17.8575,-41.5056],"state":"MG","route":"Rota BH-Jacinto"},{"id":"catuji","title":"Catuji","locality":"Minas Gerais · BR-116","coords":[-17.2625,-41.7167],"state":"MG","route":"Rota BH-Jacinto"},{"id":"padre_paraiso","title":"Padre Paraíso","locality":"Minas Gerais · Vale do Jequitinhonha / BR-116","coords":[-17.1264,-41.4847],"state":"MG","route":"Rota BH-Jacinto"},{"id":"ponto_volantes","title":"Ponto dos Volantes","locality":"Minas Gerais · BR-116","coords":[-16.7533,-41.5056],"state":"MG","route":"Rota BH-Jacinto"},{"id":"itaobim","title":"Itaobim","locality":"Minas Gerais · Vale do Jequitinhonha / BR-116 / BR-367","coords":[-16.5617,-41.5036],"state":"MG","route":"Rota BH-Jacinto"},{"id":"jequitinhonha_cidade","title":"Jequitinhonha","locality":"Minas Gerais · Médio Jequitinhonha / BR-367","coords":[-16.4339,-41.0036],"state":"MG","route":"Rota BH-Jacinto"},{"id":"almenara","title":"Almenara","locality":"Minas Gerais · Baixo Jequitinhonha / BR-367","coords":[-16.1836,-40.6942],"state":"MG","route":"Rota BH-Jacinto"},{"id":"rubim","title":"Rubim","locality":"Minas Gerais · Vale do Jequitinhonha","coords":[-16.2764,-40.5408],"state":"MG","route":"Rota BH-Jacinto"},{"id":"jacinto","title":"Jacinto","locality":"Minas Gerais · Baixo Jequitinhonha / Extremo Nordeste Mineiro","coords":[-16.1417,-40.2944],"state":"MG","route":"Rota BH-Jacinto"},{"id":"tumiritinga","title":"Tumiritinga","locality":"Minas Gerais · Bacia do Rio Doce","coords":[-18.9767,-41.6469],"state":"MG","route":"Rota BH-João Neiva"},{"id":"galileia","title":"Galiléia","locality":"Minas Gerais · BR-259","coords":[-18.9917,-41.5428],"state":"MG","route":"Rota BH-João Neiva"},{"id":"conselheiro_pena","title":"Conselheiro Pena","locality":"Minas Gerais · Vale do Rio Doce / BR-259","coords":[-19.1806,-41.4728],"state":"MG","route":"Rota BH-João Neiva"},{"id":"resplendor","title":"Resplendor","locality":"Minas Gerais · Rio Doce / BR-259","coords":[-19.3236,-41.2567],"state":"MG","route":"Rota BH-João Neiva"},{"id":"itueta","title":"Itueta","locality":"Minas Gerais · BR-259","coords":[-19.3800,-41.1767],"state":"MG","route":"Rota BH-João Neiva"},{"id":"aimores","title":"Aimorés","locality":"Minas Gerais · Divisa MG/ES / Instituto Terra","coords":[-19.4975,-41.0617],"state":"MG","route":"Rota BH-João Neiva"},{"id":"baixo_guandu","title":"Baixo Guandu","locality":"Espírito Santo · Portal do Rio Doce no ES / BR-259","coords":[-19.5186,-41.0142],"state":"ES","route":"Rota BH-João Neiva"},{"id":"colatina","title":"Colatina","locality":"Espírito Santo · Princesa do Norte / Rio Doce","coords":[-19.5392,-40.6300],"state":"ES","route":"Rota BH-João Neiva"},{"id":"marilandia","title":"Marilândia","locality":"Espírito Santo · BR-259","coords":[-19.4147,-40.5367],"state":"ES","route":"Rota BH-João Neiva"},{"id":"joao_neiva","title":"João Neiva","locality":"Espírito Santo · Entroncamento BR-101 / BR-259","coords":[-19.7567,-40.3858],"state":"ES","route":"Rota BH-João Neiva"},{"id":"rio_casca","title":"Rio Casca","locality":"Minas Gerais · Zona da Mata / BR-262","coords":[-20.2197,-42.6508],"state":"MG","route":"Rota BH-João Neiva"},{"id":"matipo","title":"Matipó","locality":"Minas Gerais · Zona da Mata / BR-262","coords":[-20.2800,-42.3400],"state":"MG","route":"Rota BH-João Neiva"},{"id":"manhuacu","title":"Manhuaçu","locality":"Minas Gerais · Polo Cafeeiro da Zona da Mata / BR-262","coords":[-20.2583,-42.0336],"state":"MG","route":"Rota BH-João Neiva"},{"id":"reduto","title":"Reduto","locality":"Minas Gerais · BR-262","coords":[-20.2528,-41.9708],"state":"MG","route":"Rota BH-João Neiva"},{"id":"ibatiba","title":"Ibatiba","locality":"Espírito Santo · Terra dos Tropeiros / BR-262","coords":[-20.2333,-41.5108],"state":"ES","route":"Rota BH-João Neiva"},{"id":"venda_nova_imigrante","title":"Venda Nova do Imigrante","locality":"Espírito Santo · Região Serrana Capixaba / Agroturismo","coords":[-20.3297,-41.1347],"state":"ES","route":"Rota BH-João Neiva"},{"id":"domingos_martins","title":"Domingos Martins","locality":"Espírito Santo · Pedra Azul / Mata Atlântica Serrana","coords":[-20.3633,-40.6589],"state":"ES","route":"Rota BH-João Neiva"},{"id":"marechal_floriano","title":"Marechal Floriano","locality":"Espírito Santo · Cidade das Orquídeas / BR-262","coords":[-20.4131,-40.6833],"state":"ES","route":"Rota BH-João Neiva"},{"id":"viana_es","title":"Viana","locality":"Espírito Santo · Entroncamento BR-101 / BR-262","coords":[-20.3908,-40.4983],"state":"ES","route":"Rota BH-João Neiva"},{"id":"cariacica","title":"Cariacica","locality":"Espírito Santo · Monte Mochuara / Grande Vitória","coords":[-20.2639,-40.4200],"state":"ES","route":"Rota BH-João Neiva"},{"id":"serra_es","title":"Serra","locality":"Espírito Santo · Mestre Álvaro / Litoral","coords":[-20.1286,-40.3078],"state":"ES","route":"Rota BH-João Neiva"},{"id":"fundao","title":"Fundão","locality":"Espírito Santo · BR-101 Norte","coords":[-19.9333,-40.4042],"state":"ES","route":"Rota BH-João Neiva"},{"id":"ibiracu","title":"Ibiraçu","locality":"Espírito Santo · Grande Buda de Ibiraçu / BR-101","coords":[-19.8317,-40.3689],"state":"ES","route":"Rota BH-João Neiva"},{"id":"barra_mansa","title":"Barra Mansa","locality":"Rio de Janeiro · Vale do Paraíba Fluminense / Dutra","coords":[-22.5444,-44.1714],"state":"RJ","route":"Rota Cachoeira-Regência"},{"id":"volta_redonda","title":"Volta Redonda","locality":"Rio de Janeiro · Cidade do Aço / BR-116","coords":[-22.5231,-44.1042],"state":"RJ","route":"Rota Cachoeira-Regência"},{"id":"pirai","title":"Piraí","locality":"Rio de Janeiro · Serra das Araras / Vale do Café","coords":[-22.6289,-43.8986],"state":"RJ","route":"Rota Cachoeira-Regência"},{"id":"seropedica","title":"Seropédica","locality":"Rio de Janeiro · Baixada Fluminense / Arco Metropolitano","coords":[-22.7444,-43.7075],"state":"RJ","route":"Rota Cachoeira-Regência"},{"id":"duque_caxias","title":"Duque de Caxias","locality":"Rio de Janeiro · Baía de Guanabara / BR-040","coords":[-22.7856,-43.3117],"state":"RJ","route":"Rota Cachoeira-Regência"},{"id":"mage","title":"Magé","locality":"Rio de Janeiro · Fundo da Baía de Guanabara / BR-116","coords":[-22.6528,-43.0408],"state":"RJ","route":"Rota Cachoeira-Regência"},{"id":"guapimirim","title":"Guapimirim","locality":"Rio de Janeiro · Serra dos Órgãos / Dedo de Deus","coords":[-22.5369,-42.9822],"state":"RJ","route":"Rota Cachoeira-Regência"},{"id":"itaborai","title":"Itaboraí","locality":"Rio de Janeiro · BR-101","coords":[-22.7444,-42.8594],"state":"RJ","route":"Rota Cachoeira-Regência"},{"id":"rio_bonito","title":"Rio Bonito","locality":"Rio de Janeiro · BR-101","coords":[-22.7097,-42.6267],"state":"RJ","route":"Rota Cachoeira-Regência"},{"id":"silva_jardim","title":"Silva Jardim","locality":"Rio de Janeiro · Reserva Biológica Poço das Antas","coords":[-22.6508,-42.3922],"state":"RJ","route":"Rota Cachoeira-Regência"},{"id":"casimiro_abreu","title":"Casimiro de Abreu","locality":"Rio de Janeiro · BR-101","coords":[-22.4811,-42.2044],"state":"RJ","route":"Rota Cachoeira-Regência"},{"id":"macae","title":"Macaé","locality":"Rio de Janeiro · Capital Nacional do Petróleo / Litoral Fluminense","coords":[-22.3769,-41.7869],"state":"RJ","route":"Rota Cachoeira-Regência"},{"id":"carapebus","title":"Carapebus","locality":"Rio de Janeiro · Parque Nacional da Restinga de Jurubatiba","coords":[-22.1869,-41.6617],"state":"RJ","route":"Rota Cachoeira-Regência"},{"id":"quissama","title":"Quissamã","locality":"Rio de Janeiro · Restingas \u0026 Lagoas Costeiras","coords":[-22.1069,-41.4722],"state":"RJ","route":"Rota Cachoeira-Regência"},{"id":"campos_goytacazes","title":"Campos dos Goytacazes","locality":"Rio de Janeiro · Baixo Paraíba do Sul / Norte Fluminense","coords":[-21.7544,-41.3244],"state":"RJ","route":"Rota Cachoeira-Regência"},{"id":"sao_francisco_itabapoana","title":"São Francisco de Itabapoana","locality":"Rio de Janeiro · Divisa RJ/ES","coords":[-21.4700,-41.0189],"state":"RJ","route":"Rota Cachoeira-Regência"},{"id":"mimoso_sul","title":"Mimoso do Sul","locality":"Espírito Santo · Portal Sul Capixaba / BR-101","coords":[-21.0642,-41.3664],"state":"ES","route":"Rota Cachoeira-Regência"},{"id":"cachoeiro_itapemirim","title":"Cachoeiro de Itapemirim","locality":"Espírito Santo · Capital Secreta / Rio Itapemirim","coords":[-20.8489,-41.1128],"state":"ES","route":"Rota Cachoeira-Regência"},{"id":"itapemirim","title":"Itapemirim","locality":"Espírito Santo · Litoral Sul Capixaba","coords":[-21.0117,-40.8339],"state":"ES","route":"Rota Cachoeira-Regência"},{"id":"marataizes","title":"Marataízes","locality":"Espírito Santo · Falésias \u0026 Lagoas","coords":[-21.0436,-40.8244],"state":"ES","route":"Rota Cachoeira-Regência"},{"id":"piuma","title":"Piúma","locality":"Espírito Santo · Cidade das Conchas","coords":[-20.8369,-40.7297],"state":"ES","route":"Rota Cachoeira-Regência"},{"id":"anchieta_es","title":"Anchieta","locality":"Espírito Santo · Santuário Nacional de São José de Anchieta","coords":[-20.8058,-40.6458],"state":"ES","route":"Rota Cachoeira-Regência"},{"id":"guarapari","title":"Guarapari","locality":"Espírito Santo · Areias Monazíticas \u0026 Enseadas","coords":[-20.6706,-40.4975],"state":"ES","route":"Rota Cachoeira-Regência"},{"id":"vila_velha","title":"Vila Velha","locality":"Espírito Santo · Convento da Penha \u0026 Praia da Costa","coords":[-20.3297,-40.2925],"state":"ES","route":"Rota Cachoeira-Regência"},{"id":"aracruz","title":"Aracruz","locality":"Espírito Santo · Aldeias Tupiniquim/Guarani \u0026 Barra do Sahy","coords":[-19.8203,-40.2733],"state":"ES","route":"Rota Cachoeira-Regência"},{"id":"regencia_es","title":"Regência","locality":"Espírito Santo · Foz do Rio Doce / Rebio Comboios / TAMAR","coords":[-19.6417,-39.8250],"state":"ES","route":"Rota Cachoeira-Regência"},{"id":"gov_lindenberg","title":"Governador Lindenberg","locality":"Espírito Santo · Noroeste Capixaba","coords":[-19.2667,-40.4833],"state":"ES","route":"Rota João Neiva-Planalto"},{"id":"rio_bananal","title":"Rio Bananal","locality":"Espírito Santo · Rio Bananal","coords":[-19.2656,-40.3328],"state":"ES","route":"Rota João Neiva-Planalto"},{"id":"sao_gabriel_palha","title":"São Gabriel da Palha","locality":"Espírito Santo · Capital do Café Conilon","coords":[-19.0169,-40.5367],"state":"ES","route":"Rota João Neiva-Planalto"},{"id":"vila_valerio","title":"Vila Valério","locality":"Espírito Santo · Noroeste Capixaba","coords":[-18.9989,-40.3889],"state":"ES","route":"Rota João Neiva-Planalto"},{"id":"nova_venecia","title":"Nova Venécia","locality":"Espírito Santo · Pedra do Elefante","coords":[-18.7106,-40.4006],"state":"ES","route":"Rota João Neiva-Planalto"},{"id":"pinheiros_es","title":"Pinheiros","locality":"Espírito Santo · Extremo Norte Capixaba","coords":[-18.4069,-40.2133],"state":"ES","route":"Rota João Neiva-Planalto"},{"id":"montanha_es","title":"Montanha","locality":"Espírito Santo · Cidade da Carne de Sol","coords":[-18.1269,-40.3633],"state":"ES","route":"Rota João Neiva-Planalto"},{"id":"mucurici","title":"Mucurici","locality":"Espírito Santo · Bacia do Rio Cricaré","coords":[-18.0939,-40.5189],"state":"ES","route":"Rota João Neiva-Planalto"},{"id":"ponto_belo","title":"Ponto Belo","locality":"Espírito Santo · Divisa ES/BA","coords":[-18.1239,-40.5367],"state":"ES","route":"Rota João Neiva-Planalto"},{"id":"lajedao","title":"Lajedão","locality":"Bahia · Extremo Sul Baiano","coords":[-17.5258,-40.4189],"state":"BA","route":"Rota João Neiva-Planalto"},{"id":"medeiros_neto","title":"Medeiros Neto","locality":"Bahia · Rio Alcobaça / Extremo Sul Baiano","coords":[-17.3739,-40.2208],"state":"BA","route":"Rota João Neiva-Planalto"},{"id":"itanhem","title":"Itanhém","locality":"Bahia · Bacia do Rio Itanhém","coords":[-17.1667,-40.3333],"state":"BA","route":"Rota João Neiva-Planalto"},{"id":"vereda_ba","title":"Vereda","locality":"Bahia · Extremo Sul","coords":[-17.2228,-40.1069],"state":"BA","route":"Rota João Neiva-Planalto"},{"id":"ibirapua","title":"Ibirapuã","locality":"Bahia · Extremo Sul Baiano","coords":[-17.6889,-40.1189],"state":"BA","route":"Rota João Neiva-Planalto"},{"id":"serra_aimores","title":"Serra dos Aimorés","locality":"Minas Gerais · Divisa MG/BA / Mucuri","coords":[-17.7889,-40.2458],"state":"MG","route":"Rota João Neiva-Planalto"},{"id":"nanuque","title":"Nanuque","locality":"Minas Gerais · Rio Mucuri / Portal do Nordeste Mineiro","coords":[-17.8394,-40.3542],"state":"MG","route":"Rota João Neiva-Planalto"},{"id":"carlos_chagas","title":"Carlos Chagas","locality":"Minas Gerais · Vale do Mucuri / Monólitos","coords":[-17.7033,-40.7661],"state":"MG","route":"Rota João Neiva-Planalto"},{"id":"bertopolis","title":"Bertópolis","locality":"Minas Gerais · Vale do Mucuri","coords":[-17.0606,-40.5847],"state":"MG","route":"Rota João Neiva-Planalto"},{"id":"santa_maria_salto","title":"Santa Maria do Salto","locality":"Minas Gerais · Baixo Jequitinhonha","coords":[-16.2489,-40.1506],"state":"MG","route":"Rota João Neiva-Planalto"},{"id":"salto_divisa","title":"Salto da Divisa","locality":"Minas Gerais · Cachoeira do Tombo da Fumaça","coords":[-16.0028,-39.9472],"state":"MG","route":"Rota João Neiva-Planalto"},{"id":"sto_antonio_jacinto","title":"Santo Antônio do Jacinto","locality":"Minas Gerais · Baixo Jequitinhonha","coords":[-16.5369,-40.1989],"state":"MG","route":"Rota João Neiva-Planalto"},{"id":"pedra_azul_mg","title":"Pedra Azul","locality":"Minas Gerais · Formações Rochosas \u0026 Cactáceas","coords":[-16.0056,-41.2969],"state":"MG","route":"Rota João Neiva-Planalto"},{"id":"medina_mg","title":"Medina","locality":"Minas Gerais · Vale do Jequitinhonha / BR-116","coords":[-16.2239,-41.5647],"state":"MG","route":"Rota João Neiva-Planalto"},{"id":"candido_sales","title":"Cândido Sales","locality":"Bahia · Rio Pardo / BR-116","coords":[-15.8344,-41.2422],"state":"BA","route":"Rota João Neiva-Planalto"},{"id":"barra_choca","title":"Barra do Choça","locality":"Bahia · Planalto da Conquista","coords":[-14.8608,-40.5800],"state":"BA","route":"Rota João Neiva-Planalto"},{"id":"planalto_ba","title":"Planalto","locality":"Bahia · BR-116 / Sudoeste Baiano","coords":[-14.6739,-40.4722],"state":"BA","route":"Rota João Neiva-Planalto"},{"id":"pocoes","title":"Poções","locality":"Bahia · Terra do Divino / BR-116","coords":[-14.5297,-40.3644],"state":"BA","route":"Rota João Neiva-Planalto"},{"id":"dianopolis","title":"Dianópolis","locality":"Tocantins · Serras Gerais do Tocantins","coords":[-11.6258,-46.8208],"state":"TO","route":"Rota Belém-Botumirim"},{"id":"taguatinga_to","title":"Taguatinga","locality":"Tocantins · Serras Gerais","coords":[-12.4042,-46.4367],"state":"TO","route":"Rota Belém-Botumirim"},{"id":"aurora_to","title":"Aurora do Tocantins","locality":"Tocantins · Menor Rio do Mundo (Rio Azuis)","coords":[-12.7119,-46.4069],"state":"TO","route":"Rota Belém-Botumirim"},{"id":"sao_desiderio","title":"São Desidério","locality":"Bahia · Bacia do Rio Grande / Gruta do Catão","coords":[-12.3633,-44.9733],"state":"BA","route":"Rota Belém-Botumirim"},{"id":"correntina","title":"Correntina","locality":"Bahia · Sete Ilhas / Rio Correntina","coords":[-13.3439,-44.6369],"state":"BA","route":"Rota Belém-Botumirim"},{"id":"santa_maria_vitoria","title":"Santa Maria da Vitória","locality":"Bahia · Bacia do Rio Corrente","coords":[-13.3947,-44.1889],"state":"BA","route":"Rota Belém-Botumirim"},{"id":"riacho_santana","title":"Riacho de Santana","locality":"Bahia · Alto Sertão Baiano","coords":[-13.6089,-42.9389],"state":"BA","route":"Rota Belém-Botumirim"},{"id":"guanambi","title":"Guanambi","locality":"Bahia · Polo do Alto Sertão Baiano","coords":[-14.2233,-42.7814],"state":"BA","route":"Rota Belém-Botumirim"},{"id":"urandi","title":"Urandi","locality":"Bahia · Divisa BA/MG","coords":[-14.7869,-42.6644],"state":"BA","route":"Rota Belém-Botumirim"},{"id":"espinosa","title":"Espinosa","locality":"Minas Gerais · Portal Norte de Minas","coords":[-14.9264,-42.8189],"state":"MG","route":"Rota Belém-Botumirim"},{"id":"monte_azul","title":"Monte Azul","locality":"Minas Gerais · Serra Geral do Espinhaço","coords":[-15.1558,-42.8744],"state":"MG","route":"Rota Belém-Botumirim"},{"id":"mato_verde","title":"Mato Verde","locality":"Minas Gerais · Serra do Espinhaço","coords":[-15.3975,-42.8661],"state":"MG","route":"Rota Belém-Botumirim"},{"id":"porteirinha","title":"Porteirinha","locality":"Minas Gerais · Serra Geral / Parque Estadual de Montezuma","coords":[-15.7439,-43.0267],"state":"MG","route":"Rota Belém-Botumirim"},{"id":"francisco_sa","title":"Francisco Sá","locality":"Minas Gerais · Norte de Minas","coords":[-16.1139,-43.4889],"state":"MG","route":"Rota Belém-Botumirim"},{"id":"grao_mogol","title":"Grão Mogol","locality":"Minas Gerais · Parque Estadual de Grão Mogol / Espinhaço","coords":[-16.5744,-42.8917],"state":"MG","route":"Rota Belém-Botumirim"},{"id":"cristalia","title":"Cristália","locality":"Minas Gerais · Serra do Espinhaço","coords":[-16.7167,-42.8667],"state":"MG","route":"Rota Belém-Botumirim"},{"id":"botumirim","title":"Botumirim","locality":"Minas Gerais · Serra de Botumirim / Berço da Rolinha-do-Planalto","coords":[-16.8667,-43.0089],"state":"MG","route":"Rota Belém-Botumirim"},{"id":"itacambira","title":"Itacambira","locality":"Minas Gerais · Cadeia do Espinhaço","coords":[-17.0689,-43.3289],"state":"MG","route":"Rota Belém-Botumirim"},{"id":"pontal_araguaia","title":"Pontal do Araguaia","locality":"Mato Grosso · Encontro dos Rios Araguaia e Garças","coords":[-15.8656,-52.2611],"state":"MT","route":"Rota Barra do Garças-Nova Xavantina"},{"id":"torixoreu","title":"Torixoréu","locality":"Mato Grosso · Vale do Araguaia","coords":[-16.2167,-52.5667],"state":"MT","route":"Rota Barra do Garças-Nova Xavantina"},{"id":"ribeiraozinho","title":"Ribeirãozinho","locality":"Mato Grosso · Vale do Araguaia","coords":[-16.4667,-52.7167],"state":"MT","route":"Rota Barra do Garças-Nova Xavantina"},{"id":"campinapolis","title":"Campinápolis","locality":"Mato Grosso · Terra Indígena Parabubure","coords":[-14.5028,-52.8833],"state":"MT","route":"Rota Barra do Garças-Nova Xavantina"},{"id":"nova_xavantina","title":"Nova Xavantina","locality":"Mato Grosso · Rio das Mortes / Campus UNEMAT Transição Biológica","coords":[-14.6739,-52.3556],"state":"MT","route":"Rota Barra do Garças-Nova Xavantina"},{"id":"agua_boa","title":"Água Boa","locality":"Mato Grosso · Coração do Vale do Araguaia","coords":[-14.0500,-52.1583],"state":"MT","route":"Rota Barra do Garças-Nova Xavantina"},{"id":"senador_canedo","title":"Senador Canedo","locality":"Goiás · Polo Petroquímico","coords":[-16.7083,-49.0917],"state":"GO","route":"Rota Goiânia-Janaúba"},{"id":"bonfinopolis_go","title":"Bonfinópolis","locality":"Goiás · GO-010","coords":[-16.6186,-48.9608],"state":"GO","route":"Rota Goiânia-Janaúba"},{"id":"leopoldo_bulhoes","title":"Leopoldo de Bulhões","locality":"Goiás · Estrada de Ferro Goyaz","coords":[-16.6200,-48.7267],"state":"GO","route":"Rota Goiânia-Janaúba"},{"id":"silvania","title":"Silvânia","locality":"Goiás · Floresta Nacional de Silvânia","coords":[-16.6589,-48.6089],"state":"GO","route":"Rota Goiânia-Janaúba"},{"id":"vianopolis","title":"Vianópolis","locality":"Goiás · GO-010 / Agropecuária Cerrado","coords":[-16.7417,-48.5133],"state":"GO","route":"Rota Goiânia-Janaúba"},{"id":"luziania","title":"Luziânia","locality":"Goiás · Entorno do DF / Bacia do Corumbá","coords":[-16.2525,-47.9500],"state":"GO","route":"Rota Goiânia-Janaúba"},{"id":"cristalina","title":"Cristalina","locality":"Goiás · Maior Domo de Cristal de Rocha do Mundo","coords":[-16.7686,-47.6136],"state":"GO","route":"Rota Goiânia-Janaúba"},{"id":"paracatu","title":"Paracatu","locality":"Minas Gerais · Centro Histórico \u0026 Mineração de Ouro","coords":[-17.2222,-46.8747],"state":"MG","route":"Rota Goiânia-Janaúba"},{"id":"unai","title":"Unaí","locality":"Minas Gerais · Vale do Rio Preto / Noroeste Mineiro","coords":[-16.3575,-46.9061],"state":"MG","route":"Rota Goiânia-Janaúba"},{"id":"joao_pinheiro","title":"João Pinheiro","locality":"Minas Gerais · Maior Município em Extensão de MG","coords":[-17.7439,-46.1725],"state":"MG","route":"Rota Goiânia-Janaúba"},{"id":"brasilandia_minas","title":"Brasilândia de Minas","locality":"Minas Gerais · Bacia do Rio Paracatu","coords":[-17.0033,-46.0028],"state":"MG","route":"Rota Goiânia-Janaúba"},{"id":"bonfinopolis_minas","title":"Bonfinópolis de Minas","locality":"Minas Gerais · Noroeste de Minas","coords":[-16.5606,-46.0408],"state":"MG","route":"Rota Goiânia-Janaúba"},{"id":"buritizeiro","title":"Buritizeiro","locality":"Minas Gerais · Margem Esquerda do Velho Chico","coords":[-17.3511,-44.9622],"state":"MG","route":"Rota Goiânia-Janaúba"},{"id":"pirapora","title":"Pirapora","locality":"Minas Gerais · Porto Fluvial do Rio São Francisco / Vapor Benjamim Guimarães","coords":[-17.3550,-44.9419],"state":"MG","route":"Rota Goiânia-Janaúba"},{"id":"varzea_palma","title":"Várzea da Palma","locality":"Minas Gerais · Bacia do Rio das Velhas","coords":[-17.5989,-44.7317],"state":"MG","route":"Rota Goiânia-Janaúba"},{"id":"corinto","title":"Corinto","locality":"Minas Gerais · Centro Geográfico de Minas Gerais","coords":[-18.3806,-44.4558],"state":"MG","route":"Rota Goiânia-Janaúba"},{"id":"montes_claros","title":"Montes Claros","locality":"Minas Gerais · Capital do Norte de Minas / Polo Universitário","coords":[-16.7289,-43.8617],"state":"MG","route":"Rota Goiânia-Janaúba"},{"id":"capitao_eneas","title":"Capitão Enéas","locality":"Minas Gerais · BR-122 Norte de Minas","coords":[-15.9444,-43.7083],"state":"MG","route":"Rota Goiânia-Janaúba"},{"id":"eusebio","title":"Eusébio","locality":"Ceará · Região Metropolitana de Fortaleza","coords":[-3.8906,-38.4556],"state":"CE","route":"Rota Fortaleza-Canoa Quebrada"},{"id":"aquiraz","title":"Aquiraz","locality":"Ceará · Primeira Capital do Ceará / Parque das Dunas","coords":[-3.9017,-38.3911],"state":"CE","route":"Rota Fortaleza-Canoa Quebrada"},{"id":"pindoretama","title":"Pindoretama","locality":"Ceará · CE-040 Terra da Engenharia Tradicional","coords":[-4.0289,-38.3056],"state":"CE","route":"Rota Fortaleza-Canoa Quebrada"},{"id":"cascavel_ce","title":"Cascavel","locality":"Ceará · Praia de Águas Belas / Encontro Rio e Mar","coords":[-4.1333,-38.2417],"state":"CE","route":"Rota Fortaleza-Canoa Quebrada"},{"id":"beberibe","title":"Beberibe","locality":"Ceará · Monumento Natural das Falésias de Morro Branco","coords":[-4.1797,-38.1306],"state":"CE","route":"Rota Fortaleza-Canoa Quebrada"},{"id":"fortim","title":"Fortim","locality":"Ceará · Foz do Rio Jaguaribe / Pontal de Maceió","coords":[-4.4489,-37.7986],"state":"CE","route":"Rota Fortaleza-Canoa Quebrada"},{"id":"brasilia_df","title":"Brasília","locality":"Distrito Federal · Capital Federal","coords":[-15.7975,-47.8919],"state":"DF","route":"Distrito Federal"},{"id":"bertioga","title":"Bertioga","locality":"São Paulo · Litoral Norte / Restingas \u0026 Manguezais","coords":[-23.8542,-46.1389],"state":"SP","route":"Litoral Paulista"},{"id":"guaruja","title":"Guarujá","locality":"São Paulo · Ilha de Santo Amaro","coords":[-23.9931,-46.2564],"state":"SP","route":"Litoral Paulista"},{"id":"sao_vicente","title":"São Vicente","locality":"São Paulo · Primeira Vila do Brasil / Baixada Santista","coords":[-23.9631,-46.3919],"state":"SP","route":"Litoral Paulista"},{"id":"praia_grande","title":"Praia Grande","locality":"São Paulo · Baixada Santista","coords":[-24.0058,-46.4028],"state":"SP","route":"Litoral Paulista"},{"id":"mongagua","title":"Mongaguá","locality":"São Paulo · Litoral Sul Paulista","coords":[-24.0931,-46.6208],"state":"SP","route":"Litoral Paulista"},{"id":"peruibe","title":"Peruíbe","locality":"São Paulo · Portal da Estação Ecológica Jureia-Itatins","coords":[-24.3200,-46.9989],"state":"SP","route":"Litoral Paulista"},{"id":"campinas","title":"Campinas","locality":"São Paulo · Polo Tecnológico \u0026 Científico","coords":[-22.9056,-47.0608],"state":"SP","route":"Rota Campinas-Ponta Grossa"},{"id":"valinhos","title":"Valinhos","locality":"São Paulo · Região Metropolitana de Campinas","coords":[-22.9708,-46.9961],"state":"SP","route":"Rota Campinas-Ponta Grossa"},{"id":"vinhedo","title":"Vinhedo","locality":"São Paulo · Circuito das Frutas","coords":[-23.0297,-46.9744],"state":"SP","route":"Rota Campinas-Ponta Grossa"},{"id":"indaiatuba","title":"Indaiatuba","locality":"São Paulo · Bacia do Rio Capivari","coords":[-23.0903,-47.2181],"state":"SP","route":"Rota Campinas-Ponta Grossa"},{"id":"buri","title":"Buri","locality":"São Paulo · Vale do Paranapanema","coords":[-23.7975,-48.5919],"state":"SP","route":"Rota Campinas-Ponta Grossa"},{"id":"taquarivai","title":"Taquarivaí","locality":"São Paulo · Sudoeste Paulista","coords":[-23.9219,-48.6917],"state":"SP","route":"Rota Campinas-Ponta Grossa"},{"id":"itapeva","title":"Itapeva","locality":"São Paulo · Polo Mineral do Sudoeste Paulista","coords":[-23.9822,-48.8767],"state":"SP","route":"Rota Campinas-Ponta Grossa"},{"id":"itarare","title":"Itararé","locality":"São Paulo · Canyons do Vale do Itararé / Divisa SP/PR","coords":[-24.1114,-49.3339],"state":"SP","route":"Rota Campinas-Ponta Grossa"},{"id":"taboao_serra","title":"Taboão da Serra","locality":"São Paulo · Grande São Paulo / BR-116","coords":[-23.6261,-46.7917],"state":"SP","route":"Rota São Paulo-Joinville"},{"id":"embu_artes","title":"Embu das Artes","locality":"São Paulo · Cinturão Verde Metropolitano","coords":[-23.6489,-46.8522],"state":"SP","route":"Rota São Paulo-Joinville"},{"id":"itapecerica_serra","title":"Itapecerica da Serra","locality":"São Paulo · Mananciais da Serra","coords":[-23.7172,-46.8492],"state":"SP","route":"Rota São Paulo-Joinville"},{"id":"sao_lourenco_serra","title":"São Lourenço da Serra","locality":"São Paulo · BR-116 Régis Bittencourt","coords":[-23.8528,-46.9439],"state":"SP","route":"Rota São Paulo-Joinville"},{"id":"juquitiba","title":"Juquitiba","locality":"São Paulo · Floresta Ombrófila Densa Preservada","coords":[-23.9308,-47.0708],"state":"SP","route":"Rota São Paulo-Joinville"},{"id":"miracatu","title":"Miracatu","locality":"São Paulo · Vale do Ribeira / BR-116","coords":[-24.2817,-47.4589],"state":"SP","route":"Rota São Paulo-Joinville"},{"id":"juquia","title":"Juquiá","locality":"São Paulo · Bacia do Rio Juquiá","coords":[-24.3208,-47.6358],"state":"SP","route":"Rota São Paulo-Joinville"},{"id":"registro","title":"Registro","locality":"São Paulo · Capital do Vale do Ribeira","coords":[-24.4975,-47.8447],"state":"SP","route":"Rota São Paulo-Joinville"},{"id":"pariquera_acu","title":"Pariquera-Açu","locality":"São Paulo · Vale do Ribeira","coords":[-24.7142,-47.8817],"state":"SP","route":"Rota São Paulo-Joinville"},{"id":"jacupiranga","title":"Jacupiranga","locality":"São Paulo · Parque Estadual de Jacupiranga","coords":[-24.6944,-48.0028],"state":"SP","route":"Rota São Paulo-Joinville"},{"id":"cajati","title":"Cajati","locality":"São Paulo · BR-116 Régis Bittencourt","coords":[-24.7367,-48.1228],"state":"SP","route":"Rota São Paulo-Joinville"},{"id":"barra_do_turvo","title":"Barra do Turvo","locality":"São Paulo · Mosaico de UCs do Jacupiranga / Divisa SP/PR","coords":[-24.7567,-48.5028],"state":"SP","route":"Rota São Paulo-Joinville"},{"id":"campina_grande_sul","title":"Campina Grande do Sul","locality":"Paraná · Represa do Capivari-Cachoeira / Serra do Mar","coords":[-25.3056,-49.0556],"state":"PR","route":"Rota São Paulo-Joinville"},{"id":"quatro_barras","title":"Quatro Barras","locality":"Paraná · Morro do Anhangava / Serra da Graciosa","coords":[-25.3656,-49.0778],"state":"PR","route":"Rota São Paulo-Joinville"},{"id":"sao_jose_pinhais","title":"São José dos Pinhais","locality":"Paraná · Região Metropolitana de Curitiba","coords":[-25.5347,-49.2064],"state":"PR","route":"Rota São Paulo-Joinville"},{"id":"tijucas_do_sul","title":"Tijucas do Sul","locality":"Paraná · Serra do Mar Paranaense / BR-376","coords":[-25.9289,-49.1989],"state":"PR","route":"Rota São Paulo-Joinville"},{"id":"garuva","title":"Garuva","locality":"Santa Catarina · Portal Norte Catarinense / BR-101","coords":[-26.0267,-48.8556],"state":"SC","route":"Rota São Paulo-Joinville"},{"id":"aguas_lindas","title":"Águas Lindas de Goiás","locality":"Goiás · Entorno do Distrito Federal","coords":[-15.7625,-48.2817],"state":"GO","route":"Rota Brasília-Nova Nazaré"},{"id":"padre_bernardo","title":"Padre Bernardo","locality":"Goiás · Bacia do Rio Maranhão","coords":[-15.1606,-48.2833],"state":"GO","route":"Rota Brasília-Nova Nazaré"},{"id":"barro_alto","title":"Barro Alto","locality":"Goiás · Polo Niquelífero","coords":[-14.9708,-48.9108],"state":"GO","route":"Rota Brasília-Nova Nazaré"},{"id":"goianesia_go","title":"Goianésia","locality":"Goiás · Vale do São Patrício","coords":[-15.3189,-49.1178],"state":"GO","route":"Rota Brasília-Nova Nazaré"},{"id":"santa_rita_novo_destino","title":"Santa Rita do Novo Destino","locality":"Goiás · Bacia do Lago de Serra da Mesa","coords":[-15.1389,-49.1239],"state":"GO","route":"Rota Brasília-Nova Nazaré"},{"id":"alto_horizonte","title":"Alto Horizonte","locality":"Goiás · Complexo Mineração Maracá / Ouro \u0026 Cobre","coords":[-14.2008,-49.3389],"state":"GO","route":"Rota Brasília-Nova Nazaré"},{"id":"nova_iguacu_go","title":"Nova Iguaçu de Goiás","locality":"Goiás · Norte Goiano","coords":[-14.2889,-49.3889],"state":"GO","route":"Rota Brasília-Nova Nazaré"},{"id":"pilar_de_goias","title":"Pilar de Goiás","locality":"Goiás · Centro Histórico do Ciclo do Ouro","coords":[-14.7606,-49.5789],"state":"GO","route":"Rota Brasília-Nova Nazaré"},{"id":"crixas_go","title":"Crixás","locality":"Goiás · Mineração Serra Grande / Vale do Rio Vermelho","coords":[-14.5489,-49.9689],"state":"GO","route":"Rota Brasília-Nova Nazaré"},{"id":"santa_terezinha_go","title":"Santa Terezinha de Goiás","locality":"Goiás · Terra das Esmeraldas","coords":[-14.4369,-49.7083],"state":"GO","route":"Rota Brasília-Nova Nazaré"},{"id":"nova_crixas","title":"Nova Crixás","locality":"Goiás · Portal do Vale do Araguaia","coords":[-14.0989,-50.3267],"state":"GO","route":"Rota Brasília-Nova Nazaré"},{"id":"mundo_novo_go","title":"Mundo Novo","locality":"Goiás · Vale do Araguaia Goiano","coords":[-13.7744,-50.2817],"state":"GO","route":"Rota Brasília-Nova Nazaré"},{"id":"sao_miguel_araguaia","title":"São Miguel do Araguaia","locality":"Goiás · Portal da Ilha do Bananal / Porto Luiz Alves","coords":[-13.2750,-50.1628],"state":"GO","route":"Rota Brasília-Nova Nazaré"},{"id":"aruana","title":"Aruanã","locality":"Goiás · Encontro dos Rios Vermelho e Araguaia","coords":[-14.9106,-51.0828],"state":"GO","route":"Rota Brasília-Nova Nazaré"},{"id":"britania","title":"Britânia","locality":"Goiás · Lago dos Tigres / Rio Araguaia","coords":[-15.2417,-51.1608],"state":"GO","route":"Rota Brasília-Nova Nazaré"},{"id":"cocalinho","title":"Cocalinho","locality":"Mato Grosso · Porto do Rio Araguaia / Divisa GO/MT","coords":[-14.3947,-50.9950],"state":"MT","route":"Rota Brasília-Nova Nazaré"},{"id":"nova_nazare","title":"Nova Nazaré","locality":"Mato Grosso · Vale do Médio Araguaia / MT-326","coords":[-13.9858,-51.8106],"state":"MT","route":"Rota Brasília-Nova Nazaré"},{"id":"canarana","title":"Canarana","locality":"Mato Grosso · Portal do Parque Indígena do Xingu","coords":[-13.5528,-52.2708],"state":"MT","route":"Rota Brasília-Nova Nazaré"},{"id":"piquete","title":"Piquete","locality":"São Paulo · Serra da Mantiqueira / Garganta do Piquete","coords":[-22.6133,-45.1767],"state":"SP","route":"Rota Cachoeira-BH"},{"id":"passa_quatro","title":"Passa Quatro","locality":"Minas Gerais · Garganta do Embaú / Serra da Mantiqueira","coords":[-22.3908,-44.9667],"state":"MG","route":"Rota Cachoeira-BH"},{"id":"itanhandu","title":"Itanhandu","locality":"Minas Gerais · Terras Altas da Mantiqueira","coords":[-22.2969,-44.9333],"state":"MG","route":"Rota Cachoeira-BH"},{"id":"pouso_alto","title":"Pouso Alto","locality":"Minas Gerais · Serra da Mantiqueira","coords":[-22.1889,-44.9708],"state":"MG","route":"Rota Cachoeira-BH"},{"id":"itamonte","title":"Itamonte","locality":"Minas Gerais · Face Mineira da Mantiqueira","coords":[-22.2833,-44.8667],"state":"MG","route":"Rota Cachoeira-BH"},{"id":"sao_lourenco","title":"São Lourenço","locality":"Minas Gerais · Circuito das Águas / Estância Hidromineral","coords":[-22.1158,-45.0533],"state":"MG","route":"Rota Cachoeira-BH"},{"id":"caxambu","title":"Caxambu","locality":"Minas Gerais · Parque das Águas Minerais","coords":[-21.9769,-44.9328],"state":"MG","route":"Rota Cachoeira-BH"},{"id":"baependi","title":"Baependi","locality":"Minas Gerais · Cachoeiras da Mantiqueira","coords":[-21.9567,-44.8889],"state":"MG","route":"Rota Cachoeira-BH"},{"id":"cruzilia","title":"Cruzília","locality":"Minas Gerais · Berço do Cavalo Mangalarga Marchador","coords":[-21.8389,-44.8094],"state":"MG","route":"Rota Cachoeira-BH"},{"id":"minduri","title":"Minduri","locality":"Minas Gerais · Campo das Vertentes","coords":[-21.6889,-44.6089],"state":"MG","route":"Rota Cachoeira-BH"},{"id":"sao_vicente_minas","title":"São Vicente de Minas","locality":"Minas Gerais · Campo das Vertentes","coords":[-21.7089,-44.4444],"state":"MG","route":"Rota Cachoeira-BH"},{"id":"madre_deus_minas","title":"Madre de Deus de Minas","locality":"Minas Gerais · Campo das Vertentes","coords":[-21.4806,-44.3317],"state":"MG","route":"Rota Cachoeira-BH"},{"id":"sao_joao_del_rei","title":"São João del-Rei","locality":"Minas Gerais · Cidade Histórica / Serra do Lenheiro","coords":[-21.1356,-44.2617],"state":"MG","route":"Rota Cachoeira-BH"},{"id":"tiradentes","title":"Tiradentes","locality":"Minas Gerais · Serra de São José / Refúgio de Vida Silvestre","coords":[-21.1103,-44.1783],"state":"MG","route":"Rota Cachoeira-BH"},{"id":"barbacena","title":"Barbacena","locality":"Minas Gerais · Cidade das Rosas / Campo das Vertentes","coords":[-21.2258,-43.7736],"state":"MG","route":"Rota Cachoeira-BH"},{"id":"carandai","title":"Carandaí","locality":"Minas Gerais · BR-040","coords":[-20.9536,-43.8058],"state":"MG","route":"Rota Cachoeira-BH"},{"id":"cristiano_otoni","title":"Cristiano Otoni","locality":"Minas Gerais · BR-040","coords":[-20.8358,-43.8117],"state":"MG","route":"Rota Cachoeira-BH"},{"id":"conselheiro_lafaiete","title":"Conselheiro Lafaiete","locality":"Minas Gerais · Polo Siderúrgico / BR-040","coords":[-20.6606,-43.7856],"state":"MG","route":"Rota Cachoeira-BH"},{"id":"congonhas","title":"Congonhas","locality":"Minas Gerais · Cidade dos Profetas / Patrimônio Mundial UNESCO","coords":[-20.4989,-43.8569],"state":"MG","route":"Rota Cachoeira-BH"},{"id":"ouro_branco","title":"Ouro Branco","locality":"Minas Gerais · Serra de Ouro Branco / Estrada Real","coords":[-20.5219,-43.6917],"state":"MG","route":"Rota Cachoeira-BH"},{"id":"itabirito","title":"Itabirito","locality":"Minas Gerais · Quadrilátero Ferrífero / Pico do Itabirito","coords":[-20.2525,-43.8033],"state":"MG","route":"Rota Cachoeira-BH"},{"id":"itajuba","title":"Itajubá","locality":"Minas Gerais · Polo Tecnológico da Mantiqueira","coords":[-22.4258,-45.4528],"state":"MG","route":"Rota Cachoeira-BH"},{"id":"santa_rita_sapucai","title":"Santa Rita do Sapucaí","locality":"Minas Gerais · Vale da Eletrônica","coords":[-22.2519,-45.7033],"state":"MG","route":"Rota Cachoeira-BH"},{"id":"pouso_alegre","title":"Pouso Alegre","locality":"Minas Gerais · Capital Regional do Sul de Minas / BR-381","coords":[-22.2300,-45.9364],"state":"MG","route":"Rota Cachoeira-BH"},{"id":"sao_goncalo_sapucai","title":"São Gonçalo do Sapucaí","locality":"Minas Gerais · Vale do Sapucaí / BR-381","coords":[-21.8925,-45.5969],"state":"MG","route":"Rota Cachoeira-BH"},{"id":"tres_coracoes","title":"Três Corações","locality":"Minas Gerais · Bacia do Rio Verde","coords":[-21.6942,-45.2536],"state":"MG","route":"Rota Cachoeira-BH"},{"id":"varginha","title":"Varginha","locality":"Minas Gerais · Polo Cafeeiro do Sul de Minas","coords":[-21.5558,-45.4339],"state":"MG","route":"Rota Cachoeira-BH"},{"id":"lavras","title":"Lavras","locality":"Minas Gerais · Cidade Universitária / UFLA","coords":[-21.2464,-44.9997],"state":"MG","route":"Rota Cachoeira-BH"},{"id":"perdoes","title":"Perdões","locality":"Minas Gerais · BR-381 Fernão Dias","coords":[-21.0917,-45.0894],"state":"MG","route":"Rota Cachoeira-BH"},{"id":"sto_antonio_amparo","title":"Santo Antônio do Amparo","locality":"Minas Gerais · BR-381","coords":[-20.9464,-44.9197],"state":"MG","route":"Rota Cachoeira-BH"},{"id":"oliveira_mg","title":"Oliveira","locality":"Minas Gerais · Campo das Vertentes / BR-381","coords":[-20.6975,-44.8267],"state":"MG","route":"Rota Cachoeira-BH"},{"id":"carmopolis_minas","title":"Carmópolis de Minas","locality":"Minas Gerais · BR-381 Fernão Dias","coords":[-20.5369,-44.6367],"state":"MG","route":"Rota Cachoeira-BH"},{"id":"itaguara","title":"Itaguara","locality":"Minas Gerais · BR-381","coords":[-20.4397,-44.4908],"state":"MG","route":"Rota Cachoeira-BH"},{"id":"itatiauco","title":"Itatiaiuçu","locality":"Minas Gerais · Serra de Itatiaiuçu","coords":[-20.1989,-44.4239],"state":"MG","route":"Rota Cachoeira-BH"},{"id":"igarape_mg","title":"Igarapé","locality":"Minas Gerais · Região Metropolitana de BH","coords":[-20.0717,-44.3033],"state":"MG","route":"Rota Cachoeira-BH"},{"id":"betim","title":"Betim","locality":"Minas Gerais · Polo Industrial / Região Metropolitana de BH","coords":[-19.9678,-44.1983],"state":"MG","route":"Rota Cachoeira-BH"},{"id":"contagem","title":"Contagem","locality":"Minas Gerais · Grande BH","coords":[-19.9317,-44.0536],"state":"MG","route":"Rota Cachoeira-BH"}];

function initFieldMap() {
    const mapContainer = document.getElementById('brazil-expedition-map');
    if (!mapContainer || typeof L === 'undefined') return;

    // Centro geografico do Brasil com visao panoramica
    const brazilCenter = [-14.8, -52.2];
    const initialZoom = window.innerWidth < 768 ? 3.8 : 4.4;

    // Inicializacao do mapa Leaflet com visao fixa de Satelite em Alta Resolucao
    const map = L.map('brazil-expedition-map', {
        center: brazilCenter,
        zoom: initialZoom,
        minZoom: 3.5,
        maxZoom: 18,
        scrollWheelZoom: false,
        attributionControl: false
    });

    // Ativa scrollWheelZoom ao clicar no mapa para evitar prender a rolagem da pagina
    map.on('click', () => { map.scrollWheelZoom.enable(); });
    mapContainer.addEventListener('mouseleave', () => { map.scrollWheelZoom.disable(); });

    // 1. Camada de Satelite de Alta Resolucao (Esri World Imagery) - VISAO FIXA
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18
    }).addTo(map);

    // 2. Camada sutil de Referencia e Fronteiras Internacionais (Esri Boundaries & Places)
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18,
        opacity: 0.65
    }).addTo(map);

    // 3. Divisao dos Estados Brasileiros (Fronteiras Estaduais Vetoriais IBGE)
    if (typeof brazilStatesGeoJson !== 'undefined') {
        L.geoJSON(brazilStatesGeoJson, {
            style: function() {
                return {
                    color: 'rgba(78, 204, 163, 0.48)',
                    weight: 1.3,
                    opacity: 0.85,
                    fillColor: 'transparent',
                    fillOpacity: 0,
                    dashArray: '3, 4'
                };
            },
            interactive: false
        }).addTo(map);
    }

    // 4. Siglas dos Estados Brasileiros (Rotulos Geograficos Flutuantes)
    if (typeof brazilStateLabels !== 'undefined') {
        const stateLabelsLayer = L.layerGroup().addTo(map);
        brazilStateLabels.forEach(st => {
            const labelIcon = L.divIcon({
                className: 'state-acronym-label',
                html: '<span>' + st.sigla + '</span>',
                iconSize: [26, 18],
                iconAnchor: [13, 9]
            });
            L.marker(st.coords, {
                icon: labelIcon,
                interactive: false,
                keyboard: false
            }).addTo(stateLabelsLayer);
        });
    }

    // Attribution discreto no canto inferior direito
    L.control.attribution({ position: 'bottomright', prefix: false })
        .addAttribution('&copy; Esri &bull; IBGE &bull; Distribui&ccedil;&atilde;o Lucas A&oslash;sf')
        .addTo(map);

    // Botao de restauracao da visao geral do Brasil
    const resetControl = L.control({ position: 'topright' });
    resetControl.onAdd = function() {
        const div = L.DomUtil.create('div', 'leaflet-bar map-reset-control');
        div.innerHTML = '<button id="btn-map-fit-brazil" title="Restaurar visão geral do Brasil" style="background:rgba(7,20,11,0.9); border:1px solid #4ECCA3; color:#4ECCA3; width:34px; height:34px; border-radius:4px; cursor:pointer; font-size:14px; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 10px rgba(0,0,0,0.5);"><i class="fa-solid fa-expand"></i></button>';
        div.onclick = function(e) {
            e.stopPropagation();
            map.flyTo(brazilCenter, initialZoom, { duration: 1.2 });
        };
        return div;
    };
    resetControl.addTo(map);

    // Atualiza contador de pontos no cabecalho
    const counterEl = document.getElementById('map-counter-points');
    if (counterEl) {
        counterEl.textContent = lucasDistributionPoints.length + ' Pontos';
    }

    // 5. Renderizacao dos Pontinhos Simples Georreferenciados (Camada Superior)
    const markersLayer = L.layerGroup().addTo(map);

    lucasDistributionPoints.forEach(pt => {
        const marker = L.circleMarker(pt.coords, {
            radius: 5,
            fillColor: '#00ff88',
            color: '#ffffff',
            weight: 1.4,
            opacity: 0.95,
            fillOpacity: 0.88,
            className: 'lucas-point-dot'
        });

        const tooltipHtml = '<div style="font-family:monospace; font-size:11.5px; line-height:1.35;">' +
                            '<strong style="color:#ffffff; font-size:12.5px;">' + pt.title + '</strong>' +
                            '<div style="color:#00ff88; margin-top:2px;"><i class="fa-solid fa-location-dot" style="font-size:10px;"></i> ' + pt.locality + '</div>' +
                            '<div style="color:#a0aec0; font-size:10px; margin-top:2px;">' + pt.coords[0].toFixed(4) + ', ' + pt.coords[1].toFixed(4) + '</div>' +
                            '</div>';

        marker.bindTooltip(tooltipHtml, {
            direction: 'top',
            offset: [0, -6],
            className: 'bio-simple-tooltip',
            opacity: 0.96
        });

        marker.on('mouseover', function() {
            this.setRadius(7.5);
            this.setStyle({ fillColor: '#ffffff', color: '#00ff88', weight: 2 });
        });
        marker.on('mouseout', function() {
            this.setRadius(5);
            this.setStyle({ fillColor: '#00ff88', color: '#ffffff', weight: 1.4 });
        });

        markersLayer.addLayer(marker);
    });
}
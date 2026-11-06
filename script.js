/**
 * BIOKURI // PORTFÓLIO INTERATIVO DE LUCAS AØSF
 * Taxonomia · Ecologia Computacional · Automação & Programação
 */

document.addEventListener('DOMContentLoaded', () => {
    initAudioSystem();
    initBioCanvas();
    initTerminalTyping();
    initInteractiveCLI();
    initBioScanner();
    initProjectFilters();
    initScrollReveal();
    initLanguageSystem();
    initMetricsCounter();
});

/* ==========================================================================
   1. SOUND EFFECTS (Web Audio API - No external audio files required)
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
        if (soundEnabled) playBioBeep(520, 0.08);
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
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, audioCtx.currentTime + duration);

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

function playScanTone(step = 1) {
    if (!soundEnabled) return;
    const baseFreqs = [320, 480, 640, 820, 1080];
    const freq = baseFreqs[step % baseFreqs.length] || 440;
    playBioBeep(freq, 0.12, 'triangle');
}

/* ==========================================================================
   2. BIO-CANVAS: SPORES, FIREFLIES & TAXONOMIC DATA DRIFT
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
    const particleCount = Math.min(width > 768 ? 55 : 28, 65);
    const taxaLabels = [
        'Bothrops bilineatus', 'Melanophryniscus moreirae', 'Boana pardalis',
        'GBIF: 3193966', 'CRBio: 127233/01-D', 'CEMAVE: #7723874',
        'Leptodactylus paranaru', 'Raven Pro: 44.1kHz', 'R::vegan::diversity'
    ];

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.45;
            this.vy = -Math.random() * 0.6 - 0.2; // drift upward
            this.size = Math.random() * 2.8 + 1;
            this.alpha = Math.random() * 0.5 + 0.2;
            this.pulseSpeed = Math.random() * 0.02 + 0.01;
            this.isLabel = Math.random() < 0.18;
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
   3. BIO-TERMINAL AUTOMATED TYPING SEQUENCE
   ========================================================================== */
function initTerminalTyping() {
    const terminalOutput = document.getElementById('terminal-output');
    if (!terminalOutput) return;

    const sequence = [
        { type: 'cmd', text: 'Rscript -e "biokuri::init(systematics = TRUE, ecology = TRUE)"' },
        { type: 'out', text: '[BIODIVERSITY OS] Conectando chaves taxonômicas, matrizes faunísticas e bases GBIF...', ok: true },
        { type: 'cmd', text: 'whoami --taxonomist' },
        { type: 'out', text: 'Lucas José Alves de Oliveira Simões Ferreira | CRBio 127233/01-D | Anilhador CEMAVE nº 7723874' },
        { type: 'cmd', text: 'cat /biokuri/core_mission.md' },
        { type: 'out', text: '[FOCO PRIMÁRIO] Taxonomia & Sistemática Filogenética · Herpetologia & Ornitologia · Bioacústica · Automação em R e Python', gold: true }
    ];

    let lineIdx = 0;

    function typeCommand(element, text, speed, cb) {
        let i = 0;
        element.innerHTML = '';
        element.classList.add('typing-cursor');

        const timer = setInterval(() => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                if (i % 3 === 0) playBioBeep(650, 0.03);
                i++;
            } else {
                clearInterval(timer);
                element.classList.remove('typing-cursor');
                if (cb) setTimeout(cb, 220);
            }
        }, speed);
    }

    function runNext() {
        if (lineIdx >= sequence.length) return;

        const item = sequence[lineIdx];
        const row = document.createElement('div');
        row.style.marginBottom = '0.45rem';
        terminalOutput.appendChild(row);

        if (item.type === 'cmd') {
            row.innerHTML = `<span class="terminal-prompt">lucas@biokuri:~$</span> <span class="cmd-content"></span>`;
            const cmdSpan = row.querySelector('.cmd-content');
            typeCommand(cmdSpan, item.text, 35, () => {
                lineIdx++;
                setTimeout(runNext, 250);
            });
        } else {
            let className = 'terminal-output-text';
            if (item.ok) className += ' terminal-output-ok';
            if (item.gold) className += ' terminal-output-gold';

            row.innerHTML = `<span class="${className}">${item.text}</span>`;
            playBioBeep(420, 0.05);
            lineIdx++;
            setTimeout(runNext, 450);
        }

        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    setTimeout(runNext, 600);
}

/* ==========================================================================
   4. INTERACTIVE CLI (VISITOR COMMANDS)
   ========================================================================== */
function initInteractiveCLI() {
    const input = document.getElementById('terminal-cli-input');
    const terminalOutput = document.getElementById('terminal-output');
    if (!input || !terminalOutput) return;

    const commands = {
        help: () => `
COMANDOS DISPONÍVEIS:
  • <span style="color:var(--bio-emerald)">taxa</span>      : Grupos zoológicos e clados de foco
  • <span style="color:var(--bio-emerald)">papers</span>    : Artigos científicos e redescobertas
  • <span style="color:var(--bio-emerald)">tools</span>     : Stack computacional e linguagens (R, Python, GIS)
  • <span style="color:var(--bio-emerald)">projects</span>  : Softwares e PWAs desenvolvidos (Caderneta, Cubagem)
  • <span style="color:var(--bio-emerald)">contact</span>   : Informações diretas de contato
  • <span style="color:var(--bio-emerald)">whoami</span>    : Credenciais e registros oficiais
  • <span style="color:var(--bio-emerald)">clear</span>     : Limpar terminal
        `,
        taxa: () => `
[TAXONOMIA & SISTEMÁTICA]
  • Herpetofauna: Serpentes (Bothrops, atrox clade), Anuros (Melanophryniscus, Boana, Leptodactylus), Crocodilianos
  • Ornitofauna: Aves costeiras, pelágicas, florestais e de altitude (CEMAVE nº 7723874)
  • Mastofauna: Pequenos, médios e grandes mamíferos; Quiropterofauna (morcegos)
  • Metodologias: Busca ativa, pitfall, redes de neblina, gravadores de bioacústica (XPRIZE Rainforest)
        `,
        papers: () => `
[PUBLICAÇÕES RECENTES]
  1. Bothrops bilineatus rediscovery (Rev. Lat. Herpetol., 2026 - DOI: 10.22201/fc.25942158e.2026.2.1666)
  2. Melanophryniscus moreirae distribution expansion (Reptiles & Amphibians, 2026)
  3. Death feigning in Bothrops atrox clade (Reptiles & Amphibians, 2026)
  4. Hoplias malabaricus preying on Leptodactylus paranaru (Herp. Bras., 2026)
  5. Boana pardalis predation by Erythrolamprus miliaris (Herp. Bras., 2022)
  6. Restauração microclimática e avifauna (Apresentado na COP30 - ONU, 2025)
        `,
        tools: () => `
[COMPUTATION & STACK]
  • Linguagens: R (tidyverse, vegan, sp, rgbif), Python (pandas, geopandas, automation), JavaScript, HTML5/CSS3
  • Bioacústica: Raven Pro, bioacoustics package
  • Softwares: QGIS, ExcelJS, Git/GitHub, PWA Offline-First
        `,
        projects: () => `
[PROJETOS DESTAQUE]
  • Caderneta de Campo: https://lucasaosf.github.io/caderneta-de-campo/
  • Cubagem Florestal Smalian: https://lucasaosf.github.io/cubagem-florestal/
  • M_moreirae_distribution (R): https://github.com/lucasaosf/M_moreirae_distribution
  • Consultoria Ambiental Hub: https://github.com/lucasaosf/consultoria_ambiental
        `,
        whoami: () => `
Lucas José Alves de Oliveira Simões Ferreira (Lucas Aøsf)
• Registro: CRBio-01 nº 127233/01-D
• Anilhador Júnior CEMAVE/ICMBio nº 7723874
• Especialista em Gestão Ambiental (UNOPAR) | Biólogo (UNIFATEA)
• Fundador da Biokuri — Pesquisa & Soluções Ambientais
        `,
        contact: () => `
• E-mail: lucasaosf@gmail.com
• WhatsApp: (12) 99182-1729
• Lattes: lattes.cnpq.br/3193966103707256
• ORCID: orcid.org/0000-0003-3337-2137
• GitHub: github.com/lucasaosf
• Instagram: @lucas_aosf
        `
    };

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const rawVal = input.value.trim();
            const cmd = rawVal.toLowerCase();
            input.value = '';

            if (!rawVal) return;

            playBioBeep(580, 0.05);

            if (cmd === 'clear') {
                terminalOutput.innerHTML = '';
                return;
            }

            const promptRow = document.createElement('div');
            promptRow.style.margin = '0.5rem 0 0.2rem';
            promptRow.innerHTML = `<span class="terminal-prompt">biokuri@aosf:~$</span> <span style="color:#fff">${escapeHtml(rawVal)}</span>`;
            terminalOutput.appendChild(promptRow);

            const resultRow = document.createElement('div');
            resultRow.style.marginBottom = '0.65rem';

            if (commands[cmd]) {
                resultRow.innerHTML = `<div style="color:var(--text-main); font-size:0.85rem; line-height:1.5;">${commands[cmd]()}</div>`;
            } else {
                resultRow.innerHTML = `<span style="color:var(--bio-coral)">Comando não reconhecido: "${escapeHtml(cmd)}". Digite <span style="color:var(--bio-emerald)">help</span> para ver a lista de comandos.</span>`;
            }

            terminalOutput.appendChild(resultRow);
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }
    });

    function escapeHtml(str) {
        return str.replace(/[&<>'"]/g, tag => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
        }[tag] || tag));
    }
}

/* ==========================================================================
   5. BIO-SCANNER ANIMATION (_INICIAR_VARREDURA_TAXONÔMICA)
   ========================================================================== */
function initBioScanner() {
    const btnHack = document.getElementById('btn-hack');
    const miniTerminal = document.getElementById('mini-terminal');
    const projectsContent = document.getElementById('projects-content');

    if (!btnHack || !miniTerminal || !projectsContent) return;

    btnHack.addEventListener('click', () => {
        btnHack.disabled = true;
        btnHack.style.opacity = '0.6';
        miniTerminal.style.display = 'block';
        miniTerminal.innerHTML = '';

        const scanLogs = [
            '>> [BIO-SCAN] Conectando ao repositório taxonômico Biokuri...',
            '>> Sincronizando ocorrências no GBIF (rgbif::occ_search)... [23.418 registros validados]',
            '>> Mapeando espectrogramas acústicos da Serra da Mantiqueira e Bocaina...',
            '>> Processando diagnose do clado Bothrops atrox e rediscutindo táxons...',
            '>> Carregando PWAs e scripts de ecologia computacional...',
            '>> [SUCESSO]: Acervo taxonômico e projetos de engenharia desbloqueados com rigor!'
        ];

        let i = 0;
        function logNext() {
            if (i < scanLogs.length) {
                const line = document.createElement('div');
                line.style.margin = '0.25rem 0';
                line.innerHTML = scanLogs[i];
                miniTerminal.appendChild(line);
                playScanTone(i + 1);
                i++;
                setTimeout(logNext, 380);
            } else {
                projectsContent.classList.remove('locked-content');
                projectsContent.style.animation = 'fadeInUp 0.8s ease forwards';
                playBioBeep(880, 0.25, 'triangle');

                // Smooth scroll to projects
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
        desc_bio: "Biólogo (UNIFATEA) e Especialista em Gestão Ambiental (UNOPAR), anilhador CEMAVE/ICMBio. Atua há mais de uma década na fronteira entre <strong>Taxonomia & Sistemática Filogenética</strong>, ecologia de campo em todos os biomas e <strong>automação científica em R e Python</strong> para modelagem de biodiversidade.",
        header_focus: "Atuação & Foco Central",
        intro_focus: "Integração pioneira entre o rigor morfológico da taxonomia tradicional e algoritmos modernos de análise biológica.",
        focus_taxo_title: "Taxonomia & Sistemática (Foco Primário)",
        focus_taxo_desc: "Diagnose de herpetofauna e ornitofauna, análise morfológica, bioacústica de vocalizações, chaves dicotômicas, clados crípticos (ex: complexo Bothrops atrox) e redescobertas de táxons históricos.",
        focus_prog_title: "Ecologia Computacional & Programação em R",
        focus_prog_desc: "Pipelines avançados para mineração do GBIF (Global Biodiversity Information Facility), análise estatística multivariada de comunidades faunísticas, bioestatística e modelagem ecológica.",
        focus_auto_title: "Automação de Relatórios & Dados de Campo",
        focus_auto_desc: "Scripts em Python e R para higienização e tratamento de matrizes ecológicas, cálculo automático de índices faunísticos e confecção automatizada de relatórios para EIA/RIMA e laudos CETESB.",
        focus_apps_title: "Engenharia de Softwares de Campo (PWA)",
        focus_apps_desc: "Idealizador e arquiteto de PWAs como a Caderneta de Campo (georreferenciamento offline, listas de Mackinnon, exportação instantânea Excel) e Cubagem Florestal Smalian.",
        metric_years: "Anos em Campo & Taxonomia",
        metric_papers: "Artigos Científicos & Livros",
        metric_projects: "Empreendimentos Atendidos",
        metric_biomes: "Biomas Brasileiros Amostrados",
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
        btn_scan: "_INICIAR_VARREDURA_TAXONÔMICA",
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
        intro_pubs: "Artigos completos em periódicos científicos internacionais e nacionais, com foco em sistemática, taxonomia de répteis e anfíbios, história natural e redescobertas.",
        abstract_bothrops: "Registro e confirmação morfológica/taxonômica da víbora-verde após 30 anos sem ocorrências documentadas no Espírito Santo, preenchendo lacunas críticas de biogeografia e conservação da Mata Atlântica.",
        abstract_moreirae: "Expansão e atualização dos limites de distribuição geográfica do sapinho-da-serra (espécie endêmica de altitude), aliando curadoria taxonômica a dados massivos de ciência cidadã validados.",
        abstract_feigning: "Primeiros relatos detalhados de tanatose (simulação de morte) em serpentes do clado Bothrops atrox, discutindo implicações etológicas e caracteres comportamentais em viperídeos neotropicais.",
        abstract_hoplias: "Primeiro registro formal de predação da rã Leptodactylus paranaru pela traíra, documentando interações tróficas aquático-terrestres em áreas ciliares de Mata Atlântica.",
        abstract_boana: "Registro de história natural e predação de anfíbio anuro arbóreo de grande porte por cobra d'água na Mata Atlântica costeira.",
        abstract_guia: "Contribuição fotográfica integral e identificação taxonômica da herpetofauna: fotografias de alta resolução de anfíbios e répteis que compõem quase todo o acervo do guia oficial do ICMBio.",
        header_experience: "Experiência Profissional & Empreendimentos",
        intro_experience: "Responsabilidade técnica e consultoria especializada em infraestrutura de grande porte em todo o Brasil.",
        exp_caruso: "Responsável pela execução das atividades de campo em monitoramento ambiental (fauna, ruído ambiental e qualidade da água), planejamento de campanhas, aplicação metodológica, inventários, fichas de campo e apoio a relatórios técnicos.",
        exp_engpacto: "RT pelos grupos de herpetofauna e quiropterofauna na duplicação da Rodovia dos Tamoios (Trecho Serra), Contorno Sul de Caraguatatuba e São Sebastião, duplicação de rodovias no Paraná, EIA/RIMA do Complexo Logístico Tatu (Cubatão/SP) e extensão da Rodovia Carvalho Pinto (Taubaté–Aparecida).",
        exp_imbio: "Pesquisas com fauna na Serra da Mantiqueira, Serra da Bocaina e Serra do Mar. Linhas de investigação em bioacústica e padrões de vocalização, taxonomia, evolução, sistemática filogenética, biogeografia e programas de educação ambiental.",
        exp_ecos: "Monitoramento de herpetofauna e mastofauna para a instalação da Fábrica de Celulose Arauco (Inocência/MS), celulose em Bataguassu/MS, Cargill no MS, portos de areia (Pindamonhangaba, Aparecida e Realmix/Boituva) e empreendimentos industriais.",
        exp_cayman: "Responsável técnico por mastofauna e herpetofauna no monitoramento de fauna da PCH Verde 2 (Rio Verde/GO) e monitoramento de herpetofauna na Mineradora Massari.",
        exp_lt: "Monitoramento de aves suscetíveis à colisão em Linhas de Transmissão de alta tensão (LT 500 kV Estreito–Cachoeira Paulista, LT 230 kV Itumbiara–Paranaíba, LT Fernão Dias, LT Marituba–Tucuruí no bioma Amazônia), ornitofauna portuária no Porto de São Sebastião/SP e parque solar em Janaúba/MG (Caatinga).",
        header_certs: "Formação Acadêmica & Credenciais",
        subtitle_academic: "Títulos Acadêmicos",
        acad_pos_title: "Especialização em Gestão Ambiental (Pós-Graduação Lato Sensu)",
        acad_pos_desc: "Ênfase em governança ambiental, instrumentos de planejamento territorial, mitigação de impactos e compliance regulatório de grandes empreendimentos.",
        status_pos: "Pós-Graduação",
        acad_grad_title: "Graduação — Licenciatura em Ciências Biológicas",
        acad_grad_desc: "TCC com mérito acadêmico: “Levantamento da Ornitofauna do Parque Ecológico do Taboão”, Lorena/SP. Bolsista de pesquisa institucional e bolsista PIBID-CAPES de iniciação à docência.",
        status_grad: "Graduação Superior",
        subtitle_licenses: "Registros Oficiais & Qualificações Técnicas",
        cert_crbio_desc: "Biólogo registrado e devidamente habilitado para assunção de Anotações de Responsabilidade Técnica (ART) e laudos de fauna em âmbito nacional.",
        status_active: "Ativo & Regular",
        cert_cemave_desc: "Credencial oficial do Centro Nacional de Pesquisa e Conservação de Aves Silvestres para anilhamento, captura, biometria e marcação de avifauna.",
        status_official_cert: "Credencial Oficial",
        cert_eear_desc: "Capacitação teórica e treinamento de segurança para militares e especialistas em contenção física de répteis peçonhentos e crocodilianos.",
        status_instructor: "Docência / Treinamento",
        cert_symp_desc: "Participação no II International Symposium on Tadpole Evolution (2024), AVISTAR (2024), análise de muda em aves e cursos avançados de herpetologia.",
        status_continuous: "Educação Continuada",
        header_stats: "GitHub & Atividade Aberta",
        btn_explore_gh: "Explorar Todos os Repositórios (@lucasaosf)",
        header_manifesto: "Manifesto Científico",
        footer_text: "Desenvolvido por Lucas Aøsf // Biokuri — Soluções Ambientais & Ecologia Computacional"
    },
    en: {
        tag_identity: "Identity & Leadership",
        desc_bio: "Biologist (UNIFATEA) and Environmental Management Specialist (UNOPAR), CEMAVE/ICMBio licensed bird bander. Over 10 years working at the nexus of <strong>Taxonomy & Phylogenetic Systematics</strong>, fieldwork across all Brazilian biomes, and <strong>computational automation in R & Python</strong> for biodiversity modeling.",
        header_focus: "Focus & Core Expertise",
        intro_focus: "Pioneering synthesis of classical morphological taxonomy with modern computational biology and automation.",
        focus_taxo_title: "Taxonomy & Systematics (Core Focus)",
        focus_taxo_desc: "Morphological diagnosis of herpetofauna and avifauna, bioacoustics, dichotomous keys, cryptic clades (e.g. Bothrops atrox complex), and historical taxa rediscoveries.",
        focus_prog_title: "Computational Ecology & R Programming",
        focus_prog_desc: "Advanced automated pipelines for GBIF (Global Biodiversity Information Facility) data mining, multivariate statistical community ecology, and ecological modeling.",
        focus_auto_title: "Automated Reporting & Field Data Pipelines",
        focus_auto_desc: "Python and R scripts for automated cleaning and ingestion of field matrices, biodiversity index calculation, and instant technical environmental report generation.",
        focus_apps_title: "Field Software Engineering (PWAs)",
        focus_apps_desc: "Creator and software architect of offline-first PWAs such as Caderneta de Campo (GPS geotagging, Mackinnon lists, automated Excel export) and Smalian Timber Scaler.",
        metric_years: "Years in Field & Taxonomy",
        metric_papers: "Scientific Papers & Books",
        metric_projects: "Major Enterprise Contracts",
        metric_biomes: "Brazilian Biomes Sampled",
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
        btn_scan: "_INITIATE_TAXONOMIC_SCAN",
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
        intro_pubs: "Full peer-reviewed papers in international and national scientific journals focusing on systematics, herpetology, natural history, and rediscoveries.",
        abstract_bothrops: "Taxonomic and morphological confirmation of the green jararaca after 30 years without documented occurrences in Espírito Santo, filling crucial biogeographical and conservation gaps.",
        abstract_moreirae: "Expansion and revision of the geographical distribution of the high-altitude redbelly toad using curated and validated mass citizen science datasets.",
        abstract_feigning: "First detailed reports of death feigning (thanatosis) in pitvipers of the Bothrops atrox clade, addressing ethological and behavioral characters in Neotropical vipers.",
        abstract_hoplias: "First documented predation of the frog Leptodactylus paranaru by trahira fish, capturing aquatic-terrestrial trophic interactions in Atlantic Forest riparian zones.",
        abstract_boana: "Natural history observation of predation on the large leopard tree frog by the water snake in coastal Atlantic Forest.",
        abstract_guia: "Comprehensive photographic contribution and taxonomic identification: high-resolution imagery of amphibians and reptiles composing nearly the entire herpetofauna section of the official ICMBio guide.",
        header_experience: "Professional Experience & Major Contracts",
        intro_experience: "Technical responsibility (RT) and specialized environmental consulting for major infrastructure across Brazil.",
        exp_caruso: "Field execution of environmental monitoring (wildlife, environmental noise, and water quality), survey campaign design, sampling methodologies, and technical reporting support.",
        exp_engpacto: "Technical Lead for herpetofauna and bats on the Rodovia dos Tamoios highway duplication (mountain section), Caraguatatuba bypass, Paraná highways, Tatu Logistics EIA/RIMA, and Carvalho Pinto Highway extension.",
        exp_imbio: "Wildlife research across Mantiqueira, Bocaina, and Serra do Mar ranges. Focused on bioacoustics, vocalization patterns, evolutionary systematics, phylogenetics, and conservation education.",
        exp_ecos: "Herpetofauna and mammal monitoring for Arauco Pulp Mill construction (MS), Bataguassu pulp mill, Cargill MS operations, sand mining ports, and industrial developments.",
        exp_cayman: "Technical lead for herpetofauna and mastozoology on PCH Verde 2 hydroelectric plant (GO) and herpetological surveys for Massari Mining.",
        exp_lt: "Bird collision risk monitoring along high-voltage transmission lines (500 kV Estreito–Cachoeira Paulista, 230 kV Itumbiara–Paranaíba, Fernão Dias, Marituba–Tucuruí in Amazon biome), port avifauna at São Sebastião, and solar farm in Caatinga.",
        header_certs: "Academic Education & Credentials",
        subtitle_academic: "Academic Degrees",
        acad_pos_title: "Postgraduate Specialization in Environmental Management",
        acad_pos_desc: "Focused on environmental governance, spatial planning instruments, impact mitigation, and regulatory compliance for large-scale operations.",
        status_pos: "Postgraduate Degree",
        acad_grad_title: "Bachelor's Degree in Biological Sciences",
        acad_grad_desc: "Honor thesis: 'Avifauna Survey of Taboão Ecological Park', Lorena/SP. Institutional research grantee and CAPES-PIBID teaching fellow.",
        status_grad: "Higher Education Degree",
        subtitle_licenses: "Official Licenses & Technical Qualifications",
        cert_crbio_desc: "Licensed Biologist qualified for Technical Responsibility (ART) and official environmental wildlife assessments nationwide.",
        status_active: "Active & Certified",
        cert_cemave_desc: "Official credential from ICMBio National Center for Wild Bird Research for scientific mist netting, banding, and biometrics.",
        status_official_cert: "Official Credential",
        cert_eear_desc: "Theoretical training and field safety instruction for military personnel on venomous snakes, spiders, scorpions, and crocodilians.",
        status_instructor: "Instruction / Training",
        cert_symp_desc: "Active participant in the II International Symposium on Tadpole Evolution (2024), AVISTAR (2024), and advanced zoological seminars.",
        status_continuous: "Continuing Education",
        header_stats: "GitHub & Open Science",
        btn_explore_gh: "Explore All Repositories (@lucasaosf)",
        header_manifesto: "Scientific Manifesto",
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

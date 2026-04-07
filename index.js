(function () {
    // Run after DOM is ready (the HTML loads this script with `defer`).
    function onReady() {
        // -------------------------
        // Temporary debug controllers (for tuning model look)
        // -------------------------
        const degToRad = (deg) => (deg * Math.PI) / 180;

        const debugUI = document.createElement('div');
        debugUI.id = 'debug-ui';
        debugUI.innerHTML = `
            <div class="row">
                <label for="dbg-targetMaxDim">
                    <span>targetMaxDim</span>
                    <span id="dbg-targetMaxDim-val"></span>
                </label>
                    <input id="dbg-targetMaxDim" type="range" min="0.5" max="6" step="0.01" value="6" />
            </div>
            <div class="row">
                <label for="dbg-initRotX">
                    <span>initRotX (deg)</span>
                    <span id="dbg-initRotX-val"></span>
                </label>
                <input id="dbg-initRotX" type="range" min="-180" max="180" step="1" value="0" />
            </div>
            <div class="row">
                <label for="dbg-initRotY">
                    <span>initRotY (deg)</span>
                    <span id="dbg-initRotY-val"></span>
                </label>
                <input id="dbg-initRotY" type="range" min="-180" max="180" step="1" value="0" />
            </div>
            <div class="row row--btn">
                <button id="dbg-reset" type="button">Reset</button>
            </div>
        `;
        document.body.appendChild(debugUI);

        const targetMaxDimEl = debugUI.querySelector('#dbg-targetMaxDim');
        const initRotXEl = debugUI.querySelector('#dbg-initRotX');
        const initRotYEl = debugUI.querySelector('#dbg-initRotY');

        const targetMaxDimValEl = debugUI.querySelector('#dbg-targetMaxDim-val');
        const initRotXValEl = debugUI.querySelector('#dbg-initRotX-val');
        const initRotYValEl = debugUI.querySelector('#dbg-initRotY-val');

        const getTargetMaxDim = () => parseFloat(targetMaxDimEl.value);
        const getInitRotX = () => degToRad(parseFloat(initRotXEl.value));
        const getInitRotY = () => degToRad(parseFloat(initRotYEl.value));

        const renderDebugVals = () => {
            targetMaxDimValEl.innerText = getTargetMaxDim().toFixed(2);
            initRotXValEl.innerText = initRotXEl.value;
            initRotYValEl.innerText = initRotYEl.value;
        };
        renderDebugVals();

        // -------------------------
        // CRT scanline overlay (top-most screen effect)
        // -------------------------
        const crtStyleId = 'crt-overlay-style';
        if (!document.getElementById(crtStyleId)) {
            const crtStyle = document.createElement('style');
            crtStyle.id = crtStyleId;
            crtStyle.textContent = `
                #crt-overlay {
                    position: fixed;
                    inset: 0;
                    pointer-events: none;
                    z-index: 2147483646;
                    opacity: 0.9;
                    background-image:
                        repeating-linear-gradient(
                            to bottom,
                            rgba(255, 255, 255, 0.12) 0px,
                            rgba(255, 255, 255, 0.12) 1px,
                            rgba(0, 0, 0, 0.12) 2px,
                            rgba(0, 0, 0, 0.12) 3px
                        ),
                        linear-gradient(
                            to bottom,
                            rgba(255, 255, 255, 0.04),
                            rgba(0, 0, 0, 0.08)
                        );
                    mix-blend-mode: soft-light;
                    animation: crt-scan-move 1s linear infinite, crt-flicker 0.12s steps(2, end) infinite;
                    will-change: background-position, opacity;
                }

                @keyframes crt-scan-move {
                    0% { background-position: 0 0, 0 0; }
                    100% { background-position: 0 180px, 0 0; }
                }

                @keyframes crt-flicker {
                    0% { opacity: 0.28; }
                    50% { opacity: 0.34; }
                    100% { opacity: 0.30; }
                }
            `;
            document.head.appendChild(crtStyle);
        }

        if (!document.getElementById('crt-overlay')) {
            const crtOverlay = document.createElement('div');
            crtOverlay.id = 'crt-overlay';
            document.body.appendChild(crtOverlay);
        }

        // -------------------------
        // Clock banner
        // -------------------------
        const clockEl = document.getElementById('clock');
        if (clockEl) {
            setInterval(() => {
                const now = new Date();
                clockEl.innerText = now.toISOString().substr(11, 8);
            }, 1000);
        }

        // -------------------------
        // Footer contact form
        // -------------------------
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            const statusEl = document.getElementById('contactFormStatus');
            const nameEl = document.getElementById('contactName');
            const emailEl = document.getElementById('contactEmail');
            const messageEl = document.getElementById('contactMessage');

            contactForm.addEventListener('submit', (event) => {
                event.preventDefault();
                if (!nameEl || !emailEl || !messageEl) return;

                if (!contactForm.checkValidity()) {
                    contactForm.reportValidity();
                    if (statusEl) statusEl.innerText = 'Please fill all required fields.';
                    return;
                }

                const name = nameEl.value.trim();
                const email = emailEl.value.trim();
                const message = messageEl.value.trim();

                const subject = encodeURIComponent(`Contact Form - ${name}`);
                const body = encodeURIComponent(
                    `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
                );
                const mailtoUrl = `mailto:hi@ouvre.nyc?subject=${subject}&body=${body}`;
                window.location.href = mailtoUrl;

                if (statusEl) statusEl.innerText = 'Opening your email client...';
            });
        }

        // -------------------------
        // Product detail modal (Acquire Edition) — markup from product-modal.fragment.html
        // -------------------------
        const getProductModalMarkupFallback = () =>
            `<div id="product-modal" class="product-modal" hidden aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="product-modal-title">
    <div class="product-modal__backdrop" tabindex="-1" aria-hidden="true"></div>
    <div class="product-modal__card">
        <button type="button" class="product-modal__close" aria-label="Close">×</button>
        <div class="product-modal__split">
            <div class="product-modal__gallery">
                <img src="src/IMG_4365.jpg" alt="Edition detail — radiating structure" loading="lazy">
                <img src="src/IMG_4370.jpg" alt="Edition detail — fan silhouette" loading="lazy">
                <img src="src/IMG_4374.jpg" alt="Edition detail — pleated surface" loading="lazy">
                <img src="src/IMG_4406.jpg" alt="Edition detail — curved slats" loading="lazy">
            </div>
            <div class="product-modal__detail">
                <h2 id="product-modal-title" class="product-modal__title"></h2>
                <div class="product-modal__pricing-row">
                    <p class="product-modal__price" aria-live="polite"></p>
                    <div class="filter-group product-modal__version-toggle" role="tablist" aria-label="Edition version">
                        <button type="button" class="filter-btn product-modal__version-btn active" data-version="base" data-price="29" aria-selected="true">base</button>
                        <button type="button" class="filter-btn product-modal__version-btn" data-version="nfc" data-price="39" aria-selected="false">NFC version</button>
                    </div>
                </div>
                <p class="product-modal__desc t-body"></p>
                <ul class="product-modal__specs" id="product-modal-specs"></ul>
                <ul class="product-modal__specs product-modal__specs--dimensions" aria-label="Dimensions">
                    <li><span class="t-label">Dimensions</span><span>Open span 320 mm · Closed length 210 mm</span></li>
                </ul>
                <p class="product-modal__edition"><span class="t-label">Edition</span><span> Numbered studio release.</span></p>
                <div class="product-modal__cta-block">
                    <button type="button" class="product-modal__cta" data-text="Checkout">Checkout</button>
                    <p class="product-modal__shipping-returns t-body">Shipping &amp; returns — Ships in 3–5 business days. Final sale on opened editions; unopened items may be returned within 14 days.</p>
                </div>
            </div>
        </div>
    </div>
</div>`;

        const injectProductModalMarkup = () => {
            if (document.getElementById('product-modal')) {
                return Promise.resolve();
            }
            return fetch('product-modal.fragment.html', { cache: 'no-store' })
                .then((res) => (res.ok ? res.text() : Promise.reject(new Error(String(res.status)))))
                .then((html) => {
                    document.body.insertAdjacentHTML('beforeend', html.trim());
                })
                .catch(() => {
                    document.body.insertAdjacentHTML(
                        'beforeend',
                        getProductModalMarkupFallback().trim()
                    );
                });
        };

        const initProductModal = () => {
            const productModal = document.getElementById('product-modal');
            if (!productModal || productModal.dataset.modalBound === '1') return;
            productModal.dataset.modalBound = '1';

            const backdrop = productModal.querySelector('.product-modal__backdrop');
            const closeBtn = productModal.querySelector('.product-modal__close');
            const titleEl = document.getElementById('product-modal-title');
            const subtitleEl = productModal.querySelector('.product-modal__subtitle');
            const priceEl = productModal.querySelector('.product-modal__price');
            const descEl = productModal.querySelector('.product-modal__desc');
            const specsEl = document.getElementById('product-modal-specs');
            const galleryEl = productModal.querySelector('.product-modal__gallery');
            const versionButtons = productModal.querySelectorAll('.product-modal__version-btn');
            const ctaBtn = productModal.querySelector('.product-modal__cta');
            let lastFocusEl = null;
            let previousBodyOverflow = '';
            let activeTriggerBtn = null;
            let activeProductKey = '';

            const checkoutUrls = {
                flow: {
                    base: 'https://buy.stripe.com/5kQ6oJfwQeo15itbdI7wA01',
                    nfc: 'https://buy.stripe.com/eVqdRb4SccfTfX795A7wA00',
                },
                babylon: {
                    base: 'https://buy.stripe.com/3cI5kF1G01Bf8uF95A7wA02',
                    nfc: 'https://buy.stripe.com/00w7sN0BWbbPcKV4Pk7wA03',
                },
            };

            const modalGalleryImages = {
                babylon: [
                    { src: 'src/IMG_4370.jpg', alt: 'Babylon edition detail 01' },
                    { src: 'src/cover_1.jpg', alt: 'Babylon edition detail 02' },
                    { src: 'src/IMG_4374.jpg', alt: 'Babylon edition detail 03' },
                ],
                flow: [
                    { src: 'src/IMG_4365.jpg', alt: 'flow edition detail 01' },
                    { src: 'src/cover_2.jpg', alt: 'flow edition detail 02' },
                    { src: 'src/IMG_4406.jpg', alt: 'flow edition detail 03' },
                ],
            };

            const formatUSD = (raw) => {
                const num = parseFloat(String(raw).replace(/[^0-9.]/g, ''), 10);
                if (Number.isNaN(num)) return raw ? String(raw) : '—';
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                }).format(num);
            };

            const updateModalGallery = (productKey) => {
                if (!galleryEl) return;
                const images =
                    modalGalleryImages[productKey] || modalGalleryImages.flow;
                galleryEl.innerHTML = images
                    .map(
                        (image) =>
                            `<img src="${image.src}" alt="${image.alt}" loading="lazy">`
                    )
                    .join('');
            };

            const populateFromCard = (card, triggerBtn) => {
                if (!card || !titleEl) return;
                const h3 = card.querySelector('h3');
                const firstCol = card.querySelector('.drop-info .info-col:first-child');
                const subtitle =
                    firstCol?.querySelector('.t-label')?.textContent?.trim() || '';
                const desc =
                    firstCol?.querySelector('p.t-body')?.textContent?.trim() || '';
                titleEl.textContent = h3 ? h3.textContent.trim() : 'Edition';
                activeProductKey = (h3?.textContent || '')
                    .trim()
                    .toLowerCase();
                updateModalGallery(activeProductKey);
                if (subtitleEl) {
                    subtitleEl.textContent = subtitle;
                    subtitleEl.hidden = !subtitle;
                }
                if (descEl) descEl.textContent = desc;
                if (priceEl) {
                    priceEl.textContent = formatUSD(
                        triggerBtn?.dataset?.price || ''
                    );
                }
                if (specsEl) {
                    specsEl.innerHTML = '';
                    const rows = card.querySelectorAll(
                        '.drop-info .info-col:nth-child(2) .info-row'
                    );
                    rows.forEach((row) => {
                        const label = row.querySelector('.t-label');
                        const data = row.querySelector('.t-data');
                        if (!label || !data) return;
                        const li = document.createElement('li');
                        const labSpan = document.createElement('span');
                        labSpan.className = 't-label';
                        labSpan.textContent = label.textContent.trim();
                        const valSpan = document.createElement('span');
                        valSpan.textContent = data.textContent.trim();
                        li.appendChild(labSpan);
                        li.appendChild(valSpan);
                        specsEl.appendChild(li);
                    });
                }
            };

            const applyModalVersion = (targetBtn) => {
                if (!targetBtn) return;
                versionButtons.forEach((btn) => {
                    const isActive = btn === targetBtn;
                    btn.classList.toggle('active', isActive);
                    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
                });
                const nextPrice = targetBtn.dataset.price || '29';
                if (priceEl) priceEl.textContent = formatUSD(nextPrice);
                if (activeTriggerBtn) {
                    activeTriggerBtn.dataset.price = nextPrice;
                    const baseEditionId =
                        activeTriggerBtn.dataset.editionBaseId ||
                        activeTriggerBtn.dataset.editionId ||
                        '';
                    const nextVersion = targetBtn.dataset.version || 'base';
                    if (baseEditionId) {
                        activeTriggerBtn.dataset.editionBaseId = baseEditionId;
                        activeTriggerBtn.dataset.editionId = `${baseEditionId}-${nextVersion}`;
                    }
                }
                if (ctaBtn) {
                    const nextUrl = checkoutUrls[activeProductKey]?.[targetBtn.dataset.version || 'base'] || '';
                    ctaBtn.dataset.checkoutUrl = nextUrl;
                }
            };

            const closeModal = () => {
                productModal.setAttribute('hidden', '');
                productModal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = previousBodyOverflow;
                document.removeEventListener('keydown', onKeyDown);
                if (lastFocusEl && typeof lastFocusEl.focus === 'function') {
                    lastFocusEl.focus();
                }
                activeTriggerBtn = null;
                lastFocusEl = null;
            };

            const openModal = (card, triggerBtn) => {
                lastFocusEl = document.activeElement;
                activeTriggerBtn = triggerBtn;
                populateFromCard(card, triggerBtn);
                const defaultVersionBtn =
                    productModal.querySelector('.product-modal__version-btn[data-version="base"]') ||
                    versionButtons[0];
                applyModalVersion(defaultVersionBtn);
                productModal.removeAttribute('hidden');
                productModal.setAttribute('aria-hidden', 'false');
                previousBodyOverflow = document.body.style.overflow;
                document.body.style.overflow = 'hidden';
                document.addEventListener('keydown', onKeyDown);
                if (closeBtn && typeof closeBtn.focus === 'function') {
                    closeBtn.focus();
                }
            };

            function onKeyDown(e) {
                if (e.key === 'Escape') {
                    e.preventDefault();
                    closeModal();
                }
            }

            versionButtons.forEach((btn) => {
                btn.addEventListener('click', () => {
                    applyModalVersion(btn);
                });
            });

            if (ctaBtn) {
                ctaBtn.addEventListener('click', () => {
                    const targetUrl = ctaBtn.dataset.checkoutUrl || '';
                    if (!targetUrl) return;
                    window.location.href = targetUrl;
                });
            }

            document.querySelectorAll('.drop-acquire-btn').forEach((btn) => {
                btn.addEventListener('click', () => {
                    const card = btn.closest('.drop-card');
                    openModal(card, btn);
                });
            });

            if (closeBtn) {
                closeBtn.addEventListener('click', () => closeModal());
            }
            if (backdrop) {
                backdrop.addEventListener('click', () => closeModal());
            }
        };

        injectProductModalMarkup().then(() => initProductModal());

        // -------------------------
        // Catalog grid population
        // -------------------------
        const grid = document.getElementById('catalogGrid');
        if (grid) {
            // Each catalog item represents a single artist.
            const artists = [
                { name: "Astra Vellum", practice: "Generative collage", focus: "Light-as-structure", medium: "Ink + algorithmic print", year: "2024" },
                { name: "Noir Calder", practice: "Kinetic sculpture", focus: "Mechanical poetry", medium: "Steel + torsion springs", year: "2023" },
                { name: "Mina Flux", practice: "Ceramic gradients", focus: "Firing as narrative", medium: "Glaze + high-temperature color", year: "2025" },
                { name: "Eli Datum", practice: "Data murals", focus: "Signals turned visible", medium: "Pigment + typographic systems", year: "2022" },
                { name: "Sol Ember", practice: "Found-object assemblage", focus: "Ritualized debris", medium: "Mixed materials + patina", year: "2024" },
                { name: "Rhea Hex", practice: "Minimal painting cycles", focus: "Constraints as rhythm", medium: "Acrylic on linen", year: "2021" },
                { name: "Kaito Ion", practice: "Glass relief studies", focus: "Transparency with weight", medium: "Cast resin + glass dust", year: "2023" },
                { name: "Vera Circuit", practice: "Light projection works", focus: "Latency & glow", medium: "LED + projection media", year: "2025" },
                { name: "Rowan Gamma", practice: "Monochrome sculpture", focus: "Texture as memory", medium: "Basalt-like plaster + pigment", year: "2022" },
                { name: "Aya Logic", practice: "Textile pattern experiments", focus: "Stitching the impossible", medium: "Thread + warped grid weaving", year: "2024" },
                { name: "Theo Carbon", practice: "Charcoal architecture", focus: "Shadow plans", medium: "Charcoal + fixative", year: "2023" },
                { name: "Sable Circuitry", practice: "Ambient installation", focus: "Sound as geometry", medium: "Speakers + spatial light", year: "2021" },
            ];

            // Open/free portrait images (grayscale is applied via CSS)
            // Keep all queries face-forward so every card tends to show a visible face.
            const imgQueries = [
                'face,portrait,headshot,person,black-and-white',
                'human face,studio portrait,person,black-and-white',
                'close-up face,portrait,person,black-and-white',
                'front-facing portrait,human face,headshot,black-and-white',
            ];

            grid.innerHTML = '';
            for (let i = 1; i <= 12; i++) {
                const artist = artists[i - 1];
                // `source.unsplash.com` uses `sig` to bust caching and keep it random per load.
                const sig = Math.floor(Math.random() * 1000000);
                const imgQuery = imgQueries[(i - 1) % imgQueries.length];
                const imgUrl = `https://source.unsplash.com/400x300/?${imgQuery}&sig=${sig}`;
                const fallbackUrl = `https://picsum.photos/seed/${sig}/400/300`;

                const item = document.createElement('div');
                item.className = 'catalog-item';
                item.innerHTML = `
                    <div class="item-header">
                        <span class="t-label">ARTIST-${i.toString().padStart(3, '0')}</span>
                        <span class="t-data" style="color:var(--muted)">[Archive: Open]</span>
                    </div>
                    <h4 class="item-name">${artist.name}</h4>
                    <div class="item-img-container">
                        <img src="${imgUrl}" alt="Artist archive imagery" onerror="this.onerror=null;this.src='${fallbackUrl}';">
                    </div>
                    <div class="item-stats">
                        <div class="stat-box"><span class="t-label">Practice</span><span class="t-data">${artist.practice}</span></div>
                        <div class="stat-box"><span class="t-label">Focus</span><span class="t-data">${artist.focus}</span></div>
                        <div class="stat-box"><span class="t-label">Medium</span><span class="t-data">${artist.medium}</span></div>
                    </div>
                `;
                grid.appendChild(item);
            }
        }

        const landingSystemBannerEl = document.querySelector('#landing .system-banner');
        const dropsSectionEl = document.getElementById('drops');
        const catalogSectionEl = document.getElementById('catalog');

        function smoothstep01(t) {
            const x = Math.min(1, Math.max(0, t));
            return x * x * (3 - 2 * x);
        }

        /** Opacity 0→1→0 from how close the visible part of `el` is to a viewport reading line (works for tall sections). */
        function opacityFromViewportScroll(rect, vh) {
            const visibleTop = Math.max(0, rect.top);
            const visibleBottom = Math.min(vh, rect.bottom);
            if (visibleBottom <= visibleTop) return 0;
            const focusY = (visibleTop + visibleBottom) * 0.5;
            const viewAnchor = vh * 0.38;
            const dist = Math.abs(focusY - viewAnchor);
            const inner = vh * 0.14;
            const outer = vh * 0.48;
            if (dist <= inner) return 1;
            if (dist >= outer) return 0;
            return smoothstep01(1 - (dist - inner) / (outer - inner));
        }

        function updateScrollRevealSections() {
            const vh = window.innerHeight;
            const apply = (el) => {
                if (!el) return;
                const o = opacityFromViewportScroll(el.getBoundingClientRect(), vh);
                el.style.opacity = String(o);
            };
            apply(landingSystemBannerEl);
            apply(dropsSectionEl);
            apply(catalogSectionEl);
        }

        (function scrollRevealRafLoop() {
            updateScrollRevealSections();
            requestAnimationFrame(scrollRevealRafLoop);
        })();

        // -------------------------
        // Three.js background / shader blob
        // -------------------------
        if (!window.THREE) return;

        const container = document.getElementById('canvas-container');
        if (!container) return;

        // -------------------------
        // Background noise overlay (moved from `index.html`)
        // -------------------------
        const noiseCanvas = document.getElementById('glcanvas');
        if (noiseCanvas) {
            const noiseRenderer = new THREE.WebGLRenderer({ canvas: noiseCanvas, antialias: false, alpha: true });
            noiseRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
            noiseRenderer.setClearColor(0x000000, 0);

            const noiseCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
            const noiseScene = new THREE.Scene();

            const noiseVertexShader = `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = vec4(position, 1.0);
                }
            `;

            const noiseFragmentShader = `
                uniform float u_time;
                uniform vec2 u_resolution;
                uniform float u_dustScaleA;
                uniform float u_dustScaleB;
                uniform float u_dustSpeedA;
                uniform float u_dustSpeedB;
                uniform float u_grainAmount;
                uniform float u_dustAmount;
                uniform float u_baseAlpha;
                uniform float u_vignettePower;
                varying vec2 vUv;

                // Pseudo-random generator for film grain
                float random(vec2 st) {
                    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
                }

                // Simplex noise function for dust clouds
                vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
                vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
                vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }
                float snoise(vec2 v) {
                    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
                    vec2 i = floor(v + dot(v, C.yy));
                    vec2 x0 = v - i + dot(i, C.xx);
                    vec2 i1;
                    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
                    vec4 x12 = x0.xyxy + C.xxzz;
                    x12.xy -= i1;
                    i = mod289(i);
                    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
                    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
                    m = m * m;
                    m = m * m;
                    vec3 x = 2.0 * fract(p * C.www) - 1.0;
                    vec3 h = abs(x) - 0.5;
                    vec3 ox = floor(x + 0.5);
                    vec3 a0 = x - ox;
                    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
                    vec3 g;
                    g.x = a0.x * x0.x + h.x * x0.y;
                    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
                    return 130.0 * dot(m, g);
                }

                void main() {
                    vec2 st = gl_FragCoord.xy / u_resolution.xy;
                    st.x *= u_resolution.x / u_resolution.y;

                    // Dust clouds (slow moving)
                    float dust = snoise(st * u_dustScaleA + u_time * u_dustSpeedA) * 0.5 + 0.5;
                    dust *= snoise(st * u_dustScaleB - u_time * u_dustSpeedB) * 0.5 + 0.5;

                    // Film grain
                    float grain = random(st * u_time) * u_grainAmount;

                    // Translucent overlay so it layers over your existing scene.
                    vec3 noiseColor = vec3(grain);
                    noiseColor += vec3(0.5, 0.6, 0.7) * dust * u_dustAmount;

                    // Vignette mask
                    vec2 uv = vUv;
                    uv *= 1.0 - uv.yx;
                    float vig = uv.x * uv.y * 15.0;
                    vig = pow(vig, u_vignettePower);
                    noiseColor *= vig;

                    // Alpha modulated by activity (grain/dust)
                    float alpha = u_baseAlpha;
                    alpha *= clamp((dust * 0.65) + (grain * 2.5), 0.0, 1.0);

                    gl_FragColor = vec4(noiseColor, alpha);
                }
            `;

            const noiseUniforms = {
                u_time: { value: 0.0 },
                u_resolution: { value: new THREE.Vector2() },
                u_dustScaleA: { value: 3.0 },
                u_dustScaleB: { value: 6.0 },
                u_dustSpeedA: { value: 0.05 },
                u_dustSpeedB: { value: 0.02 },
                u_grainAmount: { value: 0.39 },
                u_dustAmount: { value: 0.19 },
                u_baseAlpha: { value: 0.29 },
                u_vignettePower: { value: 0.18 }
            };

            const noiseMaterial = new THREE.ShaderMaterial({
                vertexShader: noiseVertexShader,
                fragmentShader: noiseFragmentShader,
                uniforms: noiseUniforms,
                transparent: true,
                depthTest: false,
                depthWrite: false
            });

            const plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), noiseMaterial);
            noiseScene.add(plane);

            const noiseDefaults = {
                dustScaleA: 3.0,
                dustScaleB: 6.0,
                dustSpeedA: 0.05,
                dustSpeedB: 0.02,
                grainAmount: 0.39,
                dustAmount: 0.19,
                baseAlpha: 0.29,
                vignettePower: 0.18,
            };
            const SHOW_NOISE_CONTROLLER = false;

            const noiseCtrl = document.createElement('div');
            noiseCtrl.id = 'noise-controller';
            noiseCtrl.innerHTML = `
                <div class="row">
                    <label for="noise-dust-amount">
                        <span>Dust Amount</span>
                        <span id="noise-dust-amount-val"></span>
                    </label>
                    <input id="noise-dust-amount" type="range" min="0" max="0.6" step="0.01" value="${noiseDefaults.dustAmount}" />
                </div>
                <div class="row">
                    <label for="noise-grain-amount">
                        <span>Grain Amount</span>
                        <span id="noise-grain-amount-val"></span>
                    </label>
                    <input id="noise-grain-amount" type="range" min="0" max="0.8" step="0.01" value="${noiseDefaults.grainAmount}" />
                </div>
                <div class="row">
                    <label for="noise-base-alpha">
                        <span>Base Alpha</span>
                        <span id="noise-base-alpha-val"></span>
                    </label>
                    <input id="noise-base-alpha" type="range" min="0" max="0.6" step="0.01" value="${noiseDefaults.baseAlpha}" />
                </div>
                <div class="row">
                    <label for="noise-vignette-power">
                        <span>Vignette Power</span>
                        <span id="noise-vignette-power-val"></span>
                    </label>
                    <input id="noise-vignette-power" type="range" min="0.1" max="1.2" step="0.01" value="${noiseDefaults.vignettePower}" />
                </div>
                <div class="row row--btn">
                    <button id="noise-reset" type="button">Reset Noise</button>
                </div>
            `;
            document.body.appendChild(noiseCtrl);
            if (!SHOW_NOISE_CONTROLLER) noiseCtrl.style.display = 'none';

            const noiseDustAmountEl = noiseCtrl.querySelector('#noise-dust-amount');
            const noiseGrainAmountEl = noiseCtrl.querySelector('#noise-grain-amount');
            const noiseBaseAlphaEl = noiseCtrl.querySelector('#noise-base-alpha');
            const noiseVignettePowerEl = noiseCtrl.querySelector('#noise-vignette-power');

            const noiseDustAmountValEl = noiseCtrl.querySelector('#noise-dust-amount-val');
            const noiseGrainAmountValEl = noiseCtrl.querySelector('#noise-grain-amount-val');
            const noiseBaseAlphaValEl = noiseCtrl.querySelector('#noise-base-alpha-val');
            const noiseVignettePowerValEl = noiseCtrl.querySelector('#noise-vignette-power-val');

            const updateNoiseUI = () => {
                if (noiseDustAmountValEl) noiseDustAmountValEl.textContent = noiseUniforms.u_dustAmount.value.toFixed(2);
                if (noiseGrainAmountValEl) noiseGrainAmountValEl.textContent = noiseUniforms.u_grainAmount.value.toFixed(2);
                if (noiseBaseAlphaValEl) noiseBaseAlphaValEl.textContent = noiseUniforms.u_baseAlpha.value.toFixed(2);
                if (noiseVignettePowerValEl) noiseVignettePowerValEl.textContent = noiseUniforms.u_vignettePower.value.toFixed(2);
            };

            const applyNoiseState = (state) => {
                if (typeof state.dustAmount === 'number') noiseUniforms.u_dustAmount.value = Math.min(0.6, Math.max(0, state.dustAmount));
                if (typeof state.grainAmount === 'number') noiseUniforms.u_grainAmount.value = Math.min(0.8, Math.max(0, state.grainAmount));
                if (typeof state.baseAlpha === 'number') noiseUniforms.u_baseAlpha.value = Math.min(0.6, Math.max(0, state.baseAlpha));
                if (typeof state.vignettePower === 'number') noiseUniforms.u_vignettePower.value = Math.min(1.2, Math.max(0.1, state.vignettePower));

                if (noiseDustAmountEl) noiseDustAmountEl.value = String(noiseUniforms.u_dustAmount.value);
                if (noiseGrainAmountEl) noiseGrainAmountEl.value = String(noiseUniforms.u_grainAmount.value);
                if (noiseBaseAlphaEl) noiseBaseAlphaEl.value = String(noiseUniforms.u_baseAlpha.value);
                if (noiseVignettePowerEl) noiseVignettePowerEl.value = String(noiseUniforms.u_vignettePower.value);
                updateNoiseUI();
            };

            noiseDustAmountEl?.addEventListener('input', () => {
                applyNoiseState({ dustAmount: parseFloat(noiseDustAmountEl.value) });
            });
            noiseGrainAmountEl?.addEventListener('input', () => {
                applyNoiseState({ grainAmount: parseFloat(noiseGrainAmountEl.value) });
            });
            noiseBaseAlphaEl?.addEventListener('input', () => {
                applyNoiseState({ baseAlpha: parseFloat(noiseBaseAlphaEl.value) });
            });
            noiseVignettePowerEl?.addEventListener('input', () => {
                applyNoiseState({ vignettePower: parseFloat(noiseVignettePowerEl.value) });
            });
            noiseCtrl.querySelector('#noise-reset')?.addEventListener('click', () => {
                applyNoiseState(noiseDefaults);
            });

            window.noiseController = {
                setDustAmount: (v) => applyNoiseState({ dustAmount: v }),
                setGrainAmount: (v) => applyNoiseState({ grainAmount: v }),
                setBaseAlpha: (v) => applyNoiseState({ baseAlpha: v }),
                setVignettePower: (v) => applyNoiseState({ vignettePower: v }),
                reset: () => applyNoiseState(noiseDefaults),
                getState: () => ({
                    dustAmount: noiseUniforms.u_dustAmount.value,
                    grainAmount: noiseUniforms.u_grainAmount.value,
                    baseAlpha: noiseUniforms.u_baseAlpha.value,
                    vignettePower: noiseUniforms.u_vignettePower.value,
                }),
            };

            updateNoiseUI();

            function noiseResize() {
                noiseRenderer.setSize(window.innerWidth, window.innerHeight, false);
                noiseUniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
            }

            window.addEventListener('resize', noiseResize);
            noiseResize();

            function noiseAnimate(time) {
                noiseUniforms.u_time.value = time * 0.001;
                noiseRenderer.render(noiseScene, noiseCamera);
                requestAnimationFrame(noiseAnimate);
            }

            requestAnimationFrame(noiseAnimate);
        }

        /* Point cloud + main WebGL scene: set to true to restore. */
        const ENABLE_POINT_CLOUD = false;

        const landingBannerBodyEl = document.querySelector(
            '#landing .system-banner .t-body'
        );
        const heroTitleWrapperEl = document.querySelector('#landing .hero-title-wrapper');
        let landingHeroFadeBannerTopAtRest = null;
        const pointCloudScrollMotion = {
            triggerScrollPx: 60,
            travelScrollPx: 520,
            minScale: 0.62,
        };

        const scrollBgVideoEl = document.getElementById('scroll-bg-video');
        if (scrollBgVideoEl) {
            scrollBgVideoEl.play().catch(() => {});
        }

        const scrollVideoMotion = {
            minScale: 0.38,
            maxTranslateZ: -780,
            translateYFactor: 0.12,
            opacityTop: 0.82,
            opacityBottom: 0.1,
            opacityEase: 2,
            /** Radial mask: opaque core end % (lower = more edge feather). Interpolates with scroll. */
            maskCoreTop: 64,
            maskCoreBottom: 20,
            maskEllipseXTop: 98,
            maskEllipseXBottom: 80,
            maskEllipseYTop: 94,
            maskEllipseYBottom: 72,
        };

        if (ENABLE_POINT_CLOUD) {
        const scene = new THREE.Scene();
        scene.fog = new THREE.Fog('#020202', 3, 10);

        const camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );
        camera.position.set(0, 0, 5);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        const vertexShader = `
            varying vec3 vNormal;
            varying vec3 vPosition;
            uniform float time;
            
            // Simplex noise function for organic morphing
            vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
            vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
            float snoise(vec3 v) {
                const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
                const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
                vec3 i  = floor(v + dot(v, C.yyy) );
                vec3 x0 = v - i + dot(i, C.xxx) ;
                vec3 g = step(x0.yzx, x0.xyz);
                vec3 l = 1.0 - g;
                vec3 i1 = min( g.xyz, l.zxy );
                vec3 i2 = max( g.xyz, l.zxy );
                vec3 x1 = x0 - i1 + C.xxx;
                vec3 x2 = x0 - i2 + C.yyy;
                vec3 x3 = x0 - D.yyy;
                i = mod289(i);
                vec4 p = permute( permute( permute( i.z + vec4(0.0, i1.z, i2.z, 1.0 )) + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
                float n_ = 0.142857142857;
                vec3  ns = n_ * D.wyz - D.xzx;
                vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
                vec4 x_ = floor(j * ns.z);
                vec4 y_ = floor(j - 7.0 * x_ );
                vec4 x = x_ *ns.x + ns.yyyy;
                vec4 y = y_ *ns.x + ns.yyyy;
                vec4 h = 1.0 - abs(x) - abs(y);
                vec4 b0 = vec4( x.xy, y.xy );
                vec4 b1 = vec4( x.zw, y.zw );
                vec4 s0 = floor(b0)*2.0 + 1.0;
                vec4 s1 = floor(b1)*2.0 + 1.0;
                vec4 sh = -step(h, vec4(0.0));
                vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
                vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
                vec3 p0 = vec3(a0.xy,h.x);
                vec3 p1 = vec3(a0.zw,h.y);
                vec3 p2 = vec3(a1.xy,h.z);
                vec3 p3 = vec3(a1.zw,h.w);
                vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
                p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
                vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
                m = m * m;
                return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
            }

            void main() {
                vNormal = normalize(normalMatrix * normal);
                
                // Displacement based on noise
                float noise = snoise(vec3(position.x * 2.0 + time * 0.2, position.y * 2.0, position.z * 2.0));
                vec3 newPosition = position + normal * (noise * 0.15);
                
                vPosition = (modelViewMatrix * vec4(newPosition, 1.0)).xyz;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
            }
        `;

        const fragmentShader = `
            varying vec3 vNormal;
            varying vec3 vPosition;
            
            // Palette generation for iridescence
            vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ) {
                return a + b*cos( 6.28318*(c*t+d) );
            }

            void main() {
                vec3 viewDirection = normalize(-vPosition);
                
                // Fresnel effect for glassy edge highlighting
                float fresnel = dot(viewDirection, vNormal);
                fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
                fresnel = pow(fresnel, 3.0);
                
                // Chromatic aberration / Iridescence mapping based on normals
                float colorFactor = vNormal.x * 0.5 + vNormal.y * 0.5 + 0.5;
                
                // Dark, deep blues/purples/cyans palette
                vec3 a = vec3(0.5, 0.5, 0.5);
                vec3 b = vec3(0.5, 0.5, 0.5);
                vec3 c = vec3(1.0, 1.0, 1.0);
                vec3 d = vec3(0.263, 0.416, 0.557); // Blueish shift
                
                vec3 baseColor = palette(colorFactor + fresnel, a, b, c, d);
                
                // Darken the core, brighten edges
                vec3 finalColor = mix(vec3(0.01, 0.01, 0.05), baseColor, fresnel * 1.5);
                
                // Add a sharp rim light
                finalColor += vec3(0.5, 0.8, 1.0) * pow(fresnel, 5.0);
                
                gl_FragColor = vec4(finalColor, 0.85); // slight transparency
            }
        `;

        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: { time: { value: 0.0 } },
            transparent: true,
            wireframe: false,
            // Reduce z-fighting artifacts when using transparency
            depthWrite: false,
            side: THREE.DoubleSide,
        });

        // Model root (we rotate/translate this, regardless of when the OBJ finishes loading).
        const modelRoot = new THREE.Group();
        scene.add(modelRoot);

        const objUrl = './Meshy_AI_Four_Pointed_Crystal__0320172141_generate.obj';

        // -------------------------
        // Dark FBO particle system
        // -------------------------
        const SIM_RES = 256;
        const PARTICLE_COUNT = SIM_RES * SIM_RES;

        const isWebGL2 = renderer.capabilities.isWebGL2;
        const hasFloat = !!renderer.extensions.get('OES_texture_float');
        const hasHalfFloat = !!renderer.extensions.get('OES_texture_half_float');
        const dataType = (isWebGL2 || hasFloat) ? THREE.FloatType : THREE.HalfFloatType;

        if (!hasHalfFloat && dataType === THREE.HalfFloatType) {
            // eslint-disable-next-line no-console
            console.warn('Half float textures are not supported. Particle simulation may fail.');
        }

        const rtOptions = {
            type: dataType,
            format: THREE.RGBAFormat,
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            depthBuffer: false,
            stencilBuffer: false,
        };

        const rtA = new THREE.WebGLRenderTarget(SIM_RES, SIM_RES, rtOptions);
        const rtB = new THREE.WebGLRenderTarget(SIM_RES, SIM_RES, rtOptions);

        function makeDataTexture(fillFn) {
            const arr = new Float32Array(PARTICLE_COUNT * 4);
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const o = i * 4;
                const v = fillFn(i);
                arr[o + 0] = v[0];
                arr[o + 1] = v[1];
                arr[o + 2] = v[2];
                arr[o + 3] = 1.0;
            }
            const tex = new THREE.DataTexture(arr, SIM_RES, SIM_RES, THREE.RGBAFormat, dataType);
            tex.needsUpdate = true;
            tex.minFilter = THREE.NearestFilter;
            tex.magFilter = THREE.NearestFilter;
            tex.generateMipmaps = false;
            return tex;
        }

        // Initial textures (until OBJ loads).
        let targetTex = makeDataTexture(() => {
            const r = (Math.random() - 0.5) * 1.0;
            return [r, r * 0.6, r * 0.4];
        });
        let currentPosTex = makeDataTexture((i) => {
            const r = (Math.random() - 0.5) * 1.5;
            return [r, r * 0.7, r * 0.5];
        });

        const simVertexShader = `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = vec4(position, 1.0);
            }
        `;

        const simFragmentShader = `
            precision highp float;
            varying vec2 vUv;

            uniform sampler2D uPosTex;
            uniform sampler2D uTargetTex;
            uniform float uTime;
            uniform float uTargetScale;
            uniform float uRotX;
            uniform float uRotY;
            uniform vec2 uMouse;
            uniform float uScrollOffset;
            uniform float uAttract;
            uniform float uNoise;
            uniform float uBrownian;
            uniform float uMouseRotStrengthX;
            uniform float uMouseRotStrengthY;

            // Simple hash for pseudo-random noise (used as Brownian motion perturbation)
            float hash21(vec2 p) {
                return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
            }

            mat3 rotX(float a) {
                float c = cos(a);
                float s = sin(a);
                return mat3(
                    1.0, 0.0, 0.0,
                    0.0, c, -s,
                    0.0, s, c
                );
            }

            mat3 rotY(float a) {
                float c = cos(a);
                float s = sin(a);
                return mat3(
                    c, 0.0, s,
                    0.0, 1.0, 0.0,
                    -s, 0.0, c
                );
            }

            void main() {
                vec3 pos = texture2D(uPosTex, vUv).xyz;
                vec3 target = texture2D(uTargetTex, vUv).xyz;

                // Subtle mouse-tracking rotation so the form gently faces the cursor.
                float mouseRotX = -uMouse.y * uMouseRotStrengthX;
                float mouseRotY = -uMouse.x * uMouseRotStrengthY;
                target = rotY(uRotY + mouseRotY) * rotX(uRotX + mouseRotX) * target;
                target *= uTargetScale;

                vec3 mouseOffset = vec3(uMouse.x * 1.2, uMouse.y * 0.9, 0.0);
                target += mouseOffset * 0.14;
                target.z += uScrollOffset;

                float n = sin(target.x * 6.0 + uTime * 1.1) * cos(target.y * 5.0 - uTime * 0.9);
                vec3 turbulent = vec3(n, -n * 0.65, n * 0.35) * uNoise;

                // Brownian jitter: small random walk around the target/turbulence.
                vec3 brownian = vec3(
                    hash21(vUv + uTime * 0.17),
                    hash21(vUv + uTime * 0.27 + 12.34),
                    hash21(vUv + uTime * 0.37 + 56.78)
                ) - 0.5;

                vec3 next = pos + (target + turbulent + brownian * uBrownian - pos) * uAttract;
                gl_FragColor = vec4(next, 1.0);
            }
        `;

        const simUniforms = {
            uPosTex: { value: currentPosTex },
            uTargetTex: { value: targetTex },
            uTime: { value: 0.0 },
            uTargetScale: { value: getTargetMaxDim() },
            uRotX: { value: getInitRotX() },
            uRotY: { value: getInitRotY() },
            uMouse: { value: new THREE.Vector2(0, 0) },
            uScrollOffset: { value: 0.0 },
            uAttract: { value: 0.045 },
            uNoise: { value: 0.04 },
            uBrownian: { value: 0.7 },
            // Boosted for snappier cursor-facing response.
            uMouseRotStrengthX: { value: 0.28 },
            uMouseRotStrengthY: { value: 0.28 },
        };

        const simScene = new THREE.Scene();
        const simCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const simMaterial = new THREE.ShaderMaterial({
            vertexShader: simVertexShader,
            fragmentShader: simFragmentShader,
            uniforms: simUniforms,
        });
        simScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), simMaterial));

        const particleVertexShader = `
            precision highp float;
            uniform sampler2D uPosTex;
            uniform float uTime;
            uniform float uPointScale;
            attribute vec2 aUv;
            varying float vDepth;

            void main() {
                vec3 pos = texture2D(uPosTex, aUv).xyz;
                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                vDepth = -mvPosition.z;

                float size = uPointScale / max(0.001, vDepth);
                gl_PointSize = size;
                gl_Position = projectionMatrix * mvPosition;
            }
        `;

        const particleFragmentShader = `
            precision highp float;
            uniform float uTime;
            uniform vec3 uParticleColor;
            uniform float uParticleAlpha;
            uniform float uAlphaMultiplier;
            uniform float uGlowPower;
            uniform float uGlowSoftness;
            uniform float uGlowCore;
            varying float vDepth;

            void main() {
                vec2 p = gl_PointCoord - vec2(0.5);
                float d = length(p);
                float normalizedRadius = clamp(d / 0.5, 0.0, 1.0);
                float glowMask = pow(1.0 - normalizedRadius, uGlowSoftness);
                float coreMask = pow(1.0 - normalizedRadius, 6.0);

                vec3 col = uParticleColor;
                col += uParticleColor * coreMask * uGlowCore;

                // Dark aesthetic: low alpha + soft glow
                float alpha = glowMask * uParticleAlpha * uGlowPower * uAlphaMultiplier;
                gl_FragColor = vec4(col, alpha);
            }
        `;

        const particleGeom = new THREE.BufferGeometry();
        const uvs = new Float32Array(PARTICLE_COUNT * 2);
        const dummyPos = new Float32Array(PARTICLE_COUNT * 3);
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const ix = i % SIM_RES;
            const iy = Math.floor(i / SIM_RES);
            uvs[i * 2 + 0] = (ix + 0.5) / SIM_RES;
            uvs[i * 2 + 1] = (iy + 0.5) / SIM_RES;
        }
        particleGeom.setAttribute('aUv', new THREE.BufferAttribute(uvs, 2));
        particleGeom.setAttribute('position', new THREE.BufferAttribute(dummyPos, 3));

        const particleMat = new THREE.ShaderMaterial({
            vertexShader: particleVertexShader,
            fragmentShader: particleFragmentShader,
            uniforms: {
                uPosTex: { value: currentPosTex },
                uTime: { value: 0.0 },
                // Default particle point size scale (user-tuned)
                uPointScale: { value: 20.0 },
                // Particle color controller (tuning)
                uParticleColor: { value: new THREE.Vector3(0.341, 0.4, 0.478) },
                uParticleAlpha: { value: 0.39 },
                uAlphaMultiplier: { value: 1.0 },
                uGlowPower: { value: 1.41 },
                uGlowSoftness: { value: 2.41 },
                uGlowCore: { value: 0.37 },
            },
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        const particles = new THREE.Points(particleGeom, particleMat);
        scene.add(particles);

        // Particle color controller (exposed for tuning)
        const particleColorDefaults = {
            r: 0.341,
            g: 0.4,
            b: 0.478,
            alpha: 0.39,
            glowPower: 1.41,
            glowSoftness: 2.41,
            glowCore: 0.37,
        };

        const clamp01 = (v) => Math.min(1, Math.max(0, v));

        const rgbToHex = (r, g, b) => {
            const toHex = (x) =>
                Math.round(clamp01(x) * 255).toString(16).padStart(2, '0');
            return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
        };

        const hexToRgb = (hex) => {
            const h = String(hex).replace('#', '').trim();
            if (h.length === 3) {
                const r = parseInt(h[0] + h[0], 16);
                const g = parseInt(h[1] + h[1], 16);
                const b = parseInt(h[2] + h[2], 16);
                return [r / 255, g / 255, b / 255];
            }

            const r = parseInt(h.slice(0, 2), 16);
            const g = parseInt(h.slice(2, 4), 16);
            const b = parseInt(h.slice(4, 6), 16);
            return [r / 255, g / 255, b / 255];
        };

        const particleColorCtrl = document.createElement('div');
        particleColorCtrl.id = 'particle-color-controller';
        particleColorCtrl.innerHTML = `
            <div class="row">
                <label for="dbg-particleColor">
                    <span>particleColor</span>
                    <span id="dbg-particleColor-val"></span>
                </label>
                <input id="dbg-particleColor" type="color" value="${rgbToHex(
                    particleColorDefaults.r,
                    particleColorDefaults.g,
                    particleColorDefaults.b
                )}" />
            </div>
            <div class="row">
                <label for="dbg-particleAlpha">
                    <span>particleAlpha</span>
                    <span id="dbg-particleAlpha-val"></span>
                </label>
                <input
                    id="dbg-particleAlpha"
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value="${particleColorDefaults.alpha}"
                />
            </div>
            <div class="row">
                <label for="dbg-particleGlowPower">
                    <span>glowPower</span>
                    <span id="dbg-particleGlowPower-val"></span>
                </label>
                <input
                    id="dbg-particleGlowPower"
                    type="range"
                    min="0"
                    max="2"
                    step="0.01"
                    value="${particleColorDefaults.glowPower}"
                />
            </div>
            <div class="row">
                <label for="dbg-particleGlowSoftness">
                    <span>glowSoftness</span>
                    <span id="dbg-particleGlowSoftness-val"></span>
                </label>
                <input
                    id="dbg-particleGlowSoftness"
                    type="range"
                    min="0.2"
                    max="6"
                    step="0.01"
                    value="${particleColorDefaults.glowSoftness}"
                />
            </div>
            <div class="row">
                <label for="dbg-particleGlowCore">
                    <span>glowCore</span>
                    <span id="dbg-particleGlowCore-val"></span>
                </label>
                <input
                    id="dbg-particleGlowCore"
                    type="range"
                    min="0"
                    max="2"
                    step="0.01"
                    value="${particleColorDefaults.glowCore}"
                />
            </div>
            <div class="row row--btn">
                <button id="dbg-particleReset" type="button">Reset</button>
            </div>
        `;
        document.body.appendChild(particleColorCtrl);

        // Hide debug panels by default; press "g" to toggle them.
        let debugPanelsVisible = false;
        const setDebugPanelsVisible = (visible) => {
            debugPanelsVisible = visible;
            if (visible) {
                debugUI.style.setProperty('display', 'block', 'important');
                particleColorCtrl.style.display = 'block';
            } else {
                debugUI.style.setProperty('display', 'none', 'important');
                particleColorCtrl.style.display = 'none';
            }
        };
        setDebugPanelsVisible(false);

        document.addEventListener('keydown', (event) => {
            if (event.key.toLowerCase() !== 'g' || event.repeat) return;

            const target = event.target;
            if (
                target instanceof HTMLElement &&
                (target.tagName === 'INPUT' ||
                    target.tagName === 'TEXTAREA' ||
                    target.isContentEditable)
            ) {
                return;
            }

            setDebugPanelsVisible(!debugPanelsVisible);
        });

        const particleColorInputEl = particleColorCtrl.querySelector('#dbg-particleColor');
        const particleAlphaInputEl = particleColorCtrl.querySelector('#dbg-particleAlpha');
        const particleGlowPowerInputEl = particleColorCtrl.querySelector('#dbg-particleGlowPower');
        const particleGlowSoftnessInputEl = particleColorCtrl.querySelector('#dbg-particleGlowSoftness');
        const particleGlowCoreInputEl = particleColorCtrl.querySelector('#dbg-particleGlowCore');
        const particleColorValEl = particleColorCtrl.querySelector('#dbg-particleColor-val');
        const particleAlphaValEl = particleColorCtrl.querySelector('#dbg-particleAlpha-val');
        const particleGlowPowerValEl = particleColorCtrl.querySelector('#dbg-particleGlowPower-val');
        const particleGlowSoftnessValEl = particleColorCtrl.querySelector('#dbg-particleGlowSoftness-val');
        const particleGlowCoreValEl = particleColorCtrl.querySelector('#dbg-particleGlowCore-val');
        const particleResetBtnEl = particleColorCtrl.querySelector('#dbg-particleReset');

        const updateParticleColorUI = () => {
            const c = particleMat.uniforms.uParticleColor.value;
            if (particleColorValEl) particleColorValEl.textContent = rgbToHex(c.x, c.y, c.z);
            if (particleAlphaValEl)
                particleAlphaValEl.textContent = particleMat.uniforms.uParticleAlpha.value.toFixed(2);
            if (particleGlowPowerValEl)
                particleGlowPowerValEl.textContent = particleMat.uniforms.uGlowPower.value.toFixed(2);
            if (particleGlowSoftnessValEl)
                particleGlowSoftnessValEl.textContent = particleMat.uniforms.uGlowSoftness.value.toFixed(2);
            if (particleGlowCoreValEl)
                particleGlowCoreValEl.textContent = particleMat.uniforms.uGlowCore.value.toFixed(2);
        };

        const applyParticleColor = (r, g, b) => {
            particleMat.uniforms.uParticleColor.value.set(r, g, b);
            updateParticleColorUI();
        };

        const applyParticleAlpha = (a) => {
            particleMat.uniforms.uParticleAlpha.value = clamp01(a);
            updateParticleColorUI();
        };

        const applyGlowPower = (v) => {
            particleMat.uniforms.uGlowPower.value = Math.min(2, Math.max(0, v));
            updateParticleColorUI();
        };

        const applyGlowSoftness = (v) => {
            particleMat.uniforms.uGlowSoftness.value = Math.min(6, Math.max(0.2, v));
            updateParticleColorUI();
        };

        const applyGlowCore = (v) => {
            particleMat.uniforms.uGlowCore.value = Math.min(2, Math.max(0, v));
            updateParticleColorUI();
        };

        particleColorInputEl?.addEventListener('input', () => {
            const [r, g, b] = hexToRgb(particleColorInputEl.value);
            applyParticleColor(r, g, b);
        });

        particleAlphaInputEl?.addEventListener('input', () => {
            applyParticleAlpha(parseFloat(particleAlphaInputEl.value));
        });

        particleGlowPowerInputEl?.addEventListener('input', () => {
            applyGlowPower(parseFloat(particleGlowPowerInputEl.value));
        });

        particleGlowSoftnessInputEl?.addEventListener('input', () => {
            applyGlowSoftness(parseFloat(particleGlowSoftnessInputEl.value));
        });

        particleGlowCoreInputEl?.addEventListener('input', () => {
            applyGlowCore(parseFloat(particleGlowCoreInputEl.value));
        });

        particleResetBtnEl?.addEventListener('click', () => {
            applyParticleColor(
                particleColorDefaults.r,
                particleColorDefaults.g,
                particleColorDefaults.b
            );
            applyParticleAlpha(particleColorDefaults.alpha);
            applyGlowPower(particleColorDefaults.glowPower);
            applyGlowSoftness(particleColorDefaults.glowSoftness);
            applyGlowCore(particleColorDefaults.glowCore);

            if (particleColorInputEl)
                particleColorInputEl.value = rgbToHex(
                    particleColorDefaults.r,
                    particleColorDefaults.g,
                    particleColorDefaults.b
                );
            if (particleAlphaInputEl) particleAlphaInputEl.value = String(particleColorDefaults.alpha);
            if (particleGlowPowerInputEl)
                particleGlowPowerInputEl.value = String(particleColorDefaults.glowPower);
            if (particleGlowSoftnessInputEl)
                particleGlowSoftnessInputEl.value = String(particleColorDefaults.glowSoftness);
            if (particleGlowCoreInputEl) particleGlowCoreInputEl.value = String(particleColorDefaults.glowCore);
        });

        // Expose a small controller for console tuning too.
        window.particleColorController = {
            setColorHex: (hex) => {
                const [r, g, b] = hexToRgb(hex);
                applyParticleColor(r, g, b);
                if (particleColorInputEl) particleColorInputEl.value = rgbToHex(r, g, b);
            },
            setAlpha: (alpha) => {
                const a = clamp01(alpha);
                if (particleAlphaInputEl) particleAlphaInputEl.value = String(a);
                applyParticleAlpha(a);
            },
            setGlowPower: (value) => {
                const v = Math.min(2, Math.max(0, value));
                if (particleGlowPowerInputEl) particleGlowPowerInputEl.value = String(v);
                applyGlowPower(v);
            },
            setGlowSoftness: (value) => {
                const v = Math.min(6, Math.max(0.2, value));
                if (particleGlowSoftnessInputEl) particleGlowSoftnessInputEl.value = String(v);
                applyGlowSoftness(v);
            },
            setGlowCore: (value) => {
                const v = Math.min(2, Math.max(0, value));
                if (particleGlowCoreInputEl) particleGlowCoreInputEl.value = String(v);
                applyGlowCore(v);
            },
            reset: () => {
                particleResetBtnEl?.click();
            },
            getState: () => ({
                color: particleMat.uniforms.uParticleColor.value.clone(),
                alpha: particleMat.uniforms.uParticleAlpha.value,
                glowPower: particleMat.uniforms.uGlowPower.value,
                glowSoftness: particleMat.uniforms.uGlowSoftness.value,
                glowCore: particleMat.uniforms.uGlowCore.value,
            }),
        };

        updateParticleColorUI();

        // Controller events (live tuning)
        targetMaxDimEl.addEventListener('input', () => {
            renderDebugVals();
            simUniforms.uTargetScale.value = getTargetMaxDim();
        });

        initRotXEl.addEventListener('input', () => {
            renderDebugVals();
            simUniforms.uRotX.value = getInitRotX();
        });

        initRotYEl.addEventListener('input', () => {
            renderDebugVals();
            simUniforms.uRotY.value = getInitRotY();
        });

        debugUI.querySelector('#dbg-reset')?.addEventListener('click', () => {
            targetMaxDimEl.value = '6';
            initRotXEl.value = '0';
            initRotYEl.value = '0';
            renderDebugVals();
            simUniforms.uTargetScale.value = getTargetMaxDim();
            simUniforms.uRotX.value = getInitRotX();
            simUniforms.uRotY.value = getInitRotY();
        });

        // Mouse + scroll -> shader uniforms
        let mouseX = 0;
        let mouseY = 0;
        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -((event.clientY / window.innerHeight) * 2 - 1);
        });

        if (!THREE.OBJLoader) {
            // eslint-disable-next-line no-console
            console.warn('THREE.OBJLoader is missing. Include OBJLoader.js in the HTML.');
        } else {
            const loader = new THREE.OBJLoader();
            loader.load(
                objUrl,
                (obj) => {
                    obj.updateMatrixWorld(true);

                    let mesh = null;
                    obj.traverse((child) => {
                        if (!mesh && child.isMesh && child.geometry && child.geometry.attributes && child.geometry.attributes.position) {
                            mesh = child;
                        }
                    });
                    if (!mesh) return;

                    const box = new THREE.Box3().setFromObject(obj);
                    const center = box.getCenter(new THREE.Vector3());
                    const size = box.getSize(new THREE.Vector3());
                    const maxDim = Math.max(size.x, size.y, size.z) || 1;

                    const posAttr = mesh.geometry.attributes.position;
                    const vertexCount = posAttr.count;
                    const mat = obj.matrixWorld;
                    const tmpV = new THREE.Vector3();

                    const targetArr = new Float32Array(PARTICLE_COUNT * 4);
                    const initArr = new Float32Array(PARTICLE_COUNT * 4);

                    const jitter = 0.35;
                    for (let i = 0; i < PARTICLE_COUNT; i++) {
                        const idx = Math.floor(Math.random() * vertexCount);
                        tmpV.set(posAttr.getX(idx), posAttr.getY(idx), posAttr.getZ(idx));
                        tmpV.applyMatrix4(mat).sub(center).divideScalar(maxDim);

                        const o = i * 4;
                        targetArr[o + 0] = tmpV.x;
                        targetArr[o + 1] = tmpV.y;
                        targetArr[o + 2] = tmpV.z;
                        targetArr[o + 3] = 1.0;

                        initArr[o + 0] = tmpV.x + (Math.random() - 0.5) * jitter;
                        initArr[o + 1] = tmpV.y + (Math.random() - 0.5) * jitter;
                        initArr[o + 2] = tmpV.z + (Math.random() - 0.5) * jitter;
                        initArr[o + 3] = 1.0;
                    }

                    targetTex = new THREE.DataTexture(targetArr, SIM_RES, SIM_RES, THREE.RGBAFormat, dataType);
                    targetTex.needsUpdate = true;
                    targetTex.minFilter = THREE.NearestFilter;
                    targetTex.magFilter = THREE.NearestFilter;
                    targetTex.generateMipmaps = false;

                    currentPosTex = new THREE.DataTexture(initArr, SIM_RES, SIM_RES, THREE.RGBAFormat, dataType);
                    currentPosTex.needsUpdate = true;
                    currentPosTex.minFilter = THREE.NearestFilter;
                    currentPosTex.magFilter = THREE.NearestFilter;
                    currentPosTex.generateMipmaps = false;

                    simUniforms.uTargetTex.value = targetTex;
                    simUniforms.uPosTex.value = currentPosTex;
                    particleMat.uniforms.uPosTex.value = currentPosTex;

                    // Reset ping-pong flow.
                    simUniforms.uRotX.value = getInitRotX();
                    simUniforms.uRotY.value = getInitRotY();
                    simUniforms.uTargetScale.value = getTargetMaxDim();

                    // Ensure the animation loop starts reading the new textures.
                    readTex = currentPosTex;
                    writeRT = rtA;

                    // eslint-disable-next-line no-console
                    console.log('OBJ -> particle target texture ready.');
                },
                undefined,
                (err) => {
                    // eslint-disable-next-line no-console
                    console.error('Failed to load OBJ model:', err);
                }
            );
        }

        const threeClock = new THREE.Clock();
        let writeRT = rtA;
        let readTex = currentPosTex;

        function animate() {
            requestAnimationFrame(animate);

            const elapsedTime = threeClock.getElapsedTime();
            const scrollY = window.scrollY || window.pageYOffset || 0;
            const scrollProgress = Math.min(
                1,
                Math.max(
                    0,
                    (scrollY - pointCloudScrollMotion.triggerScrollPx) /
                        pointCloudScrollMotion.travelScrollPx
                )
            );
            let bannerCenterProgress = 0;
            if (landingBannerBodyEl) {
                const rect = landingBannerBodyEl.getBoundingClientRect();
                const bannerCenterY = rect.top + rect.height * 0.5;
                const viewportCenterY = window.innerHeight * 0.5;
                const maxDistance = window.innerHeight * 0.5;
                bannerCenterProgress = Math.min(
                    1,
                    Math.max(
                        0,
                        1 - Math.abs(bannerCenterY - viewportCenterY) / maxDistance
                    )
                );
            }

            // Ouvre title + subheader: fade as `.system-banner` rises; ~transparent by banner top ≈ 265px.
            if (heroTitleWrapperEl && landingSystemBannerEl) {
                const sy = window.scrollY || window.pageYOffset || 0;
                const bannerTop = landingSystemBannerEl.getBoundingClientRect().top;
                const fadeEndPx = 265;
                const minHeroOpacity = 0.06;
                if (landingHeroFadeBannerTopAtRest == null) {
                    landingHeroFadeBannerTopAtRest =
                        sy < 8 ? bannerTop : fadeEndPx + 340;
                }
                const fadeStartPx = Math.max(landingHeroFadeBannerTopAtRest, fadeEndPx + 40);
                let heroOpacity = 1;
                if (bannerTop <= fadeEndPx) {
                    heroOpacity = minHeroOpacity;
                } else if (bannerTop < fadeStartPx) {
                    const u =
                        (bannerTop - fadeEndPx) / (fadeStartPx - fadeEndPx);
                    heroOpacity =
                        minHeroOpacity + (1 - minHeroOpacity) * u;
                }
                heroTitleWrapperEl.style.opacity = String(heroOpacity);
            }

            simUniforms.uTime.value = elapsedTime;
            particleMat.uniforms.uTime.value = elapsedTime;
            simUniforms.uMouse.value.set(mouseX, mouseY);
            simUniforms.uScrollOffset.value = -scrollY * 0.005;

            // Keep point cloud locked at viewport center while scrolling.
            particles.position.y = 0;
            particles.position.x = 0;
            const motionProgress = Math.max(scrollProgress, bannerCenterProgress);
            const cloudScale =
                1 -
                (1 - pointCloudScrollMotion.minScale) *
                    motionProgress;
            particles.scale.setScalar(cloudScale);
            particleMat.uniforms.uAlphaMultiplier.value = 1 - Math.pow(motionProgress, 1.6);

            if (scrollBgVideoEl) {
                const t = motionProgress;
                const s =
                    1 - (1 - scrollVideoMotion.minScale) * t;
                const tz = scrollVideoMotion.maxTranslateZ * t;
                const ty = window.innerHeight * scrollVideoMotion.translateYFactor * t;
                const te = Math.min(1, Math.max(0, t));
                const opacityEase = scrollVideoMotion.opacityEase;
                const fade = 1 - Math.pow(te, opacityEase);
                const op =
                    scrollVideoMotion.opacityBottom +
                    (scrollVideoMotion.opacityTop - scrollVideoMotion.opacityBottom) * fade;
                scrollBgVideoEl.style.transform = `translateY(${ty}px) translateZ(${tz}px) scale(${s})`;
                scrollBgVideoEl.style.opacity = String(op);
                const maskT = te;
                const mCore =
                    scrollVideoMotion.maskCoreTop -
                    maskT *
                        (scrollVideoMotion.maskCoreTop -
                            scrollVideoMotion.maskCoreBottom);
                const mEx =
                    scrollVideoMotion.maskEllipseXTop -
                    maskT *
                        (scrollVideoMotion.maskEllipseXTop -
                            scrollVideoMotion.maskEllipseXBottom);
                const mEy =
                    scrollVideoMotion.maskEllipseYTop -
                    maskT *
                        (scrollVideoMotion.maskEllipseYTop -
                            scrollVideoMotion.maskEllipseYBottom);
                scrollBgVideoEl.style.setProperty(
                    '--video-mask-core',
                    `${mCore.toFixed(2)}%`
                );
                scrollBgVideoEl.style.setProperty(
                    '--video-mask-ex',
                    `${mEx.toFixed(2)}%`
                );
                scrollBgVideoEl.style.setProperty(
                    '--video-mask-ey',
                    `${mEy.toFixed(2)}%`
                );
            }

            simUniforms.uPosTex.value = readTex;
            renderer.setRenderTarget(writeRT);
            renderer.render(simScene, simCamera);
            renderer.setRenderTarget(null);

            readTex = writeRT.texture;
            writeRT = (writeRT === rtA) ? rtB : rtA;

            particleMat.uniforms.uPosTex.value = readTex;
            renderer.render(scene, camera);
        }

        animate();

        window.addEventListener('resize', () => {
            if ((window.scrollY || window.pageYOffset || 0) < 8) {
                landingHeroFadeBannerTopAtRest = null;
            }
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
        } else {
        function animateWithoutPointCloud() {
            requestAnimationFrame(animateWithoutPointCloud);

            const scrollY = window.scrollY || window.pageYOffset || 0;
            const scrollProgress = Math.min(
                1,
                Math.max(
                    0,
                    (scrollY - pointCloudScrollMotion.triggerScrollPx) /
                        pointCloudScrollMotion.travelScrollPx
                )
            );
            let bannerCenterProgress = 0;
            if (landingBannerBodyEl) {
                const rect = landingBannerBodyEl.getBoundingClientRect();
                const bannerCenterY = rect.top + rect.height * 0.5;
                const viewportCenterY = window.innerHeight * 0.5;
                const maxDistance = window.innerHeight * 0.5;
                bannerCenterProgress = Math.min(
                    1,
                    Math.max(
                        0,
                        1 - Math.abs(bannerCenterY - viewportCenterY) / maxDistance
                    )
                );
            }

            if (heroTitleWrapperEl && landingSystemBannerEl) {
                const sy = window.scrollY || window.pageYOffset || 0;
                const bannerTop = landingSystemBannerEl.getBoundingClientRect().top;
                const fadeEndPx = 265;
                const minHeroOpacity = 0.06;
                if (landingHeroFadeBannerTopAtRest == null) {
                    landingHeroFadeBannerTopAtRest =
                        sy < 8 ? bannerTop : fadeEndPx + 340;
                }
                const fadeStartPx = Math.max(landingHeroFadeBannerTopAtRest, fadeEndPx + 40);
                let heroOpacity = 1;
                if (bannerTop <= fadeEndPx) {
                    heroOpacity = minHeroOpacity;
                } else if (bannerTop < fadeStartPx) {
                    const u =
                        (bannerTop - fadeEndPx) / (fadeStartPx - fadeEndPx);
                    heroOpacity =
                        minHeroOpacity + (1 - minHeroOpacity) * u;
                }
                heroTitleWrapperEl.style.opacity = String(heroOpacity);
            }

            const motionProgress = Math.max(scrollProgress, bannerCenterProgress);

            if (scrollBgVideoEl) {
                const t = motionProgress;
                const s =
                    1 - (1 - scrollVideoMotion.minScale) * t;
                const tz = scrollVideoMotion.maxTranslateZ * t;
                const ty = window.innerHeight * scrollVideoMotion.translateYFactor * t;
                const te = Math.min(1, Math.max(0, t));
                const opacityEase = scrollVideoMotion.opacityEase;
                const fade = 1 - Math.pow(te, opacityEase);
                const op =
                    scrollVideoMotion.opacityBottom +
                    (scrollVideoMotion.opacityTop - scrollVideoMotion.opacityBottom) * fade;
                scrollBgVideoEl.style.transform = `translateY(${ty}px) translateZ(${tz}px) scale(${s})`;
                scrollBgVideoEl.style.opacity = String(op);
                const maskT = te;
                const mCore =
                    scrollVideoMotion.maskCoreTop -
                    maskT *
                        (scrollVideoMotion.maskCoreTop -
                            scrollVideoMotion.maskCoreBottom);
                const mEx =
                    scrollVideoMotion.maskEllipseXTop -
                    maskT *
                        (scrollVideoMotion.maskEllipseXTop -
                            scrollVideoMotion.maskEllipseXBottom);
                const mEy =
                    scrollVideoMotion.maskEllipseYTop -
                    maskT *
                        (scrollVideoMotion.maskEllipseYTop -
                            scrollVideoMotion.maskEllipseYBottom);
                scrollBgVideoEl.style.setProperty(
                    '--video-mask-core',
                    `${mCore.toFixed(2)}%`
                );
                scrollBgVideoEl.style.setProperty(
                    '--video-mask-ex',
                    `${mEx.toFixed(2)}%`
                );
                scrollBgVideoEl.style.setProperty(
                    '--video-mask-ey',
                    `${mEy.toFixed(2)}%`
                );
            }
        }

        animateWithoutPointCloud();

        window.addEventListener('resize', () => {
            if ((window.scrollY || window.pageYOffset || 0) < 8) {
                landingHeroFadeBannerTopAtRest = null;
            }
        });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onReady);
    } else {
        onReady();
    }
})();


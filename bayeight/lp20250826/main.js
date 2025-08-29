// ========== 1) UTM を hidden に格納 ==========
(function () {
    const qs = new URLSearchParams(location.search);
    const utmS = document.getElementById('utm_source');
    const utmC = document.getElementById('utm_campaign');
    if (utmS && qs.get('utm_source')) utmS.value = qs.get('utm_source');
    if (utmC && qs.get('utm_campaign')) utmC.value = qs.get('utm_campaign');
})();

// ========== 2) #form へのスムーススクロール ==========
(function () {
    document.querySelectorAll('a.cta-link[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const id = a.getAttribute('href').slice(1);
            const el = document.getElementById(id);
            if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        });
    });
})();

// ========== 3) 日本語バリデーション（FormSubmitにそのままPOST） ==========
(function () {
    const form = document.getElementById('lead-form');
    if (!form) return;

    const btn = form.querySelector('.submit-btn');

    const fields = {
        name: form.querySelector('input[name="name"]'),
        email: form.querySelector('input[name="email"]'),
        phone: form.querySelector('input[name="phone"]'),
        grade: form.querySelector('select[name="grade"]'),
        message: form.querySelector('textarea[name="message"]')
    };

    function showError(el, msg) {
        const wrap = el.closest('label') || el.parentElement || el;
        wrap.classList.add('err');
        let m = wrap.querySelector('.err-msg');
        if (!m) { m = document.createElement('p'); m.className = 'err-msg'; wrap.appendChild(m); }
        m.textContent = msg;
        el.setAttribute('aria-invalid', 'true');
    }
    function clearError(el) {
        const wrap = el.closest('label') || el.parentElement || el;
        wrap.classList.remove('err');
        const m = wrap.querySelector('.err-msg');
        if (m) m.remove();
        el.removeAttribute('aria-invalid');
        if (typeof el.setCustomValidity === 'function') el.setCustomValidity('');
    }
    function validateField(el) {
        if (!el) return true;
        clearError(el);
        const name = el.name;
        const val = (el.value || '').trim();

        if (name === 'name' && !val) { showError(el, 'お名前は必須です'); return false; }
        if (name === 'grade' && !val) { showError(el, '学年を選択してください'); return false; }
        if (name === 'email') {
            if (!val) { showError(el, 'メールアドレスは必須です'); return false; }
            if (el.validity && el.validity.typeMismatch) { showError(el, '有効なメールアドレスを入力してください'); return false; }
        }
        if (name === 'phone') {
            if (!val) { showError(el, '電話番号は必須です'); return false; }
            if (el.validity && (el.validity.patternMismatch || el.validity.tooShort || el.validity.tooLong)) {
                showError(el, '電話番号を正しく入力してください（例：080-1234-5678）'); return false;
            }
        }
        return true;
    }

    Object.values(fields).forEach(el => {
        if (!el) return;
        el.addEventListener('blur', () => validateField(el));
        el.addEventListener('input', () => clearError(el));
        el.addEventListener('change', () => clearError(el));
    });

    // ★ここがポイント：OKならそのままネイティブsubmit → FormSubmitへPOST
    form.addEventListener('submit', (e) => {
        const order = [fields.name, fields.grade, fields.phone, fields.email];
        let firstInvalid = null;
        order.forEach(el => { if (!validateField(el) && !firstInvalid) firstInvalid = el; });
        if (firstInvalid) {
            e.preventDefault();
            try { firstInvalid.focus({ preventScroll: false }); } catch { }
            if (typeof firstInvalid.reportValidity === 'function') firstInvalid.reportValidity();
            return;
        }
        // 送信中UIだけ
        if (btn) { btn.disabled = true; btn.textContent = '送信中…'; }
        // e.preventDefault() はしない（FormSubmit に飛ばす）
    });
})();

// ========== 4) ヒーローの回転ワード ==========
(function () {
    const el = document.getElementById('hero-rotate');
    if (!el) return;
    const words = ['合格設計', '週次コーチング', '学習習慣化'];
    let i = 0;
    setInterval(() => {
        i = (i + 1) % words.length;
        el.style.opacity = 0;
        setTimeout(() => { el.textContent = words[i]; el.style.opacity = 1; }, 200);
    }, 1800);
})();

// ========== 5) スクロールでふわっと表示 ==========
(function () {
    const targets = Array.from(document.querySelectorAll('[data-reveal]'));
    if (!('IntersectionObserver' in window) || targets.length === 0) {
        targets.forEach(t => t.classList.add('is-in')); return;
    }
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-in'); });
    }, { threshold: 0.1 });
    targets.forEach(t => io.observe(t));
})();

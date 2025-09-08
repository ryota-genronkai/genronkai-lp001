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

// ========== 3) 日本語バリデーション + FormSubmitへPOST(ajax) & 自前リダイレクト ==========
(function () {
    const form = document.getElementById('lead-form');
    if (!form) return;

    const btn = form.querySelector('.submit-btn');

    // 既存のバリデーション関数（showError/clearError/validateField）がある前提
    // ない場合は、最低限：return true; で通してOK

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // ← 自前送信に切替

        // 最低限のチェック（必要ならあなたの validate を使う）
        const name = form.querySelector('input[name="name"]');
        const grade = form.querySelector('select[name="grade"]');
        const phone = form.querySelector('input[name="phone"]');
        const email = form.querySelector('input[name="email"]');
        if (!name.value.trim() || !grade.value || !phone.value.trim() || !email.value.trim()) {
            alert('未入力の必須項目があります。');
            return;
        }

        if (btn) { btn.disabled = true; btn.textContent = '送信中…'; }

        try {
            const fd = new FormData(form); // hidden(_next/_subject/_captcha 等)も全部送られる
            const res = await fetch(form.action, {
                method: 'POST',
                body: fd,
                headers: { 'Accept': 'application/json' } // ← JSON応答を要求（CORS可）
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            // 成功：自前で thanks.html へ
            window.location.replace('/thanks.html');
        } catch (err) {
            console.error(err);
            alert('送信に失敗しました。時間をおいて再度お試しください。');
            if (btn) { btn.disabled = false; btn.textContent = '送信する'; }
        }
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

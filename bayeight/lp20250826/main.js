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

// ========== 3) 日本語バリデーション & fetch送信 ==========
(function () {
    const form = document.getElementById('lead-form');
    if (!form) return;

    const toast = document.getElementById('form-toast');
    const btn = form.querySelector('.submit-btn');

    // --- カスタムメッセージ設定 ---
    const fields = {
        name: form.querySelector('input[name="name"]'),
        email: form.querySelector('input[name="email"]'),
        phone: form.querySelector('input[name="phone"]'),
        grade: form.querySelector('select[name="grade"]')
    };
    const setMsg = (el, msg) => el && el.setCustomValidity(msg || '');

    Object.values(fields).forEach(el => {
        if (!el) return;
        el.addEventListener('invalid', () => {
            if (el.name === 'email') {
                setMsg(el, el.validity.valueMissing ? 'メールアドレスは必須です' : '有効なメールアドレスを入力してください');
            } else if (el.name === 'phone') {
                setMsg(el, el.validity.valueMissing ? '電話番号は必須です' : '電話番号を正しく入力してください（例：080-1234-5678）');
            } else if (el.tagName === 'SELECT') {
                setMsg(el, '学年を選択してください');
            } else if (el.name === 'name') {
                setMsg(el, 'お名前は必須です');
            }
        });
        el.addEventListener('input', () => setMsg(el, ''));
        el.addEventListener('change', () => setMsg(el, ''));
    });

    // --- 送信 ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // ネイティブ検証（メッセージは上で上書き）
        if (!form.reportValidity()) {
            const firstInvalid = form.querySelector(':invalid');
            if (firstInvalid) firstInvalid.focus();
            return;
        }

        // 状態：送信中
        const originalLabel = btn ? btn.textContent : '';
        if (btn) { btn.disabled = true; btn.textContent = '送信中…'; }

        try {
            // form -> x-www-form-urlencoded
            const fd = new FormData(form);
            const body = new URLSearchParams();
            for (const [k, v] of fd.entries()) body.append(k, v);

            const res = await fetch('/api/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
                body
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            // 成功処理
            form.reset();
            if (toast) {
                toast.hidden = false;
                // トーストを見える位置へ（任意）
                try { toast.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch { }
                setTimeout(() => (toast.hidden = true), 3000);
            }
        } catch (err) {
            console.error(err);
            alert('送信に失敗しました。時間をおいて再度お試しください。');
        } finally {
            if (btn) { btn.disabled = false; btn.textContent = originalLabel; }
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

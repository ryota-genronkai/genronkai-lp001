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

    // 対象フィールド
    const fields = {
        name: form.querySelector('input[name="name"]'),
        email: form.querySelector('input[name="email"]'),
        phone: form.querySelector('input[name="phone"]'),
        grade: form.querySelector('select[name="grade"]'),
        message: form.querySelector('textarea[name="message"]') // 任意
    };

    // ------- エラーメッセージの生成/削除 -------
    function showError(el, msg) {
        const wrap = el.closest('label') || el.parentElement || el;
        wrap.classList.add('err');
        let m = wrap.querySelector('.err-msg');
        if (!m) {
            m = document.createElement('p');
            m.className = 'err-msg';
            wrap.appendChild(m);
        }
        m.textContent = msg;
        el.setAttribute('aria-invalid', 'true');
    }
    function clearError(el) {
        const wrap = el.closest('label') || el.parentElement || el;
        wrap.classList.remove('err');
        const m = wrap.querySelector('.err-msg');
        if (m) m.remove();
        el.removeAttribute('aria-invalid');
        // ネイティブ検証メッセージも消しておく
        if (typeof el.setCustomValidity === 'function') el.setCustomValidity('');
    }

    // ------- 個別バリデータ -------
    function validateField(el) {
        if (!el) return true;
        clearError(el); // 先にクリア

        const name = el.name;
        const val = (el.value || '').trim();

        if (name === 'name') {
            if (!val) {
                showError(el, 'お名前は必須です');
                return false;
            }
            return true;
        }

        if (name === 'grade') {
            if (!val) {
                showError(el, '学年を選択してください');
                return false;
            }
            return true;
        }

        if (name === 'email') {
            if (!val) {
                showError(el, 'メールアドレスは必須です');
                return false;
            }
            // ブラウザの型判定
            if (el.validity && el.validity.typeMismatch) {
                showError(el, '有効なメールアドレスを入力してください');
                return false;
            }
            return true;
        }

        if (name === 'phone') {
            if (!val) {
                showError(el, '電話番号は必須です');
                return false;
            }
            // pattern（HTML側のpatternを尊重）
            if (el.validity && (el.validity.patternMismatch || el.validity.tooShort || el.validity.tooLong)) {
                showError(el, '電話番号を正しく入力してください（例：080-1234-5678）');
                return false;
            }
            return true;
        }

        // 任意項目など
        return true;
    }

    // blurで逐次チェック、input/changeでエラー解除
    Object.values(fields).forEach(el => {
        if (!el) return;
        el.addEventListener('blur', () => validateField(el));
        el.addEventListener('input', () => clearError(el));
        el.addEventListener('change', () => clearError(el));
    });

    // ------- 送信 -------
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // 自動送信は止める（novalidate運用）

        // 1) 全項目検証
        const order = [fields.name, fields.grade, fields.phone, fields.email]; // フォーカス優先
        let firstInvalid = null;
        order.forEach(el => {
            const ok = validateField(el);
            if (!ok && !firstInvalid) firstInvalid = el;
        });
        if (firstInvalid) {
            try { firstInvalid.focus({ preventScroll: false }); } catch { }
            // ネイティブの吹き出しも出す場合は↓（Safari等で出ない環境あり）
            if (typeof firstInvalid.reportValidity === 'function') firstInvalid.reportValidity();
            return;
        }

        // 2) 状態：送信中
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
            // 全てのエラー表示を消す
            Object.values(fields).forEach(clearError);

            if (toast) {
                toast.hidden = false;
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

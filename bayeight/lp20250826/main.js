// UTM を hidden に格納
(function () {
    const qs = new URLSearchParams(location.search);
    const utmS = document.getElementById('utm_source');
    const utmC = document.getElementById('utm_campaign');
    if (utmS && qs.get('utm_source')) utmS.value = qs.get('utm_source');
    if (utmC && qs.get('utm_campaign')) utmC.value = qs.get('utm_campaign');
})();

// 送信トースト（hidden iframe 受信で表示）
(function () {
    const form = document.getElementById('lead-form');
    const toast = document.getElementById('form-toast');
    const hidden = document.getElementById('hidden_iframe');

    if (form && hidden && toast) {
        form.addEventListener('submit', () => {
            const btn = form.querySelector('.submit-btn');
            if (btn) { btn.disabled = true; btn.textContent = '送信中…'; }
        });
        hidden.addEventListener('load', () => {
            if (toast.hasAttribute('hidden')) toast.removeAttribute('hidden');
            setTimeout(() => toast.setAttribute('hidden', ''), 3500);
            form.reset();
            const btn = form.querySelector('.submit-btn');
            if (btn) { btn.disabled = false; btn.textContent = '送信する'; }
        });
    }
})();

// #form へのスムーススクロール
(function () {
    document.querySelectorAll('a.cta-link[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const id = a.getAttribute('href').slice(1);
            const el = document.getElementById(id);
            if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        });
    });
})();

// ▼ 日本語のカスタムバリデーション
(function () {
    const form = document.getElementById('lead-form');
    if (!form) return;

    const fields = {
        name: form.querySelector('input[name="name"]'),
        email: form.querySelector('input[name="email"]'),
        phone: form.querySelector('input[name="phone"]'),
        grade: form.querySelector('select[name="grade"]')
    };

    const setMsg = (el, msg) => { el.setCustomValidity(msg || ''); };

    // 失敗時の日本語メッセージ
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

        // 入力時はエラー解除
        el.addEventListener('input', () => setMsg(el, ''));
        el.addEventListener('change', () => setMsg(el, ''));
    });

    // 送信前チェック（HTMLの novalidate と併用）
    form.addEventListener('submit', (e) => {
        if (!form.checkValidity()) {
            e.preventDefault();
            // 最初の不正項目へフォーカス
            const firstInvalid = form.querySelector(':invalid');
            if (firstInvalid) firstInvalid.focus();
        }
    });
})();

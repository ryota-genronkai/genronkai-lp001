// UTM を hidden に格納
(function () {
    const qs = new URLSearchParams(location.search);
    const utmS = document.getElementById('utm_source');
    const utmC = document.getElementById('utm_campaign');
    if (utmS && qs.get('utm_source')) utmS.value = qs.get('utm_source');
    if (utmC && qs.get('utm_campaign')) utmC.value = qs.get('utm_campaign');
})();

// 送信トースト制御（hidden iframe の onload で出す）
(function () {
    const form = document.getElementById('lead-form');
    const toast = document.getElementById('form-toast');
    const hidden = document.getElementById('hidden_iframe');

    if (form && hidden && toast) {
        form.addEventListener('submit', () => {
            // 連打防止
            const btn = form.querySelector('.submit-btn');
            if (btn) { btn.disabled = true; btn.textContent = '送信中…'; }
        });

        hidden.addEventListener('load', () => {
            // GAS応答を受け取ったら成功表示＆フォームリセット
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
            if (el) {
                e.preventDefault();
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
})();

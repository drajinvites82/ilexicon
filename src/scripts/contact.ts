// Contact form (spec §8.2): client-side checks, POST to /contact.php, error and success states.
const form = document.getElementById('contact-form') as HTMLFormElement | null;

if (form) {
  form.noValidate = true;
  const success = document.getElementById('cf-success') as HTMLElement;
  const sendError = document.getElementById('cf-send-error') as HTMLElement;
  const submit = form.querySelector<HTMLButtonElement>('button[type=submit]')!;
  const fields = ['name', 'email', 'interest', 'message'].map((n) => ({
    input: form.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(`#cf-${n}`)!,
    error: document.getElementById(`cf-${n}-error`) as HTMLElement,
  }));

  const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  const isValid = (el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) =>
    el.type === 'email' ? emailOk(el.value.trim()) : el.value.trim() !== '';

  const setError = (f: (typeof fields)[number], bad: boolean) => {
    f.error.hidden = !bad;
    if (bad) {
      f.input.setAttribute('aria-invalid', 'true');
      f.input.setAttribute('aria-describedby', f.error.id);
    } else {
      f.input.removeAttribute('aria-invalid');
      f.input.removeAttribute('aria-describedby');
    }
  };

  fields.forEach((f) => {
    f.input.addEventListener('blur', () => { if (!f.error.hidden) setError(f, !isValid(f.input)); });
    f.input.addEventListener('input', () => { if (!f.error.hidden && isValid(f.input)) setError(f, false); });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    sendError.hidden = true;

    const bad = fields.filter((f) => !isValid(f.input));
    fields.forEach((f) => setError(f, bad.includes(f)));
    if (bad.length) { bad[0].input.focus(); return; }

    const data = new FormData(form);
    // Honeypot: a filled "_gotcha" field means a bot. Pretend it worked and send nothing.
    if ((data.get('_gotcha') as string)?.trim()) { showSuccess(); return; }

    submit.disabled = true;
    submit.textContent = 'Sending…';
    try {
      const post = () => fetch(form.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      let res = await post();
      // HostGator's bot check answers PHP requests with 409 and a script that sets a cookie and
      // reloads. fetch can't run that script, so set the cookie it names and retry once.
      if (res.status === 409) {
        const cookie = /document\.cookie\s*=\s*"([^";]+)"/.exec(await res.text())?.[1];
        if (cookie) {
          document.cookie = `${cookie}; path=/; SameSite=Lax`;
          res = await post();
        }
      }
      if (res.status === 422) {
        // Server-side validation: show the same field errors the client uses (same copy).
        const { errors = {} } = (await res.json().catch(() => ({}))) as { errors?: Record<string, string> };
        const bad = fields.filter((f) => f.input.name in errors);
        if (!bad.length) throw new Error('422');
        fields.forEach((f) => setError(f, bad.includes(f)));
        bad[0].input.focus();
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
      showSuccess();
    } catch {
      sendError.hidden = false;
    } finally {
      submit.disabled = false;
      submit.textContent = 'Send';
    }
  });

  function showSuccess() {
    form!.hidden = true;
    success.hidden = false;
    success.focus();
  }
}

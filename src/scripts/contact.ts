// Contact form (spec §8.2): client-side checks, Formspree POST, error and success states.
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
    data.delete('_gotcha');
    data.set('_subject', `iLexicon enquiry: ${data.get('interest')}`);

    submit.disabled = true;
    submit.textContent = 'Sending…';
    try {
      const res = await fetch(form.dataset.endpoint || form.action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
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

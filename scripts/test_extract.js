const fs = require('fs');
(async () => {
  try {
    const file = fs.readFileSync('tmp/test.pdf');
    const form = new FormData();
    const blob = new Blob([file], { type: 'application/pdf' });
    form.append('file', blob, 'test.pdf');

    const res = await fetch('http://localhost:3000/api/extract', { method: 'POST', body: form });
    const json = await res.json();
    console.log('status', res.status);
    console.log(json);
  } catch (err) {
    console.error(err);
  }
})();
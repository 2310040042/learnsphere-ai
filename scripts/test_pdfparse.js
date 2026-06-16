const fs = require('fs');

async function run() {
  const buf = fs.readFileSync('tmp/test.pdf');
  try {
    const mod = await import('pdf-parse');
    const PDFParse = mod.PDFParse ?? mod.default ?? mod;

    if (typeof PDFParse === 'function') {
      // try constructor
      try {
        PDFParse.setWorker?.('pdfjs-dist/legacy/build/pdf.worker.mjs');
      } catch (e) {}

      const inst = new PDFParse({ data: buf });
      if (typeof inst.getText === 'function') {
        const res = await inst.getText();
        console.log('result:', res.text);
      } else {
        const res = await PDFParse(buf);
        console.log('result:', res.text);
      }
    } else {
      console.error('Unexpected pdf-parse export:', typeof PDFParse);
    }
  } catch (err) {
    console.error('pdf-parse test failed:', err);
  }
}

run();

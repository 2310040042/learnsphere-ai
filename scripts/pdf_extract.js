#!/usr/bin/env node
const fs = require('fs');

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error('No file provided');
    process.exit(2);
  }

  try {
    const data = fs.readFileSync(file);
    const pdfParse = require('pdf-parse');
    const res = await pdfParse(data);
    // Ensure only JSON is printed to stdout for the caller to parse.
    process.stdout.write(JSON.stringify({ text: res?.text ?? '' }));
  } catch (err) {
    console.error('pdf_extract error', String(err));
    process.exit(1);
  }
}

main();

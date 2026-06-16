import fs from "fs";
import path from "path";
import { tmpdir } from "os";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

export async function extractPdfText(data: Uint8Array | Buffer): Promise<string> {
  const buf = Buffer.isBuffer(data) ? data : Buffer.from(data);
  const tmpFile = path.join(tmpdir(), `pdf-upload-${Date.now()}-${Math.random().toString(36).slice(2)}.pdf`);
  try {
    await fs.promises.writeFile(tmpFile, buf);
    const script = path.join(process.cwd(), "scripts", "pdf_extract.js");
    const node = process.execPath || "node";
    const { stdout, stderr } = await execFileAsync(node, [script, tmpFile], { maxBuffer: 20 * 1024 * 1024 });

    if (stderr && String(stderr).trim()) {
      console.warn("pdf_extract stderr:", String(stderr).slice(0, 2000));
    }

    if (!stdout) throw new Error("No output from pdf extractor");

    try {
      const parsed = JSON.parse(stdout.toString());
      return parsed?.text ?? "";
    } catch (e) {
      // If helper printed raw text, return it directly
      return stdout.toString();
    }
  } finally {
    try { await fs.promises.unlink(tmpFile); } catch (e) {}
  }
}
import fs from 'fs-extra';
import path from 'path';

const MANIFEST_PATH = './docs-manifest.json';
const OUTPUT_BASE = './src/content/docs';

async function sync() {
  try {
    const manifest = await fs.readJson(MANIFEST_PATH);

    // --- PRE-PROCESS: Create a map for link replacement ---
    // This allows us to turn [Link](./01-intro.md) into [Link](./introduction)
    const linkMap = {};
    manifest.sync.forEach(entry => {
      const srcFileName = path.basename(entry.source); // e.g., "01-introduction.md"
      const destFileName = path.basename(entry.destination, '.md'); // e.g., "introduction"
      linkMap[srcFileName] = destFileName;
    });

    for (const entry of manifest.sync) {
      const srcPath = path.resolve(entry.source);
      const destPath = path.resolve(OUTPUT_BASE, entry.destination);

      if (!fs.existsSync(srcPath)) {
        console.warn(`❌ Missing source file: ${entry.source}`);
        continue;
      }

      let content = await fs.readFile(srcPath, 'utf-8');

      // --- 1. SMART LINK REWRITING ---
      // This regex handles: [text](path/to/file.md#anchor)
      content = content.replace(/\[([^\]]+)\]\(([^)]+)\.md(.*?)\)/g, (match, text, link, anchor) => {
        if (link.startsWith('http')) return match;

        // Get the filename being linked to (e.g., "01-introduction.md")
        const linkedFile = path.basename(link) + '.md';

        if (linkMap[linkedFile]) {
          // Point to the new clean filename. 
          // Since we move all spec files into one folder, we use './'
          return `[${text}](./${linkMap[linkedFile]}${anchor})`;
        }

        return match;
      });

      // --- 2. FRONTMATTER GENERATION ---
      const frontmatter = [
        '---',
        `title: "${entry.title}"`,
        `sidebar:`,
        `  order: ${entry.order || 99}`,
        entry.description ? `description: "${entry.description}"` : '',
        '---',
        '',
        ''
      ].filter(Boolean).join('\n');

      // --- 3. CLEANUP & WRITE ---
      // Remove the original # H1 from the markdown so Starlight doesn't show two titles
      const cleanContent = content.replace(/^#\s+.*$/m, '').trim();

      await fs.ensureDir(path.dirname(destPath));
      await fs.writeFile(destPath, frontmatter + cleanContent);
      
      console.log(`📑 Processed: ${entry.source} -> ${entry.destination}`);
    }

    console.log('\n✅ Documentation sync complete!');
  } catch (err) {
    console.error('🚀 Sync failed:', err);
  }
}

sync();
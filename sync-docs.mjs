import fs from 'fs-extra';
import path from 'path';

const MANIFEST_PATH = './spec-manifest.json';
const OUTPUT_BASE = './src/content/docs';

// Base URL for the "Edit this page" link pointing to the spec repo
const REPO_BASE_URL = 'https://github.com/open-outbox/spec/edit/main';

async function sync() {
  try {
    const manifest = await fs.readJson(MANIFEST_PATH);

    const linkMap = {};
    manifest.sync.forEach(entry => {
      const srcFileName = path.basename(entry.source);
      const destFileName = path.basename(entry.destination, '.md');
      linkMap[srcFileName] = destFileName;
    });

    for (const entry of manifest.sync) {
      const srcPath = path.resolve(entry.source);
      const destPath = path.resolve(OUTPUT_BASE, entry.destination);

      if (!fs.existsSync(srcPath)) {
        console.warn(`Missing source file: ${entry.source}`);
        continue;
      }

      let content = await fs.readFile(srcPath, 'utf-8');

      // --- 1. SMART LINK REWRITING ---
      content = content.replace(/\[([^\]]+)\]\(([^)]+)\.md(.*?)\)/g, (match, text, link, anchor) => {
        if (link.startsWith('http')) return match;
        const linkedFile = path.basename(link) + '.md';
        if (linkMap[linkedFile]) {
          return `[${text}](./${linkMap[linkedFile]}${anchor})`;
        }
        return match;
      });

      // --- 2. DYNAMIC EDIT URL ---
      // This converts "external/spec/docs/file.md" into ".../main/docs/file.md"
      const relativeSourcePath = entry.source.replace('external/spec/', '');
      const editUrl = `${REPO_BASE_URL}/${relativeSourcePath}`;

      // --- 3. FRONTMATTER GENERATION ---
      const frontmatter = [
        '---',
        `title: "${entry.title}"`,
        `editUrl: "${editUrl}"`, // The magic link
        `sidebar:`,
        `  order: ${entry.order || 99}`,
        entry.description ? `description: "${entry.description}"` : '',
        '---',
        '',
        ''
      ].filter(Boolean).join('\n');

      // --- 4. CLEANUP & WRITE ---
      const cleanContent = content.replace(/^#\s+.*$/m, '').trim();

      await fs.ensureDir(path.dirname(destPath));
      await fs.writeFile(destPath, frontmatter + cleanContent);
      
      console.log(`📑 Processed: ${entry.destination} (Edit: ${relativeSourcePath})`);
    }

    console.log('\nSync complete! Edit links now point to the spec repo.');
  } catch (err) {
    console.error('Sync failed:', err);
  }
}

sync();
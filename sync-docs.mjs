import fs from 'fs-extra';
import path from 'path';

const MANIFEST_PATH = './spec-manifest.json';
const OUTPUT_BASE = './src/content/docs';

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
      // Fixes nested pathing by using root-relative /spec/ links
      content = content.replace(/\[([^\]]+)\]\(([^)]+)\.md\/?(.*?)\)/g, (match, text, link, anchor) => {
        if (link.startsWith('http')) return match;

        // Get the filename (e.g., "03-event-model.md")
        const linkedFile = path.basename(link) + '.md';

        if (linkMap[linkedFile]) {
          // Clean up anchor: remove leading slash if it exists
          const cleanAnchor = anchor.startsWith('/') ? anchor.substring(1) : anchor;
          
          // Use /spec/ to ensure links don't break when navigating from deep pages
          return `[${text}](/spec/${linkMap[linkedFile]}${cleanAnchor})`;
        }
        return match;
      });

      // --- 2. DYNAMIC EDIT URL ---
      const relativeSourcePath = entry.source.replace('external/spec/', '');
      const editUrl = `${REPO_BASE_URL}/${relativeSourcePath}`;

      // --- 3. FRONTMATTER GENERATION ---
      const frontmatter = [
        '---',
        `title: "${entry.title}"`,
        `editUrl: "${editUrl}"`,
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
      
      console.log(`Processed: ${entry.destination}`);
    }

    console.log('\nSync complete! Internal links and Edit URLs are optimized.');
  } catch (err) {
    console.error('Sync failed:', err);
  }
}

sync();
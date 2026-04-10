# 📦 OpenOutbox Documentation

This is the source code for the official **OpenOutbox** specification and documentation site, hosted at [openoutbox.dev](https://openoutbox.dev).

---

## 🚀 About the Project

**OpenOutbox** is a high-performance, language-agnostic standard for the Transactional Outbox Pattern. It ensures data consistency in distributed systems by atomizing database updates and event publishing.

- **Spec Status**: Draft/Alpha
- **Core Logic**: Go (Golang)
- **Docs Engine**: Astro + Starlight

---

## 🛠️ Local Development

This site is built with **Starlight**. Ensure you have [Node.js](https://nodejs.org/) installed.

### Commands

| Command | Action |
| :--- | :--- |
| `npm install` | Installs all dependencies |
| `npm run dev` | Starts local dev server at `localhost:4321` |
| `npm run build` | Builds the static site to `./dist/` |
| `npm run preview` | Previews the production build locally |

### Content Structure

- **Docs**: Edit or add files in `src/content/docs/` (Markdown/MDX).
- **Assets**: Store images/diagrams in `src/assets/`.
- **Config**: Navigation and site settings are in `astro.config.mjs`.

---

## 🤝 Contributing

1. **Create a Branch**: `git checkout -b docs/your-feature-name`
2. **Commit Changes**: Use structured commit messages (e.g., `docs: add retry strategy section`).
3. **Open a PR**: Target the `main` branch.

---

## 📄 License

This project—including all documentation and core source code—is licensed under the **MIT License**. See the `LICENSE` file for details.

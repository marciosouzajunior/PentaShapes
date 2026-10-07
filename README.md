# 🎸 PentaShapes
[https://pentashapes.web.app](https://pentashapes.web.app)  

📚 **Diagnóstico e planejamento do redesign (PT-BR):** [documentação do projeto e proposta de MVP](docs/README.md).

🧪 **Nova experiência em construção:** `npm ci` e `npm run dev` abrem a landing, a prévia interativa do braço e a primeira prática em `/lesson/`. A entrada alterna entre “Começar agora” e “Continuar lição” conforme o progresso local. O [laboratório do braço](docs/06-braco-reutilizavel.md) continua disponível com `node scripts/serve.mjs` em `/lab/`; o app anterior foi arquivado em [`legacy/`](legacy/). O Firebase ainda publica o legado, até a primeira trilha estar pronta.

**PentaShapes** is an interactive web tool that helps guitarists visualize and understand scales across the fretboard.

You choose the root note, scale type (like pentatonic), and which shapes to display — and the app shows the intervals on the neck, making it easier to connect patterns and create solos.

---

## 💭 Why this project?

Many guitar players know scale shapes — but struggle to use them musically. **PentaShapes** was created to bridge that gap, by showing intervals clearly and helping players think beyond shapes.

---

## 🤝 Want to contribute?

- If you're a dev who loves music: **let’s build it together!**
- If you're a guitarist: open issues with feedback, ideas or requests.
- Contributions in UX or new scale systems are more than welcome!

---

## ⚙️ Desenvolvimento

- Nova interface: Vite, TypeScript, HTML e CSS.
- Braço e teoria musical compartilhados: módulos JavaScript em `public/components/`.
- Legado: HTML, CSS, JavaScript e jQuery em `legacy/`.
- Verificação: `npm run check`; build local da nova interface: `npm run build`.

---

## ⭐ Support the Project

If you like the idea and want to support it:

- Give it a ⭐ on GitHub!
- Share it with other guitarists

---

## License

This project is licensed under the [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).  
Feel free to use, modify, and share the code, even commercially, as long as you give credit to [Márcio Souza Junior](https://github.com/marciosouzajunior).


---

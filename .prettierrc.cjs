/** @type {import('prettier').Config} */
module.exports = {
  printWidth: 120,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  useTabs: false,

  // ⚠ NIE ustawiaj tu htmlWhitespaceSensitivity: 'strict' (próbowane 2026-08-15).
  // Miało zabronić formatterowi ruszania spacji wokół znaczników inline, ale
  // dotyczy też szkieletu dokumentu: prettier przepisał koniec Layout.astro na
  // `</body></html\n>`, czego parser ESLinta nie przyjmuje („Parsing error:
  // Declaration or statement expected") — czyli lekarstwo wywracało bramkę,
  // którą leczyliśmy. Pojedynczy przypadek wrażliwy na spację rozwiązany
  // wpisem w .prettierignore (patrz tam: src/pages/centrum.astro).

  plugins: [require.resolve('prettier-plugin-astro')],

  overrides: [{ files: '*.astro', options: { parser: 'astro' } }],
};

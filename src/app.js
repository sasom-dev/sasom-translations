class TranslationManager {
  constructor(basePath = "/translations") {
    this.basePath = basePath;
    this.cache = new Map();
  }

  async loadTranslation(lang) {
    // Check cache first
    if (this.cache.has(lang)) {
      return this.cache.get(lang);
    }

    try {
      const response = await fetch(`${this.basePath}/${lang}.json`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const translations = await response.json();
      this.cache.set(lang, translations);
      return translations;
    } catch (error) {
      console.error(`Failed to load translations for ${lang}:`, error);
      return null;
    }
  }

  translate(translations, key, params = {}) {
    const value = key.split(".").reduce((obj, k) => obj?.[k], translations);

    if (!value) return key;

    return value.replace(/{(\w+)}/g, (match, p1) =>
      params[p1] !== undefined ? params[p1] : match
    );
  }
}

// Usage example
async function main() {
  const translationManager = new TranslationManager();

  try {
    const enTranslations = await translationManager.loadTranslation("en");
    if (enTranslations) {
      const welcomeMessage = translationManager.translate(
        enTranslations,
        "welcome"
      );
      const greetingMessage = translationManager.translate(
        enTranslations,
        "greeting",
        { name: "John" }
      );

      document.getElementById("app").innerHTML = `
                <h1>${welcomeMessage}</h1>
                <p>${greetingMessage}</p>
            `;
    }
  } catch (error) {
    console.error("Translation initialization failed:", error);
  }
}

main();

/** Escapes user input so it is matched literally inside a RegExp. */
export const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

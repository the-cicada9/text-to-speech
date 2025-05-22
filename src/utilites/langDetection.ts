import { francAll } from 'franc-all';
import langs from 'langs';

export const detectLanguage = (text: string) => {
  const results = francAll(text);
  const bestMatch = results[0];
  if (!bestMatch || bestMatch[0] === 'und') return 'Unknown';

  const lang = langs.where('3', bestMatch[0]);
  return lang ? lang.name : 'Unknown';
};

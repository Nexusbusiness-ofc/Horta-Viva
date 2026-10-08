import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { translate } from '../src/lib/i18n.js';
import { CURIOSITY_FACT_ROWS } from '../src/lib/i18nCuriosityFacts.js';

const cardSource = readFileSync(new URL('../src/components/home/DailyCuriosityCard.jsx', import.meta.url), 'utf8');
const facts = [...cardSource.matchAll(/fact:\s*("(?:[^"\\]|\\.)*")/g)].map(match => JSON.parse(match[1]));
const rows = CURIOSITY_FACT_ROWS.trim().split('\n').map(row => row.split('|').map(part => part.trim()));

test('every curiosity has complete text in all four supported languages', () => {
  assert.equal(facts.length, 25);
  assert.equal(rows.length, facts.length);
  assert.equal(new Set(rows.map(row => row[0])).size, facts.length);
  for (const fact of facts) {
    const row = rows.find(candidate => candidate[0] === fact);
    assert.ok(row, `Missing full translation for ${fact}`);
    assert.equal(row.length, 4);
    assert.equal(translate(fact, 'pt-PT'), fact);
    for (const [language, index] of [['en', 1], ['es', 2], ['pt-BR', 3]]) {
      assert.ok(row[index]?.length > 30, `Incomplete ${language} text`);
      assert.equal(translate(fact, language), row[index]);
      if (language !== 'pt-BR') assert.notEqual(translate(fact, language), fact);
    }
  }
});

test('switching language translates the same curiosity instead of retaining the previous text', () => {
  const fact = facts.find(text => text.startsWith('O milho'));
  for (const language of ['en', 'es', 'pt-BR', 'pt-PT', 'en']) {
    const index = { 'pt-PT': 0, en: 1, es: 2, 'pt-BR': 3 }[language];
    assert.equal(translate(fact, language), rows.find(row => row[0] === fact)[index]);
  }
});

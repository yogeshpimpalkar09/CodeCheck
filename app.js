const errorInput = document.querySelector('#errorInput');
const language = document.querySelector('#language');
const explanationLanguage = document.querySelector('#explanationLanguage');
const explainButton = document.querySelector('#explainButton');
const sampleButton = document.querySelector('#sampleButton');
const statusMessage = document.querySelector('#statusMessage');
const emptyState = document.querySelector('#emptyState');
const answer = document.querySelector('#answer');
const errorTitle = document.querySelector('#errorTitle');
const locationBox = document.querySelector('#locationBox');
const locationLabel = document.querySelector('#locationLabel');
const locationCode = document.querySelector('#locationCode');
const meaningHeading = document.querySelector('#meaningHeading');
const meaning = document.querySelector('#meaning');
const fixHeading = document.querySelector('#fixHeading');
const steps = document.querySelector('#steps');
const tip = document.querySelector('#tip');
const copyButton = document.querySelector('#copyButton');
const simpleButton = document.querySelector('#simpleButton');
const simpleExample = document.querySelector('#simpleExample');
const exampleTitle = document.querySelector('#exampleTitle');
const exampleText = document.querySelector('#exampleText');
const exampleCode = document.querySelector('#exampleCode');
const fixSection = document.querySelector('#fixSection');
const fixCodeHeading = document.querySelector('#fixCodeHeading');
const fixedCode = document.querySelector('#fixedCode');

const API_BASE = 'https://codecheck-backend.onrender.com';
const API_URLS = [
  new URL('/analyze', API_BASE).toString(),
];

const samples = [
  'ReferenceError: userName is not defined\nconsole.log(userName);',
  'SyntaxError: missing ) after argument list\nconsole.log("Hello";',
  'TypeError: Cannot read properties of undefined (reading "map")\nitems.map(item => item.name);',
  'ModuleNotFoundError: No module named "flask"\nimport flask',
  'IndentationError: expected an indented block\nif True:\nprint("hi")',
];

const simpleExamples = {
  general: {
    english: [
      'Read the clue',
      'An error is like a teacher pointing to the line that went wrong. Start with the file name and line number.',
      'console.log("Start here");',
    ],
    hindi: [
      'Hint को पढ़ें',
      'Error को ऐसे समझें जैसे teacher ने गलत line पर निशान लगा दिया हो. पहले file name और line number देखें.',
      'console.log("Start here");',
    ],
  },
  variable: {
    english: [
      'Name not created yet',
      'The program tried to use a name before it was made. Create it first, then use it.',
      'const name = "Asha";\nconsole.log(name);',
    ],
    hindi: [
      'Name पहले नहीं बना',
      'Program ने ऐसे नाम का use किया जो पहले बनाया ही नहीं गया था. पहले बनाइए, फिर use कीजिए.',
      'const name = "Asha";\nconsole.log(name);',
    ],
  },
  emptyData: {
    english: [
      'Value is still empty',
      'The code is trying to use data before it exists. Check that it is loaded first.',
      'if (user) {\n  console.log(user.name);\n}',
    ],
    hindi: {
      title: 'Value अभी खाली है',
      text: 'Code ऐसी value use कर रहा है जो अभी आई ही नहीं है. पहले check करें कि data मौजूद है.',
      code: 'if (user) {\n  console.log(user.name);\n}',
    },
  },
  syntax: {
    english: [
      'Missing punctuation',
      'A bracket, quote, comma, or colon is probably missing. Check the line above too.',
      'console.log("Hello");',
    ],
    hindi: [
      'Punctuation छूट गई',
      'Bracket, quote, comma, या colon छूट गया लगता है. ऊपर वाली line भी देखें.',
      'console.log("Hello");',
    ],
  },
  package: {
    english: [
      'Package not installed',
      'The code needs a library that is not available in this project yet.',
      'pip install flask',
    ],
    hindi: [
      'Package install नहीं है',
      'Code ऐसी library चाहता है जो इस project में अभी उपलब्ध नहीं है.',
      'pip install flask',
    ],
  },
  indent: {
    english: [
      'Spacing is wrong',
      'Python needs a block to be indented properly. Put the next line inside the block.',
      'if True:\n    print("hi")',
    ],
    hindi: [
      'Spacing गलत है',
      'Python में block के अंदर वाली line को सही indentation चाहिए. अगली line को block के अंदर रखें.',
      'if True:\n    print("hi")',
    ],
  },
};

let sampleIndex = 0;
const defaultButtonText = explainButton.textContent;

console.log('[CodeError] app.js loaded', { API_BASE, API_URLS });
window.addEventListener('error', event => {
  console.error('[CodeError] window error:', event.error || event.message);
});
window.addEventListener('unhandledrejection', event => {
  console.error('[CodeError] unhandled rejection:', event.reason);
});

function setStatus(message, kind = 'idle') {
  if (!statusMessage) return;
  statusMessage.textContent = message || '';
  statusMessage.dataset.kind = kind;
}

function setBusy(isBusy) {
  explainButton.disabled = isBusy;
  sampleButton.disabled = isBusy;
  explainButton.textContent = isBusy ? 'Checking...' : defaultButtonText;
}

function normalizeSuggestions(value) {
  if (Array.isArray(value)) {
    return value.filter(item => typeof item === 'string' && item.trim());
  }
  if (typeof value === 'string' && value.trim()) {
    return value
      .split(/\n+/)
      .map(item => item.replace(/^[\s\d.:-]+/, '').trim())
      .filter(Boolean);
  }
  return [];
}

function issueTypeFromText(text) {
  const value = (text || '').toLowerCase();
  if (value.includes('referenceerror') || value.includes('is not defined') || value.includes('nameerror')) return 'variable';
  if (value.includes('cannot read properties') || value.includes('cannot read property') || value.includes('undefined') || value.includes('nonetype') || value.includes('null')) return 'emptyData';
  if (value.includes('syntaxerror') || value.includes('unexpected token') || value.includes('invalid syntax')) return 'syntax';
  if (value.includes('modulenotfounderror') || value.includes('cannot find module') || value.includes('module not found')) return 'package';
  if (value.includes('indentationerror') || value.includes('unexpected indent') || value.includes('expected an indented')) return 'indent';
  return 'general';
}

function parsePayload(raw) {
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) return raw;
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

function lineWithArrow(code, lineNumber, columnNumber = 1) {
  const lines = code.split(/\r?\n/);
  const line = lines[lineNumber - 1] || '';
  const prefix = `${lineNumber} | `;
  const cleanedColumn = Math.max(1, columnNumber);
  const arrow = `${' '.repeat(prefix.length + cleanedColumn - 1)}^`;
  return `${prefix}${line}\n${arrow}`;
}

function renderSimpleExample(type) {
  const lang = explanationLanguage.value;
  const data = simpleExamples[type]?.[lang] || simpleExamples.general[lang];
  const [title, text, code] = Array.isArray(data) ? data : [data.title, data.text, data.code];
  exampleTitle.textContent = title;
  exampleText.textContent = text;
  exampleCode.textContent = code;
  simpleExample.classList.remove('hidden');
  simpleButton.classList.add('hidden');
}

function renderResponse(input, data) {
  const lang = explanationLanguage.value;
  const issueType = issueTypeFromText(input);
  const parsed = parsePayload(data?.analysis) || parsePayload(data);
  const source = data?.source || parsed?.source || 'local';

  emptyState.classList.add('hidden');
  answer.classList.remove('hidden');
  answer.dataset.issueType = issueType;
  simpleExample.classList.add('hidden');
  simpleButton.classList.remove('hidden');

  const title = data?.title || parsed?.title || 'AI code review';
  const analysisText = data?.analysis || parsed?.analysis || 'No explanation was returned.';
  const suggestions = normalizeSuggestions(data?.suggestions || parsed?.suggestions);
  const fixedCodeText = (data?.fixed_code || parsed?.fixed_code || '').trim();
  const lineNumber = Number(data?.likely_line || parsed?.likely_line);
  const columnNumber = Number(data?.likely_column || parsed?.likely_column || 1);
  const snippet = (data?.likely_snippet || parsed?.likely_snippet || '').trim();
  const note = data?.note || parsed?.note || '';

  errorTitle.textContent = title;
  meaningHeading.textContent = lang === 'hindi' ? 'इसका मतलब क्या है?' : 'What does this mean?';
  fixHeading.textContent = lang === 'hindi' ? 'इसे कैसे ठीक करें?' : 'How do I fix it?';
  meaning.textContent = analysisText;
  steps.innerHTML = '';

  const fallbackSteps = lang === 'hindi'
    ? [
      'Error वाली line और उसके ऊपर वाली line देखें.',
      'Spelling, brackets, और variable names जाँचें.',
      'एक छोटा बदलाव करके फिर से run करें.',
    ]
    : [
      'Read the line number in the message.',
      'Check spelling, brackets, and variable names near that line.',
      'Make one small change and run again.',
    ];

  (suggestions.length ? suggestions : fallbackSteps).forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    steps.appendChild(li);
  });

  tip.textContent = source === 'gemini'
    ? (lang === 'hindi'
      ? 'यह live AI जवाब है. अगर कुछ missing लगे तो फिर से paste करें.'
      : 'This is a live AI answer. If it misses something, paste the exact error message too.')
    : (lang === 'hindi'
      ? 'यह local fallback है. Live AI नहीं मिला, लेकिन app फिर भी मदद करने की कोशिश कर रहा है.'
      : 'This is a local fallback. Live AI was not available, but the app still tried to help.');

  setStatus(
    source === 'gemini'
      ? (lang === 'hindi' ? 'Live AI response received.' : 'Live AI response received.')
      : (lang === 'hindi' ? 'Local fallback response received.' : 'Local fallback response received.'),
    source === 'gemini' ? 'success' : 'idle'
  );

  if (note) {
    setStatus(note, 'idle');
  }

  if (Number.isFinite(lineNumber) && lineNumber > 0) {
    const codeLines = input.split(/\r?\n/);
    const displayLine = snippet || codeLines[lineNumber - 1] || '';
    if (displayLine.trim()) {
      locationLabel.textContent = lang === 'hindi' ? `संभावित समस्या: line ${lineNumber}` : `Likely issue: line ${lineNumber}`;
      locationCode.textContent = lineWithArrow(input, lineNumber, columnNumber);
      locationBox.classList.remove('hidden');
    } else {
      locationBox.classList.add('hidden');
    }
  } else {
    locationBox.classList.add('hidden');
  }

  if (fixedCodeText) {
    fixCodeHeading.textContent = lang === 'hindi' ? 'यह corrected code है' : 'Try this corrected code';
    fixedCode.textContent = fixedCodeText;
    fixSection.classList.remove('hidden');
  } else {
    fixSection.classList.add('hidden');
  }
}

function renderFallback(input, message) {
  const issueType = issueTypeFromText(input);
  const lang = explanationLanguage.value;
  const localData = {
    title: lang === 'hindi' ? 'Backend unavailable' : 'Backend unavailable',
    analysis: message || (lang === 'hindi'
      ? 'Frontend अभी backend तक नहीं पहुँच पाया. Backend को चलाकर फिर कोशिश करें.'
      : 'The frontend could not reach the backend. Start the backend and try again.'),
    suggestions: lang === 'hindi'
      ? ['Backend service उपलब्ध है या नहीं check करें.', 'कुछ seconds बाद फिर try करें.', 'Page को refresh करके फिर try करें.']
      : ['Check that the backend service is available.', 'Wait a few seconds and try again.', 'Refresh the page and try again.'],
    likely_line: issueType === 'general' ? null : 1,
    likely_column: 1,
    likely_snippet: issueType === 'general' ? '' : input.split(/\r?\n/)[0] || '',
    fixed_code: '',
    source: 'network_error',
  };
  renderResponse(input, localData);
  setStatus(message || 'Backend request failed.', 'error');
}

async function showExplanation() {
  const input = errorInput.value.trim();
  console.log('[CodeError] explain button clicked', {
    inputLength: input.length,
    language: language.value,
    explanationLanguage: explanationLanguage.value,
    apiUrls: API_URLS,
  });
  if (!input) {
    errorInput.focus();
    setStatus('Please paste an error or code first.', 'error');
    return;
  }

  setBusy(true);
  setStatus('Sending request to backend...', 'sending');

  const payload = {
    code: input,
    language: language.value,
    explanationLanguage: explanationLanguage.value,
  };

  try {
    let lastError = null;
    for (const apiUrl of API_URLS) {
      console.log('[CodeError] trying backend URL', apiUrl);
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));
      console.log('[CodeError] backend response', { apiUrl, status: response.status, ok: response.ok, data });
      if (response.ok) {
        renderResponse(input, data);
        return;
      }

      lastError = new Error(data.error || `Request failed with status ${response.status}`);
      if (response.status !== 404) {
        throw lastError;
      }
    }

    throw lastError || new Error('Could not reach the backend route.');
  } catch (error) {
    console.error(error);
    renderFallback(input, `Request failed: ${error.message}`);
  } finally {
    setBusy(false);
  }
}

sampleButton.addEventListener('click', () => {
  errorInput.value = samples[sampleIndex];
  sampleIndex = (sampleIndex + 1) % samples.length;
  errorInput.focus();
  setStatus('Example loaded. Click Check & explain.', 'idle');
});

explainButton.addEventListener('click', showExplanation);
console.log('[CodeError] listeners attached', { explainButton: Boolean(explainButton), sampleButton: Boolean(sampleButton) });
errorInput.addEventListener('keydown', event => {
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    showExplanation();
  }
});

simpleButton.addEventListener('click', () => {
  renderSimpleExample(answer.dataset.issueType || issueTypeFromText(errorInput.value));
});

copyButton.addEventListener('click', async () => {
  const text = [
    errorTitle.textContent,
    meaningHeading.textContent,
    meaning.textContent,
    fixHeading.textContent,
    [...steps.children].map((li, index) => `${index + 1}. ${li.textContent}`).join('\n'),
    tip.textContent ? `Tip: ${tip.textContent}` : '',
  ]
    .filter(Boolean)
    .join('\n\n');

  try {
    await navigator.clipboard.writeText(text);
    copyButton.textContent = 'Copied!';
    setTimeout(() => {
      copyButton.textContent = 'Copy';
    }, 1300);
  } catch {
    copyButton.textContent = 'Select & copy';
  }
});

setStatus('Ready. Paste code or an error message.', 'idle');

const errorInput = document.querySelector('#errorInput');
const language = document.querySelector('#language');
const explanationLanguage = document.querySelector('#explanationLanguage');
const explainButton = document.querySelector('#explainButton');
const sampleButton = document.querySelector('#sampleButton');
const emptyState = document.querySelector('#emptyState');
const answer = document.querySelector('#answer');
const errorTitle = document.querySelector('#errorTitle');
const locationBox = document.querySelector('#locationBox');
const locationLabel = document.querySelector('#locationLabel');
const locationCode = document.querySelector('#locationCode');
const meaning = document.querySelector('#meaning');
const meaningHeading = document.querySelector('#meaningHeading');
const fixHeading = document.querySelector('#fixHeading');
const steps = document.querySelector('#steps');
const tip = document.querySelector('#tip');
const copyButton = document.querySelector('#copyButton');
const fixSection = document.querySelector('#fixSection');
const fixCodeHeading = document.querySelector('#fixCodeHeading');
const fixedCode = document.querySelector('#fixedCode');
const simpleButton = document.querySelector('#simpleButton');
const simpleExample = document.querySelector('#simpleExample');
const exampleTitle = document.querySelector('#exampleTitle');
const exampleText = document.querySelector('#exampleText');
const exampleCode = document.querySelector('#exampleCode');

const examples = ['ReferenceError: userName is not defined', "TypeError: Cannot read properties of undefined (reading 'map')", "SyntaxError: unexpected token ')'", "ModuleNotFoundError: No module named 'pandas'", 'IndentationError: expected an indented block'];
let exampleIndex = 0;

const translations = {
  general: [
    ["Let's understand this error", 'Your program found a problem it cannot solve by itself. Look at the file name and line number in the message to find the place causing it.', ['Read the file name and line number in the error.', 'Check spelling, brackets, and variable names near that line.', 'Make one small change and run the program again.'], 'Every developer learns by fixing errors. The message is a useful clue.'],
    ['चलो, इस error को समझते हैं', 'आपके program को एक ऐसी समस्या मिली है जिसे वह खुद ठीक नहीं कर सकता। Error message में file name और line number देखकर गलती वाली जगह ढूँढें।', ['Error message में file name और line number देखें।', 'उस line के पास spelling, brackets और variable names जांचें।', 'एक छोटा बदलाव करें और program फिर चलाएँ।'], 'घबराइए मत—हर developer errors देखकर ही सीखता है। Error message आपका hint है।']
  ],
  variable: [
    ['The variable cannot be found', 'Your program is using a variable or function name that was never created, or its spelling is different.', ['Find the name shown in the error.', 'Create it before you use it, with const, let, var, or def.', 'Check capital letters: userName and username are different.'], 'Think of a variable as a labelled box. The program needs the exact label to find it.'],
    ['Variable मिला नहीं', 'Program एक नाम (variable या function) इस्तेमाल कर रहा है, लेकिन वह नाम पहले बनाया नहीं गया है—या spelling अलग है।', ['जिस नाम का error है, उसकी spelling copy करके code में खोजें।', 'उसे इस्तेमाल करने से पहले const, let, var या def से बनाएं।', 'Capital letters भी जांचें: userName और username अलग-अलग हैं।'], 'Variables को ऐसे समझें जैसे किसी डिब्बे पर नाम लिखा हो। सही नाम नहीं होगा तो program डिब्बा नहीं ढूँढ पाएगा।']
  ],
  emptyData: [
    ['The data is not available yet', 'You are trying to use information inside a value that is currently undefined, null, or empty.', ['Use console.log or print to inspect that variable.', 'Check whether you use the data before it arrives.', 'Add a condition first, such as if (user) { ... }.'], 'First check that the box exists, then use what is inside it.'],
    ['डेटा अभी मौजूद नहीं है', 'आप किसी value के अंदर से जानकारी लेना चाहते हैं, लेकिन वह value अभी undefined, null या खाली है।', ['उस variable को console.log या print करके देखें।', 'डेटा आने से पहले उसे इस्तेमाल तो नहीं कर रहे, यह जांचें।', 'पहले condition लगाएँ, जैसे if (user) { ... }।'], 'पहले जांचें कि डिब्बा मौजूद है, फिर उसके अंदर की चीज़ इस्तेमाल करें।']
  ],
  syntax: [
    ['There is a code grammar mistake', 'The program cannot understand how the code is written. Usually a bracket, quote, comma, or colon is missing.', ['Check the line in the error and the line above it.', 'Match every (, {, [ with ), }, ].', 'Check quotes and commas in strings and lists.'], 'Clicking a bracket in many editors highlights its matching bracket.'],
    ['Code की लिखावट में गलती है', 'Program को code का grammar समझ नहीं आया। अक्सर कोई bracket, quote, comma या colon छूट गया होता है।', ['बताई गई line और उससे एक line ऊपर देखें।', 'हर (, {, [ का closing ), }, ] मिलाएँ।', 'Strings के quotes और commas जांचें।'], 'Editor में brackets पर click करने से उसका matching bracket अक्सर highlight हो जाता है।']
  ],
  package: [
    ['A required package is missing', 'Your program is trying to use a library or package that is not installed or imported in this project.', ['Read the package name carefully in the error.', 'Install that package in your project.', 'Check the spelling in the import statement.'], 'After installing a package, you may need to restart the development server.'],
    ['ज़रूरी package नहीं मिला', 'आपका program एक library/package इस्तेमाल कर रहा है, लेकिन वह project में install या import नहीं है।', ['Package का नाम error से ध्यान से पढ़ें।', 'उस package को अपने project में install करें।', 'Import statement और package name की spelling जांचें।'], 'Package install करने के बाद development server को फिर से चलाना पड़ सकता है।']
  ],
  indent: [
    ['The spacing alignment is incorrect', 'In Python, spaces are part of the code. A line inside a block needs the correct indentation.', ['Align the error line below the related line above it.', 'Do not mix tabs and spaces in the same file.', 'Use 4 spaces for lines inside if, for, while, or def blocks.'], 'Indentation tells Python which lines belong together, like paragraphs in a book.'],
    ['Spaces की alignment गलत है', 'Python में spaces code का हिस्सा होती हैं। किसी block के अंदर वाली line को सही indentation चाहिए।', ['Error वाली line को उसके ऊपर की related line के नीचे align करें।', 'एक ही file में tabs और spaces को mix न करें।', 'if, for, while या def के बाद वाली lines में usually 4 spaces रखें।'], 'Python में indentation वैसी ही है जैसे किताब में paragraph—वह बताती है कि कौन-सी lines साथ हैं।']
  ],
  codeReview: [
    ['Code check: no clear error message found', 'You pasted code, but there is no error message to identify the exact problem. The code may still have a runtime or logic error that only appears when it runs.', ['Run the code and copy the complete error message it shows.', 'Paste that error together with 5–15 related lines of code.', 'Check variable spelling, brackets, and indentation while you wait.'], 'The best debugging report has both: the error message tells what failed, and code tells why it failed.'],
    ['Code check: clear error message नहीं मिला', 'आपने code paste किया है, लेकिन exact problem बताने के लिए कोई error message नहीं मिला। Code में runtime या logic error हो सकता है जो run करने पर ही दिखेगा।', ['Code को run करें और जो पूरा error message आए उसे copy करें।', 'उस error के साथ 5–15 related code lines भी paste करें।', 'तब तक variable spelling, brackets और indentation जांचें।'], 'Debugging के लिए error message और related code—दोनों सबसे useful होते हैं।']
  ]
};

const simpleExamples = {
  general: [
    ['Read the clue', 'An error is like your teacher marking the line where an answer went wrong. Read the file name and line number first.', 'console.log("Start here");'],
    ['Hint को पढ़ें', 'Error को ऐसे समझें जैसे teacher ने उस line पर निशान लगाया हो जहाँ उत्तर गलत है। पहले file name और line number देखें।', 'console.log("यहाँ से शुरू करें");']
  ],
  variable: [
    ['Use the name after creating it', 'Here, score has not been created yet. Create it first, then use it.', 'const score = 95;\nconsole.log(score);'],
    ['पहले नाम बनाएं, फिर इस्तेमाल करें', 'यहाँ score पहले बनाया नहीं गया है। पहले उसे बनाएं, फिर इस्तेमाल करें।', 'const score = 95;\nconsole.log(score);']
  ],
  emptyData: [
    ['Check before using data', 'user may not exist yet. Check it before asking for user.name.', 'if (user) {\n  console.log(user.name);\n}'],
    ['Data इस्तेमाल करने से पहले जांचें', 'user अभी मौजूद नहीं हो सकता। user.name लेने से पहले उसे जांचें।', 'if (user) {\n  console.log(user.name);\n}']
  ],
  syntax: [
    ['Every opening quote needs a closing quote', 'The text starts with a quote and must end with the same quote.', 'const name = "Asha";\nconsole.log(name);'],
    ['हर opening quote का closing quote होना चाहिए', 'Text quote से शुरू हुआ है, इसलिए उसे उसी quote से बंद करना होगा।', 'const name = "Asha";\nconsole.log(name);']
  ],
  package: [
    ['Install before importing', 'You cannot import a library until it is installed in your project.', 'npm install axios\n\nimport axios from "axios";'],
    ['Import करने से पहले install करें', 'किसी library को import करने से पहले उसे project में install करना होता है।', 'npm install axios\n\nimport axios from "axios";']
  ],
  indent: [
    ['Lines inside a Python block move right', 'The print line belongs inside the if block, so it has four spaces before it.', 'if age >= 18:\n    print("You can vote")'],
    ['Python block के अंदर वाली lines right जाती हैं', 'print line if block के अंदर है, इसलिए उसके पहले चार spaces हैं।', 'if age >= 18:\n    print("You can vote")']
  ],
  codeReview: [
    ['Run the code to find its exact message', 'Your code may look correct but still fail when it runs. The next useful clue is the error message.', 'console.log("Run the program and copy any error here");'],
    ['Exact error पाने के लिए code चलाएं', 'Code ठीक दिख सकता है, लेकिन run करने पर problem आ सकती है। अगला useful clue error message है।', 'console.log("Code चलाकर error message copy करें");']
  ]
};

function lineFromMessage(text) {
  const match = text.match(/\bline\s+(\d+)\b/i) || text.match(/:(\d+):(\d+)\b/);
  return match ? Number(match[1]) : null;
}

function getErrorInfo(text) {
  const value = text.toLowerCase();
  const reportedLine = lineFromMessage(text);
  if (/referenceerror|is not defined|nameerror/.test(value)) return { type: 'variable', line: reportedLine };
  if (/cannot read propert|undefined|null|nonetype/.test(value)) return { type: 'emptyData', line: reportedLine };
  if (/syntaxerror|unexpected token|invalid syntax/.test(value)) return { type: 'syntax', line: reportedLine };
  if (/module.*not found|modulenotfounderror|cannot find module/.test(value)) return { type: 'package', line: reportedLine };
  if (/indentationerror|expected an indented/.test(value)) return { type: 'indent', line: reportedLine };
  const pairs = { '(': ')', '[': ']', '{': '}' };
  const stack = [];
  let line = 1;
  let column = 1;
  let openQuote = null;
  let previousCharacter = '';
  for (const character of text) {
    if (character === '\n') { line += 1; column = 1; continue; }
    if (openQuote) {
      if (character === openQuote.character && previousCharacter !== '\\') openQuote = null;
      previousCharacter = character;
      column += 1;
      continue;
    }
    if (character === '"' || character === "'") {
      openQuote = { character, line, column };
      previousCharacter = character;
      column += 1;
      continue;
    }
    if (pairs[character]) stack.push({ expected: pairs[character], line, column });
    else if (character === ')' || character === ']' || character === '}') {
      const opening = stack.pop();
      if (!opening || opening.expected !== character) return { type: 'syntax', line, column };
    }
    previousCharacter = character;
    column += 1;
  }
  if (stack.length) return { type: 'syntax', line: stack[stack.length - 1].line, column: stack[stack.length - 1].column, missingClosings: stack.slice().reverse().map(item => item.expected).join('') };
  if (openQuote) return { type: 'syntax', line: openQuote.line, column: openQuote.column, missingQuote: openQuote.character };
  const looksLikeCode = /[{};]|\b(function|const|let|var|def|class|print|console\.log|import)\b/.test(value);
  return { type: looksLikeCode ? 'codeReview' : 'general', line: null, column: null };
}

function isDirectCode(text) {
  return /[{};]|\b(function|const|let|var|def|class|print|console\.log|import)\b/.test(text) && !/referenceerror|nameerror|typeerror|syntaxerror|module.*not found|traceback/i.test(text);
}

function suggestedCode(text, issue) {
  if (issue.missingQuote && issue.line) {
    const lines = text.split(/\r?\n/);
    const codeLine = lines[issue.line - 1];
    const semicolon = codeLine.lastIndexOf(';');
    const position = semicolon >= 0 ? semicolon : codeLine.length;
    lines[issue.line - 1] = `${codeLine.slice(0, position)}${issue.missingQuote}${codeLine.slice(position)}`;
    return lines.join('\n');
  }
  if (issue.missingClosings) return `${text}\n${issue.missingClosings}`;
  if (issue.type === 'codeReview') return text;
  return null;
}

function showExplanation() {
  const input = errorInput.value.trim();
  if (!input) { errorInput.focus(); errorInput.placeholder = 'First, paste an error message or code here…'; return; }
  renderExplanation(input);
}

function renderExplanation(input) {
  emptyState.classList.add('hidden');
  const languageIndex = explanationLanguage.value === 'hindi' ? 1 : 0;
  const issue = getErrorInfo(input);
  const [title, explanation, fixSteps, helpfulTip] = translations[issue.type][languageIndex];
  errorTitle.textContent = title;
  meaning.textContent = explanation;
  meaningHeading.textContent = languageIndex ? 'इसका मतलब क्या है?' : 'What does this mean?';
  fixHeading.textContent = languageIndex ? 'इसे कैसे ठीक करें?' : 'How do I fix it?';
  steps.innerHTML = '';
  fixSteps.forEach(item => { const li = document.createElement('li'); li.textContent = item; steps.appendChild(li); });
  tip.textContent = helpfulTip;
  answer.dataset.issueType = issue.type;
  simpleExample.classList.add('hidden');
  simpleButton.classList.remove('hidden');
  simpleButton.textContent = languageIndex ? 'समझ नहीं आया? सरल उदाहरण देखें' : 'I don’t understand — show a simple example';
  const codeLines = input.split(/\r?\n/);
  const suspectedCode = issue.line && codeLines[issue.line - 1];
  if (suspectedCode && /[{};=()]|\b(const|let|var|def|class|if|for|while|return|print|console\.log)\b/.test(suspectedCode)) {
    locationLabel.textContent = languageIndex ? `संभावित समस्या: line ${issue.line}` : `Likely issue: line ${issue.line}`;
    const visibleCode = suspectedCode.trim();
    const removedIndent = suspectedCode.length - suspectedCode.trimStart().length;
    const column = Math.max(1, (issue.column || 1) - removedIndent);
    const prefix = `${issue.line} | `;
    locationCode.textContent = `${prefix}${visibleCode}\n${' '.repeat(prefix.length + column - 1)}↑`;
    locationBox.classList.remove('hidden');
  } else {
    locationBox.classList.add('hidden');
  }
  const correction = isDirectCode(input) && suggestedCode(input, issue);
  if (correction) {
    fixCodeHeading.textContent = issue.type === 'codeReview' ? 'No clear syntax issue found in this code' : 'Try this corrected code';
    fixedCode.textContent = correction;
    fixSection.classList.remove('hidden');
  } else {
    fixSection.classList.add('hidden');
  }
  answer.classList.remove('hidden');
}

sampleButton.addEventListener('click', () => { errorInput.value = examples[exampleIndex]; exampleIndex = (exampleIndex + 1) % examples.length; errorInput.focus(); });
explainButton.addEventListener('click', showExplanation);
errorInput.addEventListener('keydown', event => { if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') showExplanation(); });
simpleButton.addEventListener('click', () => {
  const languageIndex = explanationLanguage.value === 'hindi' ? 1 : 0;
  const example = simpleExamples[answer.dataset.issueType][languageIndex];
  exampleTitle.textContent = example[0];
  exampleText.textContent = example[1];
  exampleCode.textContent = example[2];
  simpleExample.classList.remove('hidden');
  simpleButton.classList.add('hidden');
});
copyButton.addEventListener('click', async () => {
  const text = `${errorTitle.textContent}\n\n${meaningHeading.textContent}\n${meaning.textContent}\n\n${fixHeading.textContent}\n${[...steps.children].map((li, index) => `${index + 1}. ${li.textContent}`).join('\n')}\n\nTip: ${tip.textContent}`;
  try { await navigator.clipboard.writeText(text); copyButton.textContent = 'Copied!'; setTimeout(() => { copyButton.textContent = 'Copy'; }, 1500); } catch { copyButton.textContent = 'Select & copy'; }
});

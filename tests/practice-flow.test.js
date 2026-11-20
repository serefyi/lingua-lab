const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');

class FakeElement {
  constructor(selector, document) {
    this.selector = selector;
    this.document = document;
    this.listeners = new Map();
    this.dataset = {};
    this.value = '';
    this.textContent = '';
    this.disabled = false;
    this.hidden = false;
    this.open = false;
    this.classList = {
      values: new Set(),
      add: value => this.classList.values.add(value),
      remove: value => this.classList.values.delete(value),
      contains: value => this.classList.values.has(value)
    };
  }

  set innerHTML(value) {
    this._innerHTML = value;
    if (this.selector === '#topicSelect') {
      this.value = value.match(/<option value="([^"]+)"/)?.[1] || '';
    } else if (this.selector === '#practiceContent') {
      this.document.mountPracticeNodes(value);
    }
  }

  get innerHTML() { return this._innerHTML || ''; }

  addEventListener(type, callback) {
    const callbacks = this.listeners.get(type) || [];
    callbacks.push(callback);
    this.listeners.set(type, callbacks);
  }

  click(event = {}) {
    for (const callback of this.listeners.get('click') || []) callback({ target: this, ...event });
  }

  change() {
    for (const callback of this.listeners.get('change') || []) callback({ target: this });
  }

  focus() { this.focused = true; }
  scrollIntoView() { this.scrolledIntoView = true; }
  showModal() { this.open = true; }

  close() {
    this.open = false;
    for (const callback of this.listeners.get('close') || []) callback({ target: this });
  }
}

class FakeDocument {
  constructor() {
    this.elements = new Map();
    this.contextButtons = ['business', 'academic', 'natural'].map(context => {
      const button = this.getElement(`.choice-${context}`);
      button.dataset.context = context;
      return button;
    });
    this.skillButtons = ['speaking', 'listening', 'reading', 'writing'].map(skill => {
      const button = this.getElement(`.skill-${skill}`);
      button.dataset.skill = skill;
      return button;
    });
    for (const selector of [
      '#practiceDialog', '#practiceContent', '#topicSelect', '#durationSelect',
      '#difficultySelect', '#sessionPreference', '#clearProgress', '#progressSummary',
      '#progressDetails', '#startPractice', '#closeDialog', '.dialog-eyebrow'
    ]) this.getElement(selector);
    this.querySelector('#durationSelect').value = '5';
    this.querySelector('#difficultySelect').value = 'intermediate';
  }

  getElement(selector) {
    if (!this.elements.has(selector)) this.elements.set(selector, new FakeElement(selector, this));
    return this.elements.get(selector);
  }

  querySelector(selector) { return this.getElement(selector); }

  querySelectorAll(selector) {
    if (selector === '.choice') return this.contextButtons;
    if (selector === '.skill-option') return this.skillButtons;
    return [];
  }

  mountPracticeNodes(markup) {
    const selectors = ['#practiceTimer', '#timerMessage', '#answerInput', '#submitAnswer', '#feedback', '#playPrompt'];
    for (const selector of selectors) this.elements.delete(selector);
    for (const selector of selectors) {
      const id = selector.slice(1);
      if (markup.includes(`id="${id}"`)) this.getElement(selector);
    }
  }
}

class FakeSpeech {
  constructor(text) { this.text = text; }
}

function createAppHarness({ storageFails = false, speechSupported = true } = {}) {
  const document = new FakeDocument();
  const values = new Map();
  const storage = {
    getItem(key) {
      if (storageFails) throw new Error('storage disabled');
      return values.get(key) ?? null;
    },
    setItem(key, value) {
      if (storageFails) throw new Error('storage disabled');
      values.set(key, String(value));
    },
    removeItem(key) {
      if (storageFails) throw new Error('storage disabled');
      values.delete(key);
    }
  };
  const state = { confirm: true, spoken: [], cancels: 0, clearedIntervals: [] };
  const speechSynthesis = {
    speak(utterance) { state.spoken.push(utterance); },
    cancel() { state.cancels += 1; }
  };
  const window = { confirm: () => state.confirm };
  if (speechSupported) {
    window.speechSynthesis = speechSynthesis;
    window.SpeechSynthesisUtterance = FakeSpeech;
  }
  let nextInterval = 1;
  const sandbox = vm.createContext({
    document,
    window,
    localStorage: storage,
    SpeechSynthesisUtterance: FakeSpeech,
    setInterval: () => nextInterval++,
    clearInterval: id => state.clearedIntervals.push(id),
    Date,
    console
  });
  vm.runInContext(source, sandbox, { filename: 'app.js' });
  return { document, state, storage, values };
}

test('all context and skill combinations render a complete practice prompt', () => {
  const topicByContext = { business: 'email', academic: 'research', natural: 'expressions' };
  for (const context of Object.keys(topicByContext)) {
    for (const skill of ['speaking', 'listening', 'reading', 'writing']) {
      const app = createAppHarness();
      app.document.contextButtons.find(button => button.dataset.context === context).click();
      app.document.skillButtons.find(button => button.dataset.skill === skill).click();
      app.document.querySelector('#topicSelect').value = topicByContext[context];
      app.document.querySelector('#difficultySelect').value = 'advanced';
      app.document.querySelector('#durationSelect').value = '3';
      app.document.querySelector('#durationSelect').change();
      app.document.querySelector('#startPractice').click();

      const markup = app.document.querySelector('#practiceContent').innerHTML;
      assert.match(markup, /進階/);
      assert.match(markup, /id="practiceTimer"/);
      assert.match(markup, /id="answerInput"/);
      assert.doesNotMatch(markup, /undefined|null/);
      if (skill === 'listening') assert.match(markup, /class="transcript"/);
      if (skill === 'reading') assert.match(markup, /class="mini-passage"/);
      if (skill === 'speaking') assert.match(markup, /口說草稿/);
      if (skill === 'writing') assert.match(markup, /英文草稿/);
      assert.equal(app.document.querySelector('#practiceTimer').textContent, '03:00');
      assert.equal(app.document.querySelector('#sessionPreference').textContent, '約 3 分鐘');
    }
  }
});

test('empty answers are rejected, completion is counted once, and local progress can be reset', () => {
  const app = createAppHarness();
  app.document.querySelector('#startPractice').click();
  const answer = app.document.querySelector('#answerInput');
  const submit = app.document.querySelector('#submitAnswer');
  answer.value = 'I will share the project update on Friday.';

  answer.value = '';
  submit.click();
  assert.match(app.document.querySelector('#feedback').innerHTML, /先寫下幾個關鍵字/);
  assert.equal(app.values.size, 0);
  assert.equal(answer.focused, true);

  answer.value = 'I will share the project update on Friday.';
  submit.click();
  submit.click();
  const saved = JSON.parse(app.values.get('lingua-lab-progress-v1'));
  assert.equal(saved.total, 1);
  assert.equal(saved.bySkill.speaking, 1);
  assert.equal(Object.hasOwn(saved, 'answer'), false);
  assert.equal(submit.disabled, true);
  assert.equal(app.document.querySelector('#clearProgress').hidden, false);
  assert.match(app.document.querySelector('#progressDetails').textContent, /說 1/);

  app.state.confirm = false;
  app.document.querySelector('#clearProgress').click();
  assert.notEqual(app.values.has('lingua-lab-progress-v1'), false);

  app.state.confirm = true;
  app.document.querySelector('#clearProgress').click();
  assert.equal(app.values.has('lingua-lab-progress-v1'), false);
  assert.equal(app.document.querySelector('#clearProgress').hidden, true);
});

test('listening audio has a transcript, plays with speech synthesis, and degrades without it', () => {
  const app = createAppHarness();
  app.document.contextButtons.find(button => button.dataset.context === 'natural').click();
  app.document.skillButtons.find(button => button.dataset.skill === 'listening').click();
  app.document.querySelector('#topicSelect').value = 'polite';
  app.document.querySelector('#startPractice').click();
  assert.match(app.document.querySelector('#practiceContent').innerHTML, /先聽完再看文字稿/);
  app.document.querySelector('#playPrompt').click();
  assert.match(app.state.spoken[0].text, /Would you mind walking me through/);
  app.document.querySelector('#closeDialog').click();
  assert.ok(app.state.cancels > 0);
  assert.ok(app.state.clearedIntervals.length > 0);

  const fallback = createAppHarness({ speechSupported: false });
  fallback.document.skillButtons.find(button => button.dataset.skill === 'listening').click();
  fallback.document.querySelector('#startPractice').click();
  fallback.document.querySelector('#playPrompt').click();
  assert.match(fallback.document.querySelector('#timerMessage').textContent, /不支援語音播放/);
  assert.match(fallback.document.querySelector('#practiceContent').innerHTML, /class="transcript"/);
});

test('storage failures do not prevent practice completion', () => {
  const app = createAppHarness({ storageFails: true });
  app.document.querySelector('#startPractice').click();
  app.document.querySelector('#answerInput').value = 'The next step is to share the draft.';
  app.document.querySelector('#submitAnswer').click();
  assert.equal(app.document.querySelector('#submitAnswer').disabled, true);
  assert.match(app.document.querySelector('#feedback').innerHTML, /瀏覽器未允許本機儲存進度/);
});

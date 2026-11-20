const contextNames = { business: '商業英文', academic: '學術英文', natural: '道地英文分析' };
const skillNames = { speaking: '口說', listening: '聽力', reading: '閱讀', writing: '寫作' };
const topics = {
  business: [
    { id: 'meeting', label: '團隊會議', scenario: '你要在團隊會議中更新專案進度。', audio: 'The design team finished the first round of user interviews. We found that new customers need clearer setup instructions. Maya will share a revised draft by Friday.', passage: 'The design team has completed the first round of user interviews. They found that new customers need clearer setup instructions. Maya will share a revised draft by Friday.', question: '團隊發現了什麼？Maya 預計何時分享新版草稿？', speak: '用英文說明一項進度、一個發現，以及接下來的行動。', write: '寫一段簡短的進度更新，包含發現和下一步。', phrase: 'The main update is … / The next step is …', note: '先說進度，再用一項發現或下一步補充。' },
    { id: 'email', label: '商務郵件', scenario: '你需要用英文寫信，請同事提供專案需要的資料。', audio: 'Hi Jordan, could you send me the latest sales figures by Wednesday? I need them for the client presentation. Let me know if you need more time. Thanks, Alex.', passage: 'Hi Jordan,\n\nCould you send me the latest sales figures by Wednesday? I need them for the client presentation. Let me know if you need more time.\n\nThanks,\nAlex', question: 'Jordan 需要提供什麼資料？期限是什麼時候？', speak: '用口語說明你需要什麼、何時需要，以及原因。', write: '寫一封簡短郵件提出請求，補上期限與原因。', phrase: 'Could you send me … by …? / Let me know if …', note: '清楚交代請求、期限和原因，語氣保持有禮。' },
    { id: 'presentation', label: '簡報提案', scenario: '你要向團隊簡介一項改善客戶體驗的提案。', audio: 'Our proposal is to add a guided setup checklist for new customers. In a small pilot, most users finished setup faster. We recommend testing the checklist with one more group next month.', passage: 'The team proposed adding a guided setup checklist for new customers. In a small pilot, most users finished setup faster. The team recommended testing the checklist with one more group next month.', question: '提案要新增什麼？團隊建議接下來做什麼？', speak: '用英文簡介提案、說出一項理由，再提出建議的下一步。', write: '用 2–4 句英文概述提案、理由與下一步。', phrase: 'We recommend … because … / As a next step, …', note: '先講建議，再用證據或理由支撐。' }
  ],
  academic: [
    { id: 'discussion', label: '課堂討論', scenario: '你正在課堂上回應同學對遠距學習的看法。', audio: 'I agree that online classes offer more flexibility. However, students may find it harder to stay engaged. Short group activities could help keep everyone involved.', passage: 'Online classes offer more flexibility, but some students find it harder to stay engaged. Short group activities may help keep students involved during class.', question: '這段話提出了遠距課程的哪項優點和挑戰？可能的改善方法是什麼？', speak: '先表達你的立場，再補一個理由或回應另一種觀點。', write: '寫一段短回應，先提出主張，再用理由支持。', phrase: 'I agree that …; however, … / One reason is …', note: '用清楚的主張和理由連結想法，並公平回應不同觀點。' },
    { id: 'research', label: '研究摘要', scenario: '你需要向同學摘要一項關於學習習慣的小型研究。', audio: 'The study examined whether short daily review sessions improve vocabulary recall. Thirty students took part for four weeks. Students who reviewed for ten minutes each day remembered more words than the comparison group.', passage: 'A four-week study examined whether short daily reviews improve vocabulary recall. Thirty students participated. Students who reviewed for ten minutes each day remembered more words than the comparison group.', question: '研究探討什麼問題？參與者是誰？主要發現為何？', speak: '用英文摘要研究問題、參與者和主要發現。', write: '以 2–4 句摘要研究問題與主要發現，不加入原文沒有的結論。', phrase: 'This study examined … / The findings suggest …', note: '區分研究問題、觀察結果和研究者推論。' },
    { id: 'paper', label: '論文閱讀', scenario: '你正在閱讀一段論文摘要，找出主張與限制。', audio: 'The results suggest that short, regular study sessions may improve long-term recall. However, the study involved only one class, so further research is needed before applying the findings to other groups.', passage: 'The results suggest that short, regular study sessions may improve long-term recall. However, the study involved only one class. Further research is needed before applying the findings to other groups.', question: '研究結果暗示什麼？作者提醒了哪項限制？', speak: '用自己的話說明作者的主要主張和一項限制。', write: '用英文寫出主要主張與一項限制，保留原文的保留語氣。', phrase: 'The results suggest … / One limitation is …', note: '留意 may、suggest 等保留語，不要把相關性說成定論。' }
  ],
  natural: [
    { id: 'polite', label: '禮貌請求', scenario: '你沒聽清楚同事的說明，想請對方再解釋一次。', audio: 'Sorry, I missed the last part. Would you mind walking me through that one more time?', passage: '“Would you mind walking me through that one more time?” is a polite way to ask someone to explain something again, step by step.', question: '這句話的語氣如何？片語 “walk me through” 在這裡是什麼意思？', speak: '用自然又有禮貌的英文，請對方再解釋一次。', write: '寫一句自然、有禮貌的英文，請同事再次說明。', phrase: 'Would you mind walking me through that one more time?', note: 'walk someone through something 是帶著對方逐步說明；語氣委婉，常用於工作或學習。' },
    { id: 'conversation', label: '日常對話', scenario: '同事提到週末去爬山，你想自然地延續對話。', audio: 'I went hiking near the lake this weekend. The weather was perfect, and the trail was quieter than I expected.', passage: 'A: I went hiking near the lake this weekend.\nB: That sounds lovely. Was the trail busy?', question: '說話者週末做了什麼？對方用什麼問題延續對話？', speak: '用一句回應表示興趣，再問一個自然的追問。', write: '寫兩句日常對話：先回應對方，再提出一個相關問題。', phrase: 'That sounds lovely. What was … like?', note: '先接住對方分享的內容，再問一個開放、相關的小問題。' },
    { id: 'expressions', label: '自然說法', scenario: '你想用自然的英文表達「我正在處理這件事，稍後回覆」。', audio: 'I’m looking into it now. I’ll get back to you with an update this afternoon.', passage: '“I’m looking into it now. I’ll get back to you with an update this afternoon.” sounds natural in a work conversation. “Look into” means to investigate or check something.', question: '“look into” 在這裡是什麼意思？說話者承諾何時再回覆？', speak: '用自然的英文告訴對方你會查看狀況，稍後再更新。', write: '寫兩句自然的英文，說明你會先確認，再交代何時回覆。', phrase: 'I’m looking into it. I’ll get back to you by …', note: 'look into 比直譯的 “check this thing deeply” 更自然地表示調查或確認。' }
  ]
};

const levelGuidance = {
  beginner: {
    speaking: '入門提示：先用 1–2 句完成意思。可用句型：I think … / The next step is …',
    listening: '入門提示：第一遍先抓主旨；第二遍再找題目中的人、事或時間。',
    reading: '入門提示：先找重複出現的關鍵字，再用短句回答。',
    writing: '入門提示：先寫 1–2 句。可用句型：Could you …? / I think … because …'
  },
  intermediate: {
    speaking: '中階提示：先說重點，再補一項理由、細節或下一步。',
    listening: '中階提示：記下主旨與兩項細節，再用自己的話作答。',
    reading: '中階提示：用自己的話回答，並指出支持答案的文字線索。',
    writing: '中階提示：寫 2–3 句，讓主要訊息、理由和下一步連貫。'
  },
  advanced: {
    speaking: '進階提示：加入比較、限制或委婉語氣，並保持內容精簡。',
    listening: '進階提示：注意說話者的保留語氣、理由與未明說的下一步。',
    reading: '進階提示：區分主張、證據與限制，避免推論超出文章內容。',
    writing: '進階提示：清楚連結主張、證據與限制，並依情境調整語氣。'
  }
};

const progressKey = 'lingua-lab-progress-v1';
const dialog = document.querySelector('#practiceDialog');
const content = document.querySelector('#practiceContent');
const topicSelect = document.querySelector('#topicSelect');
let currentContext = 'business';
let currentSkill = 'speaking';
let timerInterval = null;
let currentSpeech = null;
let exerciseCompleted = false;

function readProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(progressKey));
    return saved && Number.isInteger(saved.total) ? saved : { total: 0, bySkill: {}, lastAt: null };
  } catch {
    return { total: 0, bySkill: {}, lastAt: null };
  }
}

function updateProgressSummary() {
  const progress = readProgress();
  document.querySelector('#progressSummary').textContent = progress.total
    ? `這台裝置已完成 ${progress.total} 次單項練習`
    : '一次只專注一件事';
  if (!progress.total) {
    document.querySelector('#progressDetails').textContent = '完成紀錄只存在本機，不保存你的作答';
    return;
  }
  const skillCounts = ['listening', 'speaking', 'reading', 'writing']
    .map(skill => `${skillNames[skill]} ${progress.bySkill?.[skill] || 0}`)
    .join('・');
  const recentDate = progress.lastAt
    ? new Date(progress.lastAt).toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric' })
    : '';
  document.querySelector('#progressDetails').textContent = `${skillCounts}${recentDate ? `・最近 ${recentDate}` : ''}｜紀錄只存在本機，不保存作答`;
}

function updateTopicOptions() {
  topicSelect.innerHTML = topics[currentContext]
    .map(topic => `<option value="${topic.id}">${topic.label}</option>`)
    .join('');
}

function updatePreferenceSummary() {
  document.querySelector('#sessionPreference').textContent = `約 ${document.querySelector('#durationSelect').value} 分鐘`;
}

document.querySelectorAll('.choice').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.choice').forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  currentContext = button.dataset.context;
  updateTopicOptions();
}));

document.querySelectorAll('.skill-option').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.skill-option').forEach(item => item.classList.remove('selected'));
  button.classList.add('selected');
  currentSkill = button.dataset.skill;
}));

document.querySelector('#durationSelect').addEventListener('change', updatePreferenceSummary);

function stopTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = null;
}

function stopSpeech() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}

function startTimer(minutes) {
  stopTimer();
  let secondsLeft = Number(minutes) * 60;
  const timer = document.querySelector('#practiceTimer');
  const render = () => {
    const mins = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
    const secs = (secondsLeft % 60).toString().padStart(2, '0');
    timer.textContent = `${mins}:${secs}`;
  };
  render();
  timerInterval = setInterval(() => {
    secondsLeft -= 1;
    render();
    if (secondsLeft <= 0) {
      stopTimer();
      timer.textContent = '時間到';
      timer.classList.add('timer-finished');
      document.querySelector('#timerMessage').textContent = '本次設定時長已到；你可以繼續作答，或完成練習。';
    }
  }, 1000);
}

function getTaskMarkup(topic, duration, difficulty) {
  const guidance = levelGuidance[difficulty][currentSkill];
  if (currentSkill === 'listening') {
    return `<button class="listen-play" id="playPrompt" type="button">▶ 播放英文音訊</button>
      <details class="transcript"><summary>先聽完再看文字稿</summary><p>${topic.audio}</p></details>
      <p class="practice-question">${topic.question}</p>
      <div class="goal-note">${guidance}</div>
      <textarea class="dialog-input" id="answerInput" placeholder="記下你聽到的重點⋯"></textarea>`;
  }
  if (currentSkill === 'reading') {
    return `<p class="mini-passage">${topic.passage.replaceAll('\n', '<br>')}</p>
      <p class="practice-question">${topic.question}</p>
      <div class="goal-note">${guidance}</div>
      <textarea class="dialog-input" id="answerInput" placeholder="用中文或英文回答⋯"></textarea>`;
  }
  const prompt = currentSkill === 'speaking' ? topic.speak : topic.write;
  const placeholder = currentSkill === 'speaking'
    ? '先寫關鍵字或英文口說草稿；這個版本不錄音⋯'
    : '在這裡輸入你的英文草稿⋯';
  return `<div class="prompt-box">${topic.scenario}</div>
    <p class="practice-question">${prompt}</p>
    <div class="goal-note">${guidance}</div>
    <textarea class="dialog-input" id="answerInput" placeholder="${placeholder}"></textarea>`;
}

function saveCompletion() {
  try {
    const progress = readProgress();
    progress.total += 1;
    progress.bySkill[currentSkill] = (progress.bySkill[currentSkill] || 0) + 1;
    progress.lastAt = new Date().toISOString();
    localStorage.setItem(progressKey, JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
}

function openPractice() {
  const topic = topics[currentContext].find(item => item.id === topicSelect.value) || topics[currentContext][0];
  const duration = document.querySelector('#durationSelect').value;
  const difficulty = document.querySelector('#difficultySelect').value;
  const title = `${contextNames[currentContext]} · ${skillNames[currentSkill]}`;
  exerciseCompleted = false;
  content.innerHTML = `<div class="practice-meta"><span>${topic.label}・${difficulty === 'beginner' ? '入門' : difficulty === 'advanced' ? '進階' : '中階'}</span><span class="timer-pill" id="practiceTimer">${duration}:00</span></div>
    <h2>${title}</h2><p class="dialog-lede">${topic.scenario}</p>${getTaskMarkup(topic, duration, difficulty)}
    <p class="timer-message" id="timerMessage">依照你的時長練習；時間到仍可繼續完成。</p>
    <button class="dialog-submit" id="submitAnswer" type="button">完成練習並查看建議 →</button><div id="feedback" aria-live="polite"></div>`;
  document.querySelector('.dialog-eyebrow').textContent = `FOCUSED PRACTICE · ${duration} MIN`;
  dialog.showModal();
  startTimer(duration);

  document.querySelector('#playPrompt')?.addEventListener('click', () => {
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      document.querySelector('#timerMessage').textContent = '這個瀏覽器不支援語音播放，請展開文字稿完成聽力題。';
      return;
    }
    stopSpeech();
    currentSpeech = new SpeechSynthesisUtterance(topic.audio);
    currentSpeech.lang = 'en-US';
    window.speechSynthesis.speak(currentSpeech);
  });

  document.querySelector('#submitAnswer').addEventListener('click', () => {
    const answer = document.querySelector('#answerInput').value.trim();
    const feedback = document.querySelector('#feedback');
    if (!answer) {
      feedback.innerHTML = '<div class="feedback-result">先寫下幾個關鍵字或句子，再完成練習喔。</div>';
      document.querySelector('#answerInput').focus();
      return;
    }
    if (exerciseCompleted) return;
    exerciseCompleted = true;
    stopTimer();
    stopSpeech();
    const saved = saveCompletion();
    updateProgressSummary();
    const completionMessage = currentContext === 'natural'
      ? `<b>自然英文觀察</b><br>${topic.note}<br><span>可帶走的說法：<strong>${topic.phrase}</strong></span>`
      : `<b>${skillNames[currentSkill]}自我檢查</b><br>${topic.note}<br><span>${currentSkill === 'listening' || currentSkill === 'reading' ? '回到音訊或文章，找出支持答案的線索。' : '再讀一次你的草稿，確認主要訊息和情境相符。'}</span>`;
    const saveMessage = saved
      ? '只更新本機完成摘要；沒有保存這次回答。'
      : '本次完成，但瀏覽器未允許本機儲存進度。';
    feedback.innerHTML = `<div class="feedback-result">${completionMessage}<small class="privacy-note">${saveMessage}</small></div>`;
    document.querySelector('#submitAnswer').textContent = '練習已完成 ✓';
    document.querySelector('#submitAnswer').disabled = true;
    feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

document.querySelector('#startPractice').addEventListener('click', openPractice);
document.querySelector('#closeDialog').addEventListener('click', () => {
  stopTimer(); stopSpeech(); dialog.close();
});
dialog.addEventListener('close', () => { stopTimer(); stopSpeech(); });
dialog.addEventListener('click', event => {
  if (event.target === dialog) { stopTimer(); stopSpeech(); dialog.close(); }
});

updateTopicOptions();
updatePreferenceSummary();
updateProgressSummary();

const contextNames = { business: '商業英文', academic: '學術英文', natural: '道地英文分析' };
const skillNames = { speaking: '口說', listening: '聽力', reading: '閱讀', writing: '寫作' };
let currentContext = 'business';
let currentSkill = 'speaking';
const dialog = document.querySelector('#practiceDialog');
const content = document.querySelector('#practiceContent');

document.querySelectorAll('.choice').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.choice').forEach(item => item.classList.remove('active'));
  button.classList.add('active'); currentContext = button.dataset.context;
}));
document.querySelectorAll('.skill-option').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.skill-option').forEach(item => item.classList.remove('selected'));
  button.classList.add('selected'); currentSkill = button.dataset.skill;
}));

const prompts = {
  business: {
    speaking: ['在下次團隊會議中，你要用英文分享一個正在進行的專案。', '試著用 2–3 句話介紹專案進度，並說明一個接下來的行動。'],
    listening: ['在會議中聽取專案更新。', '用瀏覽器朗讀一段簡短的會議更新，聽完後說出負責人與下一步。'],
    reading: ['A project update: “The design team has completed the first round of user interviews. We found that new customers need clearer setup instructions. The team will share a revised draft by Friday.”', '這個團隊發現了什麼？預計何時分享新版草稿？'],
    writing: ['你需要寄信給同事，簡短更新專案進度。', '請寫 2–3 句英文，包含目前進度和下一步。']
  },
  academic: {
    speaking: ['在課堂討論中，說明一個你最近讀到的觀點。', '用 2–3 句話介紹觀點，並簡單說明你是否認同。'],
    listening: ['聽一段簡短的學術分享摘要。', '用瀏覽器朗讀摘要，聽完後說出主張和一項研究發現。'],
    reading: ['Research suggests that short, regular study sessions can improve long-term recall. Learners who revisit information over several days often remember more than those who study the same material in one long session.', '這段文字指出哪一種學習方式較能幫助長期記憶？'],
    writing: ['請練習以清楚、正式的語氣整理一項觀點。', '用 2–3 句英文說明一個觀點，並補上一項支持理由。']
  },
  natural: {
    speaking: ['你想婉轉地請同事再說明一次。', '試著用英文說出這個請求，再看看一種自然又有禮貌的表達方式。'],
    listening: ['聽聽日常對話中的自然說法。', '用瀏覽器朗讀 “Would you mind walking me through that one more time?”，聽聽它如何委婉地請對方再解釋一次。'],
    reading: ['“Would you mind walking me through that one more time?” 這句話常用在工作或學習情境，禮貌地請對方再解釋一次。 “Walk me through” 有帶著某人逐步說明的意思。', '這句話的語氣如何？片語 “walk me through” 在此表示什麼？'],
    writing: ['把直譯的請求改成自然、有禮貌的英文。', '請用英文寫一句話，請同事再說明一次。']
  }
};

function openPractice() {
  const [instruction, task] = prompts[currentContext][currentSkill];
  const title = `${contextNames[currentContext]} · ${skillNames[currentSkill]}`;
  const taskMarkup = currentSkill === 'listening'
    ? `<button class="listen-play" id="playPrompt">▶ 播放聆聽內容</button><div class="prompt-box">${task}</div><textarea class="dialog-input" id="answerInput" placeholder="記下你聽到的重點⋯"></textarea>`
    : currentSkill === 'reading'
      ? `<p class="mini-passage">${instruction}</p><p>${task}</p><textarea class="dialog-input" id="answerInput" placeholder="用中文或英文回答⋯"></textarea>`
      : `<div class="prompt-box">${instruction}</div><p>${task}</p><textarea class="dialog-input" id="answerInput" placeholder="在這裡輸入你的想法⋯"></textarea>`;
  content.innerHTML = `<h2>${title}</h2><p>約 5 分鐘，專注完成這一項練習。</p>${taskMarkup}<button class="dialog-submit" id="submitAnswer">完成練習並查看回饋 →</button><div id="feedback"></div>`;
  dialog.showModal();
  document.querySelector('#playPrompt')?.addEventListener('click', () => {
    const utterance = new SpeechSynthesisUtterance(task.replace('用瀏覽器朗讀一段簡短的會議更新，聽完後說出負責人與下一步。', 'The product team finished testing the new onboarding flow. Maya will share the results on Thursday, and we will decide on next steps at Friday’s meeting.').replace('用瀏覽器朗讀摘要，聽完後說出主張和一項研究發現。', 'Today I will discuss how daily reading habits affect vocabulary growth. Our findings suggest that learners who read for fifteen minutes each day encounter more new words in context.'));
    utterance.lang = 'en-US'; speechSynthesis.cancel(); speechSynthesis.speak(utterance);
  });
  document.querySelector('#submitAnswer').addEventListener('click', () => {
    const answer = document.querySelector('#answerInput').value.trim();
    const feedback = document.querySelector('#feedback');
    if (!answer) { feedback.innerHTML = '<div class="feedback-result">先寫下幾個想法再完成練習喔。</div>'; return; }
    const tips = currentSkill === 'writing' ? '檢查看看：主要訊息是否清楚？句子是否符合情境需要的語氣？試著用一個連接詞讓想法更連貫。' : currentSkill === 'reading' ? '回頭找出支持答案的關鍵字句，並試著用自己的話說明。' : currentSkill === 'listening' ? '回想剛才聽到的關鍵資訊，再聽一次確認細節。這次先抓主旨，再注意人名、日期或下一步。' : '試著把主要觀點放在開頭，再補一個細節或例子。這樣聽的人會更容易跟上。';
    feedback.innerHTML = `<div class="feedback-result"><b>練習完成 ✦</b><br>${tips}<br><span style="color:#71805e">自然表達小提醒：${currentContext === 'business' ? '商務場合常先說重點，再補背景或下一步。' : currentContext === 'academic' ? '學術表達可用清楚的主張與理由連結觀點。' : '留意語氣是否符合你和對方的關係與情境。'}</span></div>`;
    feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}
document.querySelector('#startPractice').addEventListener('click', openPractice);
document.querySelector('#closeDialog').addEventListener('click', () => { speechSynthesis.cancel(); dialog.close(); });
dialog.addEventListener('click', event => { if (event.target === dialog) { speechSynthesis.cancel(); dialog.close(); } });

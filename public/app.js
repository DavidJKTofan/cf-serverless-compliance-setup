/* ============================================================
   Cloudflare SE Learning — Interactive Walkthrough
   Modular architecture: steps loaded from /steps/step-N.html
   ============================================================ */

const TOTAL_STEPS = 8; // 0-7 (Step 7 = optional Knowledge Check quiz)
let currentStep = 0;
let visitedSteps = new Set([0]);
let quizScore = 0;
let quizAnswered = 0;
const QUIZ_TOTAL = 5;
let menuOpen = false;
const loadedSteps = new Set();

// --- Step Loading ---

async function loadStep(stepIndex) {
  if (loadedSteps.has(stepIndex)) return;

  try {
    const resp = await fetch(`/steps/step-${stepIndex}.html`);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const html = await resp.text();

    const section = document.createElement('section');
    section.className = 'step';
    section.setAttribute('data-step', String(stepIndex));
    section.innerHTML = html;

    const container = document.getElementById('stepsContainer');
    container.appendChild(section);
    loadedSteps.add(stepIndex);
  } catch (err) {
    console.error(`Failed to load step ${stepIndex}:`, err);
  }
}

async function loadAllSteps() {
  const promises = [];
  for (let i = 0; i < TOTAL_STEPS; i++) {
    promises.push(loadStep(i));
  }
  await Promise.all(promises);

  // Ensure DOM order matches step order
  const container = document.getElementById('stepsContainer');
  for (let i = 0; i < TOTAL_STEPS; i++) {
    const section = container.querySelector(`.step[data-step="${i}"]`);
    if (section) container.appendChild(section);
  }
}

// --- Menu Panel ---

function toggleMenu() {
  menuOpen = !menuOpen;
  const panel = document.getElementById('menuPanel');
  const overlay = document.getElementById('menuOverlay');
  if (panel) panel.classList.toggle('open', menuOpen);
  if (overlay) overlay.classList.toggle('open', menuOpen);
}

function updateMenuItems() {
  const items = document.querySelectorAll('.menu-item');
  items.forEach((item) => {
    const step = parseInt(item.getAttribute('data-menu-step'), 10);
    item.classList.remove('active', 'visited');
    if (step === currentStep) {
      item.classList.add('active');
    } else if (visitedSteps.has(step)) {
      item.classList.add('visited');
    }
  });
}

// --- Navigation ---

// Step titles used for the "Next" button label
const STEP_TITLES = [
  'Overview',
  'Developer Platform',
  'Business Continuity',
  'Data Security',
  'Jurisdictional Restrictions',
  'Data Localization Suite',
  'Summary',
  'Knowledge Check',
];
const MAIN_STEPS = 7; // Steps 0-6 are the main walkthrough; Step 7 is optional quiz

function goToStep(step) {
  if (step < 0 || step >= TOTAL_STEPS) return;

  const oldSection = document.querySelector(`.step[data-step="${currentStep}"]`);
  const newSection = document.querySelector(`.step[data-step="${step}"]`);

  if (oldSection) oldSection.classList.remove('active');
  if (newSection) newSection.classList.add('active');

  currentStep = step;
  visitedSteps.add(step);

  updateProgress();
  updateMenuItems();
  updateFooterNav();
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Save state
  try {
    sessionStorage.setItem('cf-compliance-step', String(step));
    sessionStorage.setItem('cf-compliance-visited', JSON.stringify([...visitedSteps]));
  } catch (_e) {
    // ignore
  }
}

function updateFooterNav() {
  const backBtn = document.getElementById('navBack');
  const nextBtn = document.getElementById('navNext');
  const nextLabel = document.getElementById('navNextLabel');

  if (!backBtn || !nextBtn || !nextLabel) return;

  // Back button: hidden on first step
  backBtn.style.visibility = currentStep === 0 ? 'hidden' : 'visible';

  // Next button: hidden on Summary (step 6) and Quiz (step 7)
  // Quiz is accessed via the CTA button on the Summary page
  if (currentStep >= MAIN_STEPS - 1) {
    nextBtn.style.visibility = 'hidden';
  } else {
    nextBtn.style.visibility = 'visible';
    if (currentStep === 0) {
      nextLabel.textContent = 'Start the Walkthrough';
    } else {
      nextLabel.textContent = 'Next: ' + STEP_TITLES[currentStep + 1];
    }
  }
}

function updateProgress() {
  const fill = document.getElementById('progressFill');
  const label = document.getElementById('progressLabel');
  // Progress bar caps at step 6 (summary) — step 7 (quiz) is optional
  const displayStep = Math.min(currentStep, MAIN_STEPS - 1);
  const pct = displayStep === 0 ? 0 : (displayStep / (MAIN_STEPS - 1)) * 100;
  if (fill) fill.style.width = pct + '%';
  if (label) label.textContent = `${displayStep} / ${MAIN_STEPS - 1}`;
}

// --- Accordion ---

function toggleAccordion(trigger) {
  const expanded = trigger.getAttribute('aria-expanded') === 'true';
  const content = trigger.nextElementSibling;

  // Close all in same accordion
  const accordion = trigger.closest('.accordion');
  if (accordion) {
    accordion.querySelectorAll('.accordion-trigger').forEach((t) => {
      t.setAttribute('aria-expanded', 'false');
      if (t.nextElementSibling) t.nextElementSibling.classList.remove('open');
    });
  }

  if (!expanded) {
    trigger.setAttribute('aria-expanded', 'true');
    if (content) content.classList.add('open');
  }
}

// --- Tabs ---

function switchTab(tabBtn, panelId) {
  const tabContainer = tabBtn.parentElement;
  tabContainer.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
  tabBtn.classList.add('active');

  const parent = tabContainer.parentElement;
  parent.querySelectorAll('.tab-panel').forEach((p) => p.classList.remove('active'));
  const panel = document.getElementById(panelId);
  if (panel) panel.classList.add('active');
}

// --- Jurisdiction Selector ---

function selectJurisdiction(pill, type) {
  const pills = pill.parentElement.querySelectorAll('.pill');
  pills.forEach((p) => p.classList.remove('active'));
  pill.classList.add('active');

  document.getElementById('jurisdiction-eu').style.display = type === 'eu' ? 'block' : 'none';
  document.getElementById('jurisdiction-fedramp').style.display = type === 'fedramp' ? 'block' : 'none';
}

// --- Code Copy ---

function copyCode(btn) {
  const codeBlock = btn.closest('.code-block');
  const code = codeBlock.querySelector('code');
  if (!code) return;

  navigator.clipboard
    .writeText(code.textContent)
    .then(() => {
      btn.textContent = 'Copied';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = 'Copy';
        btn.classList.remove('copied');
      }, 2000);
    })
    .catch(() => {
      // Fallback for older browsers
      const range = document.createRange();
      range.selectNodeContents(code);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      document.execCommand('copy');
      sel.removeAllRanges();
      btn.textContent = 'Copied';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = 'Copy';
        btn.classList.remove('copied');
      }, 2000);
    });
}

// --- Quiz ---

function checkAnswer(btn, isCorrect) {
  const questionEl = btn.closest('.quiz-question');
  const options = questionEl.querySelectorAll('.quiz-option');
  const feedback = questionEl.querySelector('.quiz-feedback');

  // Disable all options
  options.forEach((opt) => {
    opt.disabled = true;
    if (opt === btn) {
      opt.classList.add(isCorrect ? 'correct' : 'wrong');
    }
    // Highlight the correct answer if wrong was selected
    if (!isCorrect && opt.getAttribute('onclick')?.includes('true')) {
      opt.classList.add('correct');
    }
  });

  if (isCorrect) {
    quizScore++;
    feedback.textContent = 'Correct!';
    feedback.style.color = '#2ea44f';
  } else {
    feedback.textContent = 'Not quite. The correct answer is highlighted above.';
    feedback.style.color = '#d93025';
  }

  quizAnswered++;

  // Move to next question after delay
  setTimeout(() => {
    const nextQ = questionEl.nextElementSibling;
    if (nextQ && nextQ.classList.contains('quiz-question')) {
      questionEl.classList.remove('active');
      nextQ.classList.add('active');
      updateQuizProgress(quizAnswered + 1);
    } else {
      questionEl.classList.remove('active');
      showQuizScore();
    }
  }, 1200);
}

function updateQuizProgress(questionNum) {
  const label = document.getElementById('quizProgressLabel');
  const fill = document.getElementById('quizProgressFill');
  if (label) label.textContent = `Question ${questionNum} of ${QUIZ_TOTAL}`;
  if (fill) fill.style.width = `${(questionNum / QUIZ_TOTAL) * 100}%`;
}

function showQuizScore() {
  const scoreEl = document.getElementById('quizScore');
  const scoreText = document.getElementById('scoreText');
  const scoreMsg = document.getElementById('scoreMessage');
  const quizEl = document.getElementById('quiz');
  const progressEl = document.getElementById('quizProgress');

  if (quizEl) quizEl.style.display = 'none';
  if (progressEl) progressEl.style.display = 'none';
  if (scoreEl) scoreEl.style.display = 'block';
  if (scoreText) scoreText.textContent = `${quizScore}/${QUIZ_TOTAL}`;

  if (scoreMsg) {
    if (quizScore === QUIZ_TOTAL) {
      scoreMsg.textContent = 'Perfect score! Solid understanding of compliance-aware serverless setups.';
    } else if (quizScore >= 3) {
      scoreMsg.textContent = 'Good job! Review the sections you missed for a complete understanding.';
    } else {
      scoreMsg.textContent = 'Consider reviewing the walkthrough again to strengthen your knowledge.';
    }
  }
}

function resetQuiz() {
  quizScore = 0;
  quizAnswered = 0;

  const quizEl = document.getElementById('quiz');
  const scoreEl = document.getElementById('quizScore');
  const progressEl = document.getElementById('quizProgress');

  if (quizEl) quizEl.style.display = 'block';
  if (scoreEl) scoreEl.style.display = 'none';
  if (progressEl) progressEl.style.display = 'flex';
  updateQuizProgress(1);

  const questions = document.querySelectorAll('.quiz-question');
  questions.forEach((q, i) => {
    q.classList.toggle('active', i === 0);
    q.querySelectorAll('.quiz-option').forEach((opt) => {
      opt.disabled = false;
      opt.classList.remove('correct', 'wrong');
    });
    const feedback = q.querySelector('.quiz-feedback');
    if (feedback) feedback.textContent = '';
  });
}

// --- Keyboard Navigation ---

document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

  // Close menu on Escape
  if (e.key === 'Escape' && menuOpen) {
    toggleMenu();
    return;
  }

  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    e.preventDefault();
    if (currentStep < TOTAL_STEPS - 1) goToStep(currentStep + 1);
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault();
    if (currentStep > 0) goToStep(currentStep - 1);
  }
});

// --- Init ---

document.addEventListener('DOMContentLoaded', async () => {
  // Load all step HTML partials
  await loadAllSteps();

  // Restore state from session
  let initialStep = 0;
  try {
    const savedVisited = sessionStorage.getItem('cf-compliance-visited');
    if (savedVisited) {
      visitedSteps = new Set(JSON.parse(savedVisited));
    }
    const saved = sessionStorage.getItem('cf-compliance-step');
    if (saved !== null) {
      const step = parseInt(saved, 10);
      if (step >= 0 && step < TOTAL_STEPS) {
        initialStep = step;
      }
    }
  } catch (_e) {
    // ignore
  }

  // Activate the initial step
  goToStep(initialStep);
});

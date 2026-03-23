const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const statusTextEl = document.getElementById('statusText');
const scoreXEl = document.getElementById('scoreXVal');
const scoreOEl = document.getElementById('scoreOVal');
const scoreTieEl = document.getElementById('scoreTieVal');
const scoreXCard = document.getElementById('scoreX');
const scoreOCard = document.getElementById('scoreO');
const winLineEl = document.getElementById('winLine');

const WIN_COMBOS = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

const WIN_LINE_STYLES = [
  { top:'18%', left:'5%', width:'90%', height:'4px', transform:'none' },
  { top:'50%', left:'5%', width:'90%', height:'4px', transform:'none' },
  { top:'82%', left:'5%', width:'90%', height:'4px', transform:'none' },
  { top:'5%', left:'18%', width:'4px', height:'90%', transform:'none' },
  { top:'5%', left:'50%', width:'4px', height:'90%', transform:'none' },
  { top:'5%', left:'82%', width:'4px', height:'90%', transform:'none' },
  { top:'50%', left:'50%', width:'128%', height:'4px', transform:'translate(-50%,-50%) rotate(45deg)' },
  { top:'50%', left:'50%', width:'128%', height:'4px', transform:'translate(-50%,-50%) rotate(-45deg)' },
];

let board = Array(9).fill(null);
let current = 'X';
let gameOver = false;
let scores = { X: 0, O: 0, T: 0 };
let cells = [];

function init() {
  boardEl.innerHTML = '';
  cells = [];
  winLineEl.classList.remove('show');
  winLineEl.style.cssText = '';

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.innerHTML = '<span class="mark"></span>';
    cell.addEventListener('click', () => handleClick(i));
    boardEl.appendChild(cell);
    cells.push(cell);
  }

  board = Array(9).fill(null);
  current = 'X';
  gameOver = false;
  updateStatus();
  updateActiveCard();
}

function handleClick(i) {
  if (gameOver) {
    init();
    return;
  }
  if (board[i]) return;

  board[i] = current;

  const cell = cells[i];
  cell.classList.add('taken', current.toLowerCase());
  cell.querySelector('.mark').textContent = current;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => cell.classList.add('show'));
  });

  const winCombo = checkWin();
  if (winCombo !== null) {
    gameOver = true;
    scores[current]++;
    updateScores();
    highlightWin(winCombo);
    showWinLine(winCombo);
    setStatus('win', `${current} тоглогч ялав! 🎉`);
    spawnConfetti();
    return;
  }

  if (board.every(Boolean)) {
    gameOver = true;
    scores.T++;
    updateScores();
    setStatus('draw', 'Тэнцсэн тоглоом!');
    return;
  }

  current = current === 'X' ? 'O' : 'X';
  updateStatus();
  updateActiveCard();
}

function checkWin() {
  for (let i = 0; i < WIN_COMBOS.length; i++) {
    const [a, b, c] = WIN_COMBOS[i];
    if (board[a] && board[a] === board[b] && board[b] === board[c]) return i;
  }
  return null;
}

function highlightWin(comboIdx) {
  WIN_COMBOS[comboIdx].forEach(i => cells[i].classList.add('winner'));
}

function showWinLine(comboIdx) {
  const s = WIN_LINE_STYLES[comboIdx];
  Object.assign(winLineEl.style, s);
  winLineEl.classList.add('show');
}

function updateStatus() {
  setStatus(`turn-${current.toLowerCase()}`, `${current} ийн ээлж`);
}

function setStatus(cls, text) {
  statusEl.className = `status ${cls}`;
  statusTextEl.textContent = text;
}

function updateActiveCard() {
  scoreXCard.className = 'score-card' + (current === 'X' ? ' active-x' : '');
  scoreOCard.className = 'score-card' + (current === 'O' ? ' active-o' : '');
}

function updateScores() {
  scoreXEl.textContent = scores.X;
  scoreOEl.textContent = scores.O;
  scoreTieEl.textContent = scores.T;
}

boardEl.addEventListener('mouseover', e => {
  const cell = e.target.closest('.cell');
  if (!cell || gameOver) return;
  if (cell.classList.contains('taken')) return;
  cell.setAttribute('data-ghost', current);
  cell.classList.remove('ghost-x', 'ghost-o');
  cell.classList.add(current === 'X' ? 'ghost-x' : 'ghost-o');
});

boardEl.addEventListener('mouseout', e => {
  const cell = e.target.closest('.cell');
  if (cell) cell.classList.remove('ghost-x', 'ghost-o');
});

function spawnConfetti() {
  const colors = ['#ff4d6d', '#4dffd2', '#f5c542', '#a78bfa', '#fb923c'];
  for (let i = 0; i < 60; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.cssText = `
      left: ${Math.random() * 100}vw;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${1.5 + Math.random() * 2}s;
      animation-delay: ${Math.random() * 0.6}s;
      width: ${6 + Math.random() * 8}px;
      height: ${6 + Math.random() * 8}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
    `;
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }
}

init();
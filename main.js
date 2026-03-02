const bodyEl = document.getElementById("body");
const clothesEl = document.getElementById("clothes");
const faceEl = document.getElementById("face");
const effectEl = document.getElementById("effect");
function updateCharacterVisual() {
  // Expressió segons estrès
  if (state.estrès > 60) {
    faceEl.style.background = "#ffaaaa";
  } else {
    faceEl.style.background = "#f2c9a0";
  }

  // Efecte mala olor
  if (state.mentidesCV >= 2) {
    effectEl.textContent = "😰";
  } else {
    effectEl.textContent = "";
  }
}
// ==========================
// ESTAT DEL JUGADOR
// ==========================
const state = {
  confiança: 50,
  estrès: 30,
  olor: 0,
  professionalitat: 50,
  energia: 50,
  mentidesCV: 0
};

// ==========================
// REFERÈNCIES DOM
// ==========================
const textEl = document.getElementById("text");
const choicesEl = document.getElementById("choices");
const sceneNameEl = document.getElementById("sceneName");
const hudEl = document.getElementById("hud");

// ==========================
// HUD
// ==========================
function renderHud() {
  hudEl.innerHTML = `
    <span class="pill">Confiança: ${state.confiança}</span>
    <span class="pill">Estrès: ${state.estrès}</span>
    <span class="pill">Professionalitat: ${state.professionalitat}</span>
    <span class="pill">Mentides CV: ${state.mentidesCV}</span>
  `;
}
updateCharacterVisual();

// ==========================
// ESCENES
// ==========================
let selectedSkills = [];

const skills = [
  { name: "Excel nivell avançat", lie: false, effect: () => state.professionalitat += 10 },
  { name: "Treball en equip", lie: false, effect: () => state.confiança += 5 },
  { name: "C2 anglès", lie: true, effect: () => { state.confiança += 8; state.mentidesCV += 1; } },
  { name: "Lideratge d’equips de 20 persones", lie: true, effect: () => { state.professionalitat += 5; state.mentidesCV += 1; } },
  { name: "Gestió d’estrès", lie: false, effect: () => state.estrès -= 5 },
  { name: "Programació en 7 llenguatges", lie: true, effect: () => { state.professionalitat += 7; state.mentidesCV += 1; } }
];

function renderCVScene() {
  sceneNameEl.textContent = "Preparant el CV";
  textEl.textContent = `Selecciona 3 habilitats per incloure al teu CV (${selectedSkills.length}/3)`;

  choicesEl.innerHTML = "";

  skills.forEach(skill => {
    const btn = document.createElement("button");
    btn.className = "choice";
    btn.textContent = skill.name;

    btn.onclick = () => {
      if (selectedSkills.includes(skill.name)) return;

      if (selectedSkills.length >= 3) {
        alert("Només pots seleccionar 3 habilitats!");
        return;
      }

      selectedSkills.push(skill.name);
      skill.effect();
      renderCVScene();
      renderHud();
    };

    choicesEl.appendChild(btn);
  });

  if (selectedSkills.length === 3) {
    const continueBtn = document.createElement("button");
    continueBtn.className = "choice";
    continueBtn.textContent = "Continuar →";
    continueBtn.onclick = goToInterviewIntro;
    choicesEl.appendChild(continueBtn);
  }
}

// ==========================
// SEGÜENT ESCENA (intro entrevista)
// ==========================
function goToInterviewIntro() {
  sceneNameEl.textContent = "Dia de l'entrevista";
  
  let text = "Arribes a l'entrevista amb el teu CV imprès. ";
  
  if (state.mentidesCV >= 2) {
    text += "Sents una veu interior que diu: 'Esperem que no preguntin massa...' 😅";
    state.estrès += 10;
  } else {
    text += "Et sents relativament coherent amb el que has escrit.";
    state.confiança += 5;
  }

  textEl.textContent = text;
  choicesEl.innerHTML = `
    <button class="choice" onclick="alert('Continuarà...')">Entrar a l'edifici</button>
  `;

  renderHud();
}

// ==========================
// INICI
// ==========================
renderHud();
renderCVScene();

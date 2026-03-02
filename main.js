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
let companyType = null;
// ==========================
// REFERÈNCIES DOM
// ==========================
const textEl = document.getElementById("text");
const choicesEl = document.getElementById("choices");
const sceneNameEl = document.getElementById("sceneName");
const hudEl = document.getElementById("hud");

const bodyEl = document.getElementById("body");
const clothesEl = document.getElementById("clothes");
const faceEl = document.getElementById("face");
const effectEl = document.getElementById("effect");

// ==========================
// ACTUALITZAR PERSONATGE
// ==========================
function updateCharacterVisual() {

  const mouth = document.getElementById("mouth");
  const aura = document.getElementById("aura");
  const character = document.getElementById("characterWrap");

  // Cara segons estrès
  if (state.estrès > 50) {
    mouth.style.borderBottom = "3px solid red";
    character.classList.add("nervous");
  } else {
    mouth.style.borderBottom = "3px solid black";
    character.classList.remove("nervous");
  }

  // Roba segons professionalitat
  if (state.professionalitat > 60) {
    clothesEl.style.background = "#1f3a93";
  } else if (state.professionalitat < 40) {
    clothesEl.style.background = "#6b2c2c";
  } else {
    clothesEl.style.background = "#2c3e50";
  }

  // Aura si fa mala olor
  if (state.olor >= 30) {
    aura.style.opacity = "1";
  } else {
    aura.style.opacity = "0";
  }
}
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
  updateCharacterVisual();
}

// ==========================
// PERFIL REAL
// ==========================
function renderProfileScene() {
  sceneNameEl.textContent = "El teu perfil real";

  textEl.textContent = `
Aquest és el teu perfil real:

• Anglès: B1 funcional
• Experiència laboral: 1 any
• No has liderat equips grans
• Excel: nivell mig
• Saps programar en 1 llenguatge

Ara hauràs de decidir què poses al CV.
`;

  choicesEl.innerHTML = `
    <button class="choice" onclick="renderCompanySelection()"
      Començar a preparar el CV →
    </button>
  `;

  renderHud();
}

// ==========================
// CV
// ==========================
let selectedSkills = [];

const skills = [
  { name: "Excel nivell avançat", lie: false },
  { name: "Treball en equip", lie: false },
  { name: "C2 anglès", lie: true },
  { name: "Lideratge d’equips de 20 persones", lie: true },
  { name: "Gestió d’estrès", lie: false },
  { name: "Programació en 7 llenguatges", lie: true }
];
function renderCompanySelection() {

  sceneNameEl.textContent = "Has aplicat a...";

  textEl.textContent = `
Abans de preparar el CV, recordes que has aplicat a:
`;

  choicesEl.innerHTML = "";

  const corpBtn = document.createElement("button");
  corpBtn.className = "choice";
  corpBtn.textContent = "🏢 Corporació tradicional";
  corpBtn.onclick = () => {
    companyType = "corporacio";
    renderCVScene();
  };

  const startupBtn = document.createElement("button");
  startupBtn.className = "choice";
  startupBtn.textContent = "🚀 Startup moderna";
  startupBtn.onclick = () => {
    companyType = "startup";
    renderCVScene();
  };

  const ongBtn = document.createElement("button");
  ongBtn.className = "choice";
  ongBtn.textContent = "🧠 ONG social";
  ongBtn.onclick = () => {
    companyType = "ong";
    renderCVScene();
  };

  choicesEl.appendChild(corpBtn);
  choicesEl.appendChild(startupBtn);
  choicesEl.appendChild(ongBtn);

  renderHud();
}
function renderCVScene() {

  sceneNameEl.textContent = "Preparant el CV";
  textEl.textContent = `Selecciona 3 habilitats (${selectedSkills.length}/3)`;

  choicesEl.innerHTML = "";

  skills.forEach(skill => {

    const btn = document.createElement("button");
    btn.className = "choice";
    btn.textContent = skill.name;

    if (selectedSkills.includes(skill)) {
      btn.style.border = "2px solid #42e6a4";
      btn.style.background = "#1e3d32";
    }

    btn.onclick = () => {

      if (selectedSkills.includes(skill)) return;

      if (selectedSkills.length >= 3) {
        alert("Només pots seleccionar 3 habilitats!");
        return;
      }

      selectedSkills.push(skill);
if (skill.lie) {
  state.mentidesCV += 1;
  state.confiança += 5;
  state.estrès += 12; // 👈 tensió interna per mentir
}

      renderCVScene();
      renderHud();
    };

    choicesEl.appendChild(btn);
  });

  if (selectedSkills.length === 3) {
    const continueBtn = document.createElement("button");
    continueBtn.className = "choice";
    continueBtn.textContent = "Continuar →";
    continueBtn.onclick = renderBeforeInterviewScene;
    choicesEl.appendChild(continueBtn);
  }

  renderHud();
}

// ==========================
// ABANS ENTREVISTA
// ==========================
function renderBeforeInterviewScene() {

  sceneNameEl.textContent = "Davant l'edifici";

  textEl.textContent = `
Ets davant l'edifici. Tens uns minuts abans d'entrar.

Què fas?
`;

  choicesEl.innerHTML = "";

  const smokeBtn = document.createElement("button");
  smokeBtn.className = "choice";
  smokeBtn.textContent = "🚬 Fumar";
  smokeBtn.onclick = () => {
    state.estrès -= 5;
    state.olor += 40;
    goToInterview();
  };

  const coffeeBtn = document.createElement("button");
  coffeeBtn.className = "choice";
  coffeeBtn.textContent = "☕ Cafè";
  coffeeBtn.onclick = () => {
    state.energia += 10;
    state.olor += 20;
    state.estrès += 5;
    goToInterview();
  };

  const breatheBtn = document.createElement("button");
  breatheBtn.className = "choice";
  breatheBtn.textContent = "🧘 Respirar";
  breatheBtn.onclick = () => {
    state.estrès -= 15;
    state.confiança += 5;
    goToInterview();
  };

  choicesEl.appendChild(smokeBtn);
  choicesEl.appendChild(coffeeBtn);
  choicesEl.appendChild(breatheBtn);

  renderHud();
}

// ==========================
// ENTREVISTA
// ==========================
function goToInterview() {

  if (state.olor >= 30) {
    state.confiança -= 5;
    state.professionalitat -= 5;
  }

  sceneNameEl.textContent = "Entrevista";
  choicesEl.innerHTML = "";

  const liedSkill = selectedSkills.find(skill => skill.lie);

  let intro = "El reclutador revisa el teu CV.";

  if (state.olor >= 30) {
    intro += " Fa una micro pausa estranya mentre respira.";
  }

  if (liedSkill) {

    textEl.textContent =
      intro + `\n\n“Veig que tens: ${liedSkill.name}. Em pots explicar aquesta experiència?”`;

    const improviseBtn = document.createElement("button");
    improviseBtn.className = "choice";
    improviseBtn.textContent = "Improvisar 😅";
    improviseBtn.onclick = () => {

      state.estrès += 15;

      if (Math.random() < 0.5) {
        showResult("Et quedes en blanc.", false);
      } else {
        showResult("La improvisació cola... de moment.", true);
      }
    };

    const admitBtn = document.createElement("button");
    admitBtn.className = "choice";
    admitBtn.textContent = "Admetre exageració";
    admitBtn.onclick = () => {
      state.professionalitat += 5;
      state.confiança -= 5;
      showResult("Valora l’honestedat.", true);
    };

    choicesEl.appendChild(improviseBtn);
    choicesEl.appendChild(admitBtn);

  } else {

    textEl.textContent = intro + "\n\nSembla satisfet amb el teu perfil.";

    const continueBtn = document.createElement("button");
    continueBtn.className = "choice";
    continueBtn.textContent = "Continuar";
    continueBtn.onclick = () =>
      showResult("L'entrevista flueix amb normalitat.", true);

    choicesEl.appendChild(continueBtn);
  }

  renderHud();
}

// ==========================
// RESULTAT
// ==========================
function showResult(message, positive) {

  sceneNameEl.textContent = "Resultat";

let score = 0;

if (companyType === "corporacio") {
  score =
    state.professionalitat * 0.5 +
    state.confiança * 0.2 -
    state.estrès * 0.2 -
    state.mentidesCV * 15 -
    state.olor * 0.3;
}

if (companyType === "startup") {
  score =
    state.confiança * 0.5 +
    state.professionalitat * 0.2 -
    state.estrès * 0.1 -
    state.mentidesCV * 5;
}

if (companyType === "ong") {
  score =
    state.professionalitat * 0.3 +
    state.confiança * 0.2 -
    state.mentidesCV * 20 -
    state.estrès * 0.1;
}

  if (!positive) score -= 15;

  textEl.textContent = message + "\n\n";

  if (score >= 40) {
    textEl.textContent += "Et contactaran aviat.";
  } else {
    textEl.textContent += "Rebràs un correu genèric.";
  }

  choicesEl.innerHTML = `
    <button class="choice" onclick="location.reload()">Tornar a començar</button>
  `;

  renderHud();
}

// ==========================
// INICI
// ==========================
renderHud();
renderProfileScene();

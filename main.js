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

const bodyEl = document.getElementById("body");
const clothesEl = document.getElementById("clothes");
const faceEl = document.getElementById("face");
const effectEl = document.getElementById("effect");

// ==========================
// ACTUALITZAR PERSONATGE
// ==========================
function updateCharacterVisual() {

  // Cara segons estrès
  if (state.estrès > 60) {
    faceEl.style.background = "#ffaaaa";
  } else {
    faceEl.style.background = "#f2c9a0";
  }

  // Roba segons professionalitat
  if (state.professionalitat > 60) {
    clothesEl.style.background = "#1f3a93"; // blau més formal
  } else if (state.professionalitat < 40) {
    clothesEl.style.background = "#6b2c2c"; // més cutre
  } else {
    clothesEl.style.background = "#2c3e50";
  }

  // Efecte si hi ha moltes mentides
  if (state.mentidesCV >= 2) {
    effectEl.textContent = "😰";
  } else {
    effectEl.textContent = "";
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
// CV - MINI JOC
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

function renderCVScene() {
  sceneNameEl.textContent = "Preparant el CV";
  textEl.textContent = `Selecciona 3 habilitats per incloure al teu CV (${selectedSkills.length}/3)`;

  choicesEl.innerHTML = "";

  skills.forEach(skill => {

    const btn = document.createElement("button");
    btn.className = "choice";
    btn.textContent = skill.name;

    // Si està seleccionada → marquem visualment
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

      // Aplicar efectes
      if (skill.lie) {
        state.mentidesCV += 1;
        state.confiança += 5;
      } else {
        state.professionalitat += 5;
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
    continueBtn.onclick = goToInterview;
    choicesEl.appendChild(continueBtn);
  }
}

// ==========================
// ENTREVISTA
// ==========================
function goToInterview() {

  sceneNameEl.textContent = "Entrevista";

  choicesEl.innerHTML = "";

  // Busquem una mentida concreta seleccionada
  const liedSkill = selectedSkills.find(skill => skill.lie);

  if (liedSkill) {

    textEl.textContent =
      `El reclutador revisa el teu CV.\n\n“Veig que tens: ${liedSkill.name}. Em pots explicar aquesta experiència?”`;

    const improviseBtn = document.createElement("button");
    improviseBtn.className = "choice";
    improviseBtn.textContent = "Improvisar resposta 😅";
    improviseBtn.onclick = () => {

      state.estrès += 15;

      if (Math.random() < 0.5) {
        showResult("Et quedes en blanc. Silenci incòmode.", false);
      } else {
        showResult("La improvisació cola... de moment.", true);
      }
    };

    const admitBtn = document.createElement("button");
    admitBtn.className = "choice";
    admitBtn.textContent = "Admetre que vas exagerar";
    admitBtn.onclick = () => {
      state.professionalitat += 5;
      state.confiança -= 5;
      showResult("Valora l’honestedat... però ho apunta.", true);
    };

    choicesEl.appendChild(improviseBtn);
    choicesEl.appendChild(admitBtn);

  } else {

    textEl.textContent =
      "El reclutador sembla satisfet amb el teu perfil.";

    const continueBtn = document.createElement("button");
    continueBtn.className = "choice";
    continueBtn.textContent = "Continuar l'entrevista";
    continueBtn.onclick = () =>
      showResult("L'entrevista flueix amb normalitat.", true);

    choicesEl.appendChild(continueBtn);
  }

  renderHud();
}

// ==========================
// RESULTAT FINAL
// ==========================
function showResult(message, positive) {

  sceneNameEl.textContent = "Resultat";

  let score =
    state.professionalitat * 0.4 +
    state.confiança * 0.3 -
    state.estrès * 0.2 -
    state.mentidesCV * 10;

  if (!positive) score -= 15;

  textEl.textContent = message + "\n\n";

  if (score >= 40) {
    textEl.textContent += "Et diuen que et contactaran aviat. (No sona malament...)";
  } else {
    textEl.textContent += "Rebràs un correu genèric en breu. Ja saps quin.";
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
renderCVScene();

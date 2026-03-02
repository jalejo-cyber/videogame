// -----------------------------
// 1) Estat del jugador (stats)
// -----------------------------
const state = {
  confiança: 50,
  estrès: 35,
  olor: 0,              // 0..100 (fum/cafè)
  professionalitat: 50, // 0..100
  energia: 55           // 0..100
};

// -----------------------------
// 2) Helpers de UI
// -----------------------------
const hudEl = document.getElementById("hud");
const textEl = document.getElementById("text");
const choicesEl = document.getElementById("choices");
const sceneNameEl = document.getElementById("sceneName");
const restartBtn = document.getElementById("restartBtn");

const characterWrap = document.getElementById("characterWrap");
const layerBody = document.getElementById("layerBody");
const layerClothes = document.getElementById("layerClothes");
const layerFace = document.getElementById("layerFace");
const layerEffect = document.getElementById("layerEffect");

// Per no petar si no tens assets encara:
function safeImg(el, src, fallbackLabel) {
  el.onerror = () => {
    // Fallback: si no troba imatge, posem una “targeta” amb color
    el.removeAttribute("src");
    el.style.background = "rgba(255,255,255,0.08)";
    el.style.border = "1px dashed rgba(255,255,255,0.25)";
    el.style.borderRadius = "14px";
    el.style.display = "block";
    el.style.inset = "12px";
    el.style.width = "calc(100% - 24px)";
    el.style.height = "calc(100% - 24px)";
    el.style.objectFit = "contain";
    el.alt = fallbackLabel;
  };
  el.src = src;
}

// -----------------------------
// 3) Personatge modular (capes)
// -----------------------------
const character = {
  body: "assets/character/body/base.png",
  clothes: "assets/character/clothes/formal.png",
  face: "assets/character/face/neutral.png",
  effect: "" // smell/smoke o buit
};

function applyCharacter() {
  safeImg(layerBody, character.body, "Cos (placeholder)");
  safeImg(layerClothes, character.clothes, "Roba (placeholder)");
  safeImg(layerFace, character.face, "Cara (placeholder)");

  if (character.effect) {
    layerEffect.style.opacity = "0.95";
    safeImg(layerEffect, character.effect, "Efecte (placeholder)");
  } else {
    layerEffect.removeAttribute("src");
    layerEffect.style.opacity = "0";
  }

  // Animació idle segons estrès
  characterWrap.classList.remove("idle-breath", "idle-nervous");
  if (state.estrès >= 60) characterWrap.classList.add("idle-nervous");
  else characterWrap.classList.add("idle-breath");
}

// -----------------------------
// 4) Render HUD (stats visibles)
// -----------------------------
function clamp(v) { return Math.max(0, Math.min(100, v)); }

function renderHud() {
  const pills = [
    ["Confiança", state.confiança],
    ["Estrès", state.estrès],
    ["Olor", state.olor],
    ["Professionalitat", state.professionalitat],
    ["Energia", state.energia],
  ].map(([k,v]) => `<span class="pill">${k}: <b>${v}</b></span>`).join("");

  hudEl.innerHTML = pills;
}

// -----------------------------
// 5) Escenes (història + decisions)
// -----------------------------
const scenes = {
  start: {
    name: "Abans de l’entrevista",
    text: "Ets davant l’edifici. A dins hi ha una entrevista. A fora hi ha... temptacions. Què fas?",
    onEnter() {
      character.face = "assets/character/face/neutral.png";
      character.clothes = "assets/character/clothes/formal.png";
      character.effect = "";
    },
    choices: [
      {
        label: "🚬 Fumar un cigarret ‘per relaxar-me’ (spoiler: olor)",
        apply() {
          state.estrès = clamp(state.estrès - 8);
          state.olor = clamp(state.olor + 35);
          state.professionalitat = clamp(state.professionalitat - 10);
          character.effect = "assets/character/effects/smoke.png";
          character.face = "assets/character/face/nervous.png";
        },
        next: "coffee"
      },
      {
        label: "☕ Fer un cafè ràpid (energia +, però alè…)",
        apply() {
          state.energia = clamp(state.energia + 15);
          state.olor = clamp(state.olor + 18);
          state.estrès = clamp(state.estrès + 5); // pressa
          character.effect = "assets/character/effects/smell.png";
        },
        next: "coffee"
      },
      {
        label: "🧘 Respirar 30 segons i repassar 3 punts clau",
        apply() {
          state.estrès = clamp(state.estrès - 15);
          state.confiança = clamp(state.confiança + 10);
          state.professionalitat = clamp(state.professionalitat + 5);
          character.face = "assets/character/face/neutral.png";
          character.effect = "";
        },
        next: "coffee"
      }
    ]
  },

  coffee: {
    name: "Porta d’entrada",
    text: "El recepcionista et mira com si fos un CAPTCHA: ‘Demostra que ets humà i solvent’.",
    onEnter() {
      // si fas pudor, el joc ho comenta amb humor/crítica
      if (state.olor >= 30) {
        character.face = "assets/character/face/nervous.png";
      }
    },
    choices: [
      {
        label: "🙂 Somriure i dir: “Bon dia, vinc per l’entrevista.”",
        apply() {
          state.confiança = clamp(state.confiança + 5);
          state.professionalitat = clamp(state.professionalitat + 5);
        },
        next: "interview"
      },
      {
        label: "📱 Mirar el mòbil com si estiguessis molt ocupat (dominància?)",
        apply() {
          state.confiança = clamp(state.confiança + 3);
          state.professionalitat = clamp(state.professionalitat - 8);
          state.estrès = clamp(state.estrès + 6);
        },
        next: "interview"
      }
    ]
  },

  interview: {
    name: "Entrevista",
    text: "",
    onEnter() {
      // Text dinàmic segons stats (aquí entra la crítica social)
      let intro = "El reclutador et dóna la mà amb entusiasme corporatiu. ";
      if (state.olor >= 40) {
        intro += "Fa una micro-pausa. Somriu. Però els seus narius presenten una queixa formal. 🤢 ";
        state.confiança = clamp(state.confiança - 6);
      }
      if (state.estrès >= 60) {
        intro += "Sents que el teu cor fa sprint sense escalfar. ";
      }
      intro += "Pregunta: “Per què vols treballar aquí?”";
      textEl.textContent = intro;

      // cara segons confiança
      character.face = state.confiança >= 55
        ? "assets/character/face/neutral.png"
        : "assets/character/face/nervous.png";

      // olor -> efecte
      character.effect = (state.olor >= 30)
        ? "assets/character/effects/smell.png"
        : "";
    },
    choices: [
      {
        label: "🧠 “M’atrau el projecte i vull aportar valor (de veritat).”",
        apply() {
          state.professionalitat = clamp(state.professionalitat + 10);
          state.confiança = clamp(state.confiança + 5);
        },
        next: "result"
      },
      {
        label: "💬 “M’encanta la vostra cultura… sobretot els bean bags.”",
        apply() {
          // crítica social: postureig de cultura corporativa
          state.professionalitat = clamp(state.professionalitat - 5);
          state.confiança = clamp(state.confiança + 3);
        },
        next: "result"
      },
      {
        label: "💸 “Sincerament? Necessito pagar el lloguer.”",
        apply() {
          // honestedat valenta però arriscada
          state.confiança = clamp(state.confiança + 8);
          state.professionalitat = clamp(state.professionalitat - 2);
        },
        next: "result"
      }
    ]
  },

  result: {
    name: "Resultat",
    text: "",
    onEnter() {
      // Simple sistema de final
      const score =
        state.professionalitat * 0.5 +
        state.confiança * 0.3 +
        state.energia * 0.2 -
        state.olor * 0.35 -
        state.estrès * 0.15;

      let ending;
      if (score >= 55) ending = "offer";
      else if (score >= 40) ending = "maybe";
      else ending = "ghosted";

      const endingsText = {
        offer: "Et diuen: “Ens agrada la teva energia.” (No especifiquen quina.) Tens oferta! ✅",
        maybe: "Et diuen: “Ja et direm coses.” Traducció: potser sí, potser no, potser mai. 🤝",
        ghosted: "Silenci administratiu. El teu email entra al forat negre del ‘No-Reply’. 👻"
      };

      textEl.textContent = endingsText[ending];

      // visual final
      if (ending === "offer") {
        character.face = "assets/character/face/neutral.png";
        character.effect = "";
      } else if (ending === "maybe") {
        character.face = "assets/character/face/nervous.png";
      } else {
        character.face = "assets/character/face/nervous.png";
        character.effect = "assets/character/effects/smell.png";
      }

      restartBtn.hidden = false;
    },
    choices: []
  }
};

// -----------------------------
// 6) Motor de navegació d'escenes
// -----------------------------
let currentSceneId = "start";

function renderScene() {
  const scene = scenes[currentSceneId];
  sceneNameEl.textContent = scene.name;

  if (scene.onEnter) scene.onEnter();

  // si l'escena no ha posat textEl (com interview result), el posem des d'aquí
  if (scene.text) textEl.textContent = scene.text;

  choicesEl.innerHTML = "";
  for (const ch of scene.choices) {
    const btn = document.createElement("button");
    btn.className = "choice";
    btn.textContent = ch.label;
    btn.onclick = () => {
      if (ch.apply) ch.apply();
      restartBtn.hidden = true;
      currentSceneId = ch.next;
      applyCharacter();
      renderHud();
      renderScene();
    };
    choicesEl.appendChild(btn);
  }

  applyCharacter();
  renderHud();
}

restartBtn.addEventListener("click", () => {
  // reset
  state.confiança = 50;
  state.estrès = 35;
  state.olor = 0;
  state.professionalitat = 50;
  state.energia = 55;

  character.body = "assets/character/body/base.png";
  character.clothes = "assets/character/clothes/formal.png";
  character.face = "assets/character/face/neutral.png";
  character.effect = "";

  currentSceneId = "start";
  restartBtn.hidden = true;
  renderScene();
});

// start
renderScene();

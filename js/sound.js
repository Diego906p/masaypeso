/* Sonidos del juego (archivos MP3 locales, volumen normalizado a -16 LUFS).
   Cada categoría reproduce UN sonido aleatorio por vez.
   API: Sound.correct(), Sound.wrong(), Sound.victory(), Sound.enabled(bool) */
const Sound = (function(){
  const BASE = "sonidos/";
  const SETS = {
    correct: [
      "5-minutos-despues-bob-sponja.mp3",
      "bob-esponja-flauta.mp3",
      "al-dia-siguiente.mp3"
    ],
    wrong: [
      "uh-roblox-death-sound.mp3",
      "se-me-chispoteo-chavo.mp3"
    ],
    victory: [
      "michael-jackson-hee-hee.mp3"
    ]
  };

  let on = true;
  let currentAudio = null;

  function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

  function play(category){
    if(on === false) return;
    const file = pick(SETS[category]);
    if(!file) return;
    try{
      // corta el sonido anterior para no solaparlos
      if(currentAudio){ currentAudio.pause(); currentAudio.currentTime = 0; }
      const a = new Audio(BASE + file);
      a.volume = 0.7;
      currentAudio = a;
      a.play().catch(()=>{}); // ignora bloqueos de autoplay
    }catch(e){}
  }

  return {
    enabled(v){ on = v !== false; },
    correct(){ play("correct"); },
    wrong(){ play("wrong"); },
    victory(){ play("victory"); }
  };
})();

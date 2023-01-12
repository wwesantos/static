const play = get("#play");
const selectVoice = get("#selectVoice");
const input = get("#input");
const speed = get("#speed");
const synth = window.speechSynthesis;
let voices = [];

if ("speechSynthesis" in window || "SpeechRecognition" in window) {
  const timer = setInterval(() => {
    const voicesLoaded = speechSynthesis.getVoices();
    if (voicesLoaded.length !== 0) {
      voices = voicesLoaded.filter(voice => voice.lang.indexOf("en") > -1);
      voices.forEach((voice, i) => {
        const option = document.createElement("option");
        option.innerText = `${voice.name} / ${voice.lang}`;
        option.value = i;
        selectVoice.appendChild(option);
      });
      clearInterval(timer);
    }
  }, 200);
} else {
  showError("This Browser doesn't support this Text to Speech.");
  play.style.display = "none";
}

get("#play").addEventListener("click", e => {
  e.preventDefault();
  const utterThis = new SpeechSynthesisUtterance(input.value);
  utterThis.voice = voices[selectVoice.selectedIndex];
  utterThis.rate = speed.value;
  synth.speak(utterThis);
});
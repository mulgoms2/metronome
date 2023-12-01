//
window.onload = function () {
  let metronome = new Metronome();

  document.addEventListener("keydown", (e) => {
    if (e.key === " ") {
      metronome.playAndStop(metronome);
    }
  });
};

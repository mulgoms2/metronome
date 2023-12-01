// 템포 슬라이더가 표시되는 숫자를 변경해줘요. //
document.querySelector(".tempoSlider").addEventListener("input", () => {
  // 템포 표시기의 숫자를 변경시켜요.
  document.querySelector(".tempo").value = document.querySelector(".tempoSlider").value;

  // 소리가 재생중이었다면 새로운 템포로 재생시켜요.
  if (isPlaying) playInterval();

  // 빠르기말 표시기를 변화시켜줘요.
  tempoSignature();
});
// 템포 버튼으로 화면의 숫자를 변경해요. //

const onMinus = (e) => {
  // 버튼이 가진 값만큼 tempo의 value를 변경한다.
  document.querySelector(".tempo").value -= e.target.textContent;

  tempoSignature();
};

const onPlus = (e) => {
  // 눌린 버튼의 값
  const BUTTON_VALUE = parseInt(e.target.textContent);
  const PLUS_ONE = 1;
  const PLUS_FIVE = 5;

  // 템포 표시기.
  const tempo = document.querySelector(".tempo");
  const prevVal = parseInt(tempo.value);
  // 빠르기말 표시기
  tempoSignature();

  //
  tempo.value = String(BUTTON_VALUE === PLUS_ONE ? prevVal + PLUS_ONE : prevVal + PLUS_FIVE);
};

document.querySelector(".minusOneStep").addEventListener("click", onMinus);
document.querySelector(".minusFiveStep").addEventListener("click", onMinus);

document.querySelector(".plusOneStep").addEventListener("click", onPlus);
document.querySelector(".plusFiveStep").addEventListener("click", onPlus);

// 메트로놈 소리재생 //
const playBtn = document.querySelector(".play");

// audioContext 객체의 oscillator 를 이용해서 소리를 만든다.
const audioContext = new window.AudioContext();
const oscillator = audioContext.createOscillator();
// 출력장치와 연결을 맺어주는 것 같아요.
oscillator.connect(audioContext.destination);
oscillator.frequency.setValueAtTime(0, audioContext.currentTime); // set the frequency (Hz)
oscillator.start();

// 소리 반복재생을 진행하는 setInterval 메서드의 키값이다.
let intervalId;
let isPlaying = false;

// 스페이스바로 메트로놈을 켜고 끌 수 있어요.
document.addEventListener("keydown", (e) => {
  if (e.key === " ") {
    playBtn.click();
  }
});

// 재생버튼이 눌렸을때 소리를 만들어주는 메서드이다.
const playSound = () => {
  oscillator.frequency.setValueAtTime(500, audioContext.currentTime);
  oscillator.frequency.setValueAtTime(0, audioContext.currentTime + 0.05);
};

// 멈추기 버튼이 눌렸을 때 실행될 함수이다.
const stopSound = () => {
  oscillator.frequency.setValueAtTime(0, audioContext.currentTime);

  clearInterval(intervalId);
};

// 너무 많은 기능을 담당하고있어요. 분리할 필요가 있겠어요.
const playAndStop = () => {
  const PLAY_BUTTON = `<i class="fa-solid fa-play"></i>`;
  const STOP_BUTTON = `<i class="fa-solid fa-stop" aria-hidden="true"></i>`;

  // 재생중에 메서드가 실행되면 재생을 중단해요.
  if (isPlaying) {
    // 소리를 중단하고, 버튼모양을 재생모양으로 바꾼 후 메서드를 종료한다.
    stopSound();
    playBtn.innerHTML = PLAY_BUTTON;
    isPlaying = false;
    return;
  }

  // 재생버튼의 모양을 바꾼 후 소리를 재생시켜요.
  playBtn.innerHTML = STOP_BUTTON;
  isPlaying = true;

  // 응답성 향상을 위해 소리를 먼저 재생 후에 인터벌을 실행해요.
  playSound();
  playInterval();
};

playBtn.addEventListener("click", playAndStop);

let playInterval = () => {
  if (intervalId) clearInterval(intervalId);

  let bpm = 60000 / parseInt(document.querySelector(".tempo").value);

  intervalId = setInterval(function () {
    playSound();
  }, bpm);
};

// 안단테 모데라토 //
let tempoSignature = () => {
  // 빠르기말 표시기를 변경하는 메서드에요.
  const tempo = parseInt(document.querySelector(".tempo").value);
  const indicator = document.querySelector(".beatIndicator");
  const changeTempoSignature = (text) => {
    indicator.innerHTML = text;
  };

  switch (true) {
    case tempo < 60:
      changeTempoSignature("Andante");
      break;
    case tempo < 120:
      changeTempoSignature("Moderato");
      break;
    case tempo < 180:
      changeTempoSignature("Allegro");
      break;
    case tempo < 220:
      changeTempoSignature("Presto");
      break;
  }
};

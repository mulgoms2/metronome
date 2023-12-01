class Metronome {
  #audioContext;
  #oscillator;

  #plusOneBtn;
  #plusFiveBtn;
  #minusOneBtn;
  #minusFiveBtn;

  #tempoSlider;
  #playBtn;

  #tempoIndicator;
  #tempoSignatureIndicator;

  #isPlaying = false;
  #intervalId;

  constructor() {
    this.#audioContext = new window.AudioContext();
    this.#oscillator = this.#audioContext.createOscillator();
    this.#oscillator.connect(this.#audioContext.destination);

    this.#setComponent();
  }

  // 메트로놈의 실행과 정지. 두 상태를 담당하는 메서드에요.
  playAndStop(instance) {
    if (this.#isPlaying) {
      // 소리를 중단하고, 버튼모양을 재생모양으로 바꾼 후 메서드를 종료한다.
      stopSound();
      this.#isPlaying = false;
      this.#changePlayBtn(this.#isPlaying);
      return;
    }

    // 재생버튼의 모양을 바꿔요.
    this.#isPlaying = false;
    this.#changePlayBtn(this.#isPlaying);

    // 응답성 향상을 위해 소리를 먼저 재생 후에 인터벌을 실행해요.
    this.makeSound();
    this.#playInterval(instance);
  }

  #changePlayBtn(isPlaying) {
    const PLAY_BUTTON = `<i class="fa-solid fa-play"></i>`;
    const STOP_BUTTON = `<i class="fa-solid fa-stop" aria-hidden="true"></i>`;

    console.log("here");
    this.#playBtn.innerHTML = isPlaying ? STOP_BUTTON : PLAY_BUTTON;
  }

  #setComponent() {
    // 뷰가 자주 바뀌니까 사실 이 객체가 접근할 게 아니라 외부에서 주입받아야해요.
    // 외부에서 전달받을 때를 대비해서. 각각의 컴포넌트가 최대한 독립적으로 동작할 수 있도록 설계해야 해요.
    // 모든 컴포넌트를 전달받지 않고 최소한으로 동작할 수 있어야 하거든요.
    this.#plusOneBtn = document.querySelector(".plusOneStep");
    this.#plusFiveBtn = document.querySelector(".plusFiveStep");
    this.#minusOneBtn = document.querySelector(".minusOneStep");
    this.#minusFiveBtn = document.querySelector(".minusFiveStep");
    this.#tempoSlider = document.querySelector(".tempoSlider");
    this.#tempoIndicator = document.querySelector(".tempo");
    this.#tempoSignatureIndicator = document.querySelector(".beatIndicator");
    this.#playBtn = document.querySelector(".play");
    // 검사 완료. 모든 컴포넌트가 정상적으로 등록되었어요.
  }

  makeSound() {
    this.#oscillator.frequency.setValueAtTime(500, this.#audioContext.currentTime);
    this.#oscillator.frequency.setValueAtTime(0, this.#audioContext.currentTime + 0.05);
  }

  #playInterval(instance) {
    if (this.#intervalId) clearInterval(this.#intervalId);

    let bpm = 60000 / parseInt(this.#tempoIndicator.value);

    this.#intervalId = setInterval(function () {
      instance.makeSound();
    }, bpm);
  }

  #minusBtnListner() {}

  #plusBtnListner() {}

  #tempoSliderListner() {
    // 템포슬라이더의 동작.
  }
}

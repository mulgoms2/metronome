class Metronome {
  #audioContext;
  #oscillator;

  #plusOneBtn;
  #plusFiveBtn;
  #minusOneBtn;
  #minusFiveBtn;

  #tempoSlider;
  #playBtn;

  #ledIndicator;
  #prevIndicator;
  #tempoIndicator;
  #tempoSignIndicator;

  #isPlaying = false;
  #intervalId;

  constructor() {
    this.#audioContext = new window.AudioContext();

    this.#setComponent();
    this.#tempoSliderListner();
    this.#setBtnListner();
  }

  // 메트로놈의 실행과 정지. 두 상태를 담당하는 메서드에요.
  playAndStop() {
    if (this.#isPlaying) {
      // 소리를 중단하고, 버튼모양을 재생모양으로 바꾼 후 메서드를 종료한다.
      this.#stopSound();
      this.#isPlaying = false;
      this.#changePlayBtn(this.#isPlaying);
      // 오실레이터가 일회용이라, 멈춤버튼이 눌렸을때 미리 새로 만들어놔요.
      this.#getOscilator();
      // 정지하면 led를 처음으로 초기화해요.
      this.#initLed();
      return;
    }

    this.#isPlaying = true;
    this.#changePlayBtn();

    // 응답성 향상을 위해 소리를 먼저 재생 후에 인터벌을 실행해요.
    this.#getOscilator();
    this.#oscillator.start();
    this.#makeSound();
    this.#changeLed();
    this.#playInterval();
  }

  #playInterval() {
    if (this.#intervalId) clearInterval(this.#intervalId);

    let bpm = 60000 / parseInt(this.#tempoIndicator.value);

    // 참조를 잃어버려서 생긴 문제였다. That bind 람다식으로 해결 가능하다. 람다로 해결했어요.
    this.#intervalId = setInterval(() => {
      this.#makeSound();
      this.#changeLed();
    }, bpm);
  }

  #makeSound() {
    this.#oscillator.frequency.setValueAtTime(500, this.#audioContext.currentTime);
    this.#oscillator.frequency.setValueAtTime(0, this.#audioContext.currentTime + 0.05);
  }

  #stopSound() {
    this.#oscillator.frequency.setValueAtTime(0, this.#audioContext.currentTime);
    this.#oscillator.stop();
    // this.#audioContext.suspend();
    clearInterval(this.#intervalId);
  }

  // 아래는 버튼들의 동작을 정의하고있어요.
  #setBtnListner() {
    const onMinusClick = (e) => {
      // 기존 템포
      const currTempo = this.#tempoIndicator.valueAsNumber;
      let targetTemp = currTempo - parseInt(e.target.innerText);

      // 템포는 1 이상이 유지되어야 해요.
      if (targetTemp <= 0) targetTemp = 1;

      // 템포인디케이터의 숫자를 내려요.
      this.#tempoIndicator.valueAsNumber = targetTemp;
      // 템포슬라이더를 이동시켜요.
      this.#tempoSlider.valueAsNumber = targetTemp;

      this.#changeTempoSign();

      // 메트로놈이 실행중이었을 때만 템포 변경시 메트로놈 재실행
      if (this.#isPlaying) {
        this.#playInterval();
      }
    };

    const onPlusClick = (e) => {
      // 이전 템포
      const prevTempo = this.#tempoIndicator.valueAsNumber;

      // 변경하려는 템포
      let targetTemp = prevTempo + parseInt(e.target.innerText);

      // 한계 템포에요.
      if (targetTemp >= 220) targetTemp = 220;

      // 템포 슬라이더를 바뀐 값으로 이동시켜요.
      this.#tempoSlider.valueAsNumber = targetTemp;
      this.#tempoIndicator.valueAsNumber = targetTemp;

      // 빠르기말 표시기
      this.#changeTempoSign();

      // 메트로놈이 실행중일때만 변경된 템포로 메트로놈을 재실행합니다.
      if (this.#isPlaying) {
        this.#playInterval();
      }
    };

    // 재생버튼의 리스너를 설정해요.
    this.#playBtn.onclick = () => {
      this.playAndStop();
    };

    // 마이너스 버튼 리스너를 설정했어요.
    this.#minusOneBtn.onclick = onMinusClick;
    this.#minusFiveBtn.onclick = onMinusClick;

    // 플러스버튼 리스너를 설정해요.
    this.#plusOneBtn.onclick = onPlusClick;
    this.#plusFiveBtn.onclick = onPlusClick;
  }

  #tempoSliderListner() {
    // 템포슬라이더의 동작.
    const changeTempo = () => {
      // 템포 인디케이터에 표시되는 숫자를 바꿔요
      this.#tempoIndicator.value = this.#tempoSlider.value;
      // 소리가 재생중이라면 템포를 변경해줘요.
      if (this.#isPlaying) this.#playInterval();
      // 모데라토 - 알레그레토 - 프레스토
      this.#changeTempoSign();
    };

    this.#tempoSlider.oninput = () => {
      changeTempo();
    };

    this.#tempoSlider.onwheel = (e) => {
      if (e.deltaY > 0) {
        this.#tempoSlider.valueAsNumber += 1;
      } else {
        this.#tempoSlider.value -= 1;
      }
      changeTempo();
    };
  }

  // 콜백함수들을 통해서 실행될 동작들이에요.
  #changeTempoSign() {
    // 빠르기말 표시기를 변경하는 메서드에요.
    const tempo = this.#tempoIndicator.valueAsNumber;

    const changeTempoSignature = (text) => {
      this.#tempoSignIndicator.innerText = text;
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
  }

  #changePlayBtn() {
    const PLAY_BUTTON = `<i class="fa-solid fa-play"></i>`;
    const STOP_BUTTON = `<i id="stop"  class="fa-solid fa-stop" aria-hidden="true"></i>`;

    this.#playBtn.innerHTML = this.#isPlaying ? STOP_BUTTON : PLAY_BUTTON;
  }

  // led 초기화 메서드
  #initLed() {
    this.#prevIndicator.classList.remove("flash");
    this.#ledIndicator = document.querySelector(".indicator").firstElementChild;
  }

  #changeLed() {
    // 이전 led 색상 초기화. 아쿠아마린.
    if (this.#prevIndicator !== undefined) this.#prevIndicator.classList.remove("flash");

    // 현재 led 색상 변경.
    this.#ledIndicator.classList.add("flash");

    // led 인디케이터 커서를 이동.
    this.#prevIndicator = this.#ledIndicator;

    this.#ledIndicator = this.#ledIndicator.nextElementSibling;

    // 다음 형제요소가 없을때. 마지막 led일때 작동해요.
    if (this.#ledIndicator === null) this.#ledIndicator = document.querySelector(".indicator").firstElementChild;
  }

  // 컴포넌트들의 설정을 위한 메서드들입니다.
  #getOscilator() {
    this.#oscillator = this.#audioContext.createOscillator();
    this.#oscillator.connect(this.#audioContext.destination);
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
    this.#tempoSignIndicator = document.querySelector(".beatIndicator");
    this.#playBtn = document.querySelector(".play");
    this.#ledIndicator = document.querySelector(".indicator").firstElementChild;

    // 검사 완료. 모든 컴포넌트가 정상적으로 등록되었어요.
  }
}

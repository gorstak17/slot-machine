import "./styles.css";
import * as PIXI from "pixi.js";
import { DropShadowFilter } from "@pixi/filter-drop-shadow";

let app;
const REEL_COUNT = 5;
const REEL_WIDTH = 240;
const SYMBOL_SIZE = 200;
const SYMBOLS_PER_REEL = 4;
const UI_AREA_HEIGHT = 80;
let slotTextures;
let reelTexture1;
let reelTexture2;
let isPortrait = window.matchMedia("(orientation: portrait)").matches;

function initializeApp(isPortrait) {
  let width;
  let height;
  if (isPortrait) {
    width = REEL_WIDTH * REEL_COUNT + 80;
    height = Math.min(
      (width * 16) / 9,
      (width * window.innerHeight) / window.innerWidth
    );
  } else {
    width = REEL_WIDTH * REEL_COUNT + REEL_WIDTH + 150;
    height = SYMBOL_SIZE * SYMBOLS_PER_REEL + UI_AREA_HEIGHT;
  }

  app = new PIXI.Application({
    width: width,
    height: height,
    transparent: true,
  });

  const reelBackground = new PIXI.Sprite(reelTexture1);
  reelBackground.width = REEL_WIDTH * REEL_COUNT;
  reelBackground.height = SYMBOL_SIZE * SYMBOLS_PER_REEL;
  app.stage.addChild(reelBackground);

  if (isPortrait) {
    reelBackground.x = (app.screen.width - reelBackground.width) / 2;
    reelBackground.y = height * 0.2;
  } else {
    reelBackground.x = 120;
    reelBackground.y = 5;
  }

  const reelOverlay = new PIXI.Sprite(reelTexture2);
  reelOverlay.width = REEL_WIDTH * REEL_COUNT;
  reelOverlay.height = SYMBOL_SIZE * SYMBOLS_PER_REEL;
  app.stage.addChild(reelOverlay);

  reelOverlay.x = reelBackground.x;
  reelOverlay.y = reelBackground.y;

  const reels = [];
  const reelContainer = new PIXI.Container();
  reelContainer.y = reelBackground.y;
  reelContainer.x = reelBackground.x;
  app.stage.addChild(reelContainer);

  for (let i = 0; i < REEL_COUNT; i++) {
    const rc = new PIXI.Container();
    rc.x = i * REEL_WIDTH;
    reelContainer.addChild(rc);

    const reel = {
      container: rc,
      symbols: [],
      position: 0,
      previousPosition: 0,
      blur: new PIXI.filters.BlurFilter(),
    };
    reel.blur.blurX = 0;
    reel.blur.blurY = 0;
    rc.filters = [reel.blur];

    for (let j = 0; j < SYMBOLS_PER_REEL + 1; j++) {
      const symbol = new PIXI.Sprite(
        slotTextures[Math.floor(Math.random() * slotTextures.length)]
      );
      symbol.y = j * SYMBOL_SIZE;
      symbol.scale.x = symbol.scale.y = Math.min(
        SYMBOL_SIZE / symbol.width,
        SYMBOL_SIZE / symbol.height
      );
      symbol.x = Math.round((REEL_WIDTH - symbol.width) / 2);

      reel.symbols.push(symbol);
      rc.addChild(symbol);
    }
    reels.push(reel);
  }

  const reelMask = new PIXI.Graphics();
  reelMask.beginFill(0x000000);
  reelMask.drawRect(
    reelBackground.x,
    reelBackground.y,
    reelBackground.width,
    reelBackground.height
  );
  reelMask.endFill();
  reelContainer.mask = reelMask;
  app.stage.addChild(reelMask);

  const buttonAboveDefaultTexture = PIXI.Texture.from("100.png");
  const buttonAboveHoverTexture = PIXI.Texture.from("1222.png");
  const buttonAbovePressedTexture = PIXI.Texture.from("1111.png");
  const buttonAboveDarkerTexture = PIXI.Texture.from("1222.png");

  const spinButtonDefaultTexture = PIXI.Texture.from("333.png");
  const spinButtonHoverTexture = PIXI.Texture.from("222.png");
  const spinButtonPressedTexture = PIXI.Texture.from("444.png");
  const spinButtonStopDefaultTexture = PIXI.Texture.from("555.png");
  const spinButtonStopHoverTexture = PIXI.Texture.from("666.png");
  const spinButtonStopPressedTexture = PIXI.Texture.from("555.png");

  const buttonBelowDefaultTexture = PIXI.Texture.from("1333.png");
  const buttonBelowHoverTexture = PIXI.Texture.from("14.png");
  const buttonBelowPressedTexture = PIXI.Texture.from("15.png");
  const buttonBelowTurboTexture = PIXI.Texture.from("16.png");

  let SPIN_BUTTON_SCALE;
  let OTHER_BUTTON_SCALE = 1.0;

  if (isPortrait) {
    SPIN_BUTTON_SCALE = 1.4;
  } else {
    SPIN_BUTTON_SCALE = 1.0;
  }

  const buttonAbove = new PIXI.Sprite(buttonAboveDefaultTexture);
  const spinButton = new PIXI.Sprite(spinButtonDefaultTexture);
  const buttonBelow = new PIXI.Sprite(buttonBelowDefaultTexture);

  spinButton.scale.set(SPIN_BUTTON_SCALE);
  buttonAbove.scale.set(OTHER_BUTTON_SCALE);
  buttonBelow.scale.set(OTHER_BUTTON_SCALE);
  buttonAbove.anchor.set(0.5);
  spinButton.anchor.set(0.5);
  buttonBelow.anchor.set(0.5);

  const originalSpinButtonScale = SPIN_BUTTON_SCALE;
  const originalButtonAboveScale = OTHER_BUTTON_SCALE;
  const originalButtonBelowScale = OTHER_BUTTON_SCALE;

  let spinButtonX, spinButtonY;
  let buttonAboveX, buttonAboveY;
  let buttonBelowX, buttonBelowY;

  if (isPortrait) {
    spinButtonX = app.screen.width / 2;
    spinButtonY =
      reelBackground.y + reelBackground.height + spinButton.height / 2 + 570;

    const buttonSpacing = 30;

    buttonBelowX =
      spinButtonX -
      spinButton.width / 2 -
      buttonBelow.width / 2 -
      buttonSpacing;
    buttonBelowY = spinButtonY;

    buttonAboveX =
      spinButtonX +
      spinButton.width / 2 +
      buttonAbove.width / 2 +
      buttonSpacing;
    buttonAboveY = spinButtonY;

    spinButton.x = spinButtonX;
    spinButton.y = spinButtonY;

    buttonBelow.x = buttonBelowX;
    buttonBelow.y = buttonBelowY;

    buttonAbove.x = buttonAboveX;
    buttonAbove.y = spinButtonY;
  } else {
    spinButtonX = reelBackground.x + reelBackground.width + REEL_WIDTH / 2 + 3;
    spinButtonY = reelBackground.y + (SYMBOL_SIZE * SYMBOLS_PER_REEL) / 2;

    buttonAboveX = spinButtonX;
    buttonAboveY =
      spinButtonY - spinButton.height / 2 - buttonAbove.height / 2 - 10;

    buttonBelowX = spinButtonX;
    buttonBelowY =
      spinButtonY + spinButton.height / 2 + buttonBelow.height / 2 + 10;

    spinButton.x = spinButtonX;
    spinButton.y = spinButtonY;

    buttonAbove.x = buttonAboveX;
    buttonAbove.y = buttonAboveY;

    buttonBelow.x = buttonBelowX;
    buttonBelow.y = buttonBelowY;
  }

  app.stage.addChild(buttonAbove);
  app.stage.addChild(spinButton);
  app.stage.addChild(buttonBelow);

  spinButton.interactive = true;
  spinButton.buttonMode = true;
  buttonAbove.interactive = true;
  buttonAbove.buttonMode = true;
  buttonBelow.interactive = true;
  buttonBelow.buttonMode = true;

  let running = false;
  let turboMode = false;
  let isStopping = false;

  spinButton.on("pointerover", onSpinButtonHoverOver);
  spinButton.on("pointerout", onSpinButtonHoverOut);
  spinButton.on("pointerdown", onSpinButtonDown);
  spinButton.on("pointerup", onSpinButtonUp);
  spinButton.on("pointerupoutside", onSpinButtonUp);

  buttonAbove.on("pointerover", onButtonAboveHoverOver);
  buttonAbove.on("pointerout", onButtonAboveHoverOut);
  buttonAbove.on("pointerdown", onButtonAboveDown);
  buttonAbove.on("pointerup", onButtonAboveUp);
  buttonAbove.on("pointerupoutside", onButtonAboveUp);

  buttonBelow.on("pointerover", onButtonBelowHoverOver);
  buttonBelow.on("pointerout", onButtonBelowHoverOut);
  buttonBelow.on("pointerdown", onButtonBelowDown);
  buttonBelow.on("pointerup", onButtonBelowUp);
  buttonBelow.on("pointerupoutside", onButtonBelowUp);

  function onSpinButtonHoverOver() {
    spinButton.scale.set(originalSpinButtonScale * 0.9);
    if (running) {
      spinButton.texture = spinButtonStopHoverTexture;
    } else {
      spinButton.texture = spinButtonHoverTexture;
    }
  }

  function onSpinButtonHoverOut() {
    spinButton.scale.set(originalSpinButtonScale);
    if (running) {
      spinButton.texture = spinButtonStopDefaultTexture;
    } else {
      spinButton.texture = spinButtonDefaultTexture;
    }
  }

  function onSpinButtonDown() {
    spinButton.scale.set(originalSpinButtonScale * 0.9);
    if (running) {
      spinButton.texture = spinButtonStopPressedTexture;
    } else {
      spinButton.texture = spinButtonPressedTexture;
    }
    onSpinButtonPressed();
  }

  function onSpinButtonUp() {
    spinButton.scale.set(originalSpinButtonScale * 0.9);
    if (running) {
      spinButton.texture = spinButtonStopHoverTexture;
    } else {
      spinButton.texture = spinButtonHoverTexture;
    }
  }

  function onSpinButtonPressed() {
    if (running) {
      if (!isStopping) {
        isStopping = true;
        stopReelsSmoothly();
      }
      return;
    }
    spinButton.texture = spinButtonStopDefaultTexture;
    buttonAbove.texture = buttonAboveDarkerTexture;
    startPlay();
  }

  function stopReelsSmoothly() {
    for (let i = 0; i < reels.length; i++) {
      const r = reels[i];
      let reelTween = tweening.find(
        (t) => t.object === r && t.property === "position"
      );

      if (reelTween) {
        const currentPos = r.position;
        const target = Math.ceil(currentPos);

        reelTween.propertyBeginValue = currentPos;
        reelTween.target = target;
        reelTween.time = 500 + i * 100;
        reelTween.start = Date.now();
        reelTween.easing = backout(0.5);
        reelTween.change = null;
        reelTween.complete = i === reels.length - 1 ? reelsComplete : null;
      } else {
        const currentPos = r.position;
        const target = Math.ceil(currentPos);

        const time = 500 + i * 100;
        tweenTo(
          r,
          "position",
          target,
          time,
          backout(0.5),
          null,
          i === reels.length - 1 ? reelsComplete : null
        );
      }
    }
  }

  function reelsComplete() {
    running = false;
    isStopping = false;
    spinButton.texture = spinButtonDefaultTexture;
    buttonAbove.texture = buttonAboveDefaultTexture;

    for (let i = 0; i < reels.length; i++) {
      const r = reels[i];
      r.position = Math.round(r.position);
      r.previousPosition = r.position;
    }
  }

  function onButtonAboveHoverOver() {
    buttonAbove.scale.set(originalButtonAboveScale * 0.9);
    if (!running) {
      buttonAbove.texture = buttonAboveHoverTexture;
    }
  }

  function onButtonAboveHoverOut() {
    buttonAbove.scale.set(originalButtonAboveScale);
    if (!running) {
      buttonAbove.texture = buttonAboveDefaultTexture;
    }
  }

  function onButtonAboveDown() {
    buttonAbove.scale.set(originalButtonAboveScale * 0.9);
    if (!running) {
      buttonAbove.texture = buttonAbovePressedTexture;
    }
  }

  function onButtonAboveUp() {
    buttonAbove.scale.set(originalButtonAboveScale * 0.9);
    if (!running) {
      buttonAbove.texture = buttonAboveHoverTexture;
    }
  }

  function onButtonBelowHoverOver() {
    buttonBelow.scale.set(originalButtonBelowScale * 0.9);
    buttonBelow.texture = turboMode
      ? buttonBelowTurboTexture
      : buttonBelowHoverTexture;
  }

  function onButtonBelowHoverOut() {
    buttonBelow.scale.set(originalButtonBelowScale);
    buttonBelow.texture = turboMode
      ? buttonBelowTurboTexture
      : buttonBelowDefaultTexture;
  }

  function onButtonBelowDown() {
    buttonBelow.scale.set(originalButtonBelowScale * 0.9);
    buttonBelow.texture = turboMode
      ? buttonBelowTurboTexture
      : buttonBelowPressedTexture;
  }

  function onButtonBelowUp() {
    buttonBelow.scale.set(originalButtonBelowScale * 0.9);
    toggleTurboMode();
  }

  function toggleTurboMode() {
    turboMode = !turboMode;
    if (turboMode) {
      buttonBelow.texture = buttonBelowTurboTexture;
    } else {
      buttonBelow.texture = buttonBelowDefaultTexture;
    }
  }

  function startPlay() {
    if (running) return;
    running = true;
    isStopping = false;

    for (let i = 0; i < reels.length; i++) {
      const r = reels[i];
      const extra = Math.floor(Math.random() * 3);
      let target, time;
      if (turboMode) {
        target = r.position + 10 + extra;
        time = 1000 + extra * 100;
      } else {
        target = r.position + 10 + i * 5 + extra;
        time = 2500 + i * 600 + extra * 600;
      }
      tweenTo(
        r,
        "position",
        target,
        time,
        backout(0.5),
        null,
        i === reels.length - 1 ? reelsComplete : null
      );
    }
  }

  const reelsBorder = new PIXI.Graphics();
  reelsBorder.lineStyle(12, 0xffd700, 1);
  reelsBorder.drawRoundedRect(
    reelBackground.x,
    reelBackground.y,
    REEL_WIDTH * REEL_COUNT,
    SYMBOL_SIZE * SYMBOLS_PER_REEL,
    20
  );
  app.stage.addChild(reelsBorder);

  const uiContainer = new PIXI.Container();
  app.stage.addChild(uiContainer);

  const iconWidth = 70;
  const iconPadding = 10;
  let boxWidth;
  let boxHeight;

  const musicIconTextures = [
    PIXI.Texture.from("29.png"),
    PIXI.Texture.from("33.png"),
    PIXI.Texture.from("34.png"),
  ];

  const musicIconHoverTextures = [
    PIXI.Texture.from("32.png"),
    PIXI.Texture.from("33.png"),
    PIXI.Texture.from("34.png"),
    PIXI.Texture.from("32.png"),
  ];

  const musicIconPressedTextures = [
    PIXI.Texture.from("35.png"),
    PIXI.Texture.from("36.png"),
    PIXI.Texture.from("37.png"),
    PIXI.Texture.from("35.png"),
  ];

  const settingsIconDefaultTexture = PIXI.Texture.from("26.png");
  const settingsIconHoverTexture = PIXI.Texture.from("25.png");
  const settingsIconPressedTexture = PIXI.Texture.from("27.png");

  const upArrowDefaultTexture = PIXI.Texture.from("24.png");
  const upArrowHoverTexture = PIXI.Texture.from("23.png");
  const upArrowPressedTexture = PIXI.Texture.from("24.png");

  const downArrowDefaultTexture = PIXI.Texture.from("21.png");
  const downArrowHoverTexture = PIXI.Texture.from("20.png");
  const downArrowPressedTexture = PIXI.Texture.from("19.png");

  const musicNoteIcon = new PIXI.Sprite(musicIconTextures[0]);
  const settingsIcon = new PIXI.Sprite(settingsIconDefaultTexture);

  musicNoteIcon.anchor.set(0, 0.5);
  musicNoteIcon.y = 0;
  musicNoteIcon.x = 0;

  settingsIcon.anchor.set(0, 0.5);
  settingsIcon.y = 0;

  musicNoteIcon.interactive = true;
  musicNoteIcon.buttonMode = true;
  settingsIcon.interactive = true;
  settingsIcon.buttonMode = true;

  let musicState = 0;

  function updateMusicIconTexture() {
    musicNoteIcon.texture = musicIconTextures[musicState];
  }

  musicNoteIcon.on("pointerover", () => {
    musicNoteIcon.texture = musicIconHoverTextures[musicState];
    musicNoteIcon.scale.set(0.9);
  });
  musicNoteIcon.on("pointerout", () => {
    updateMusicIconTexture();
    musicNoteIcon.scale.set(1.0);
  });
  musicNoteIcon.on("pointerdown", () => {
    musicNoteIcon.texture = musicIconPressedTextures[musicState];
    musicNoteIcon.scale.set(0.9);
  });
  musicNoteIcon.on("pointerup", () => {
    musicState = (musicState + 1) % musicIconTextures.length;
    updateMusicIconTexture();
    musicNoteIcon.scale.set(0.9);
  });
  musicNoteIcon.on("pointerupoutside", () => {
    updateMusicIconTexture();
    musicNoteIcon.scale.set(0.9);
  });

  settingsIcon.on("pointerover", () => {
    settingsIcon.texture = settingsIconHoverTexture;
    settingsIcon.scale.set(0.9);
  });
  settingsIcon.on("pointerout", () => {
    settingsIcon.texture = settingsIconDefaultTexture;
    settingsIcon.scale.set(1.0);
  });
  settingsIcon.on("pointerdown", () => {
    settingsIcon.texture = settingsIconPressedTexture;
    settingsIcon.scale.set(0.9);
  });
  settingsIcon.on("pointerup", () => {
    settingsIcon.texture = settingsIconHoverTexture;
    settingsIcon.scale.set(0.9);
  });
  settingsIcon.on("pointerupoutside", () => {
    settingsIcon.texture = settingsIconDefaultTexture;
    settingsIcon.scale.set(0.9);
  });

  const boxBackgroundColor = 0x5a1d63;
  const boxBorderColor = 0x6a2d73;

  if (isPortrait) {
    boxWidth = (app.screen.width - 20) / 3;
    boxHeight = 100;
  } else {
    boxWidth = 300;
    boxHeight = UI_AREA_HEIGHT;
  }

  const balanceBox = new PIXI.Graphics();
  balanceBox.beginFill(boxBackgroundColor, 0.5);
  balanceBox.lineStyle(2, boxBorderColor);
  balanceBox.drawRoundedRect(0, 0, boxWidth, boxHeight, 5);
  balanceBox.endFill();

  const winBox = new PIXI.Graphics();
  winBox.beginFill(boxBackgroundColor, 0.5);
  winBox.lineStyle(2, boxBorderColor);
  winBox.drawRoundedRect(0, 0, boxWidth, boxHeight, 5);
  winBox.endFill();

  const betBox = new PIXI.Graphics();
  betBox.beginFill(boxBackgroundColor, 0.5);
  betBox.lineStyle(2, boxBorderColor);
  betBox.drawRoundedRect(0, 0, boxWidth, boxHeight, 5);
  betBox.endFill();

  const dropShadowFilter = new DropShadowFilter();
  dropShadowFilter.distance = 3;
  dropShadowFilter.alpha = 0.7;

  balanceBox.filters = [dropShadowFilter];
  winBox.filters = [dropShadowFilter];
  betBox.filters = [dropShadowFilter];

  let boxPadding;

  if (isPortrait) {
    const iconScalePortrait = 1.5;

    const musicIconStateOrder = [0, 1, 2];
    let currentStateIndex = 0;

    function updateMusicIconTexture() {
      const state = musicIconStateOrder[currentStateIndex];
      musicNoteIcon.texture = musicIconTextures[state];
    }

    function cycleMusicIconState() {
      currentStateIndex = (currentStateIndex + 1) % musicIconStateOrder.length;
      updateMusicIconTexture();
    }
    boxPadding = 0;

    const totalBoxesWidth = boxWidth * 3 + boxPadding * 2;
    const startX = (app.screen.width - totalBoxesWidth) / 2;

    balanceBox.x = startX;
    balanceBox.y = app.screen.height - boxHeight - 10;

    betBox.x = balanceBox.x + boxWidth + boxPadding;
    betBox.y = balanceBox.y;

    winBox.x = betBox.x + boxWidth + boxPadding;
    winBox.y = balanceBox.y;

    app.stage.addChild(balanceBox);
    app.stage.addChild(betBox);
    app.stage.addChild(winBox);

    musicNoteIcon.scale.set(iconScalePortrait);
    settingsIcon.scale.set(iconScalePortrait);

    const edgePadding = 20;
    musicNoteIcon.x = edgePadding;
    musicNoteIcon.y = spinButtonY;

    settingsIcon.x = app.screen.width - settingsIcon.width - edgePadding;
    settingsIcon.y = spinButtonY;

    const iconHoverScale = iconScalePortrait * 0.9;
    const iconDefaultScale = iconScalePortrait;

    musicNoteIcon.on("pointerover", () => {
      musicNoteIcon.texture =
        musicIconHoverTextures[musicIconStateOrder[currentStateIndex]];
      musicNoteIcon.scale.set(iconHoverScale);
    });
    musicNoteIcon.on("pointerout", () => {
      updateMusicIconTexture();
      musicNoteIcon.scale.set(iconDefaultScale);
    });
    musicNoteIcon.on("pointerdown", () => {
      musicNoteIcon.texture =
        musicIconPressedTextures[musicIconStateOrder[currentStateIndex]];
      musicNoteIcon.scale.set(iconHoverScale);
    });
    musicNoteIcon.on("pointerup", () => {
      cycleMusicIconState();
      musicNoteIcon.scale.set(iconDefaultScale);
    });
    musicNoteIcon.on("pointerupoutside", () => {
      updateMusicIconTexture();
      musicNoteIcon.scale.set(iconDefaultScale);
    });

    settingsIcon.on("pointerover", () => {
      settingsIcon.texture = settingsIconHoverTexture;
      settingsIcon.scale.set(iconHoverScale);
    });
    settingsIcon.on("pointerout", () => {
      settingsIcon.texture = settingsIconDefaultTexture;
      settingsIcon.scale.set(iconDefaultScale);
    });
    settingsIcon.on("pointerdown", () => {
      settingsIcon.texture = settingsIconPressedTexture;
      settingsIcon.scale.set(iconHoverScale);
    });
    settingsIcon.on("pointerup", () => {
      settingsIcon.texture = settingsIconHoverTexture;
      settingsIcon.scale.set(iconHoverScale);
    });
    settingsIcon.on("pointerupoutside", () => {
      settingsIcon.texture = settingsIconDefaultTexture;
      settingsIcon.scale.set(iconDefaultScale);
    });

    app.stage.addChild(musicNoteIcon);
    app.stage.addChild(settingsIcon);
  } else {
    boxPadding = 150;

    balanceBox.x = musicNoteIcon.x + iconWidth + iconPadding;
    winBox.x = balanceBox.x + boxWidth + boxPadding;
    betBox.x = winBox.x + boxWidth + boxPadding;
    settingsIcon.x = betBox.x + boxWidth + iconPadding + 10;

    uiContainer.x =
      (app.screen.width -
        (iconWidth +
          iconPadding +
          boxWidth * 3 +
          boxPadding * 2 +
          iconPadding +
          iconWidth)) /
        2 -
      80;
    uiContainer.y = app.screen.height - UI_AREA_HEIGHT;

    musicNoteIcon.x = 0;
    musicNoteIcon.y = boxHeight / 2;
    settingsIcon.y = boxHeight / 2;

    if (!uiContainer.children.includes(musicNoteIcon)) {
      uiContainer.addChild(musicNoteIcon);
    }
    if (!uiContainer.children.includes(settingsIcon)) {
      uiContainer.addChild(settingsIcon);
    }

    uiContainer.addChild(balanceBox);
    uiContainer.addChild(winBox);
    uiContainer.addChild(betBox);
  }

  let balanceAmount = 10.0;
  const balanceText = new PIXI.Text(`BALANCE: ${balanceAmount.toFixed(2)}`, {
    fontFamily: "Arial",
    fontSize: isPortrait ? 35 : 25,
    fill: 0xffffff,
    align: "center",
    fontWeight: "bold",
    wordWrap: true,
    wordWrapWidth: boxWidth - 20,
  });
  balanceText.anchor.set(0.5);
  balanceText.x = boxWidth / 2;
  balanceText.y = boxHeight / 2;

  balanceBox.addChild(balanceText);

  let winAmount = 0.0;
  const winText = new PIXI.Text(`WIN: ${winAmount.toFixed(2)}`, {
    fontFamily: "Arial",
    fontSize: isPortrait ? 35 : 25,
    fill: 0xffffff,
    align: "center",
    fontWeight: "bold",
    wordWrap: true,
    wordWrapWidth: boxWidth - 20,
  });
  winText.anchor.set(0.5);
  winText.x = boxWidth / 2;
  winText.y = boxHeight / 2;

  winBox.addChild(winText);

  let betAmount = 0.01;
  const betText = new PIXI.Text(`BET: ${betAmount.toFixed(2)}`, {
    fontFamily: "Arial",
    fontSize: isPortrait ? 35 : 25,
    fill: 0xffffff,
    align: "center",
    fontWeight: "bold",
    wordWrap: true,
    wordWrapWidth: boxWidth - 20,
  });
  betText.anchor.set(0.5);
  betText.x = boxWidth / 2;
  betText.y = boxHeight / 2;

  const downArrowIcon = new PIXI.Sprite(downArrowDefaultTexture);
  const upArrowIcon = new PIXI.Sprite(upArrowDefaultTexture);

  downArrowIcon.anchor.set(0.5);
  upArrowIcon.anchor.set(0.5);

  downArrowIcon.interactive = true;
  downArrowIcon.buttonMode = true;
  upArrowIcon.interactive = true;
  upArrowIcon.buttonMode = true;

  downArrowIcon.on("pointerover", () => {
    downArrowIcon.texture = downArrowHoverTexture;
    downArrowIcon.scale.set(0.9);
  });
  downArrowIcon.on("pointerout", () => {
    downArrowIcon.texture = downArrowDefaultTexture;
    downArrowIcon.scale.set(1.0);
  });
  downArrowIcon.on("pointerdown", () => {
    downArrowIcon.texture = downArrowPressedTexture;
    downArrowIcon.scale.set(0.9);
  });
  downArrowIcon.on("pointerup", () => {
    downArrowIcon.texture = downArrowHoverTexture;
    downArrowIcon.scale.set(0.9);
    decreaseBet();
  });
  downArrowIcon.on("pointerupoutside", () => {
    downArrowIcon.texture = downArrowDefaultTexture;
    downArrowIcon.scale.set(0.9);
  });

  upArrowIcon.on("pointerover", () => {
    upArrowIcon.texture = upArrowHoverTexture;
    upArrowIcon.scale.set(0.9);
  });
  upArrowIcon.on("pointerout", () => {
    upArrowIcon.texture = upArrowDefaultTexture;
    upArrowIcon.scale.set(1.0);
  });
  upArrowIcon.on("pointerdown", () => {
    upArrowIcon.texture = upArrowPressedTexture;
    upArrowIcon.scale.set(0.9);
  });
  upArrowIcon.on("pointerup", () => {
    upArrowIcon.texture = upArrowHoverTexture;
    upArrowIcon.scale.set(0.9);
    increaseBet();
  });
  upArrowIcon.on("pointerupoutside", () => {
    upArrowIcon.texture = upArrowDefaultTexture;
    upArrowIcon.scale.set(0.9);
  });

  const arrowSpacing = 40;
  const arrowScalePortrait = 1.4;
  const arrowScaleLandscape = 1.0;

  if (isPortrait) {
    downArrowIcon.x =
      betText.x -
      betText.width / 2 -
      arrowSpacing -
      downArrowIcon.width / 2 -
      28;
    upArrowIcon.x =
      betText.x + betText.width / 2 + arrowSpacing + upArrowIcon.width / 2 + 28;

    downArrowIcon.scale.set(arrowScalePortrait);
    upArrowIcon.scale.set(arrowScalePortrait);
  } else {
    downArrowIcon.x =
      betText.x - betText.width / 2 - arrowSpacing - downArrowIcon.width / 2;
    upArrowIcon.x =
      betText.x + betText.width / 2 + arrowSpacing + upArrowIcon.width / 2;

    downArrowIcon.scale.set(arrowScaleLandscape);
    upArrowIcon.scale.set(arrowScaleLandscape);
  }

  downArrowIcon.y = betText.y;
  upArrowIcon.y = betText.y;

  betBox.addChild(downArrowIcon);
  betBox.addChild(betText);
  betBox.addChild(upArrowIcon);

  downArrowIcon.on("pointerover", () => {
    downArrowIcon.texture = downArrowHoverTexture;
    downArrowIcon.scale.set(
      isPortrait ? arrowScalePortrait * 0.9 : arrowScaleLandscape * 0.9
    );
  });
  downArrowIcon.on("pointerout", () => {
    downArrowIcon.texture = downArrowDefaultTexture;
    downArrowIcon.scale.set(
      isPortrait ? arrowScalePortrait : arrowScaleLandscape
    );
  });
  downArrowIcon.on("pointerdown", () => {
    downArrowIcon.texture = downArrowPressedTexture;
    downArrowIcon.scale.set(
      isPortrait ? arrowScalePortrait * 0.9 : arrowScaleLandscape * 0.9
    );
  });
  downArrowIcon.on("pointerup", () => {
    downArrowIcon.texture = downArrowHoverTexture;
    downArrowIcon.scale.set(
      isPortrait ? arrowScalePortrait * 0.9 : arrowScaleLandscape * 0.9
    );
    decreaseBet();
  });
  downArrowIcon.on("pointerupoutside", () => {
    downArrowIcon.texture = downArrowDefaultTexture;
    downArrowIcon.scale.set(
      isPortrait ? arrowScalePortrait : arrowScaleLandscape
    );
  });

  upArrowIcon.on("pointerover", () => {
    upArrowIcon.texture = upArrowHoverTexture;
    upArrowIcon.scale.set(
      isPortrait ? arrowScalePortrait * 0.9 : arrowScaleLandscape * 0.9
    );
  });
  upArrowIcon.on("pointerout", () => {
    upArrowIcon.texture = upArrowDefaultTexture;
    upArrowIcon.scale.set(
      isPortrait ? arrowScalePortrait : arrowScaleLandscape
    );
  });
  upArrowIcon.on("pointerdown", () => {
    upArrowIcon.texture = upArrowPressedTexture;
    upArrowIcon.scale.set(
      isPortrait ? arrowScalePortrait * 0.9 : arrowScaleLandscape * 0.9
    );
  });
  upArrowIcon.on("pointerup", () => {
    upArrowIcon.texture = upArrowHoverTexture;
    upArrowIcon.scale.set(
      isPortrait ? arrowScalePortrait * 0.9 : arrowScaleLandscape * 0.9
    );
    increaseBet();
  });
  upArrowIcon.on("pointerupoutside", () => {
    upArrowIcon.texture = upArrowDefaultTexture;
    upArrowIcon.scale.set(
      isPortrait ? arrowScalePortrait : arrowScaleLandscape
    );
  });

  function increaseBet() {
    betAmount += 2.5;
    betText.text = `BET: ${betAmount.toFixed(2)}`;
  }

  function decreaseBet() {
    betAmount = Math.max(2.5, betAmount - 5);
    betText.text = `BET: ${betAmount.toFixed(2)}`;
  }

  app.ticker.add(() => {
    for (let i = 0; i < reels.length; i++) {
      const r = reels[i];
      r.blur.blurY = (r.position - r.previousPosition) * 8;
      r.previousPosition = r.position;

      for (let j = 0; j < r.symbols.length; j++) {
        const s = r.symbols[j];
        const prevY = s.y;
        s.y = ((r.position + j) % r.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;
        if (s.y < 0 && prevY > SYMBOL_SIZE) {
          s.texture =
            slotTextures[Math.floor(Math.random() * slotTextures.length)];
          s.scale.x = s.scale.y = Math.min(
            SYMBOL_SIZE / s.texture.width,
            SYMBOL_SIZE / s.texture.height
          );
          s.x = Math.round((REEL_WIDTH - s.width) / 2);
        }
      }
    }
  });

  const tweening = [];

  function tweenTo(
    object,
    property,
    target,
    time,
    easing,
    onchange,
    oncomplete
  ) {
    const tween = {
      object,
      property,
      propertyBeginValue: object[property],
      target,
      easing,
      time,
      change: onchange,
      complete: oncomplete,
      start: Date.now(),
    };

    tweening.push(tween);
    return tween;
  }

  app.ticker.add(() => {
    const now = Date.now();
    const remove = [];
    for (let i = 0; i < tweening.length; i++) {
      const t = tweening[i];
      const phase = Math.min(1, (now - t.start) / t.time);

      t.object[t.property] = lerp(
        t.propertyBeginValue,
        t.target,
        t.easing(phase)
      );
      if (t.change) t.change(t);

      if (phase === 1) {
        t.object[t.property] = t.target;
        if (t.complete) t.complete(t);
        remove.push(t);
      }
    }
    for (let i = 0; i < remove.length; i++) {
      tweening.splice(tweening.indexOf(remove[i]), 1);
    }
  });

  function lerp(a1, a2, t) {
    return a1 * (1 - t) + a2 * t;
  }

  function backout(amount) {
    return function (t) {
      return --t * t * ((amount + 1) * t + amount) + 1;
    };
  }

  const gameContainer = document.querySelector(".game-container");
  gameContainer.appendChild(app.view);
}

PIXI.Loader.shared
  .add("fruits", "assets/fruit.json")
  .add("reels", "assets/reel.json")
  .add("ui", "assets/UI_2.json")
  .load(onAssetsLoaded)
  .onError.add((error) => {
    console.error("Error loading asset:", error.message);
  });

function onAssetsLoaded() {
  slotTextures = [
    PIXI.Texture.from("1.png"),
    PIXI.Texture.from("2.png"),
    PIXI.Texture.from("3.png"),
    PIXI.Texture.from("4.png"),
    PIXI.Texture.from("5.png"),
    PIXI.Texture.from("6.png"),
    PIXI.Texture.from("7.png"),
    PIXI.Texture.from("8.png"),
  ];

  reelTexture1 = PIXI.Texture.from("reel1.png");
  reelTexture2 = PIXI.Texture.from("reel2.png");

  initializeApp(isPortrait);
}

window.addEventListener("resize", function () {
  isPortrait = window.matchMedia("(orientation: portrait)").matches;

  if (app) {
    const gameContainer = document.querySelector(".game-container");
    while (gameContainer.firstChild) {
      gameContainer.removeChild(gameContainer.lastChild);
    }
    app.destroy(true, { children: true });
  }
  initializeApp(isPortrait);
});

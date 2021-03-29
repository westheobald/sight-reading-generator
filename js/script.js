"use strict";

const VF = Vex.Flow;

let previousNoteIndex;
let startingNoteIndex;
let noteList = [];
let clef = document.getElementById("clefChange").value;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function genNotes(measure) {
  noteList = [];
  let rhythms = [];

  function genRhythms() {
    let rhythmValue = Number(document.getElementById("rhythmChange").value);
    let sum = 0;

    do {
      if (rhythmValue === 1 && sum != 6 && sum != 14) {
        rhythms.push("q");
        sum += 4;
      } else if (rhythmValue === 2) {
        rhythms.push("8");
        sum += 2;
      } else if (rhythmValue === 3) {
        let randomNumber = getRandomInt(1, 2);
        if (randomNumber === 1 && sum != 6 && sum != 14) {
          rhythms.push("q");
          sum += 4;
        } else if (randomNumber === 2) {
          if (sum === 8 && rhythms[rhythms.length - 1] === "8") {
            rhythms.push("q");
            sum += 4;
          } else {
            rhythms.push("8");
            sum += 2;
          }
        }
      } else if (rhythmValue === 4) {
        let randomNumber = getRandomInt(1, 100);
        if (randomNumber <= 40 && sum != 6 && sum != 14) {
          rhythms.push("q");
          sum += 4;
        } else if (randomNumber >= 60) {
          if (sum === 8 && rhythms[rhythms.length - 1] === "8") {
            rhythms.push("q");
            sum += 4;
          } else {
            rhythms.push("8");
            sum += 2;
          }
        } else if (
          randomNumber > 40 &&
          randomNumber < 50 &&
          sum != 6 &&
          sum != 14
        ) {
          rhythms.push("qr");
          sum += 4;
        } else if (randomNumber > 50 && randomNumber < 60) {
          rhythms.push("8r");
          sum += 2;
        }
      }
    } while (sum < 16);
  }
  genRhythms();
  console.log(rhythms, rhythms[-1]);
  function genListOfNotes() {
    let noteType = [
      "C/2",
      "D/2",
      "E/2",
      "F/2",
      "G/2",
      "A/2",
      "B/2",
      "C/3",
      "D/3",
      "E/3",
      "F/3",
      "G/3",
      "A/3",
      "B/3",
      "C/4",
      "D/4",
      "E/4",
      "F/4",
      "G/4",
      "A/4",
      "B/4",
      "C/5",
      "D/5",
      "E/5",
      "F/5",
      "G/5",
      "A/5",
      "B/5",
      "C/6",
      "D/6",
      "E/6",
    ];

    let noteTypeID = [
      "C2",
      "D2",
      "E2",
      "F2",
      "G2",
      "A2",
      "B2",
      "C3",
      "D3",
      "E3",
      "F3",
      "G3",
      "A3",
      "B3",
      "C4",
      "D4",
      "E4",
      "F4",
      "G4",
      "A4",
      "B4",
      "C5",
      "D5",
      "E5",
      "F5",
      "G5",
      "A5",
      "B5",
      "C6",
      "D6",
      "E6",
    ];

    let sliderLow = document.getElementById("lowNoteRange");
    let outputLow = document.getElementById("lowNoteValue");
    sliderLow.oninput = function () {
      outputLow.innerHTML = noteTypeID[sliderLow.value];
    };
    let lowRange = +sliderLow.value;
    for (let i = 0; i < lowRange; i++) {
      noteType.shift();
    }

    let sliderHigh = document.getElementById("highNoteRange");
    let outputHigh = document.getElementById("highNoteValue");
    sliderHigh.oninput = function () {
      outputHigh.innerHTML = noteTypeID[sliderHigh.value];
    };
    let highRange = +sliderHigh.value;

    if (highRange <= lowRange) {
      return alert(
        "RANGE ERROR: The highest note range cannot be less than the lowest note range."
      );
    }

    noteType.length = noteType.length - (30 - highRange);

    let skipRange = Number(document.getElementById("skipRangeChange").value);

    for (let i = 1; noteList.length < rhythms.length + 1; i++) {
      if (i === 1 && previousNoteIndex === undefined) {
        startingNoteIndex = getRandomInt(0, noteType.length - 1);
        noteList.push(noteType[startingNoteIndex]);
        previousNoteIndex = startingNoteIndex;
      } else {
        let nextNoteIndex = getRandomInt(
          previousNoteIndex - skipRange,
          previousNoteIndex + skipRange
        );
        if (
          noteType[nextNoteIndex] != undefined &&
          noteType[nextNoteIndex] != noteType[previousNoteIndex]
        ) {
          noteList.push(noteType[nextNoteIndex]);
          previousNoteIndex = nextNoteIndex;
        }
      }
    }

    if (noteList[0] === undefined) {
      noteList.splice(0, 1);
    }
  }
  genListOfNotes();

  if (noteList.length === 0) {
    return;
  }

  rhythms.forEach(function (rhythm, index) {
    if (rhythm.includes("r")) {
      if (clef === "treble") {
        noteList[index] = "B/4";
      } else if (clef === "bass") {
        noteList[index] = "D/3";
      } else if (clef === "alto") {
        noteList[index] = "C/4";
      } else if (clef === "tenor") {
        noteList[index] = "A/3";
      }
    }
  });

  for (let i = 0; i < rhythms.length; i++) {
    let testNote = noteList[i];
    if (testNote.includes("#")) {
      measure.push(
        new VF.StaveNote({
          clef: clef,
          keys: [noteList[i]],
          duration: rhythms[i],
        }).addAccidental(0, new VF.Accidental("#"))
      );
    } else if (testNote.includes("b")) {
      measure.push(
        new VF.StaveNote({
          clef: clef,
          keys: [noteList[i]],
          duration: rhythms[i],
        }).addAccidental(0, new VF.Accidental("b"))
      );
    } else {
      measure.push(
        new VF.StaveNote({
          clef: clef,
          keys: [noteList[i]],
          duration: rhythms[i],
        })
      );
    }
  }
}

let div = document.getElementById("notation");
let renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
let context = renderer.getContext();

function renderNotation(top, width, measure) {
  let staveMeasure = new Vex.Flow.Stave(0, top, width);
  let staveMeasure2 = new Vex.Flow.Stave(
    staveMeasure.width + staveMeasure.x,
    top,
    width
  );

  if (measure === 1) {
    staveMeasure
      .addClef(clef)
      .addKeySignature(document.getElementById("keyChange").value)
      // .addTimeSignature("4/4")
      .setContext(context)
      .draw();
    renderMeasure(staveMeasure);
  } else if (measure === 2) {
    staveMeasure2.setContext(context).draw();
    renderMeasure(staveMeasure2);
  }

  function renderMeasure(measure) {
    let notesMeasure = [];
    genNotes(notesMeasure);
    let beams = VF.Beam.generateBeams(notesMeasure);
    Vex.Flow.Formatter.FormatAndDraw(context, measure, notesMeasure);
    beams.forEach(function (b) {
      b.setContext(context).draw();
    });
  }
}

function genMusic() {
  let width;
  if (window.outerWidth > 1000) {
    width = 1000;
  } else width = window.outerWidth * 0.9;

  clef = document.getElementById("clefChange").value;
  if (width < 426) {
    context.rect(0, 0, width, 15550, { fill: "white" });
    renderer.resize(width, 450);
    renderNotation(0, width, 1);
    renderNotation(150, width, 1);
    renderNotation(300, width, 1);
  } else {
    context.rect(0, 0, width, 550, { fill: "white" });
    renderer.resize(width, 450);
    renderNotation(0, width / 2, 1);
    renderNotation(0, width / 2, 2);
    renderNotation(150, width / 2, 1);
    renderNotation(150, width / 2, 2);
    renderNotation(300, width / 2, 1);
    renderNotation(300, width / 2, 2);
  }
  previousNoteIndex = undefined;
  noteList = [];
}

genMusic();

// initialize chordList, to be populated by processFile through createDnaList
let chordList = []; 
let bpm = 40; // initialize bpm
let poly, underwater, seaclam, crystal; // initialize all synths
let crickets, scrub, heartbeat, aqualung, exhale, bleep; // initialize all sfx
let initialized = false; 

/* PLAYS EACH CHORD IN CHORDLIST SEQUENTIALLY
the specific synth changes every 4 measures for 60 measures
    (so 15 synths, some of which can be the same)
starts with low, far-off, contemplative, wash-y synths
which become high, fuzzy, noisy-ish synths */
function playDna(measure){
    // get chord at this measure
    const thischord = chordList[measure-2];

    // get synth for this four-measure-stretch
    let thissynth, thisoctave;
    thisoctave = 3;  
    switch (true) {
        case (measure < 6):
            thissynth = crystal; 
            break;
        case (5 < measure && measure < 10):
            thissynth = seaclam;
            break;
        case (9 < measure && measure < 14):
            thissynth = underwater;
            break; 
    }

    console.log(`Trying to play ${thischord.root}${thischord.type} 
        with ${thissynth} at octave ${thisoctave}`);
    // play chord with synth
    thischord.play(thissynth, thisoctave); 
}

/* PLAYS CHORD ON GIVEN SYNTH IN A GIVEN OCTAVE */
function synthate(synth, octave){
    console.log(`Attempting to play chord ${this.root}${this.type}`);

    if (synth == poly){
        let arr = [];
        arr.push(this.root + String(octave));
        arr.push(this.third + String(octave));
        arr.push(this.fifth + String(octave));
        arr.push(this.seventh + String(octave));
        synth.triggerAttackRelease(arr, '1.1m');
        synth.triggerAttackRelease(this.root + String(octave), 6.2); // for 6sec
    } else {
        const targetNote = this.root + String(octave); 
        synth.triggerAttack(targetNote); 
    }
}

/* INITIALIZES ALL SYNTH TYPES */
function initSynths(){
    poly = new Tone.PolySynth(Tone.FMSynth,{}); 
    poly.toDestination();
    console.log("initialized polysynth");

    underwater = new Tone.Sampler({
        urls: { A3: "A.wav", B3: "B.wav", C3: "C.wav", D3: "D.wav", E3: "E.wav", F3: "F.wav", G3: "G.wav", },
        baseUrl: "./subdued/underwater/"
    }).toDestination();

    seaclam = new Tone.Sampler({
        urls: { A3: "A.wav", B3: "B.wav", C3: "C.wav", D3: "D.wav", E3: "E.wav", F3: "F.wav", G3: "G.wav", },
        baseUrl: "./subdued/seaclam/"
    }).toDestination();

    crystal = new Tone.Sampler({
        urls: { A3: "A.wav", B3: "B.wav", C3: "C.wav", D3: "D.wav", E3: "E.wav", F3: "F.wav", G3: "G.wav", },
        baseUrl: "./subdued/crystal/"
    }).toDestination();
}

/* INITIALIZES AUDIO FILES AND INSTRUMENTS
but doesn't start yet */
function initializeAudio(){
    console.log("Initializing Audio...")
    initSfx();
    initSynths(); 
    changeLevels(); 
    console.log(`full chord list: ${chordList}`); 
    initialized = true; 
}

/* CHANGES VOLUME OF SFX 
AND THE PROPERTIES OF SYNTHS
called with user input on the sliders */
function changeLevels(){
    // 1. get cave, forest, sea, desert slider values
    // 2. use them
    console.log("Changing Levels...")
    poly.volume.value = -10; 
    seaclam.volume.value = -10; 
    crystal.volume.value = -10; 

    heartbeat.volume.value = 10;
    crickets.volume.value = -20; 
    aqualung.volume.value = 10;
    bleep.volume.value = 0; 
}

/* STARTS TIMER AND ALL PLAY FXNS */
function startAudio(){
    // check that audio is initialized
    if (!initialized){
        console.log("Play clicked without initialized audio");
        alert("You must select a dna file first!"); 
        return; 
    }

    // set bpm
    Tone.Transport.bpm.value = bpm;

    // play intro of aqualung and exhale
    Tone.Transport.schedule(() => {
        aqualung.start();
    }, "0:0");
    Tone.Transport.schedule(() => {
        exhale.start();
    }, "0:5");
    
    // only do everything after aqualung
    Tone.Transport.scheduleOnce(() => {
        // play dna, passing in measure as argument
        Tone.Transport.scheduleRepeat(() => {
            // get current measure number (starting at 0?)
            const measure = parseInt(Tone.Transport.position.split(':')[0], 10);
            console.log(`measure: ${measure}`); 
            playDna(measure);
        }, "1m"); // once every measure

        // just shorthand for initializing all the sfx
        playSfx(); 
        playFlourish(); 
        // playEnd(); 
    }, "0:5");

    // start Transport clock
    Tone.Transport.start(); 
}

/* PLAYS CONSTANT/RECURRING SFX
heartbeat; crickets, wind, forest : distorted
repeating endless samples
volume increasing towards middle/end */
function playSfx(){
    // play cricket noise throughout the whole piece, looping
    crickets.start();

    // play heartbeat
    Tone.Transport.scheduleRepeat(() => {
        heartbeat.start(); 
    }, "2n"); // twice every measure
}

/* PLAYS FLOURISHES
insect noises, samples and pitch changes going super high and low
potentially arpeggios
at ~1:00, 2:00, 2:45 */
function playFlourish(){
    // play bleep noise a few times
    Tone.Transport.schedule(() => {
        bleep.start(); 
    }, "3m"); // at the fifth measure

    // play scrub noise a few times
    Tone.Transport.schedule(() => {
        scrub.start(); 
    }, "5m"); // at the fifth measure
    Tone.Transport.schedule(() => {
        scrub.start(); 
    }, "9m"); // at the ninth measure
}

/* PLAYS ENDING SEQUENCE
heartbeat glitching out
low synth
insects low and crazy */
// function playEnd(){

// }

/* INITIALIZES ALL SFX */
function initSfx(){
    crickets = new Tone.Player({
        url: "sfx/crickets6.wav", 
        loop: true,
        autostart: false
    }).toDestination();

    heartbeat = new Tone.Player({
        url: "sfx/heartbeat.wav", 
        loop: false,
        autostart: false
    }).toDestination();

    scrub = new Tone.Player({
        url: "sfx/scrub.wav", 
        loop: false,
        autostart: false
    }).toDestination();

    bleep = new Tone.Player({
        url: "sfx/bleep3.wav", 
        loop: false,
        autostart: false
    }).toDestination();

    aqualung = new Tone.Player({
        url: "sfx/aqualung9.wav", 
        loop: false,
        autostart: false
    }).toDestination();

    exhale = new Tone.Player({
        url: "sfx/exhale8.wav", 
        loop: false,
        autostart: false
    }).toDestination();
}

/*  MOVES BETWEEN NOTES
state: 0 -> chromatic
state: 1 -> within Am */
function move(start, n, state){
    // 0 means chromatic, 1 means Am
    let notes; 
    if (state == 0){
        notes = ["Ab", "A", "Bb", "B", "C", "Db", "D", "Eb", "E", "F", "Gb", "G"];
    } else {
        notes = ["A", "B", "C", "D", "E", "F", "G"];
    }

    // get start index
    const startIndex = notes.indexOf(start);

    // check start index
    if (startIndex === -1){
        console.error("bad start note for move");
        return; 
    }

    // get new index
    const newIndex = (startIndex + n) % notes.length;

    // if negative index (probably bc went backwards), add length of notes array
    const wrappedIndex = newIndex < 0 ? notes.length + newIndex : newIndex; 

    // return note string
    return notes[wrappedIndex];
}
// initialize chordList, to be populated by processFile through createDnaList
let chordList = []; 
let bpm = 40; // initialize bpm
let poly, vapor, underwater, seaclam; // initialize all synths
let crickets, scrub, heartbeat; // initialize all sfx
let initialized = false; 

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
    vapor.volume.value = -10; 
    seaclam.volume.value = -10; 
    heartbeat.volume.value = 0;
    crickets.volume.value = -20; 
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

    // start Transport clock
    Tone.Transport.start(); 
}

/* PLAYS EACH CHORD IN CHORDLIST SEQUENTIALLY
the specific synth changes every 4 measures for 60 measures
    (so 15 synths, some of which can be the same)
starts with low, far-off, contemplative, wash-y synths
which become high, fuzzy, noisy-ish synths */
function playDna(measure){
    // get chord at this measure
    const thischord = chordList[measure];

    // get synth for this four-measure-stretch
    let thissynth, thisoctave; 
    switch (measure){
        case 0:
            thisoctave = 3;
            thissynth = seaclam; 
            break;
        default:
            thisoctave = 3;
            thissynth = seaclam; 
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
    // let arr = [];
    // arr.push(this.root + String(octave));
    // arr.push(this.third + String(octave));
    // arr.push(this.fifth + String(octave));
    // arr.push(this.seventh + String(octave));
    // synth.triggerAttackRelease(arr, '1m');
    synth.triggerAttackRelease(this.root + String(octave), 6.2); // for 6sec
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
        url: "sfx/crickets.wav", 
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
}

/* INITIALIZES ALL SYNTH TYPES */
function initSynths(){
    poly = new Tone.PolySynth(Tone.FMSynth,{
        // set ADSR
        envelope: {
            attack: '2n',
            release: '2n'
        }
    }); 
    poly.toDestination();
    console.log("initialized polysynth");

    vapor = new Tone.Sampler({
        urls: {
            F3: "short/vapor.wav"
        }
    }).toDestination();

    underwater = new Tone.Sampler({
        urls: {
            A2: "subdued/underwater.wav"
        }
    }).toDestination();

    seaclam = new Tone.Sampler({
        urls: {
            Eb3: "subdued/seaclam.wav"
        }
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
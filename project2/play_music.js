// initialize chordList, to be populated by processFile through createDnaList
let chordList = []; 

// initialize bpm
let bpm = 60;

// initialize all synths
let poly; 

// initialize heartbeat
let heartbeat; 

// initialize all other sounds
let crickets, scrub; 

let initialized = false; 

/* 
MOVES BETWEEN NOTES
state: 0 -> chromatic
state: 1 -> within Am
*/
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

/* 
PLAYS CHORD ON GIVEN SYNTH IN A GIVEN OCTAVE
*/
function synthate(synth, octave){
    console.log(`Attempting to play chord ${this.root}${this.type}`);
    let arr = [];
    arr.push(this.root + String(octave));
    arr.push(this.third + String(octave));
    arr.push(this.fifth + String(octave));
    arr.push(this.seventh + String(octave));
    synth.triggerAttackRelease(arr, '1m');
}

/* 
ARPEGGIATES CHORD ON GIVEN INSTRUMENT IN A GIVEN OCTAVE
*/
// function arpeggiate(instr, octave){

// }

/* 
INITIALIZES AUDIO FILES AND INSTRUMENTS
but doesn't start yet
*/
function initializeAudio(){
    console.log("Initializing Audio...")
    
    // TODO: add all other synths
    poly = new Tone.PolySynth(Tone.FMSynth,{
        // set ADSR
        envelope: {
            attack: '2n',
            release: '2n'
        }
    }); 
    poly.toDestination();
    console.log("initialized polysynth");
    
    // initialize heartbeat
    heartbeat = new Tone.Sampler({
        F3: "heartbeat.wav",
    }, () => {
        console.log("heartbeat loaded")
    }).toDestination(); 

    // TODO: add all other samples
    crickets = new Tone.Player({
        url: "sfx/crickets.wav", 
        loop: true,
        autostart: false
    }).toDestination();

    scrub = new Tone.Player({
        url: "sfx/scrub.wav", 
        loop: false,
        autostart: false
    }).toDestination();

    // TODO: set volumes
    poly.volume.value = -5; 
    heartbeat.volume.value = -10;
    crickets.volume.value = -20; 

    // TODO: call changeLevels to initialize levels


    console.log(`full chord list: ${chordList}`); 
    initialized = true; 
}

/* 
CHANGES VOLUME OF VARIOUS SFX & THE PROPERTIES OF OUR SYNTHS
called with user input on the sliders
*/
function changeLevels(){
    // 1. get cave, forest, sea, desert slider values
    // 2. use them
    console.log("Changing Levels...")
}

/* 
STARTS TIMER AND ALL PLAYSOMETHING FUNCTIONS
*/
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
        const measure = Math.floor(Tone.Transport.seconds / Tone.Transport.ppq);
        playDna(measure);
    }, "1m"); // once every measure

    // play heartbeat
    Tone.Transport.scheduleRepeat(() => {
        // get current measure number (starting at 0?)
        const measure = Math.floor(Tone.Transport.seconds / Tone.Transport.ppq);
        playHeartbeat(measure); // bc need a separate fxn to shift pitch
    }, "2n"); // twice every measure

    // just shorthand for initializing all the sfx
    playSfx(); 
    playFlourish(); 
    // playEnd(); 

    // start Transport clock
    Tone.Transport.start(); 
}

/*
PLAYS EACH CHORD IN CHORDLIST SEQUENTIALLY
the specific synth changes every 4 measures for 60 measures
    (so 15 synths, some of which can be the same)
starts with low, far-off, contemplative, wash-y synths
which become high, fuzzy, noisy-ish synths
*/
function playDna(measure){
    // get chord at this measure
    const thischord = chordList[measure];

    // get synth for this four-measure-stretch
    let thissynth, thisoctave; 
    switch (measure){
        case 0:
            thisoctave = 4;
            thissynth = poly; 
            break;
        default:
            thisoctave = 4;
            thissynth = poly; 
            break; 
    }

    console.log(`Trying to play ${thischord.root}${thischord.type} 
        with ${thissynth} at octave ${thisoctave}`);
    // play chord with synth
    thischord.synthate(thissynth, thisoctave); 
}

/*
PLAYS A HEARTBEAT TWICE PER MEASURE UNTIL PLAYEND
with a shift in pitch to match the chord
*/
function playHeartbeat(measure){
    // get chord at this measure
    const thischord = chordList[measure];

    // play heartbeat at chord root pitch in the third octave
    heartbeat.triggerAttack(thischord.root + '3'); 
}

/*
PLAYS SOUND EFFECTS
crickets, wind, forest : distorted
repeating endless samples
volume increasing towards middle/end
*/
function playSfx(){
    // play cricket noise throughout the whole piece, looping
    crickets.start();
}

/*
PLAYS FLOURISHES
insect noises, samples and pitch changes going super high and low
potentially arpeggios
at ~1:00, 2:00, 2:45
*/
function playFlourish(){
    // play scrub noise a few times
    Tone.Transport.schedule(() => {
        scrub.start(); 
    }, "5m"); // at the fifth measure
    Tone.Transport.schedule(() => {
        scrub.start(); 
    }, "9m"); // at the ninth measure
}

/* 
PLAYS ENDING SEQUENCE
heartbeat glitching out
low synth
insects low and crazy
*/
// function playEnd(){

// }


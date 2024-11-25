// include Tone.js
<script src="https://cdnjs.cloudflare.com/ajax/libs/tone/15.1.3/Tone.js"></script>

// initialize chordList, to be populated by processFile through createDnaList
let chordList = []; 

// initialize bpm
let bpm = 60;

// initialize all synths
let poly; 

// initialize heartbeat
let heartbeat; 

// initialize all other sounds

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
function arpeggiate(instr, octave){

}

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
    crickets = new Tone.Sampler({
        F3: "sfx/crickets.wav",
    }, () => {
        console.log("crickets loaded")
    }).toDestination(); 

    // TODO: set volumes
    poly.volume.value = -5; 

    // TODO: call changeLevels to initialize levels
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
    // set bpm
    Tone.Transport.bpm.value = bpm;
    
    // create dna player
    playDna(); 

    // create other players

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
function playDna(){

    // repeating event
    Tone.Transport.scheduleRepeat((time) => {
        const dnaMeasure = (time) => {
            console.log(`dnaMeasure triggered at time: ${time}`);
            synthate(poly, 4);
        }
    }, "4n"); // repeats every 4n (aka 1m)

}

/*
PLAYS A HEARTBEAT TWICE PER MEASURE UNTIL PLAYEND
with a shift in pitch to match the chord
*/
function playHeartbeat(){

}

/*
PLAYS SOUND EFFECTS
crickets, wind, forest : distorted
repeating endless samples
volume increasing towards middle/end
*/
function playSfx(){

}

/*
PLAYS FLOURISHES
insect noises, samples and pitch changes going super high and low
potentially arpeggios
at ~1:00, 2:00, 2:45
*/
function playFlourish(){
    // non-repeating event
    Tone.Transport.schedule(() => {
        // do something
    }, 1000); // after a certain time
}

/* 
PLAYS ENDING SEQUENCE
heartbeat glitching out
low synth
insects low and crazy
*/
function playEnd(){

}


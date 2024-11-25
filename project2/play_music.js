// include Tone.js
<script src="https://cdnjs.cloudflare.com/ajax/libs/tone/15.1.3/Tone.js"></script>

// initialize chordList, to be populated by processFile through createDnaList
let chordList = []; 

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
INITIALIZES AUDIO FILES AND INSTRUMENTS
but doesn't start yet
*/
function initializeAudio(){

}

/* 
PLAYS CHORD ON GIVEN SYNTH
*/
function synthate(synth){
    // play this.chord, this.third, etc. 
}

/* 
ARPEGGIATES CHORD ON GIVEN INSTRUMENT
*/
function arpeggiate(instr){

}

/* 
STARTS TIMER AND ALL PLAYSOMETHING FUNCTIONS
*/
function startAudio(){

}

/*
PLAYS EACH CHORD IN CHORDLIST SEQUENTIALLY
the specific synth changes every 4 measures for 60 measures
    (so 15 synths, some of which can be the same)
starts with low, far-off, contemplative, wash-y synths
which become high, fuzzy, noisy-ish synths
*/
function playDna(){

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

}

/* 
PLAYS ENDING SEQUENCE
heartbeat glitching out
low synth
insects low and crazy
*/
function playEnd(){

}


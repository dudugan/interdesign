// initialize chordList, to be populated by processFile through createDnaList
let chordList = []; 
let bpm = 40; // initialize bpm
    // TODO: if want no spaces, make this 45 or smth

// initialize biomes, and therefore all local sounds
let sea = new Biome("sea");
// let desert = new Biome("desert");
// let forest = new Biome("forest");
// let cave = new Biome("cave");
let biomeList = [sea];

// initialize global sounds
let crystal, twinkle; // initialize all basal synths
let crickets, scrub, heartbeat, aqualung, exhale, bleep, cpuglitch, creepycrumbly; // initialize all sfx
initGlobal();
let initialized = false; 

/* PLAYS EACH CHORD IN CHORDLIST SEQUENTIALLY
the specific synth changes every 4 measures for 60 measures
    (so 15 synths, some of which can be the same)
starts with low, far-off, contemplative, wash-y synths
which become high, fuzzy, noisy-ish synths */
function playDna(measure){
    const thischord = chordList[measure];

    // get synth for this four-measure-stretch
    let thissynth, thisoctave;
    thisoctave = 3;  
    switch (true) {
        case (measure <= 4):
            thissynth = crystal; 
            break;
        case (3 < measure && measure < 8):
            thissynth = 'sbd1';
            break;
        case (7 < measure && measure < 12):
            thissynth = 'sbd2';
            break; 
        case (11 < measure && measure < 16):
            thissynth = 'sbd2';
            break;
        case (15 < measure && measure < 20):
            thissynth = 'prech';
            break;
        case (19 < measure && measure < 24):
            thissynth = 'ch1';
            break;
        case (23 < measure && measure < 28):
            thissynth = 'ch2';
            break;
        case (27 < measure && measure < 32):
            thissynth = 'sbd3';
            break;
        case (31 < measure && measure < 36):
            thissynth = 'ch2';
            break; 
        case (35 < measure && measure < 40):
            thissynth = 'postch1';
            break;
        case (39 < measure && measure < 44):
            thissynth = 'postch2';
            break;
        case (43 < measure && measure < 48):
            thissynth = 'sbd3';
            break;
        case (47 < measure && measure < 52):
            return; 
        case (51 < measure && measure < 56):
            thissynth = twinkle;
            break;
    }

    console.log(`Trying to play ${thischord.root}${thischord.type} 
        with ${thissynth} at octave ${thisoctave}`);
    // play chord with synth
    thischord.play(thissynth, thisoctave); 
}

/* PLAYS CHORD ON GIVEN SYNTH IN A GIVEN OCTAVE */
function synthate(synth, octave){
    console.log(`Playing chord ${this.root}${this.type}`);
    const targetNote = this.root + String(octave); 

    if (synth == crystal || synth == twinkle){
        synth.triggerAttack(targetNote);
    } else {
        for (let i = 0; i < biomeList.length; i++){
            synth = biomeList[i][synth];
            synth.triggerAttack(targetNote);
        }
    }
}

/* INITIALIZES AUDIO FILES AND INSTRUMENTS
but doesn't start yet */
function initializeAudio(){
    console.log("Initializing Audio...")
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
        console.log("playing aqualung at 0:0"); 
        aqualung.start();
    }, "0:0");
    Tone.Transport.schedule(() => {
        console.log("playing exhale at 0:5"); 
        exhale.start();
    }, "0:5");
    
    // only do everything after aqualung
    Tone.Transport.scheduleOnce(() => {
        console.log("starting dna player at 0:5"); 
        // play dna, passing in measure as argument
        Tone.Transport.scheduleRepeat(() => {
            // get current measure number (starting at 0?)
            const measure = parseInt(Tone.Transport.position.split(':')[0], 10);
            console.log(`attempting to play dna at measure: ${measure}`); 
            playDna(measure);
        }, "1m"); // once every measure

        // just shorthand for initializing all the sfx
        playGlobalSfx(); 
        playLocalSfx();
        // playEnd(); 
    }, "0:5");

    // start Transport clock
    Tone.Transport.start(); 
    console.log("starting transport clock"); 
}

/* PLAYS GLOBAL SFX
heartbeat; crickets, wind, forest : distorted
insect noises, samples and pitch changes going super high and low
repeating endless samples
volume increasing towards middle/end */
function playGlobalSfx(){
    // play cricket noise throughout the whole piece, looping
    crickets.start();

    // play heartbeat
    Tone.Transport.scheduleRepeat(() => {
        heartbeat.start(); 
    }, "2n"); // twice every measure

    // play bleep noise a few times
    Tone.Transport.schedule(() => {
        console.log("playing bleep at 3m"); 
        bleep.start(); 
    }, "3m"); 
    Tone.Transport.schedule(() => {
        console.log("playing bleep at 15m"); 
        bleep.start(); 
    }, "15m"); 
    Tone.Transport.schedule(() => {
        console.log("playing bleep at 31m"); 
        bleep.start(); 
    }, "31m"); 

    // play scrub noise a few times
    Tone.Transport.schedule(() => {
        console.log("playing scrub at 4m"); 
        scrub.start(); 
    }, "4m");
    Tone.Transport.schedule(() => {
        console.log("playing scrub at 20m"); 
        scrub.start(); 
    }, "20m"); 
    Tone.Transport.schedule(() => {
        console.log("playing scrub at 36m"); 
        scrub.start(); 
    }, "36m"); 

    // play creepy crumbly
    Tone.Transport.schedule(() => {
        console.log("playing creepycrumbly at 12m"); 
        creepycrumbly.start(); 
    }, "12m"); 

    // play cpu glitch at end
    Tone.Transport.schedule(() => {
        console.log("playing cpuglitch at 47m"); 
        cpuglitch.start(); 
    }, "47m"); 
}

/* PLAYS LOCAL SFX
*/
function playLocalSfx(){
    for (let i = 0; i < biomeList.length; i++){
        biome = biomeList[i];
        vol = biome.level; 

        // biome.bg1.volume = -15; 
        // biome.bg2.volume = -15; 
        // biome.bg3.volume = -15;  
        // biome.bg1.start();
        // biome.bg2.start();
        // biome.bg3.start();

        // play sfx noise a few times
        Tone.Transport.schedule(() => {
            console.log(`playing ${biome.name} sfx1 at 13m`); 
            biome.sfx1.start(); 
        }, "13m"); 
        Tone.Transport.schedule(() => {
            console.log(`playing ${biome.name} sfx1 at 25m`); 
            biome.sfx1.start(); 
        }, "25m"); 
        Tone.Transport.schedule(() => {
            console.log(`playing ${biome.name} sfx1 at 33m`); 
            biome.sfx1.start(); 
        }, "33m"); 

        Tone.Transport.schedule(() => {
            console.log(`playing ${biome.name} sfx2 at 26m`); 
            biome.sfx2.start(); 
        }, "26m"); 
        Tone.Transport.schedule(() => {
            console.log(`playing ${biome.name} sfx2 at 46m`); 
            biome.sfx2.start(); 
        }, "46m"); 

        // ramp (auto-set to go to Am)
        Tone.Transport.schedule(() => {
            console.log(`playing ${biome.name} ramp at 20m as A3`); 
            biome.ramp.triggerAttack("A3"); 
        }, "20m"); 
    }
}

/* PLAYS ENDING SEQUENCE
heartbeat glitching out
low synth
insects low and crazy */
// function playEnd(){
// }

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

/* 
CONSTRUCTS BIOME OBJECTS
*/
function Biome(name){

    // properties
    this.name = name;
    this.level = 0.25; 

    // init all synths
    this.sbd1 = new Tone.Sampler({
        urls: { A3: "A.wav", B3: "B.wav", C3: "C.wav", D3: "D.wav", E3: "E.wav", F3: "F.wav", G3: "G.wav", },
        baseUrl: `./${name}/sbd1/`
    }).toDestination();
    this.sbd2 = new Tone.Sampler({
        urls: { A3: "A.wav", B3: "B.wav", C3: "C.wav", D3: "D.wav", E3: "E.wav", F3: "F.wav", G3: "G.wav", },
        baseUrl: `./${name}/sbd2/`
    }).toDestination();
    this.sbd3 = new Tone.Sampler({
        urls: { A3: "A.wav", B3: "B.wav", C3: "C.wav", D3: "D.wav", E3: "E.wav", F3: "F.wav", G3: "G.wav", },
        baseUrl: `./${name}/sbd3/`
    }).toDestination();
    this.prech = new Tone.Sampler({
        urls: { A3: "A.wav", B3: "B.wav", C3: "C.wav", D3: "D.wav", E3: "E.wav", F3: "F.wav", G3: "G.wav", },
        baseUrl: `./${name}/prech/`
    }).toDestination();
    this.ch1 = new Tone.Sampler({
        urls: { A3: "A.wav", B3: "B.wav", C3: "C.wav", D3: "D.wav", E3: "E.wav", F3: "F.wav", G3: "G.wav", },
        baseUrl: `./${name}/ch1/`
    }).toDestination();
    this.ch2 = new Tone.Sampler({
        urls: { A3: "A.wav", B3: "B.wav", C3: "C.wav", D3: "D.wav", E3: "E.wav", F3: "F.wav", G3: "G.wav", },
        baseUrl: `./${name}/ch2/`
    }).toDestination();
    this.postch1 = new Tone.Sampler({
        urls: { A3: "A.wav", B3: "B.wav", C3: "C.wav", D3: "D.wav", E3: "E.wav", F3: "F.wav", G3: "G.wav", },
        baseUrl: `./${name}/postch1/`
    }).toDestination();
    this.postch2 = new Tone.Sampler({
        urls: { A3: "A.wav", B3: "B.wav", C3: "C.wav", D3: "D.wav", E3: "E.wav", F3: "F.wav", G3: "G.wav", },
        baseUrl: `./${name}/postch2/`
    }).toDestination();

    // init ramp
    this.ramp = new Tone.Sampler({
        urls: { A3: "A.wav", B3: "B.wav", C3: "C.wav", D3: "D.wav", E3: "E.wav", F3: "F.wav", G3: "G.wav", },
        baseUrl: `./${name}/ramp/`
    }).toDestination();

    // init all sfx and bg
    this.sfx1 = new Tone.Player({
        url: `${name}/sfx/sfx1.wav`, 
        loop: false,
        autostart: false
    }).toDestination();
    this.sfx2 = new Tone.Player({
        url: `${name}/sfx/sfx2.wav`, 
        loop: false,
        autostart: false
    }).toDestination();
    this.sfx3 = new Tone.Player({
        url: `${name}/sfx/sfx3.wav`, 
        loop: false,
        autostart: false
    }).toDestination();
    // bgs loop duh
    this.bg1 = new Tone.Player({
        url: `${name}/bg/bg1.wav`, 
        loop: true,
        autostart: false
    }).toDestination();
    this.bg2 = new Tone.Player({
        url: `${name}/bg/bg2.wav`, 
        loop: true,
        autostart: false
    }).toDestination();
    this.bg3 = new Tone.Player({
        url: `${name}/bg/bg3.wav`, 
        loop: true,
        autostart: false
    }).toDestination();

    console.log(`initialized sounds and properties for biome ${name}`); 
}

/* INITIALIZES ALL GLOBAL SYNTHS AND SFX */
function initGlobal(){
    crystal = new Tone.Sampler({
        urls: { A3: "A.wav", B3: "B.wav", C3: "C.wav", D3: "D.wav", E3: "E.wav", F3: "F.wav", G3: "G.wav", },
        baseUrl: "./global/crystal/"
    }).toDestination();
    twinkle = new Tone.Sampler({
        urls: { A3: "A.wav", B3: "B.wav", C3: "C.wav", D3: "D.wav", E3: "E.wav", F3: "F.wav", G3: "G.wav", },
        baseUrl: "./global/crystal/"
    }).toDestination();

    crickets = new Tone.Player({
        url: "global/sfx/crickets6.wav", 
        loop: true,
        autostart: false
    }).toDestination();
    heartbeat = new Tone.Player({
        url: "global/sfx/heartbeat.wav", 
        loop: false,
        autostart: false
    }).toDestination();
    scrub = new Tone.Player({
        url: "global/sfx/scrub.wav", 
        loop: false,
        autostart: false
    }).toDestination();
    bleep = new Tone.Player({
        url: "global/sfx/bleep3.wav", 
        loop: false,
        autostart: false
    }).toDestination();
    aqualung = new Tone.Player({
        url: "global/sfx/aqualung9.wav", 
        loop: false,
        autostart: false
    }).toDestination();
    exhale = new Tone.Player({
        url: "global/sfx/exhale8.wav", 
        loop: false,
        autostart: false
    }).toDestination();
    creepycrumbly = new Tone.Player({
        url: "global/sfx/creepycrumbly9.wav", 
        loop: false,
        autostart: false
    }).toDestination();
    cpuglitch = new Tone.Player({
        url: "global/sfx/cpuglitch.wav", 
        loop: false,
        autostart: false
    }).toDestination();

    console.log("initialized global sounds"); 
}
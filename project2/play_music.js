// initialize chordList, to be populated by processFile through createDnaList
let chordList = []; 
let bpm = 44; // initialize bpm (40 would have zero overlap between clips)
const synthGain = new Tone.Gain(1).toDestination();
const sfxGain = new Tone.Gain(1).toDestination();

// initialize biomes, and therefore all local sounds
let sea = new Biome("sea");
let desert = new Biome("desert");
let forest = new Biome("forest");
let cave = new Biome("cave");
let biomeList = [cave, desert, forest, sea];

const g = {}; // initialize centralized object for all global samplers and players

initGlobal();
let initialized = false; 
let finished = false; 

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
        case (measure < 4):
            thissynth = g.crystal; 
            break;
        case (3 < measure && measure < 8):
            thissynth = 'sbd1';
            break;
        case (7 < measure && measure < 12):
            thissynth = 'sbd2';
            break; 
        case (11 < measure && measure < 14):
            thissynth = 'sbd2';
            break;
        case (13 < measure && measure < 16):
            thissynth = 'sbd1';
            break; 
        case (15 < measure && measure < 20):
            thissynth = 'prech';
            break;
        case (19 < measure && measure < 24):
            thissynth = 'ch1';
            break;
        case (23 < measure && measure < 28):
            thissynth = 'postch1';
            break;
        case (27 < measure && measure < 32):
            thissynth = 'postch2';
            break;
        case (31 < measure && measure < 36):
            thissynth = 'ch2';
            break; 
        case (35 < measure && measure < 40):
            thissynth = 'sbd1';
            break;
        case (39 < measure && measure < 44):
            thissynth = 'sbd2';
            break;
        case (43 < measure && measure < 48):
            thissynth = 'ch2';
            break;
        case (47 < measure && measure < 52):
            return; 
        case (51 < measure && measure < 56):
            thissynth = g.twinkle;
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

    if (synth == g.crystal || synth == g.twinkle){
        synth.triggerAttack(targetNote);
    } else {
        for (let i = 0; i < biomeList.length; i++){
            new_synth = biomeList[i][synth];
            new_synth.triggerAttack(targetNote);
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
    g.crystal.volume.value = -10; 

    g.heartbeat.volume.value = 20;
    g.crickets.volume.value = -20; 
    g.aqualung.volume.value = 10;
    g.bleep.volume.value = 0; 
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

    // synth automation
    Tone.Transport.schedule((time) => {
        // start at initial volume
        synthGain.gain.setValueAtTime(1, time);

        // ramp 8-10m
        synthGain.gain.linearRampToValueAtTime(2, time + Tone.Time("8m").toSeconds()); 

        // fall 12m
        synthGain.gain.setValueAtTime(2, time + Tone.Time("12m").toSeconds());
        synthGain.gain.linearRampToValueAtTime(1, time + Tone.Time("14m").toSeconds());

        // ramp 16-20m
        synthGain.gain.setValueAtTime(1, time + Tone.Time("16m").toSeconds());
        synthGain.gain.linearRampToValueAtTime(3, time + Tone.Time("20m").toSeconds());

        // fall 24m
        synthGain.gain.setValueAtTime(3, time + Tone.Time("23m").toSeconds());
        synthGain.gain.linearRampToValueAtTime(2, time + Tone.Time("25m").toSeconds());

        // ramp 44-47m
        synthGain.gain.setValueAtTime(2, time + Tone.Time("43m").toSeconds());
        synthGain.gain.linearRampToValueAtTime(3, time + Tone.Time("47m").toSeconds());

        // fall 48m
        synthGain.gain.setValueAtTime(3, time + Tone.Time("47m").toSeconds());
        synthGain.gain.linearRampToValueAtTime(2, time + Tone.Time("48m").toSeconds());
    }, 0);

    // sfx automation
    Tone.Transport.schedule((time) => {
        // start at initial volume
        sfxGain.gain.setValueAtTime(1, time);

        // fall to 3/4 at 4m
        synthGain.gain.setValueAtTime(1, time + Tone.Time("3m").toSeconds());
        synthGain.gain.linearRampToValueAtTime(0.75, time + Tone.Time("4m").toSeconds());

        // ramp to 2 6-9m
        synthGain.gain.setValueAtTime(0.75, time + Tone.Time("6m").toSeconds());
        synthGain.gain.linearRampToValueAtTime(2, time + Tone.Time("9m").toSeconds());
        
        // fall to 1 16-20m
        synthGain.gain.setValueAtTime(2, time + Tone.Time("16m").toSeconds());
        synthGain.gain.linearRampToValueAtTime(1, time + Tone.Time("20m").toSeconds());

        // ramp to 2 26-28m
        synthGain.gain.setValueAtTime(1, time + Tone.Time("26m").toSeconds());
        synthGain.gain.linearRampToValueAtTime(2, time + Tone.Time("28m").toSeconds());

        // ramp to 3 46-48m
        synthGain.gain.setValueAtTime(2, time + Tone.Time("46m").toSeconds());
        synthGain.gain.linearRampToValueAtTime(3, time + Tone.Time("48m").toSeconds());

        // fall to 2 49-51m
        synthGain.gain.setValueAtTime(3, time + Tone.Time("49m").toSeconds());
        synthGain.gain.linearRampToValueAtTime(2, time + Tone.Time("51m").toSeconds());
    }, 0); 

    // schedule sfx
    playGlobalSfx(); 
    playLocalSfx();
    
    // schedule dna to start 5 seconds delayed
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
        playEnd(); 
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
    g.crickets.start();

    // play heartbeat
    Tone.Transport.scheduleRepeat(() => {
        g.heartbeat.start(); 
    }, "2n"); // twice every measure

    // all singleton sfx
    const singletonSfx = {
        bleep: ["3m", "15m", "31m"],
        scrub: ["4m", "28m"],
        creepycrumbly: ["12m", "37m", "49m"],
        aqualung: ["0:0"],
        aqualung_backwards: ["50m"],
        exhale: ["0:5", "36m", "49m"],
        wash: ["9m"],
        cpuglitch: ["48m"],
        med: ["48m"]
    };

    for (const [player, times] of Object.entries(singletonSfx)){
        console.log(`scheduling ${player}`);
        times.forEach((time) => {
            Tone.Transport.schedule(() => {
                console.log(`playing ${player} at ${time}`); 
                g[player].start(); 
            }, time);
        });
    }
}

function playEnd(){
    // schedule end of piece
    Tone.Transport.schedule(() => {
        console.log("looping piece!"); 
        Tone.Transport.position = 0;
    }, "52m");
}

/* PLAYS LOCAL SFX
*/
function playLocalSfx(){
    for (let i = 0; i < biomeList.length; i++){
        let biome = biomeList[i];

        // play bg1 rly lightly
        biome.bg.volume = -20; 

        Tone.Transport.schedule(() => {
            console.log(`starting ${biome.name} bg at 0:5`); 
            biome.bg.start(); 
        }, "0:5"); 

        // play sfx1 a few times
        Tone.Transport.schedule(() => {
            console.log(`playing ${biome.name} sfx1 at 46m`); 
            biome.sfx.start(); 
        }, "46m"); 

        // ramp (auto-set to go to Am)
        Tone.Transport.schedule(() => {
            console.log(`playing ${biome.name} ramp at 20m as A3`); 
            biome.ramp.start(); 
        }, "20m"); 
    }
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

    // get start index, new index, wrapped index
    const startIndex = notes.indexOf(start);
    if (startIndex === -1){
        console.error("bad start note for move");
        return; 
    }
    const newIndex = (startIndex + n) % notes.length;
    const wrappedIndex = newIndex < 0 ? notes.length + newIndex : newIndex; // if negative index (probably bc went backwards), add length of notes array

    // return note string
    return notes[wrappedIndex];
}

/* 
CONSTRUCTS BIOME OBJECTS
*/
function Biome(name){

    // properties
    this.name = name;

    // synths
    const synthsList = ["sbd1", "sbd2", "prech", "ch1", "postch1", "postch2", "ch2"];
    for (let synth of synthsList){
        console.log(`initializing ${synth} sampler for biome ${name}`);
        this[synth] = new Tone.Sampler({
            urls: { A3: "A.wav", B3: "B.wav", C3: "C.wav", D3: "D.wav", E3: "E.wav", F3: "F.wav", G3: "G.wav", },
            baseUrl: `./${name}/${synth}/`
        }).connect(synthGain);
    }

    // sfx
    console.log(`initializing sfx sampler for biome ${name}`);
    this.sfx = new Tone.Player({
        url: `${name}/sfx/sfx.wav`, 
        loop: false,
        autostart: false
    }).connect(sfxGain);

    // bg
    console.log(`initializing bg sampler for biome ${name}`);
    this.bg = new Tone.Player({
        url: `${name}/sfx/bg.wav`, 
        loop: true,
        autostart: false
    }).connect(sfxGain);

    // ramp
    console.log(`initializing sfx sampler for biome ${name}`);
    this.sfx = new Tone.Player({
        url: `${name}/ramp/A.wav`, 
        loop: false,
        autostart: false
    }).connect(synthGain);

    // levelling
    let _level = 0.25; // default level internal storage
    Object.defineProperty(this, "level", {
        get() {
            return _level; 
        },
        // whenever change level, change volume of all synths
        set(value){
            _level = 1- value;
            let vol = Tone.gainToDb(value);
            for (let synth of synthsList){
                this[synth].volume.value = vol; 
            }
            console.log(`${this.name} synth volume updated to ${vol} dB`); 
        }
    });

    console.log(`initialized sounds and properties for biome ${name}`); 
}

/* INITIALIZES ALL GLOBAL SYNTHS AND SFX */
function initGlobal(){
    // looping sfx
    g.crickets = new Tone.Player({
        url: "global/sfx/crickets.wav", 
        loop: true,
        autostart: false
    }).connect(sfxGain);

    // synths
    const globalSynths = ['crystal', 'twinkle'];
    for (let synth of globalSynths){
        console.log(`initializing ${synth} sampler`);
        g[synth] = new Tone.Sampler({
            urls: { A3: "A.wav", B3: "B.wav", C3: "C.wav", D3: "D.wav", E3: "E.wav", F3: "F.wav", G3: "G.wav", },
            baseUrl: `./global/${synth}/`
        }).connect(synthGain);
    }

    // non-looping sfx
    const globalSfx = ['bleep', 'scrub', 'creepycrumbly',
        'aqualung', 'aqualung_backwards', 'exhale', 'cpuglitch', 'wash',
        'med', 'heartbeat'];
    for (let sfect of globalSfx){
        console.log(`initializing ${sfect} player`);
        g[sfect] = new Tone.Player({
            url: `global/sfx/${sfect}.wav`,
            loop: false,
            autostart: false
        }).connect(sfxGain);
    }

    console.log("initialized global sounds"); 
}
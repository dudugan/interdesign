// initialize fileContent and chordList globally within this function
let fileContent = "";

/* 
CONSTRUCTS CHORD OBJECTS
*/
function Chord(root, type){
    // properties
    this.root = root;
    this.type = type; // maj = 1; min = 0
    this.fifth = move(root, 7, 0); // 7 bc we're moving in half-steps
    if (this.type == 1){
        this.third = move(root, 4, 0); 
        this.seventh = move(root, 11, 0); 
    } else if (this.type == 0){
        this.third = move(root, 3, 0); 
        this.seventh = move(root, 10, 0); 
    }

    // methods (use functions in play_music)
    this.play = synthate;
    this.arpeggiate = arpeggiate;
}

/* 
READS IN DNA FILE
*/
async function processFile(){
    // TODO: do I really need this?
    const fileInput = document.getElementById('upload'); 

    // check for file existence
    if (fileInput.files.length === 0){
        alert('please select a file');
        return; 
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    // reads the file content
    reader.readAsText(file); 

    // runs whenever the reader is done reading the file content
    reader.onload = async function(event){
        // set fileContent
        fileContent = event.target.result;
        
        // populate chordList
        createDnaList(fileContent);

        // initialize audio
        initializeAudio(); 
    }
}

/* 
REPORTS UNRECOGNIZED CHARACTERS IN INPUT FILE
*/
function reportUnrecognized(){
    console.error("unrecognized character in input file");
    alert("unrecognized character in input file"); 
    return; 
}

/* 
TRANSFERS DNA FILE TEXT CONTENT INTO LIST OF CHORD OBJECTS
*/
function createDnaList(text){
    // for every three chars in fileContent, create a 4-chord progression
    for (let i = 0; i < text.length; i+=3){
        // initialize nucleotides
        let char1 = text[i];
        let char2, char3;
        
        // initialize eventual chord progression (and push Am)
        let chord1 = new Chord("A", 0);
        chordList.push(chord1); 
        let chord2, chord3, chord4;

        let root3, root4; 
        
        // set second chord
        switch (char1){
            case 'A':
                chord2 = new Chord("F", 1);
                break;
            case 'C':
                chord2 = new Chord("G", 1);
                break;
            case 'G':
                chord2 = new Chord("B", 1);
                break;
            case 'T':
                chord2 = new Chord("F", 0);
                break;
            default:
                reportUnrecognized();
                return; 
        }

        // only read third chord if char2 exists
        if (text[i+1]){
            char2 = text[i+1];

            // set third chord
            switch (char2){
                case 'A':
                    // up a 5th, major
                    root3 = move(chord2.root, 4, 1); 
                    chord3 = new Chord(root3, 1);
                    break;
                case 'C':
                    // moves down one, flips type
                    root3 = move(chord2.root, -1, 1); 
                    chord3 = new Chord(root3, 1 - chord2.type);
                    break;
                case 'G':
                    // moves up one, flips type
                    root3 = move(chord2.root, 1, 1); 
                    chord3 = new Chord(root3, 1 - chord2.type);
                    break;
                case 'T':
                    // up a 5th, minor
                    root3 = move(chord2.root, 4, 1); 
                    chord3 = new Chord(root3, 0);
                    break;
                default:
                    reportUnrecognized();
                    return; 
            }
        } 
        // if no second or third character
        else {
            chord3 = new Chord("A", 0);
            char2 = '-'; 
        }

        // only read chord4 if char3 exists
        if (text[i+2]){
            char3 = text[i+2];
            // set fourth chord
            switch (char3){
                case 'A':
                    // if chord3 was major, duplicate it
                    if (chord3.type === 1){
                        chord4 = new Chord(chord3.root, 1);
                    } 
                    // otherwise move up a 3rd, major
                    else {
                        root4 = move(chord3.root, 2, 1);
                        chord4 = new Chord(root4, 1); 
                    }
                    break;
                case 'C':
                    // moves down one, flips type
                    root4 = move(chord3.root, -1, 1); 
                    chord4 = new Chord(root4, 1 - chord3.type);
                    break;
                case 'G':
                    // moves up one, flips type
                    root4 = move(chord3.root, 1, 1); 
                    chord4 = new Chord(root4, 1 - chord3.type);
                    break;
                case 'T':
                    // flips type
                    chord4 = new Chord(chord3.root, 1 - chord3.type);
                    break;
                default:
                    reportUnrecognized();
                    return; 
            }
        } 
        // if no third character
        else {
            chord4 = new Chord("A", 0);
            char3 = '-'; 
        }

        // push to chordList (initialized in play_music.js)
        chordList.push(chord2);
        chordList.push(chord3);
        chordList.push(chord4);

        // log mapping
        console.log(`mapped ${char1}${char2}${char3} to 
            progression A0-${chord2.root}${chord2.type}-
            ${chord3.root}${chord3.type}-${chord4.root}${chord4.type}`); 
    } 
}

// ** CONSTRUCTS CHORD OBJECTS **
// to create a new chord: "const chord1 = new Chord("C", "maj");"
function Chord(root, type){
    // properties
    this.root = root;
    this.type = type; // maj/min
    this.fifth = move(root, 7); // 7 bc we're moving in half-steps
    if (this.type == 'maj'){
        this.third = move(root, 4); 
        this.seventh = move(root, 11); 
    } else if (this.type == 'min'){
        this.third = move(root, 3); 
        this.seventh = move(root, 10); 
    }

    // methods (use functions in play_music)
    this.play = synthate;
    this.arpeggiate = arpeggiate;
}

// ** READS DNA FILE INTO LIST OF CHORD OBJECTS **
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

    // runs whenever the reader is done reading the file content
    reader.onload = async function(event){
        fileContent = event.target.result;
        initializeAudio(); 
    }

    // reads the file content
    reader.readAsText(file); 
}

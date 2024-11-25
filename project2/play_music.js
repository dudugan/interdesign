// include Tone.js
<script src="https://cdnjs.cloudflare.com/ajax/libs/tone/15.1.3/Tone.js"></script>

// for moving from one note to another
function move(start, n){
    const notes = ["Ab", "A", "Bb", "B", "C", "Db", "D", "Eb", "E", "F", "Gb", "G"];
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

function initializeAudio(){

}

function startAudio(){
    
}

function synthate(chord){

}

function arpeggiate(chord){

}
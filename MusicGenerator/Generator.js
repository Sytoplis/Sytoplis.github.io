class Generator{

    MusicInfo;
    musicParameters = {
        ChordTone: 0,
        ChordType: "maj7"
    };

    constructor(path){
        return this.fetchJSON(path).then(() => { return this; });//return first a promise and then the actual self
    }

    async fetchJSON(path) {
        let response = await fetch(path);//use absolute path to always find words
        this.MusicInfo = await response.json();
    }


    generate(){
        this.pickChord();
        let refNote = Soundfont.noteToMidi("d4");//convert the note to a number
        let notes = this.MusicParametersToChordNotes(refNote);
        this.PrintParameters(refNote);
        return notes;
    }

    pickChord(){
        //pick a chord based on the one before (TODO: maybe use some kind of regex if neccessary)
        let possibleMoves = [];
        for(let i = 0; i < this.MusicInfo.ChordMovement.length; i++){
            if(this.MusicInfo.ChordMovement[i].FromChordProperties === this.musicParameters.ChordType){//if chord type matches
                possibleMoves.push(this.MusicInfo.ChordMovement[i]);//add this possibility
            }
        }

        if(possibleMoves.length == 0){
            console.error(`Cant find follow-up chords for ${this.musicParameters.ChordType}`);
            return;
        }

        let move = choose(possibleMoves);

        //update parameters to play that chord (chord tone, etc.)
        this.musicParameters.ChordType = move.ToChord;
        this.musicParameters.ChordTone += RelativeNotesToMidiDistance(move.ToNote) + 12;
        this.musicParameters.ChordTone %= 12;
    }

    MusicParametersToChordNotes(refNote){//to which the chord tone stays relative to
        return ReadRelativeNotes(refNote + this.musicParameters.ChordTone, this.ReadChord(this.musicParameters.ChordType));
    }

    PrintParameters(refNote){
        console.log(simpleNoteName(refNote + this.musicParameters.ChordTone) + this.musicParameters.ChordType)
    }


    /**
     * Converts a chordname into an array of notes
     * 
     * @param {string} chord - the chordname to process
     * @return {Array<string>} an array of notes representing that chord
     * @example
     * possible input: "maj7,b11" or "dim,9"    (we are omitting the base note)
     * "maj7,b11" => ["1", "3", "5", "7", "b11"]
    */
    ReadChord(chord){
        let notes = [];

        let chordSegments = chord.split(',');
        let extensionStart;
        let baseChord = this.MusicInfo.Chords[chordSegments[0]];
        if(baseChord){
            Array.prototype.push.apply(notes, baseChord.Notes);
            extensionStart = 1;//start at the next one (ignore the chord definition for the extensions)
        }else{
            Array.prototype.push.apply(notes, this.MusicInfo.Chords["major"].Notes);
            extensionStart = 0;//start at the first one, because we dont have first chord definition
        }

        for(let s = extensionStart; s < chordSegments.length; s++){
            let extension = this.MusicInfo.ChordExtensions[chordSegments[s]];
            if(extension){
                notes.push(extension.Note);//if it is an pre-saved exception use the exception instead
            }else{
                if(!IsRelativeNoteFormat(chordSegments[s])){
                    console.warn(`\"${chordSegments[s]}\" is not in the correct format for a chord`);
                    continue;
                }
                notes.push(chordSegments[s]);//just assume that everything that isnt an exception is the norm and fits
                //WARNING: ... maybe it isnt the norm and doesnt fit
            }
        }
        return notes;
    }
}


//---------------------------- read notes ---------------------------------
function IsRelativeNoteFormat(note){
    return !/[^b#\d]/g.test(note);//checks if there are no characters except the ones for the correct format in the note
}


function ReadRelativeNotes(refNote/*the note you would describe as I */, notes){
    let result = [];
    for(let n = 0; n < notes.length; n++){
        let midiDist = RelativeNotesToMidiDistance(notes[n]);
        //console.log(midiDist);
        result.push(refNote + midiDist);
    }
    return result;
}
function ScaleToNote(scaleNote){//using major scale
    scaleNote -= 1;//1 -> 0 (better for use with indices)
    const NotePos = [0, 2, 4, 5, 7, 9, 11];
    return NotePos[positiveMod(scaleNote,7)] + 12*Math.floor(scaleNote/7);
}
function RelativeNotesToMidiDistance(note){//input note as a string and get a midi offset
    let flats = note.split("b").length;//NOTE: "split" is supposed to be faster than "match"
    let sharps = note.split("#").length;
    let scaleNote = parseInt(note.replace(/[^-+\d]/g, ""));//remove everything that is not part of a number
    return ScaleToNote(scaleNote) + sharps - flats;//"5#" -> 7+1 = 8 -> g# (relative to c)
}

//------------------------ Math --------------------------------
function positiveMod(number, mod){ return ((number % mod) + mod) % mod; }

function choose(array) { return array[rndInt(0, array.length)]; }
function rndInt(min, max) { return Math.floor(Math.random()*(max-min) + min); }
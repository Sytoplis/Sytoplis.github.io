//Noun-Source: https://eslgrammar.org/list-of-nouns/ 
//Verb-Source: https://www.englishbix.com/verb-forms-v1-v2-v3-list/
//Adjective-Source: https://www.mobap.edu/wp-content/uploads/2013/01/list_of_adjectives.pdf

//Created on 6.5.2022 (and the following week) by Yannis Paul

export default class Generator{

    Words;
    adjectiveProb = 0.1;

    constructor(path){
        return this.fetchWords(path).then(() => { return this; });//return first a promise and then the actual self
    }


    async fetchWords(path) {
        let response = await fetch(path);//use absolute path to always find words
        this.Words = await response.json();
    }


    generate(){
        return toSentence(this.fillTemplate(pickRandom(this.Words.Template)));
    }

    pickMethod(c) { return pickRandom(this.Words[c]); }

    fillCategory(text, indicator = "@", dictionary = {}){
        if(!"default" in dictionary)//make sure "default" is defined
            dictionary["default"] = (c,n)=>this.pickMethod(c);


        let i = text.indexOf(indicator);
        while(i != -1){
            let s = findNextNonLetter(text, i+1);//get next non-letter character
            if(s == -1) s = text.length;

            let category = text.substring(i+1, s);

            let insert = "";
            let next = text.substring(s+1, text.length);//get text rest (skip space)

            //run the pick method that was defined by the dictionary for this category
            if(category in dictionary)
                insert = dictionary[category](category, next);
            else
                insert = dictionary["default"](category, next);//if no pick method is defined -> revert to the "default" pick method

            
            insert = this.fillTemplate(insert);//resolve everything that might be inside it

            text = text.substring(0, i) + insert + text.substring(s, text.length);
            i = text.indexOf(indicator);//get next insert
        }

        return text;
    }


    fillTemplate(text){
        text = this.fillCategory(text, "@", { "default": (c,n)=>this.pickMethod(c) });

        text = this.fillCategory(text, "#", { 
            "A": (c,n)=>this.getArticle(n), //article with no adjective
            "Aadj": (c,n)=>this.getArticleAdj(n)//article with sometimes an adjective
        })
        return text;
    }


    //------------------- ARTICLES ----------------------------

    getArticle(next){
        let firstChar = next.charAt(0);
        if("aeiou".includes(firstChar)){//if character is a noun
            if(RndInt(2) == 1){
                return "the";
            }else{
                return "an"
            }
        }else{
            if(RndInt(2) == 1){
                return "the";
            }else{
                return "a"
            }
        }
    }

    getArticleAdj(next){
        if(Math.random() < this.adjectiveProb){//rng, if adjective
            let adj = pickRandom(this.Words.Adjective);
            return this.getArticle(adj) + " " + adj;
        }else{
            return this.getArticle(next);
        }    
    }
}


//HELPER FUNCTIONS
export function RndInt(count) { return Math.floor(Math.random()*count); }
export function pickRandom(array){ return array[RndInt(array.length)]; }


//LETTER HELPER FUNCTIONS
export function findNextNonLetter(text, startI){
    for(let i = startI; i < text.length; i++){
        if(/[^\w]/g.test(text[i]))//test, if text is a non letter character
            return i;
    }
    return -1;
}

export function toSentence(text){ return text.substring(0, 1).toUpperCase() + text.substring(1, text.length) + "."; }
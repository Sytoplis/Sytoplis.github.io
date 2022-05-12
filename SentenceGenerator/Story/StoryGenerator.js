import Generator, { pickRandom, RndInt , toSentence } from "../Generator.js";

export default class StoryGenerator extends Generator{
    //array of Actors sorted by importance (first character -> main char)
    Chars;
    Objs;


    pickMethod(category){
        if(category == "Character")
            return this.pickBySortedImportance(this.Chars, () => { return pickRandom(this.Words[category]); });

        //if(category == "Object")
            //return this.pickBySortedImportance(this.Objs, () => { return pickRandom(this.Words[category]); });
        if(category == "Template")
            return this.Words.Template[RndInt(this.Words.StoryTemplate)];//only pick story templates

        //else:
        return pickRandom(this.Words[category]);
    }

    generateStory(sentenceCount){
        this.Chars = [];
        this.Objs = [];

        let result = "";
        for(let i = 0; i < sentenceCount; i++){
            result += this.generate() + " ";
        }
        return result;
    }

    generate(){
        let templ = this.pickMethod("Template");
        return toSentence(this.fillTemplate(templ));
    }

    
    prob(i){ return 0.5/i; }//the sum to infinity is 1

    pickBySortedImportance(array, createElement){
        let r = Math.random();
        let sum = 0;
        for(let i = 0; i < array.length; i++){
            sum += this.prob(i);//pick a Element with lowering probability, the higher the index is
            if(r < sum)
                return array[i];
        }
        
        let newElement = createElement();//if the list doesnt have this Element jet, add the Element
        array.push(newElement);
        return newElement;
    }


    //------------------- ARTICLES ----------------------------

    getArticle(next){
        return "the";
    }
}
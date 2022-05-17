import Generator, { pickRandom, RndInt , toSentence } from "../Generator.js";

export default class StoryGenerator extends Generator{
    //array of Actors sorted by importance (first character -> main char)
    Chars;
    Objs;

    //keep track of what was used already to not use it multiple times
    usedChars;
    usedObjs;


    pickMethod(category){
        if(category == "Character")
            if(Math.random() < 0.5)
                return this.pickBySortedImportance(this.Chars, this.usedChars, 
                    () => { return pickRandom(this.Words["Adjective"]) + " " + pickRandom(this.Words[category]); },
                    (i) => { return 1; });
            else return "they";
        if(category == "Object")
            return this.pickBySortedImportance(this.Objs, this.usedObjs, 
                () => { return pickRandom(this.Words["Adjective"]) + " " + pickRandom(this.Words[category]); },
                (i) => { return 0.3; });
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

        console.log("chars: " + this.Chars.length);
        console.log("ojs: " + this.Objs.length);
        return result;
    }

    generate(){
        this.usedChars = [];
        this.usedObjs = [];

        let templ = this.pickMethod("Template");
        return toSentence(this.fillTemplate(templ));
    }

    pickBySortedImportance(array, exclude, createElement, prob){
        let r = Math.random();
        let sum = 0;
        for(let i = 0; i < array.length; i++){
            sum += prob(i);//pick a Element with lowering probability, the higher the index is
            if(r < sum)
                if(!exclude.includes(array[i])){
                    exclude.push(array[i]);
                    return array[i];
                } 
        }
        
        let newElement = createElement();//if the list doesnt have this Element jet, add the Element
        array.push(newElement);
        return newElement;
    }


    //------------------- ARTICLES ----------------------------

    getArticle(next){
        if(next.split(" ")[0] == "they")
            return "";

        //else:
        return "the";
    }

    getArticleAdj(next){
        return this.getArticle(next); 
    }
}
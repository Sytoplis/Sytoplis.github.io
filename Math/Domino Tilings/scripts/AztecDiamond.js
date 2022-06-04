//code created on 05.05.2022 by Yannis Paul. 

export default class AztecDiamond{  //aztec diamond board   (board made up of SQUARES)
    size;//NOTE: length = size*(size+1)*2
    tiling;//stores the positions of all dominos    (and types)
    /*               \ a    
    indexes:    1 4   \ 
              0 3 6 9  _| 
              2 5 8 11 _            i = b + ceil(0.5*a)*n + floor(0.5*a)*(n+1) = b + (a-odd)/2 * (2*n + 1) + odd * n = b + a*n + (a-odd)/2    NOTE: odd = a%2
                7 10   /|           x = b + floor(0.5*a)
                      /b            y = b - ceil(0.5*a)

    types:  0 1    2
                   3        moveDir = floor(type / 2)
            7
            6    5 4
    */ 
   
    constructor(){
        this.size = 1;//1 * 4
        this.tiling = [];
        this.tiling.length = this.size*4;//a 2x2 diamond as A(1)

        this.fillHoles([0]);
    }

    MoveDirs(moveDir){ return [this.size,       // down
                              -this.size-1,     // left
                              -this.size,       // up
                               this.size+1]     // right
                               [moveDir]; }//in index coordinate system
    Tiles = [[ 0.5,  0.5, 2, 1, "#00FF00"],  // right
             [ 0.5,  0.5, 1, 2, "#FFFF00"],  // down
             [ 1.5,  0.5, 2, 1, "#0000FF"],  // left
             [ 0.5,  1.5, 1, 2, "#FF0000"]];  // up
    //in index coordinate system

    moveTiling(){
        let oldSize = this.size;
        this.size++;//increase size, so moving is possible

        let movedTiling = [];
        movedTiling.length = this.tiling.length + this.size*4;//create new and bigger array to move to
        movedTiling.fill(-1);
        for(let a = 0; a < oldSize*2+1; a++){
            let odd = a%2;//1 if a is odd, 0 if a is even
            let bSize = odd + oldSize;//1 bigger sidelength if a is odd
            for(let b = 0; b < bSize; b++){
                //compute new a and b for the bigger coordinate system
                let a_ = a+1;
                let b_ = b+(1-odd);//add 1, if a is even

                let i = b + a*oldSize + (a-odd)/2;          //current index in tiling
                let i_= b_+ Math.ceil(0.5*a_)*this.size +   //current index in movedTiling
                            Math.floor(0.5*a_)*(this.size+1);

                let moveDir = Math.floor(this.tiling[i] * 0.5);//read move direction
                let target = i_ + this.MoveDirs(moveDir);//calculate target index
    
                movedTiling[target] = this.tiling[i];//write to new position
            }
        }
        this.tiling = movedTiling;
    }

    removeConflicting(){
        let down = this.MoveDirs(0);
        let right = this.MoveDirs(3);
        let left = this.MoveDirs(1)

        for(let i = 0; i < this.tiling.length; i++){
            if(this.tiling[i] != 0 && this.tiling[i] != 2)//only check 0 and 2 for opposites -> 4 and 6 ARE opposites
                continue;

            let moveDir = Math.floor(this.tiling[i] * 0.5);//read move direction
            if(this.tiling[i + this.MoveDirs(moveDir)] == this.tiling[i]+5) {//0 <-> 5;   2 <-> 7
                //remove conflict
                if(this.tiling[i] == 0){
                    this.tiling[i] = -1;      this.tiling[i+right] = -1;
                    this.tiling[i+down] = -1; this.tiling[i+right+down] = -1;
                }else{
                    this.tiling[i+left] = -1;      this.tiling[i] = -1;
                    this.tiling[i+down+left] = -1; this.tiling[i+down] = -1;
                }
            }
        }
    }

    findHoles(){//finds all 2x2 holes
        //never gonna
        let down = this.MoveDirs(0);
        let right = this.MoveDirs(3);
        
        let holes = [];
        for(let i = 0; i < this.tiling.length; i++){
            if(this.tiling[i] == -1      && this.tiling[i+right] == -1 && 
               this.tiling[i+down] == -1 && this.tiling[i+right+down] == -1){
                    this.tiling[i] = -2;      this.tiling[i+right] = -2;
                    this.tiling[i+down] = -2; this.tiling[i+right+down] = -2;
                    holes.push(i);
               }
        }
        return holes;
    }

    fillHoles(holes){//fills all given 2x2 holes with 2 random dominos  (input is an array of the index of the top left corner)
        let down = this.MoveDirs(0);
        let right = this.MoveDirs(3);

        for(let h = 0; h < holes.length; h++){
            let i = holes[h];
            if(Math.random() >= 0.5){//throw a coin to determin fill direction
                //Horizontal fill
                     this.tiling[i] = 5;         this.tiling[i+right] = 4;
                this.tiling[i+down] = 0;    this.tiling[i+down+right] = 1;
            }else{
                //Vertical fill
                     this.tiling[i] = 2;         this.tiling[i+right] = 7;
                this.tiling[i+down] = 3;    this.tiling[i+down+right] = 6;
            }
        }
    }




    //-------------------------- DISPLAY ---------------------------------

    
    drawTxt(ctx, scale, CHeight, xPos, yPos){
        xPos -= scale*(this.size - 0.5);
        yPos -= scale*(this.size - 0.5);

        ctx.beginPath();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "20px Arial";
        for(let a = 0; a < this.size*2+1; a++){
            let odd = a%2;//1 if a is odd, 0 if a is even
            let bSize = odd + this.size;//1 bigger sidelength if a is odd
            for(let b = 0; b < bSize; b++){
                let i = b + a*this.size + (a-odd)/2;            //current index in tiling
                //let i = b + Math.ceil(0.5*a)*this.size + Math.floor(0.5*a)*(this.size+1);

                let x = b + Math.floor(0.5*a);
                let y = b - Math.ceil(0.5*a)    + this.size;//move y up to not be negative

                ctx.fillText(this.tiling[i], x*scale + xPos, CHeight - (y*scale + yPos), scale-10);
            }
        }
        ctx.stroke();
    }

    draw(ctx, scale, CHeight, xPos, yPos){
        let offset = 4.0/scale;

        xPos -= scale*(this.size - 0.5);
        yPos -= scale*(this.size - 0.5);

        for(let a = 0; a < this.size*2+1; a++){
            let odd = a%2;//1 if a is odd, 0 if a is even
            let bSize = odd + this.size;//1 bigger sidelength if a is odd
            for(let b = 0; b < bSize; b++){
                let i = b + a*this.size + (a-odd)/2;            //current index in tiling

                let x = b + Math.floor(0.5*a);
                let y = b - Math.ceil(0.5*a)    + this.size;//move y up to not be negative

                if(this.tiling[i] % 2 != 0 || this.tiling[i] < 0)//use the even tiles as base
                    continue;

                let tile = this.Tiles[this.tiling[i] / 2];

                ctx.beginPath();
                ctx.lineWidth = 3;
                ctx.strokeStyle = tile[4];

                ctx.rect(     (x - tile[0] + offset*0.5)*scale + xPos, 
                   CHeight - ((y + tile[1] - offset*0.5)*scale + yPos), tile[2]*scale - offset*scale, tile[3]*scale - offset*scale);

                ctx.stroke();
            }
        }
        
    }
}
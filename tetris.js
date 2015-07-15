/**
 * Created by ой on 10.07.2015.
 */

function Field(field){
    this.field = field;
}
Field.prototype.draw = function(ctx){
    for (var i = 0; i < this.field.length; i++) {
        for (var j = 0; j < this.field[0].length; j++) {
            if(this.field[i][j]) {
                ctx.fillStyle = 'grey';
                ctx.fillRect(i * 20, j * 20, 20, 20);
                ctx.clearRect(i * 20 + 5, j * 20 + 5, 10, 10);

            }else{
                ctx.fillStyle = 'black';
                ctx.fillRect(i * 20, j * 20, 20, 20);
            }
        }
    }
};

function Figure(figure){
    this.x = 7;
    this.y = 0;
    this.figure = figure;
    this.speed = 150;
    this.isBreak = false;
}
Figure.factory = function(){
    var figures = [
        [
         [1,1],
         [1,1]
        ],
        [
         [1,1,1,1]
        ],
        [
         [1,1,0],
         [0,1,1]
        ],
        [
         [1,1,1],
         [0,1,0]
         ],
         [
          [0,1,1],
          [1,1,0]
         ],
         [
          [0,0,1],
          [1,1,1]
         ],
         [
          [1,0,0],
          [1,1,1]
         ]
    ];

    return figures[Math.floor( Math.random()*7 )]
};
Figure.prototype.put = function(tetris){
    var startX = this.x;
    var startY = this.y;

    for (var i = 0; i < this.figure.length; i++) {
        for (var j = 0; j < this.figure[0].length; j++) {
            if (this.figure[i][j]) {
                tetris.field[startX + j][startY + i] = 1;
            }
        }
    }
};
Figure.prototype.erase = function(tetris){
    var startX = this.x;
    var startY = this.y;
    for (var i = 0; i < this.figure.length; i++) {
        for (var j = 0; j < this.figure[0].length; j++) {
            if(this.figure[i][j]){
                tetris.field[startX + j][startY + i] = false;
            }
        }
    }
};

Figure.prototype.move = function(tetris){
    this.erase(tetris);

    var startX = this.x;
    var startY = this.y + 1;
    for (var i = 0; i < this.figure.length; i++) {
        for (var j = 0; j < this.figure[0].length; j++) {
            if(tetris.field[startX + j][startY + i] && this.figure[i][j]){
                this.isBreak = true;
                return true;
            }
        }
    }
    this.y++;
    return false;
};
Figure.prototype.left = function(tetris){
    if(this.x > 0 && tetris.field[this.x - 1][this.y] !== 1 && 
        tetris.field[this.x][this.y + this.figure.length] !== 1)this.x--;
};
Figure.prototype.right = function(tetris){
    if(this.x < tetris.field.length - this.figure[0].length &&
        tetris.field[this.x + this.figure[0].length][this.y] !== 1 &&
        tetris.field[this.x][this.y + this.figure.length] !== 1)this.x++;
};
Figure.prototype.fastDown = function(){
    this.speed = 40;
};
Figure.prototype.isLanded = function(tetris){
    var field = tetris.field;
    if(this.y >= field[0].length - this.figure.length)return true;

};
Figure.prototype.transform = function(){

  var figureArr = this.figure;
    var result = [];
    for (var i = 0; i < figureArr[0].length; i++) {
        var tmp = [];
        for (var j = 0; j < figureArr.length; j++) {
            tmp.push(figureArr[j][i])
        }
        result.push(tmp);
    }
    this.figure = result;
};

function isGameOver(tetris){
    var field = tetris.field;
        for (var i = 0; i < field.length; i++) {
            if(field[i][0]) return true;
        }
}
function deleteLine(tetris, lineIndex) {
    for (var i = 0; i < tetris.field.length; i++) {
        for(var j = lineIndex ; j>=1; j--){
            tetris.field[i][j] = tetris.field[i][j - 1];
        }
    }
    var points = document.getElementById('points').innerHTML;
    document.getElementById('points').innerHTML = (++points + 100);

}
function isLine(tetris){
    
    setInterval(function(){
        var field = tetris.field;
        for (var i = 0; i < field[0].length; i++) {
            var line = false;
            for (var j = 0; j < field.length; j++) {
                if(field[j][i]) {
                    line = i;
                }
                else{
                    line = false;
                    break;
                }
            }
            if(line!== false){
                deleteLine(tetris,line)
            }
        }
    },40)
}
function game() {
    var cvs = document.getElementById('canvas'),
        ctx = cvs.getContext('2d');

    var field = [];
    for(var i = 0; i < 20; i++){
        var tmp = [];
        for(var j = 0; j < 30 ; j++){
            tmp.push(false);
        }
        field.push(tmp);
    }
    var tetris = new Field(field);
    var figure = new Figure(Figure.factory());
    var flag = 0;

    document.addEventListener('keydown',function(event) {
        if(!flag){
        switch (event.keyCode){
            case 37 : figure.left(tetris); break;
            case 39 : figure.right(tetris); break;
            case 40 : figure.fastDown(tetris);break;
            case 32 : figure.transform(); break;
            }
            flag = 1;
        }
        setTimeout(function(){
            flag = 0;
        },figure.speed)

    });

    function startGame() {
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, cvs.width, cvs.height);
            figure.put(tetris);
            tetris.draw(ctx);
            if(figure.isLanded(tetris) || figure.isBreak){
                figure = new Figure(Figure.factory());
                figure.speed = 150;
            }
            figure.move(tetris);
            if(isGameOver(tetris)){
                alert('GameOver!!');
                return;
            }
        setTimeout(startGame,figure.speed);

    }
    startGame();
    isLine(tetris);
}
import { Component, HostListener, OnInit, AfterViewInit,  } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ng-Snake';


  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;

  @HostListener('document:keyup', ['$event'])
  onkeyup(e: any) {
    this.keys[e.keyCode] = false;
  }
  @HostListener('document:keydown', ['$event'])
  onkeydown(e: any) {
    console.log(e);
    this.keys[e.keyCode] = true;
    var key = e.which;
    //We will add another clause to prevent reverse gear
    if (key == "37" && this.d != "right") this.d = "left";
    else if (key == "38" && this.d != "down") this.d = "up";
    else if (key == "39" && this.d != "left") this.d = "right";
    else if (key == "40" && this.d != "up") this.d = "down";
    switch (e.keyCode) {
        case 37: case 39: case 38: case 40: // Arrow keys
        case 32: e.preventDefault(); break; // Space
        default: break; // do not block other keys
    }
  }

  public keys: Array<any> = [];
  public w: number = 450;
  public h: number = 450;
  //Lets save the cell width in a variable for easy control
  public cw: number = 10;
  public d: string;
  public food: any;
  public score: number = 0;
  constructor() { }




//Lets create the snake now
public snake_array: Array<any>; //an array of cells to make up the snake
public game_loop: any;

ngOnInit() {
  this.canvas = <HTMLCanvasElement>document.getElementById("canvas");
  this.ctx = this.canvas.getContext("2d");
  this.w = this.canvas.width;
  this.h = this.canvas.height;
    // begin game
      this.init();
  }



public init() {
  this.d = "right"; //default direction
  this.create_snake();
  this.create_food(); //Now we can see the food particle
  //finally lets display the score
  this.score = 0;

  //Lets move the snake now using a timer which will trigger the paint function
  //every 60ms
  if (typeof this.game_loop != "undefined") clearInterval(this.game_loop);
  this.game_loop = setInterval(() => {
    this.paint() }
    , 60);
  console.log(this.game_loop);
}
//this.init();

public create_snake() {
  var length = 5; //Length of the snake
  this.snake_array = []; //Empty array to start with
  for (var i = length - 1; i >= 0; i--) {
      //This will create a horizontal snake starting from the top left
      this.snake_array.push({
          x: i,
          y: 0
      });
  }
}

//Lets create the food now

public create_food() {
  this.food = {
      x: Math.round(Math.random() * (this.w - this.cw) / this.cw),
      y: Math.round(Math.random() * (this.h - this.cw) / this.cw),
  };
  //This will create a cell with x/y between 0-44
  //Because there are 45(450/10) positions accross the rows and columns
}

//Lets paint the snake now

public paint() {
  console.log(this.ctx)
  //To avoid the snake trail we need to paint the BG on every frame
  //Lets paint the canvas now
  this.ctx.fillStyle = "white";
  this.ctx.fillRect(0, 0, this.w, this.h);
  this.ctx.strokeStyle = "black";
  this.ctx.strokeRect(0, 0, this.w, this.h);

  //The movement code for the snake to come here.
  //The logic is simple
  //Pop out the tail cell and place it infront of the head cell
  var nx = this.snake_array[0].x;
  var ny = this.snake_array[0].y;
  //These were the position of the head cell.
  //We will increment it to get the new head position
  //Lets add proper direction based movement now
  if (this.d == "right") nx++;
  else if (this.d == "left") nx--;
  else if (this.d == "up") ny--;
  else if (this.d == "down") ny++;

  //Lets add the game over clauses now
  //This will restart the game if the snake hits the wall
  //Lets add the code for body collision
  //Now if the head of the snake bumps into its body, the game will restart
  if (nx == -1 || nx == this.w / this.cw || ny == -1 || ny == this.h / this.cw || this.check_collision(nx, ny, this.snake_array)) {
      //restart game
      this.init();
      //Lets organize the code a bit now.
      return;
  }

  //Lets write the code to make the snake eat the food
  //The logic is simple
  //If the new head position matches with that of the food,
  //Create a new head instead of moving the tail
  if (nx == this.food.x && ny == this.food.y) {
      var tail: any = {
          x: nx,
          y: ny
      };
      this.score++;
      //Create new food
      this.create_food();
  }
  else {
      var tail: any = this.snake_array.pop(); //pops out the last cell
      tail.x = nx;
      tail.y = ny;
  }
  //The snake can now eat the food.
  this.snake_array.unshift(tail); //puts back the tail as the first cell
  for (var i = 0; i < this.snake_array.length; i++) {
      var c = this.snake_array[i];
      //Lets paint 10px wide cells
      this.paint_cell(c.x, c.y);
  }

  //Lets paint the food
  this.paint_cell(this.food.x, this.food.y);
  //Lets paint the score
  var score_text = "Score: " + this.score;
  this.ctx.fillText(score_text, 5, this.h - 5);
}

//Lets first create a generic function to paint cells

public paint_cell(x, y) {
  this.ctx.fillStyle = "blue";
  this.ctx.fillRect(x * this.cw, y * this.cw, this.cw, this.cw);
  this.ctx.strokeStyle = "white";
  this.ctx.strokeRect(x * this.cw, y * this.cw, this.cw, this.cw);
}

public check_collision(x, y, array) {
  //This function will check if the provided x/y coordinates exist
  //in an array of cells or not
  for (var i = 0; i < array.length; i++) {
      if (array[i].x == x && array[i].y == y) return true;
  }
  return false;
}

}

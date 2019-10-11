
class Minegrid {

  constructor(size, num_mines) {

    this.HIDDEN = -1;
    this.FLAGGED = -2;
    this.UNCOVERED = -3;

    this.grid = [];
    this.size = size;

    for(var i=0; i<size; i++) {

      this.grid[i] = [];

      for(var j=0; j<size; j++) {

        this.grid[i][j] = {
          status: this.HIDDEN,
          is_mine: false
        }
      }
    }

    for (var i=0;i<num_mines;i++) {

      this.grid[Math.floor(Math.random() * 10)][Math.floor(Math.random() * 10)].is_mine = true;
    }
  }

  print() {

    console.log("\n  0 1 2 3 4 5 6 7 8 9")

    for(var i=0; i<this.size; i++) {
      for(var j=0; j<this.size; j++) {

        if ( j==0) { process.stdout.write("" + i) }

        switch(this.grid[i][j].status) {

          case this.UNCOVERED:
            process.stdout.write(" " + this.getNumMines(i, j, true));
            break;

          case this.HIDDEN:

            process.stdout.write(" *");
            break;

          case this.FLAGGED:

            process.stdout.write(" F");
            break;
        }
      }

      process.stdout.write("\n");
    }

    process.stdout.write("\n");
  }

  click(x, y) {

    if (this.grid[x][y].is_mine == true) {

      console.log("YOU HIT A MINE!!!!");
      process.exit(0);
    }

    if ( this.grid[x][y].status == this.HIDDEN) {
      this.grid[x][y].status = this.UNCOVERED;
      this.uncoverEmptySquares(x, y);
    }
  }

  flag(x, y) {

    this.grid[x][y].status = this.FLAGGED;
  }

  getNeighbors(x, y) {

    x = parseInt(x);
    y = parseInt(y);

    var neighbors = new Array();

    for(var i= (x-1);i<=(x+1);i++){
      for(var j= (y-1);j<=(y+1);j++){

        if (i>=0 && j>=0 && i<=9 && j<=9 && !(i==x&&j==y)) { neighbors.push({x: i, y: j}); }
      }
    }

    return neighbors;
  }

  getNumMines(x, y, n) {

    var neighbors = this.getNeighbors(x, y);

    var num_mines = 0;
    neighbors.forEach((pair, index) => {

      if (this.grid[pair.x][pair.y].is_mine) {

        num_mines++;
      }
    })

    return num_mines == 0 && n == true ? " " : num_mines;
  }

  uncoverEmptySquares(x, y) {

    var neighbors = this.getNeighbors(x, y);

    //console.log(neighbors);
    var num_mines = 0;
    neighbors.forEach((pair, index) => {

      if (this.grid[pair.x][pair.y].is_mine) {

        num_mines++;
      }
    })

    if (num_mines == 0) {

      neighbors.forEach((pair, index) => {

          this.click(pair.x, pair.y);

      })
    }
  }
}

class Minesweeper {

  constructor() {

    this.gameOn = true;
    this.grid = new Minegrid(10, 10);
  }

  printHelp() {

    console.log("Welcome to minesweeper by Stephen G. Pope");
    console.log("\nPress 'e' or cntl-c to exit");
    console.log("Press 'cXY' to click on a hidden square");
    console.log("Press 'fXY' to flag a square");
    console.log("\n");
  }

  getInputFromUser() {

    this.grid.print();

    const readline = require('readline');

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('(type "h" for help)> ', (answer) => {

      switch(answer.substr(0,1)) {

        case "c":

          this.grid.click(answer.substr(2,1), answer.substr(1,1));
          break

        case "f":

          this.grid.flag(answer.substr(2,1), answer.substr(1,1));
          break;

        case "e":
          process.exit(0);
          break;

        case "h":
          this.printHelp();
        break;
      }

      this.getInputFromUser();
    });
  }

  start() {

      this.printHelp();
      this.getInputFromUser();
  }
}

var game = new Minesweeper();

game.start();

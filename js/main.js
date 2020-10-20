window.onload = () => {
  'use strict';

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('./sw.js');
  }
  const board_border = '#58faf4';
  const board_background = "#81F7F3";
  const snake_col = '#40ff00';
  const snake_border = '#00ff80';
  let snake;
  let score;
  let changing_direction;
  let food_x;
  let food_y;
  let dx;
  let dy;

  let speed;

  // Get the canvas element
  const snakeboard = document.getElementById("snakeboard");
  // Return a two dimensional drawing context
  const snakeboard_ctx = snakeboard.getContext("2d");

  function init() {
    document.getElementById("score").textContent = '0';
    snake = [
      {x: 200, y: 200},
      {x: 180, y: 200},
      {x: 160, y: 200},
      {x: 140, y: 200},
      {x: 120, y: 200},
      {x: 100, y: 200},
      {x: 80, y: 200}
    ]
    score = 0;
    changing_direction = false;
    dx = 20;
    dy = 0;
    speed = 200;
    main();
    gen_food();
  }

  init();

  const btnOben = document.getElementById("oben");
  const btnUnten = document.getElementById("unten");
  const btnRechts = document.getElementById("rechts");
  const btnLinks = document.getElementById("links");
  const btnRestart = document.getElementById("restart");

  btnOben.onclick = function(eo){
    change_direction(eo, 'oben');
  };
  btnUnten.onclick = function(eu){
    change_direction(eu, 'unten');
  };
  btnRechts.onclick = function(er){
    change_direction(er, 'rechts');
  };
  btnLinks.onclick = function(el){
    change_direction(el, 'links');
  };
  btnRestart.onclick = function (ea){
    init();
  }

  document.addEventListener("keydown", change_direction);

  // main function called repeatedly to keep the game running
  function main() {

    if (has_game_ended()) {
      btnRestart.disabled = false;
      return;
    }

    changing_direction = false;
    setTimeout(function onTick() {
      clear_board();
      drawFood();
      move_snake();
      drawSnake();
      // Repeat
      main();
    }, speed)
  }

  // draw a border around the canvas
  function clear_board() {
    //  Select the colour to fill the drawing
    snakeboard_ctx.fillStyle = board_background;
    //  Select the colour for the border of the canvas
    snakeboard_ctx.strokeStyle = board_border;
    // Draw a "filled" rectangle to cover the entire canvas
    snakeboard_ctx.fillRect(0, 0, snakeboard.width, snakeboard.height);
    // Draw a "border" around the entire canvas
    snakeboard_ctx.strokeRect(0, 0, snakeboard.width, snakeboard.height);
  }

  // Draw the snake on the canvas
  function drawSnake() {
    // Draw each part
    snake.forEach(drawSnakePart)
  }

  function drawFood() {
    snakeboard_ctx.fillStyle = 'red';
    snakeboard_ctx.strokeStyle = 'darkgreen';
    snakeboard_ctx.fillRect(food_x, food_y, 20, 20);
    snakeboard_ctx.strokeRect(food_x, food_y, 20, 20);
  }

  // Draw one snake part
  function drawSnakePart(snakePart) {

    // Set the colour of the snake part
    snakeboard_ctx.fillStyle = snake_col;
    // Set the border colour of the snake part
    snakeboard_ctx.strokeStyle = snake_border;
    // Draw a "filled" rectangle to represent the snake part at the coordinates
    // the part is located
    snakeboard_ctx.fillRect(snakePart.x, snakePart.y, 20, 20);
    // Draw a border around the snake part
    snakeboard_ctx.strokeRect(snakePart.x, snakePart.y, 20, 20);
  }

  function has_game_ended() {
    for (let i = 4; i < snake.length; i++) {
      if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true
    }
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > snakeboard.width - 20;
    const hitToptWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > snakeboard.height - 20;
    return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall
  }

  function random_food(min, max) {
    return Math.round((Math.random() * (max-min) + min) / 20) * 20;
  }

  function gen_food() {
    // Generate a random number the food x-coordinate
    food_x = random_food(0, snakeboard.width - 20);
    // Generate a random number for the food y-coordinate
    food_y = random_food(0, snakeboard.height - 20);
    // if the new food location is where the snake currently is, generate a new food location
    snake.forEach(function has_snake_eaten_food(part) {
      const has_eaten = part.x == food_x && part.y == food_y;
      if (has_eaten) gen_food();
    });
  }

  function change_direction(event, button) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    // Prevent the snake from reversing

    if (changing_direction) return;
    changing_direction = true;
    const keyPressed = event.keyCode;
    const goingUp = dy === -20;
    const goingDown = dy === 20;
    const goingRight = dx === 20;
    const goingLeft = dx === -20;
    if ((keyPressed === LEFT_KEY && !goingRight) || (button === 'links' && !goingRight)) {
      dx = -20;
      dy = 0;
    }
    if ((keyPressed === UP_KEY && !goingDown) || (button === 'oben' && !goingDown)) {
      dx = 0;
      dy = -20;
    }
    if ((keyPressed === RIGHT_KEY && !goingLeft) || (button === 'rechts' && !goingLeft)) {
      dx = 20;
      dy = 0;
    }
    if ((keyPressed === DOWN_KEY && !goingUp) || (button === 'unten' && !goingUp)) {
      dx = 0;
      dy = 20;
    }
  }

  function move_snake() {
    // Create the new Snake's head
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    // Add the new head to the beginning of snake body
    snake.unshift(head);
    const has_eaten_food = snake[0].x === food_x && snake[0].y === food_y;
    if (has_eaten_food) {
      // Increase score
      score += 5;

      if (score >= 20) {
        speed = 190;
      }
      if (score >= 40) {
        speed = 180;
      }
      if (score >= 60) {
        speed = 170;
      }
      if (score >= 80) {
        speed = 160;
      }
      if (score >= 120) {
        speed = 130;
      }
      if (score >= 130) {
        speed = 100;
      }
      // Display score on screen
      document.getElementById('score').innerHTML = score;
      // Generate new food location
      gen_food();
    } else {
      // Remove the last part of snake body
      snake.pop();
    }
  }
}

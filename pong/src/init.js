const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    }
};

const game = new Phaser.Game(config);
let paddle, ball, score = 0, scoreText, lives = 3, livesText;
let difficulty = null;

function preload() {
    this.load.image('paddle', './assets/paddle.png');
    this.load.image('ball', './assets/ball.png');
    this.load.audio('hit', './assets/hit.mp3');
}

function create() {
    //UN IF ELSE MUY SENCILLO, CHECA PRIMERO LA DIFICULTAD Y LUEGO INICIA EL GAME
    if (difficulty === null) {
        showDifficultyMenu.call(this);
    } else {
        startGame.call(this);
    }
}

function update() {
    if (ball && ball.y > paddle.y + paddle.height) {
        resetBall();
    }
}

//Menú "principal" donde se muestran las dificultades antes de iniciar el jueguito
function showDifficultyMenu() {
    this.add.text(250, 100, 'Select Difficulty', { fontSize: '32px', fill: '#FFF' });

    const easyButton = this.add.sprite(400, 200,).setInteractive();
    easyButton.on('pointerdown', () => selectDifficulty.call(this, 'easy'));
    this.add.text(360, 200, 'Easy', { fontSize: '24px', fill: '#FFF' });

    const mediumButton = this.add.sprite(400, 300,).setInteractive();
    mediumButton.on('pointerdown', () => selectDifficulty.call(this, 'medium'));
    this.add.text(350, 300, 'Medium', { fontSize: '24px', fill: '#FFF' });

    const hardButton = this.add.sprite(400, 400,).setInteractive();
    hardButton.on('pointerdown', () => selectDifficulty.call(this, 'hard'));
    this.add.text(360, 400, 'Hard', { fontSize: '24px', fill: '#FFF' });
}


function selectDifficulty(level) {
    difficulty = level;
    this.children.getAll().forEach(child => child.destroy()); //esta linea toda rara lo q hace es limpiar la pantalla del menu
    startGame.call(this); //y ps ya empieza el game con la dificultad deseada
}

function startGame() {    
    //todas las propiedades del paddle
    paddle = this.physics.add.image(300, 450, 'paddle').setImmovable();
    paddle.body.collideWorldBounds = true;

    //todas las propiedades de la bola
    ball = this.physics.add.image(400, 300, 'ball');
    ball.setBounce(1, 1);
    ball.setCollideWorldBounds(true);

    //Goofy ahh sound cuando le pega
    this.physics.add.collider(ball, paddle, () => {
        this.sound.play('hit');
        hitPaddle(ball, paddle);
    }, null, this);

    //Controles del juego con el mouse
    this.input.on('pointermove', function (pointer) {
        paddle.x = Phaser.Math.Clamp(pointer.x, paddle.width / 2, 800 - paddle.width / 2);
    }, this);

    //texto del puntaje nomas
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#FFF' });

    livesText = this.add.text(16, 50, 'Lives: 3', { fontSize: '32px', fill: '#FFF' });

    setDifficulty(difficulty);
}


function hitPaddle(ball, paddle) {
    //CADA VEZ Q LA BOLA PEGUE CON EL PADDLE EL PUNTAJE AUMENTA EN 1
    score += 1;
    scoreText.setText('Score: ' + score);

    //AJUSTE DE VELOCIDAD DESPUES DE CADA GOLPE
    const relativeImpact = ball.x - paddle.x;
    ball.setVelocityX(10 * relativeImpact);
}

function resetBall() {
    //SE VAN REDUCIENDO LAS VIDAS CUANDO VAYAS PERDIENDO
    lives -= 1;
    livesText.setText('Lives: ' + lives);
    //SI LAS VIDAS LLEGAN A 0 TONS SE REINICIAN LAS VIDAS Y EL PUNTAJE
    if (lives <= 0) {
        //SE REINICIA LA BOLA TAMBIEN
        ball.setPosition(400, 300);
        ball.setVelocity(150, -150);
        
        //REINICIO DE PUNTAJE Y DE VIDAS
        score = 0;
        scoreText.setText('Score: ' + score);
        lives = 3;
        livesText.setText('Lives: ' + lives);
    } else {
        //REINICIO DE LA BOLA MIENTRAS EL CONTADOR DE VIDAS NO LLEGUE A 0
        ball.setPosition(400, 300);
        ball.setVelocity(150, -150);
    }
}

//PROPIEDADES DE CADA NIVEL DE DIFICULTAD
function setDifficulty(level) {
    switch(level) {
        case 'easy':
            ball.setVelocity(100, -100);
            paddle.displayWidth = 150;
            break;
        case 'medium':
            ball.setVelocity(200, -200);
            paddle.displayWidth = 100;
            break;
        case 'hard':
            ball.setVelocity(300, -300);
            paddle.displayWidth = 80;
            break;
    }
}
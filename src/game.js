'use strict'

/**
 * Exemplo de jogo com miscelanea de elementos:
 * - control de personagem por rotacionar e mover usando arcade physics
 * - dois players PVP
 * - pool e tiros
 * - colisao de tiros e players
 * - taxa de tiros e variancia de angulo
 * - HUD simples
 * - mapa em TXT
 */

const config = {}
config.RES_X = 1280 // resolucao HD
config.RES_Y = 720

config.PLAYER_ACCELERATION  = 600
config.PLAYER_TURN_VELOCITY = 350
config.PLAYER_MAX_VELOCITY  = 300
config.PLAYER_HEALTH        = 20
config.PLAYER_DRAG          = 300

config.BULLET_FIRE_RATE     = 20
config.BULLET_ANGLE_ERROR   = 0.1
config.BULLET_LIFE_SPAN     = 750
config.BULLET_VELOCITY      = 500

var sky
//var fog
var player1
var player2
var hud
//var map
var meteors
var mines
var timerSpawn
//var explosions
var collections
var shields
var fireballs
//var teste
var alerts
var minex =[]
var miney =[]
var bass
var invul
//var current
var life
//var spacebar
var delay =0
var delayRestart = 300
var score =0
var boom


var game = new Phaser.Game(config.RES_X, config.RES_Y, Phaser.CANVAS, 
    'game-container',
    {   
        preload: preload,
        create: create,
        update: update,
        render: render
    })

function preload() {
    game.load.image('saw', 'assets/saw.png')
    game.load.image('space', 'assets/space.png')
    game.load.spritesheet('astro1', 'assets/nave1.png', 68, 65, 4)
    game.load.spritesheet('astro2', 'assets/nave2.png', 69, 65, 4)
    game.load.image('heart', 'assets/heart.png')
    game.load.image('shot', 'assets/shot.png')
    game.load.image('wall', 'assets/wall.png')
    //game.load.image('fog', 'assets/fog.png')
    game.load.image('fireball', 'assets/fireball.png')
    game.load.image('shield', 'assets/escudo.png');
    //game.load.text('map1', 'assets/map1.txt');  // arquivo txt do mapa
    game.load.image('smallMeteor', 'assets/smallMeteor.png');
    game.load.image('bigMeteor', 'assets/bigMeteor3.png');
    game.load.image('alert', 'assets/alert.png');
    game.load.image('mine', 'assets/mine.png');
    game.load.audio('bass', 'assets/bass.mp3');
    game.load.audio('invul', 'assets/invul.mp3')
    game.load.image('gas', 'assets/gas.png')
    game.load.audio('life', 'assets/life.mp3');
    game.load.audio('boom', 'assets/boom.mp3')
    
}
/*
function createBullets() {
    var bullets = game.add.group()
    bullets.enableBody = true
    bullets.physicsBodyType = Phaser.Physics.ARCADE
    bullets.createMultiple(10, 'shot')
    bullets.setAll('anchor.x', 0.5)
    bullets.setAll('anchor.y', 0.5)
    return bullets
}*/




function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE)

    
    var skyWidth = game.cache.getImage('space').width
    var skyHeight = game.cache.getImage('space').height
    sky = game.add.tileSprite(
        0, 0, skyWidth, skyHeight, 'space')
    sky.scale.x = game.width/sky.width
    sky.scale.y = game.height/sky.height

    /*fog = game.add.tileSprite(
        0, 0, game.width, game.height, 'fog')
    fog.tileScale.setTo(7,7)
    fog.alpha = 0.4
    */
    meteors = game.add.group()
    collections = game.add.group()
    mines = game.add.group()
    shields = game.add.group()
    fireballs = game.add.group()
    alerts = game.add.group()
    bass = game.add.audio('bass')
    invul = game.add.audio('invul')
    life = game.add.audio('life')
    boom = game.add.audio('boom')
    //createMap()

    player1 = new Player(game, game.width*2/9, game.height/2, 
                        'astro1', 0xff0000, {   
            left: Phaser.Keyboard.LEFT,
            right: Phaser.Keyboard.RIGHT,
            up: Phaser.Keyboard.UP,
            down: Phaser.Keyboard.DOWN,
            fire: Phaser.Keyboard.L
        })


    player2 = new Player(game, game.width*7/9, game.height/2, 
                        'astro2', 0x000ff0, {   
            left: Phaser.Keyboard.A,
            right: Phaser.Keyboard.D,
            up: Phaser.Keyboard.W,
            down: Phaser.Keyboard.S,
            fire: Phaser.Keyboard.G
        })
    game.add.existing(player1)
    game.add.existing(player2)
    player2.angle = 180

    hud = {
        text1: createHealthText(game.width*1/9, 50, 'PLAYER 1: 30'),
        text2: createHealthText(game.width*8/9, 50, 'PLAYER 2: 30'),
        fps: createHealthText(game.width*6/9, 50, 'FPS'),
        gamescore: createScore(game.width/2, game.height/2, 'PONTUACAO FINAL: '+ score)
    }
    
    updateHud()

    var fps = new FramesPerSecond(game, game.width*3/9, 50)
    game.add.existing(fps)

    var fullScreenButton = game.input.keyboard.addKey(Phaser.Keyboard.ONE)
    fullScreenButton.onDown.add(toggleFullScreen)

    //spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    game.time.advancedTiming = true;

    game.sound.setDecodedCallback(bass, start, this);
    invul.loopFull(0.6)
    invul.mute = true
    life.volume = 0.4
    timerSpawn = game.time.create(true)
    timerSpawn.loop(1000, randomMeteor, this)
    timerSpawn.loop(2000, randomAlert, this)
    timerSpawn.loop(3000, randomMine, this)
    timerSpawn.loop(3000, randomGallon, this)
    timerSpawn.loop(3000, randomShield, this)
    timerSpawn.loop(1000,randomFireball, this)
    
    timerSpawn.start()
    
}

function start() {

    bass.loopFull(0.6);
    //text.text = 'bass';

}
/*
function loadFile() {
    var text = game.cache.getText('map1');
    return text.split('\n');
}*/
/*
function createMap() {
    // carrega mapa de arquivo texto
    var mapData = loadFile()

    map = game.add.group()
    for (var row = 0; row < mapData.length; row++) {
        for (var col = 0; col < mapData[row].length; col++) {
            var tipo = mapData[row][col]
            var param = ''
            if (col+1 < mapData[row].length) {
                param = mapData[row][col+1]
            }
            if (tipo == 'X') {
                var wall = map.create(col*32, row*32, 'wall')
                wall.scale.setTo(0.5, 0.5)
                game.physics.arcade.enable(wall)
                wall.body.immovable = true
                wall.tag = 'wall'
            } 
        }
    }


}*/

function toggleFullScreen() {
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL
    if (game.scale.isFullScreen) {
        game.scale.stopFullScreen()
    } else {
        game.scale.startFullScreen(false)
    }
}

function randomAlert(){
    var posx = Math.floor(Math.random()*1280)
    var posy = Math.floor(Math.random()*720)
    minex.push(posx) 
    miney.push(posy)
    var alert = new Alert(game, posx, posy, 'alert')
    game.add.existing(alert)
    alerts.add(alert)
}

function randomMine(){
    var mine = new Mine(game, minex.shift(), miney.shift(), 'mine')
    game.add.existing(mine)
    mines.add(mine)
}

function randomShield(){
    var posx = Math.floor(Math.random()*1280)
    var posy = Math.floor(Math.random()*720)
    var shield = new Shield(game, posx, posy, 'shield')
    game.add.existing(shield)
    shields.add(shield)
}

function randomGallon(){
    var posx = Math.floor(Math.random()*1280)
    var posy = Math.floor(Math.random()*720)
    var gallon = new Gallon(game, posx, posy, 'heart')
    game.add.existing(gallon)
    collections.add(gallon)
}

function randomMeteor(){
    //var aux = 11
    var aux = Math.floor((Math.random()*11)+1)
    if(aux == 11){
        var randpos = Math.floor((Math.random()*config.RES_Y)+1)
        var bigMeteor = bigrandomSpawnY(randpos)
        game.add.existing(bigMeteor)
        meteors.add(bigMeteor)
    }else
    if(aux > 5){
        var randpos = Math.floor((Math.random()*config.RES_X)+1)
        var smallMeteor = randomSpawnX(randpos)
        game.add.existing(smallMeteor)
        meteors.add(smallMeteor)
    }else
    if(aux <= 5){
        var randpos = Math.floor((Math.random()*config.RES_Y)+1)
        var smallMeteor = randomSpawnY(randpos)
        game.add.existing(smallMeteor)
        meteors.add(smallMeteor)
    }
    
}

function randomFireball(){
    var randpos = Math.floor((Math.random()*config.RES_X)+1)
    var fireball = fireballSpawn(randpos)
    game.add.existing(fireball)
    fireballs.add(fireball)
}

function randomSpawnX(x){
    var aux = Math.floor((Math.random()*2)+1)  
    var param = 'smallMeteor'
    switch (aux){
        case 1:
        //var param = ''
        var smallMeteor = new Saw(game, x, 0, 'smallMeteor', param)
        return smallMeteor
        break;
        case 2:
        //var param = ''
        var smallMeteor = new Saw(game, x, config.RES_Y, 'smallMeteor', param)
        return smallMeteor;
        break;
    }
}

function randomSpawnY(y){
    var aux = Math.floor((Math.random()*2)+1)
    var param = 'smallMeteor'
    switch (aux){
        case 1:
        //var param = ''
        var saw = new Saw(game, 0, y, 'smallMeteor', param)
        return saw
        break;
        case 2:
        //var param = ''
        var saw = new Saw(game, config.RES_X, y, 'smallMeteor', param)
        return saw
        break;
    }
    
}

function bigrandomSpawnY(y){
    var aux = Math.floor((Math.random()*2)+1)
    var param = 'bigMeteor'
    switch (aux){
        case 1:
        //var param = ''
        var saw = new Saw(game, 0, y, 'bigMeteor', param)
        return saw
        break;
        case 2:
        //var param = ''
        var saw = new Saw(game, config.RES_X, y, 'bigMeteor', param)
        return saw
        break;
    }
    
}

function fireballSpawn(x){
    var aux = Math.floor((Math.random()*2)+1)
    switch (aux){
        case 1:
        //var param = ''
        var saw = new Fireball(game, x, 0, 'fireball')
        return saw
        break;
        case 2:
        //var param = ''
        var saw = new Fireball(game, x, config.RES_Y, 'fireball')
        return saw
        break;
    }
    
}

function createHealthText(x, y, text) {
    var style = {font: 'bold 16px Arial', fill: 'white'}
    var text = game.add.text(x, y, text, style)
    //text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2)
    text.stroke = '#000000';
    text.strokeThickness = 2;
    text.anchor.setTo(0.5, 0.5)
    //text.visible = false
    return text
}

function createScore(x, y, text) {
    var style = {font: 'bold 32px Arial', fill: 'white'}
    var text = game.add.text(x, y, text, style)
    //text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2)
    text.stroke = '#000000';
    text.strokeThickness = 2;
    text.anchor.setTo(0.5, 0.5)
    text.visible =false
    return text
}
/*
function updateBullets(bullets) {
    bullets.forEach(function(bullet) {
        game.world.wrap(bullet, 0, true)
    })
}*/

function update() {
    hud.fps.text = `FPS ${game.time.fps}`
    hud.gamescore.text = 'PONTUACAO FINAL: '+ score
    sky.tilePosition.x += 0.5
    //randomMeteor();
    //fog.tilePosition.x += 0.3
 
    //moveAndStop(player1)
    //updateBullets(player1.bullets)
    //updateBullets(player2.bullets)
    
    if((!player1.alive) && (!player2.alive)){
        if(delay == delayRestart){
            score = 0
            delay =0
            this.game.state.restart()
            
        }else{
            bass.pause()
            updateScore()
            
            delay++
        }
    }else{
        score++
    }
/*
    if (spacebar.isDown){
        game.paused = false
        
    }*/

    game.physics.arcade.collide(player1, meteors, MeteorHitPlayer)
    game.physics.arcade.collide(player2, meteors, MeteorHitPlayer)
    game.physics.arcade.collide(player1, fireballs, fireballHitPlayer)
    game.physics.arcade.collide(player2, fireballs, fireballHitPlayer)
    game.physics.arcade.collide(player1, collections, PlayerGetLife)
    game.physics.arcade.collide(player2, collections, PlayerGetLife)    
    game.physics.arcade.collide(player1, mines, MineHitPlayer)
    game.physics.arcade.collide(player2, mines, MineHitPlayer)    
    game.physics.arcade.collide(player1, shields, PlayerGetShield)
    game.physics.arcade.collide(player2, shields, PlayerGetShield)
    game.physics.arcade.collide(meteors,meteors, MeteorHitMeteor)
    game.physics.arcade.collide(meteors,fireballs, MeteorHitMeteor)
    game.physics.arcade.collide(meteors,mines, MeteorHitMeteor)
    //game.physics.arcade.collide(meteors, meteors, BigMeteorHit)
    //game.physics.arcade.collide(meteors, collections, BigMeteorHit)
    //game.physics.arcade.collide(meteors, mines, BigMeteorHit)
    //game.physics.arcade.collide(meteors, shields, BigMeteorHit)
    game.physics.arcade.overlap(player1, player2, PassLife)
    game.physics.arcade.overlap(player2, player1, PassLife)
    
    
    detroyItens(meteors)
    detroyItens(collections)
    detroyItens(fireballs)
    detroyItens(mines)
    detroyItens(shields)
    
    /*
    game.physics.arcade.collide(player1, player2)
    game.physics.arcade.collide(
        player1, player2.bullets, hitPlayer)
    game.physics.arcade.collide(
        player2, player1.bullets, hitPlayer)

    game.physics.arcade.collide(player1, map)
    game.physics.arcade.collide(player2, map)
    game.physics.arcade.collide(
        player1.bullets, map, killBullet)
    game.physics.arcade.collide(
        player2.bullets, map, killBullet)*/
}
/*
function killBullet(bullet, wall) {
    //wall.kill()
    bullet.kill()
}*/

function detroyItens(grupo){
    grupo.forEach(element => {
        if(!element.alive){
            element.destroy()
        }
    });
}

function fireballHitPlayer(player, fireball){
    if (player.alive) {
        if(player.invulnerable == false){
            player.damage(1)
            fireball.kill()
            updateHud()
            boom.play()
        }else{
            fireball.kill()
        }
    }    
}

function MeteorHitMeteor(meteor1, meteor2){
    if(meteor1.type == 'bigMeteor'){
        meteor2.kill()    
    }else if (meteor2.type == 'bigMeteor'){
        meteor1.kill()
    }else{
        meteor1.kill()
        meteor2.kill()
    }
}

function SmallMeteorHitBig(smallmeteor, bigmeteor){
    smallmeteor.kill()
}

function PassLife(player1, player2){
    if(player1.health > player2.health+1){
        player1.health--
        player2.health++
        updateHud()        
    }
    
}

function BigMeteorHit(meteor, anything){
    if(meteor.type == 'bigMeteor'){
        anything.kill()
    }
}

function PlayerGetShield(player, shield){
    //var aux = player.tint
    if(player.alive){
        player.invulnerable= true;
        player.delayInvulnerable =0
        player.tint = 0xffff00
        shield.kill()
        bass.pause()
        if (invul.mute = true){
            invul.mute = false
        }
        

    }
}

function PlayerGetLife(player, collection){
    if(player.alive){
        if(player.health == 30){
            collection.kill()
        }else{
            player.health++
            collection.kill()
            life.play()
            updateHud()
        }
    }
}

function MeteorHitPlayer(player, obstacle) {
    if (player.alive) {
        if(player.invulnerable == false){
            if(obstacle.type == 'smallMeteor'){
                player.damage(1)
                obstacle.kill()
                boom.play()
            }else
            if(obstacle.type == 'bigMeteor')
                player.damage(10)
                obstacle.kill()
                boom.play()
            updateHud()
        }else{
            obstacle.kill()
        }
    }
}

function MineHitPlayer(player, mine){
    if(player.alive){
        if(player.invulnerable == false){
            player.damage(5)
            mine.kill()
            updateHud()
            boom.play()
        }else{
            mine.kill()
        }
    }
}

function updateScore(){
    hud.gamescore.visible=true
}

function updateHud() {
    if(player1.health < 0){
        player1.health = 0
    }else if(player2.health < 0){
        player2.health = 0
    }
    hud.text1.text = `PLAYER 1: ${player1.health}`
    hud.text2.text = 'PLAYER 2: ' + player2.health
}

function render() {
    /*meteors.forEach( function(obj) {
        game.debug.body(obj)
    })
    mines.forEach( function(obj) {
        game.debug.body(obj)
    })
    collections.forEach( function(obj) {
        game.debug.body(obj)
    })
    shields.forEach( function(obj) {
        game.debug.body(obj)
    })
    fireballs.forEach( function(obj) {
        game.debug.body(obj)
    })*/

    //var timeAlive = 0
    if((player1.alive) || (player2.alive)){
        game.debug.text('SCORE: ' + score, config.RES_X/2-50, 32);
        
    }/*else if((!player1.alive) && (!player2.alive)){
        //game.paused = true
        //game.debug.text("Tempo sobrevivido: "+ timeAlive, config.RES_X/2, 32);
    }*/ /*
    game.debug.body(player1)
    game.debug.body(player2)*/
}
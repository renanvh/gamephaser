
class Player extends Phaser.Sprite {
    constructor(game, x, y, img, tint, keys) {
        super(game, x, y, img)
        //this.tint = tint
        this.animations.add('fly')
        this.animations.play('fly', 25, true)
        this.health = config.PLAYER_HEALTH
        this.anchor.setTo(0.5, 0.5)
        game.physics.arcade.enable(this)
        this.body.drag.set(config.PLAYER_DRAG)
        this.body.maxVelocity.set(config.PLAYER_MAX_VELOCITY)
        this.body.isCircle = true
        this.body.mass = 0.1
        this.body.friction.setTo(0,0)
        this.body.bounce.setTo(1,1)
        this.nextFire = 0
        this.invulnerable = false
        this.delayInvulnerableMax = 240
        this.oldtint = this.tint

        this.delayInvulnerable

        this.cursors = {
            left: game.input.keyboard.addKey(keys.left),
            right: game.input.keyboard.addKey(keys.right),
            up: game.input.keyboard.addKey(keys.up),
            down: game.input.keyboard.addKey(keys.down),        
            fire: game.input.keyboard.addKey(keys.fire)
        }

        this.emitter = game.add.emitter(0, 0, 20);
        this.emitter.makeParticles( [ 'gas' ] );
        this.emitter.setXSpeed(10, 0)
        this.emitter.setYSpeed(10, 0)
        this.emitter.setAlpha(1, 0, 1000);
        this.emitter.setScale(1, 0, 1, 0, 1000);
        this.emitter.start(false, 1000, 50);
        this.emitter.forEach(function(particle) { particle.tint = tint;})
    
        
    }
    
    checkInvulnerable(oldtint){
        if((this.invulnerable == true) && (this.delayInvulnerableMax == this.delayInvulnerable)){
            this.invulnerable = false;
            this.tint = oldtint
            //this.delayInvulnerable = 0;
            invul.mute = true
            bass.resume()
        }        
        else
        if(this.invulnerable == true){
            this.delayInvulnerable++;
        }
    }

    // move e rotaciona, como em Asteroids   
    
    moveAndStop() {
    this.body.velocity.x =0

        //player.speedX = 0
    this.body.velocity.y =0

    if (this.cursors.left.isDown) {
        //this.body.rotation = 180
        this.body.velocity.x = -config.PLAYER_MAX_VELOCITY
    } else
    if (this.cursors.right.isDown) {
        //this.body.rotation = 0
        this.body.velocity.x = config.PLAYER_MAX_VELOCITY
    }
    
    if (this.cursors.up.isDown) {
        this.body.velocity.y = -config.PLAYER_MAX_VELOCITY
    } else
    if (this.cursors.down.isDown) {
        this.body.velocity.y = config.PLAYER_MAX_VELOCITY
    }   
    
    this.body.collideWorldBounds = true;
    this.body.bounce.set(0)

    // impedindo que ele se mova mais rapido nas diagonais
    /*
    if ((player.speedX != 0) && (player.speedY != 0)) {
        player.speedX = player.speedX * 0.7
        player.speedY = player.speedY * 0.7
    }*/

    // movendo o jogador
    //player.x += player.speedX
    //player.y += player.speedY
    

    }

    angleByAtan() {
        if ((this.body.velocity.x != 0) || (this.body.velocity.y != 0)) {
            this.angle = //1
                Math.atan2(this.body.velocity.y, this.body.velocity.x) * 180/Math.PI
        }
    }


    /*moveAndStop() {
    player.speedX = 0
    player.speedY = 0

    if (cursors.left.isDown) {
        player.speedX = -player.SPEED_X
    } else
    if (cursors.right.isDown) {
        player.speedX =  player.SPEED_X
    }
    
    if (cursors.up.isDown) {
        player.speedY = -player.SPEED_Y
    } else
    if (cursors.down.isDown) {
        player.speedY =  player.SPEED_Y
    }    

    // impedindo que ele se mova mais rapido nas diagonais
    if ((player.speedX != 0) && (player.speedY != 0)) {
        player.speedX = player.speedX * 0.7
        player.speedY = player.speedY * 0.7
    }

    // movendo o jogador
    player.x += player.speedX
    player.y += player.speedY
    }*/
    
    update() {
        this.moveAndStop()
        this.angleByAtan()
        this.checkInvulnerable(this.oldtint)
        if(!this.alive){
            this.emitter.forEach(function(particle) { particle.destroy();})   
        }else{
            this.emitter.emitX = this.x;
            this.emitter.emitY = this.y; 
        }
    }
}
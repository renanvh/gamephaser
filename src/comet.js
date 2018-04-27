class Fireball extends Phaser.Sprite {
    constructor(game, x, y, img) {
        super(game, x, y, img)
        this.scale.setTo(1, 1)
        this.anchor.setTo(0.5, 0.5)
        game.physics.arcade.enable(this)

        this.body.setSize(30, 30, 9, 9)
        this.body.isCircle = true

        var left = 0
        var right= game.width
        var up   = 0
        var down = game.height
        var hDelay = game.width/(200/2000)
        var vDelay = game.height/(200/2000)
        var tween

        /*this.emitter = game.add.emitter(0, 0, 40);
        this.emitter.makeParticles( [ 'gas' ] );
        this.emitter.setXSpeed(10, 0)
        this.emitter.setYSpeed(10, 0)
        this.emitter.setAlpha(1, 0, 1000);
        this.emitter.setScale(1, 0, 1, 0, 1000);
        this.emitter.start(false, 1000, 50);
        this.emitter.forEach(function(particle) { particle.tint = 0xff4500;})*/
    

        game.time.events.add(Phaser.Timer.SECOND * 6, this.destroy, this);
        //var explosion = explosions.getFirstExists(false);
        //explosion.reset(x, y);
        //this.animations.add('fog')
        //explosion.play('fog', 30, false, true);
        
        if(y == 0){
            //this.scale.setTo(2.2, 2.2)
            tween = game.add.tween(this)
            .to({x : this.x, y: config.RES_Y}, 3000)
            .to({x : this.x, y: 0}, 3000)
            .loop(-1)
            .start()            
            //this.emitter.forEach(function(particle) { particle.destroy();})   
            //this.y= config.RES_Y
        }else if(y== config.RES_Y){
            game.add.tween(this)
            .to({x : this.x, y: 0}, 3000)
            .to({x : this.x, y: config.RES_Y}, 3000)
            .loop(-1)
            .start()
            //this.emitter.forEach(function(particle) { particle.destroy();})   

        }
        game.add.tween(this)
        .to ( { angle: -359 }, 2000 )
        .loop(-1)
        .start()
        //this.emitter.forEach(function(particle) { particle.destroy();})   



        /*if (type == 'R') {// vai para direita
            game.add.tween(this)
                .to( { x: right, y: up }, hDelay/2 )
                .to( { x: right, y: down }, vDelay )
                .to( { x: left, y: down }, hDelay )
                .to( { x: left, y: up }, vDelay )
                .to( { x: this.x, y: this.y }, hDelay/2 )
                .loop(-1)
                .start()
        } else
        if (type == 'L') {// vai para esquerda
            game.add.tween(this)
                .to( { x: left, y: down }, hDelay/2 )
                .to( { x: left, y: up }, vDelay )
                .to( { x: right, y: up }, hDelay )
                .to( { x: right, y: down }, vDelay )
                .to( { x: this.x, y: this.y }, hDelay/2 )
                .loop(-1)
                .start()
        } else
        if (type == 'V') {// vai e vem
            game.add.tween(this)
                .to( { x: this.x+500, y: this.y }, 2000 )
                .to( { x: this.x    , y: this.y }, 2000 )
                .loop(-1)
                .start()
    }*/

    }


    /*
    update(){
        if(!this.alive){
            this.emitter.forEach(function(particle) { particle.destroy();})   
        }else{
            this.emitter.emitX = this.x;
            this.emitter.emitY = this.y; 
        }
    }*/
    

    
}
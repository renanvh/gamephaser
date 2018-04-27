
class Saw extends Phaser.Sprite {
    constructor(game, x, y, img, type) {
        super(game, x, y, img)
        this.scale.setTo(1, 1)
        this.anchor.setTo(0.5, 0.5)
        game.physics.arcade.enable(this)
        this.type = type
        this.body.setSize(46, 46, 9, 9)
        this.body.isCircle = true

        var left = 0
        var right= game.width
        var up   = 0
        var down = game.height
        var hDelay = game.width/(200/2000)
        var vDelay = game.height/(200/2000)

        /*if(this.type == 'smallMeteor'){
            game.time.events.add(Phaser.Timer.SECOND * 7, this.destroy, this);
        }else{
            game.time.events.add(Phaser.Timer.SECOND * 30, this.destroy, this);   
        }*/
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
        if(type == 'smallMeteor'){
            if(x == 0){
                //game.add.tween(this)
                var xnovo = 1400
                var ynovo = Math.floor((Math.random()*720))
                game.add.tween(this)
                .to({x : xnovo, y: ynovo}, 20000, Phaser.Easing.Exponential.Out, true)
                .loop(-1)
                .start()
            }else
            if(x == 1280){
                //game.add.tween(this)
                var xnovo = -100
                var ynovo = Math.floor((Math.random()*720))
                game.add.tween(this)
                .to({x : xnovo, y: ynovo}, 20000, Phaser.Easing.Exponential.Out, true)
                .loop(-1)
                .start()
            }else
            if(y == 0){
                //game.add.tween(this)
                var xnovo = Math.floor((Math.random()*1280))
                var ynovo = 800
                game.add.tween(this)
                .to({x : xnovo, y: ynovo}, 10000, Phaser.Easing.Exponential.Out, true)
                .loop(-1)
                .start()
            }else
            if (y == 720){
                //game.add.tween(this) 
                var xnovo = Math.floor((Math.random()*1280))
                var ynovo = -100
                game.add.tween(this)
                .to({x : xnovo, y: ynovo}, 10000, Phaser.Easing.Exponential.Out, true)
                .loop(-1)
                .start()}
        }else
        if(type == 'bigMeteor'){
            if(x == 0){
                //game.add.tween(this)
                this.scale.setTo(2.2, 2.2)
                this.body.setSize(110, 110, 5, 5)
                this.body.isCircle = true
                var xnovo = 1400
                var ynovo = Math.floor((Math.random()*720))
                game.add.tween(this)
                .to({x : xnovo, y: ynovo}, 100000, Phaser.Easing.Exponential.Out, true)
                .loop(-1)
                .start()
            }else
            if(x == 1280){
                //game.add.tween(this)
                this.scale.setTo(2.2, 2.2)
                this.body.setSize(110, 110, 5, 5)
                this.body.isCircle = true
                var xnovo = -100
                var ynovo = Math.floor((Math.random()*720))
                game.add.tween(this)
                .to({x : xnovo, y: ynovo}, 100000, Phaser.Easing.Exponential.Out, true)
                .loop(-1)
                .start()
            }
        }

        /*
            var teste = Math.floor((Math.random()*1240)+1)
            game.add.tween(this)
            .to({x : teste, y: teste}, vDelay, Phaser.Easing.Exponential.Out, true)
            .loop(-1)
            .start()*/

            

        
    }

    update(){
        if(this.type == 'bigMeteor'){
            game.physics.arcade.collide(this, collections,BigMeteorHit)
            game.physics.arcade.collide(this, mines,BigMeteorHit)
            game.physics.arcade.collide(this, shields,BigMeteorHit)
            game.physics.arcade.collide(this, fireballs,BigMeteorHit)
        }
    }

}
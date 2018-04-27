class Alert extends Phaser.Sprite {
    constructor(game, x, y, img) {
        super(game, x, y)
        this.loadTexture(img)
        this.scale.setTo(1.5, 1.5)
        this.anchor.setTo(0.5, 0.5)
        game.physics.arcade.enable(this)

        this.body.setSize(46, 46, 9, 9)
        this.body.isCircle = true
        this.delayActive = 0
        this.active = false
        this.delayActiveMax = 60
        var left = 0
        var right= game.width
        var up   = 0
        var down = game.height
        var hDelay = game.width/(200/2000)
        var vDelay = game.height/(200/2000)
        
        game.time.events.add(Phaser.Timer.SECOND * 3, this.destroy, this);
    }
}
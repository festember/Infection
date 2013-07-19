/*-------------------Player Entity-------------------------------- */
game.persistent = {
	player: {
		convertRate: 0,
		kills: 0,
	},
};



game.PlayerEntity = me.ObjectEntity.extend({
 
    /* -----constructor------ */
 
    init: function(x, y, settings) {
        // call the constructor
        this.parent(x, y, settings);
 
        // set the default horizontal & vertical speed (accel vector)
        this.setVelocity(3, 3);
 
        // set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

        //this.Kill = 0;
        this.convertRate=0; 
        this.deviation = 850;
        this.mean = 80;
 
    },
 
    /* -----update the player pos------ */
    update: function() {
        if (me.input.isKeyPressed('left')) {
            // flip the sprite on horizontal axis
            //this.flipX(true);
            // update the entity velocity
            this.vel.x -= this.accel.x * me.timer.tick;
        } else if (me.input.isKeyPressed('right')) {
            // unflip the sprite
            //this.flipX(false);
            // update the entity velocity
            this.vel.x += this.accel.x * me.timer.tick;
        } else if (me.input.isKeyPressed('up')) {
        	this.vel.y -= this.accel.x * me.timer.tick;
        }  else if (me.input.isKeyPressed('down')) {
        	this.vel.y += this.accel.x * me.timer.tick;
        } else {
            this.vel.x = 0;
            this.vel.y = 0;
        }   

        // check & update player movement
        this.updateMovement();

        var res = me.game.collide(this);
 
        if (res) {
            // if we collide with an enemy
            if (res.obj.type == me.game.ENEMY_OBJECT && me.input.isKeyPressed('attack')) {
                this.renderable.flicker(45);
                //this.Kill+=1;
                //this.convertRate = (1/1.414)*(1/Math.exp(Math.pow(this.Kill-this.mean,2)/(2*this.deviation)))*10
                //game.persstent.player.convertRate = this.convertRate;  
                /*console.log('Hey it collided');
                if (game.persistent.player.kills <= 80){
                    game.persistent.player.convertRate = (9/8)*game.persistent.player.kills + 1;
		    console.log(game.persistent.player.convertRate);
		    console.log(game.persistent.player.kills);
		    console.log('HEY');
                }
                else{
                    game.persistent.player.convertRate = (-0.07*game.persistent.player.kills) + 15.6;
                }*/
                //me.game.HUD.updateItemValue("kill", game.persistent.player.kills);
                //me.game.HUD.updateItemValue("convRate", game.persistent.player.convertRate);

                //me.game.HUD.updateItemValue("score", 250);
            }
        }
 
        // update animation if necessary
        if (this.vel.x!=0 || this.vel.y!=0) {
            // update object animation
            this.parent();
            return true;
        }
         
        // else inform the engine we did not perform
        // any update (e.g. position, animation)
        return false;
    }
 
});

/* --------------------------Zombie Entity------------------------ */
game.ZombieEntity = me.ObjectEntity.extend({
    init: function(x, y, settings) {
        // define this here instead of tiled
        settings.image = "zombie";
        settings.spritewidth = 64;
 
        // call the parent constructor
        this.parent(x, y, settings);
 
        this.startX = x;
        this.endX = x + settings.width - settings.spritewidth;
        // size of sprite
 
        // make him start from the right
        this.pos.x = x + settings.width - settings.spritewidth;
        this.walkLeft = true;
 
        // walking & jumping speed
        this.setVelocity(1, 1);
 
        // make it collidable
        this.collidable = true;
        // make it a enemy object
        this.type = me.game.ENEMY_OBJECT;

        this.health=100;
    },
 
    // call by the engine when colliding with another object
    // obj parameter corresponds to the other object (typically the player) touching this one
    onCollision: function(res, obj) {
 
        // res.y >0 means touched by something on the bottom
        // which mean at top position for this one
        if (this.alive) {
            if(me.input.isKeyPressed('attack')) {
        	   //me.game.HUD.updateItemValue("health", this.health);
                //me.game.HUD.updateItemValue("score", 250);
                //me.game.remove(this);
                //this.alive = false;
                console.log('Hey it collided');
                if (game.persistent.player.kills <= 80){
                    game.persistent.player.convertRate = (9/80)*game.persistent.player.kills + 1;
		    console.log('conv rate:' + game.persistent.player.convertRate);
		    console.log('kills :' +game.persistent.player.kills);
		    console.log('HEY');
                }
                else{
                    game.persistent.player.convertRate = (-0.07*game.persistent.player.kills) + 15.6;
                }
                console.log(game.persistent.player.convertRate);
		console.log(this.health);
                this.health-=(3*game.persistent.player.convertRate);
                //me.game.HUD.updateItemValue("health", this.health);
                if(this.health <=0){
                    //me.game.remove(this);
                	this.renderable.flicker(45);
               		 this.collidable = false;
                	 this.alive = false;
                         game.persistent.player.kills+=1;
			console.log('KILLED ')
                }
            }
        }
    },
 
    // manage the enemy movement
    update: function() {
        // do nothing if not in viewport
        if (!this.inViewport)
            return false;
 
        if (this.alive) {
            if (this.walkLeft && this.pos.x <= this.startX) {
                this.walkLeft = false;
            } else if (!this.walkLeft && this.pos.x >= this.endX) {
                this.walkLeft = true;
            }
            // make it walk
            this.flipX(this.walkLeft);
            this.vel.x += (this.walkLeft) ? -this.accel.x * me.timer.tick : this.accel.x * me.timer.tick;
                 
        } else {
            this.vel.x = 0;
        }
         
        // check and update movement
        this.updateMovement();
         
        // update animation if necessary
        if (this.vel.x!=0 || this.vel.y!=0) {
            // update object animation
            this.parent();
            return true;
        }
        return false;
    }
});


/* --------------------------Werewolf Entity------------------------ */
game.WerewolfEntity = me.ObjectEntity.extend({
    init: function(x, y, settings) {
        // define this here instead of tiled
        settings.image = "werewolf";
        settings.spritewidth = 64;
 
        // call the parent constructor
        this.parent(x, y, settings);
 
        this.startX = x;
        this.endX = x + settings.width - settings.spritewidth;
        // size of sprite
 
        // make him start from the right
        this.pos.x = x + settings.width - settings.spritewidth;
        this.walkLeft = true;
 
        // walking & jumping speed
        this.setVelocity(1, 1);
 
        // make it collidable
        this.collidable = true;
        // make it a enemy object
        this.type = me.game.ENEMY_OBJECT;
 
    },
 
    // call by the engine when colliding with another object
    // obj parameter corresponds to the other object (typically the player) touching this one
    onCollision: function(res, obj) {
 
        // res.y >0 means touched by something on the bottom
        // which mean at top position for this one
        if (this.alive) {
            if(me.input.isKeyPressed('attack')) {
                me.game.HUD.updateItemValue("score", 250);
		console.log('Hey it collided');
                if (game.persistent.player.kills <= 80){
                    game.persistent.player.convertRate = (9/8)*game.persistent.player.kills + 1;
                    console.log('convert rate:'+ game.persistent.player.convertRate);
                    console.log('KILLS: '+game.persistent.player.kills);
		
                    console.log('HEY');
                }
                else{
                    game.persistent.player.convertRate = (-0.07*game.persistent.player.kills) + 15.6;
                }
                console.log(game.persistent.player.convertRate);
                console.log(this.health);
                this.health-=(game.persistent.player.convertRate);
		if(this.health<=0){
                	this.renderable.flicker(45);
                	this.collidable = false;
                //me.game.remove(this);
                	this.alive = false;
		}
            }
        }
    },
 
    // manage the enemy movement
    update: function() {
        // do nothing if not in viewport
        if (!this.inViewport)
            return false;
 
        if (this.alive) {
            if (this.walkLeft && this.pos.x <= this.startX) {
                this.walkLeft = false;
            } else if (!this.walkLeft && this.pos.x >= this.endX) {
                this.walkLeft = true;
            }
            // make it walk
            this.flipX(this.walkLeft);
            this.vel.x += (this.walkLeft) ? -this.accel.x * me.timer.tick : this.accel.x * me.timer.tick;
                 
        } else {
            this.vel.x = 0;
        }
         
        // check and update movement
        this.updateMovement();
         
        // update animation if necessary
        if (this.vel.x!=0 || this.vel.y!=0) {
            // update object animation
            this.parent();
            return true;
        }
        return false;
    }
});


/* --------------------------Vampire Entity------------------------ */
game.VampireEntity = me.ObjectEntity.extend({
    init: function(x, y, settings) {
        // define this here instead of tiled
        settings.image = "vampire";
        settings.spritewidth = 64;
 
        // call the parent constructor
        this.parent(x, y, settings);
 
        this.startX = x;
        this.endX = x + settings.width - settings.spritewidth;
        // size of sprite
 
        // make him start from the right
        this.pos.x = x + settings.width - settings.spritewidth;
        this.walkLeft = true;
 
        // walking & jumping speed
        this.setVelocity(1, 1);
 
        // make it collidable
        this.collidable = true;
        // make it a enemy object
        this.type = me.game.ENEMY_OBJECT;
 
    },
 
    // call by the engine when colliding with another object
    // obj parameter corresponds to the other object (typically the player) touching this one
    onCollision: function(res, obj) {
 
        // res.y >0 means touched by something on the bottom
        // which mean at top position for this one
        if (this.alive) {
            if(me.input.isKeyPressed('attack')) {
                me.game.HUD.updateItemValue("score", 250);
                this.renderable.flicker(45);
                this.collidable = false;
                //me.game.remove(this);
                this.alive = false;
                //this.settings.image = obj.image;
            }
        }
    },
 
    // manage the enemy movement
    update: function() {
        // do nothing if not in viewport
        if (!this.inViewport)
            return false;
 
        if (this.alive) {
            if (this.walkLeft && this.pos.x <= this.startX) {
                this.walkLeft = false;
            } else if (!this.walkLeft && this.pos.x >= this.endX) {
                this.walkLeft = true;
            }
            // make it walk
            this.flipX(this.walkLeft);
            this.vel.x += (this.walkLeft) ? -this.accel.x * me.timer.tick : this.accel.x * me.timer.tick;
                 
        } else {
            this.vel.x = 0;
        }
         
        // check and update movement
        this.updateMovement();
         
        // update animation if necessary
        if (this.vel.x!=0 || this.vel.y!=0) {
            // update object animation
            this.parent();
            return true;
        }
        return false;
    }
});

game.ScoreObject = me.HUD_Item.extend({
    init: function(x, y) {
        // call the parent constructor
        this.parent(x, y);
        // create a font
        //this.font = new me.BitmapFont("64x64_font", 64);
        this.font = new me.BitmapFont("32x32_font", 32);
        this.font.set("right");
    },
 
    /* -----draw our score------ */
    draw: function(context, x, y) {
        this.font.draw(context, this.value, this.pos.x + x, this.pos.y + y);
    }
 
});

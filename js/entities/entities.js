/*-------------------Player Entity-------------------------------- */
game.persistent = {
    player: {
        signal : 0,
        
    },
    opponent: {
        attack : 0,
        help : 0,
    },
};


var hero  = undefined;
var heroSettings = undefined;
game.PlayerEntity = me.ObjectEntity.extend({
    draw: function(context, rect) {
        this.parent(context, rect);
        this.drawHealth(context);
      },
      drawHealth: function(context) {
        var percent = this.health / 500.0;
        var width = this.getCollisionBox().width*percent;
        context.fillStyle = 'blue';
        context.fillRect(this.getCollisionBox().x, this.pos.y - 12, width, 10);
      },
      getCollisionBox: function() {
        return {
          x: this.pos.x + this.collisionBox.colPos.x,
          y: this.pos.y + this.collisionBox.colPos.y,
          width: this.collisionBox.width,
          height: this.collisionBox.height
        };
      }, 
    /* -----constructor------ */

    init: function(x, y, settings) {
        // call the constructor
        settings.spritewidth = 64;
        this.parent(x, y, settings);
        heroSettings = settings;
        // set the default horizontal & vertical speed (accel vector)
        this.setVelocity(10, 10);
 
        // set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

        this.Kill = 0;
        this.convertRate = 0.0; 
        this.deviation = 850;
        this.mean = 80;
        this.collidabe = true;
        this.health = 500.0;
 
    },
 
    /* -----update the player pos------ */
    update: function() {
        if (me.input.isKeyPressed('left')) {
            this.flipX(false);  // unflip the sprite on horizontal axis
            this.vel.x -= this.accel.x * me.timer.tick;
            this.vel.y=0;
        } else if (me.input.isKeyPressed('right')) {
            this.flipX(true);   // flip the sprite
            this.vel.x += this.accel.x * me.timer.tick;
            this.vel.y=0;
        } else if (me.input.isKeyPressed('up')) {
            this.vel.y -= this.accel.x * me.timer.tick;
            this.vel.x=0;
        }  else if (me.input.isKeyPressed('down')) {
            this.vel.y += this.accel.x * me.timer.tick;
            this.vel.x=0;
        } else {
            this.vel.x = 0;
            this.vel.y = 0;
        }   

        if(this.pos.x<0)
            this.pos.x = 0; 
        if(this.pos.x>2500)
            this.pos.x=2500;
        if(this.pos.y<0)
            this.pos.y = 0; 
        if(this.pos.y>2350)
            this.pos.y = 2350;

        //check & update player movement
        this.updateMovement();
        var res = me.game.collide(this);
        if (res) {
            // if we collide with an enemy

            if (res.obj.type == me.game.ENEMY_OBJECT && me.input.isKeyPressed('attack')) {
                //this.renderable.flicker(45);
                res.obj.health-=(2*this.convertRate);

                this.convertRate = (1/1.414)*(1/Math.exp(Math.pow(this.Kill-this.mean,2)/(2*this.deviation)))*10
                hero.convertRate = this.convertRate;  
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

/* --------------------------Converted Entity------------------------ */
game.ConvertedEntity = me.ObjectEntity.extend({

    draw: function(context, rect) {
        this.parent(context, rect);
        this.drawHealth(context);
      },
      drawHealth: function(context) {
        var percent = this.health / 100;
        var width = this.getCollisionBox().width*percent;
        context.fillStyle = 'green';
        context.fillRect(this.getCollisionBox().x, this.pos.y - 12, width, 10);
      },
      getCollisionBox: function() {
        return {
          x: this.pos.x + this.collisionBox.colPos.x,
          y: this.pos.y + this.collisionBox.colPos.y,
          width: this.collisionBox.width,
          height: this.collisionBox.height
        };
      },
  
    init: function(x, y, settings) {
        // define this here instead of tiled
        settings.name="con";
        settings.image = "werewolf";
        
 
        // call the parent constructor
        this.parent(x, y, settings);
 
        // walking & jumping speed
        this.setVelocity(4, 4);
 
        // make it collidable
        this.health=50;
       
    },
 
    // call by the engine when colliding with another object
    // obj parameter corresponds to the other object (typically the player) touching this one
    onCollision: function(res, obj) {
        // res.y >0 means touched by something on the bottom
        // which mean at top position for this one
        if(obj.name == "con")
        {
            var i = Math.floor(Math.random()*4)
            if(i == 0) {
                this.pos.x -= 64;
                this.pos.y -= 64;
            } else if(i == 1) {
                this.pos.x += 64;
                this.pos.y -= 64;
            } else if(i == 2) {
                this.pos.x += 64;
                this.pos.x -= 64;
            } else {
                this.pos.x += 64;
                this.pos.y += 64;
            }
        }
    },
 
    // manage the movement--should follow the player
    update: function() {
        // do nothing if not in viewport
        //if (!this.inViewport)
            //return false;
        if(this.health <=0)
        {
            this.alive = false;
            me.game.remove(this);
        }
        var res = me.game.collide(this);
        if (res && res.obj.name=="zombie") {
            if (this.alive) {
                res.obj.health-=hero.convertRate;
            }
        }
        if (this.alive) {


            if (this.walkLeft && this.pos.x <= this.startX) {
                this.walkLeft = false;
            } else if (!this.walkLeft && this.pos.x >= this.endX) {
                this.walkLeft = true;
            }
            // make it walk
            this.flipX(!this.walkLeft);
            //this.vel.x += (this.walkLeft) ? -this.accel.x * me.timer.tick : this.accel.x * me.timer.tick;
                 
        } else {
            this.vel.x = 0;
        }
        
        if(me.input.isKeyPressed('attract')) {
            var dist = Math.sqrt(Math.pow(hero.pos.x-this.pos.x,2)+Math.pow(hero.pos.y-this.pos.y,2));
            var nx =  (hero.pos.x-this.pos.x)*1.0/dist;
            var ny =  (hero.pos.y-this.pos.y)*1.0/dist;

            if(dist > 10)
            {
                this.vel.x = nx*5;
                this.vel.y = ny*5; 
            } else {
                this.vel.x = 0;
                this.vel.y = 0;
            }
        }

        if(this.pos.x<0)
            this.pos.x = 0; 
        if(this.pos.x>2500)
            this.pos.x=2500;
        if(this.pos.y<0)
            this.pos.y = 0; 
        if(this.pos.y>2350)
            this.pos.y = 2350;
         
        // check and update movement
        this.updateMovement();
         
        // update animation if necessary
        if (this.vel.x != 0 || this.vel.y!=0) {
            // update object animation
            this.parent();
            return true;
        }
        return false;
    }
});

/* --------------------------Zombie Entity------------------------ */
game.ZombieEntity = me.ObjectEntity.extend({

    draw: function(context, rect) {
        this.parent(context, rect);
        this.drawHealth(context);
      },
      drawHealth: function(context) {
        var percent = this.health / 100;
        var width = this.getCollisionBox().width*percent;
        context.fillStyle = 'green';
        context.fillRect(this.getCollisionBox().x, this.pos.y - 12, width, 10);
      },
      getCollisionBox: function() {
        return {
          x: this.pos.x + this.collisionBox.colPos.x,
          y: this.pos.y + this.collisionBox.colPos.y,
          width: this.collisionBox.width,
          height: this.collisionBox.height
        };
      },
  
    init: function(x, y, settings) {

        this.maxFrames = 60+Math.floor(Math.random()*60);
        this.frameCounter=this.maxFrames;
        settings.name = "zombie";
        settings.image = "zombie";
        settings.spritewidth = 64;
        this.settings = settings;
        this.parent(x, y, settings);
        this.pos.x = x + settings.width - settings.spritewidth;
        this.walkLeft = true;
        this.setVelocity(2, 2);
        this.collidable = true;
        this.type = me.game.ENEMY_OBJECT;
        this.attack = 1;
        this.health = 100;
    },
 
   
    onCollision: function(res, obj) {
        if (this.alive) {

        }   
    },
 
    // manage the enemy movement
    update: function() {

        this.frameCounter++;
        if(this.frameCounter/this.maxFrames > 1.0){
            this.frameCounter = 0;
            this.anglex = Math.floor(Math.random()*360);
        }
        
        var res = me.game.collide(this, true);
        if (res && this.alive ){
            for(var i=0, len=res.length; i<len;i++){
                if(me.input.isKeyPressed('attack') && res[i].obj.name=="mainplayer") {
                    hero.convertRate = (hero.Kill <= 40)? (9/80)*hero.Kill + 1 :(-0.07*hero.Kill) + 15.6 ;
                    hero.health -= 0.2;
                }
                if(res[i].obj.name=="con") {
                    res[i].obj.health-=hero.convertRate;
                }    
            }
               
        }
        if(this.health <=0) {
            hero.Kill+=1;
            con = new game.ConvertedEntity(this.pos.x, this.pos.y, this.settings);
            me.game.add(con, 4);
            me.game.sort();
            this.collidable = false;
            this.alive = false;
            me.game.HUD.updateItemValue("score", 250);
            me.game.remove(this);
        }   
        
        // do nothing if not in viewport
        if (!this.inViewport)
            return false;
 
        if (this.alive) {
            this.walkLeft = (this.vel.x<0)? true:false;
                

            this.flipX(!this.walkLeft);

            var dist = Math.sqrt(Math.pow(hero.pos.x-this.pos.x,2)+Math.pow(hero.pos.y-this.pos.y,2));

            if (me.input.isKeyPressed('attack')) {
                if(dist<300) {
                    var nx =  (hero.pos.x-this.pos.x)*1.0/dist;
                    var ny =  (hero.pos.y-this.pos.y)*1.0/dist;
                    this.vel.x = nx*5;
                    this.vel.y = ny*5; 
                }
            }
            else{
                this.vel.x = Math.cos(this.anglex)*5;
                this.vel.y = Math.sin(this.anglex)*5;
            }
            if(this.pos.x<0)
                this.pos.x = 0; 
            if(this.pos.x>2500)
                this.pos.x=2500;
            if(this.pos.y<0)
                this.pos.y = 0; 
            if(this.pos.y>2350)
                this.pos.y = 2350;  
        } 

        this.updateMovement();

        if (this.vel.x!=0 || this.vel.y!=0) {
            this.parent();
            return true;
        }
        return false;
    }
});

game.Brains = me.CollectableEntity.extend({
    init: function(x, y, settings) {
        settings.name = "brain";
        settings.image = "brain";
        settings.spritewidth = 64;
        // call the parent constructor
        this.parent(x, y, settings);
    },
    onCollision: function(res, obj) {
        if(res && obj.name == "mainplayer") {
            if(me.input.isKeyPressed('pick') && hero.health < 500)
            {
                hero.health = Math.min(500, hero.health+200)
                this.collidable = false;
                me.game.remove(this);
            }
        }
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
            if(me.input.isKeyPressed('attack')) 
            {
                game.persistent.opponent.help = 1;
                game.persistent.opponent.attack = 1;
                
                hero.convertRate = (0.9/20)*hero.Kill + 1;
                
                this.health-=(2*hero.convertRate);
                //me.game.HUD.updateItemValue("health", this.health);
                if(this.health <=0) {
                    hero.Kill+=1;
                    //me.game.add()
                    //this.renderable.flicker(45);
                    this.collidable = false;
                    this.alive = false;
                    me.game.HUD.updateItemValue("score", 250);
                    console.log('KILLED ');
                    game.persistent.opponent.attack = 0;
                    me.game.remove(this);
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
            if(me.input.isKeyPressed('attack')) 
            {
                game.persistent.opponent.help = 1;
                game.persistent.opponent.attack = 1;
                hero.convertRate = (-0.9/20)*hero.Kill + 1;
                
                this.health-=(2*hero.convertRate);
                    if(this.health <=0){
                    hero.Kill+=1;
                    //me.game.add()
                    //this.renderable.flicker(45);
                    this.collidable = false;
                    this.alive = false;

                    me.game.HUD.updateItemValue("score", 250);
                    console.log('KILLED ');
                    game.persistent.opponent.attack = 0;
                    me.game.remove(this);
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
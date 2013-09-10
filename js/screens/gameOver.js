game.GameOverScreen = me.ScreenObject.extend({
	// constructor
    init: function() {
        this.parent(true);
 
        // title screen image
        this.title = null;
        this.font = null;
        ch = null;
    },
 
    // reset function
    onResetEvent: function() {
        if (this.title == null) {
            // init stuff if not yet done
            this.title = me.loader.getImage("game_over");
            // font to display the menu items
            this.font = new me.BitmapFont("32x32_font", 32);
        }
        if(fin.value > 62500) {
            ch = true;
            fin.value = 0;
        }
        /*if(hero.kills > 200 && hero.gameTime < 4.0) {
            ch = true;
            fin.value = 0;
        }*/
        
        // enable the keyboard
        //me.input.bindKey(me.input.KEY.ENTER, "enter", true);
        // play something
        me.audio.play("horror", true);
    },
 
    // update function
    update: function() {
        /*if (me.input.isKeyPressed('enter')) {
            me.state.change(me.state.PLAY);
        }*/
        return true;
    },
 
    // draw function
    draw: function(context) {
        context.drawImage(this.title, 0, 0);
        if(ch)
        {
            //fin.value = 0;
            this.font.draw(context, "PLEASE DONT CHEAT", 100, 920);
            //this.font.draw(context, "SCORE: " + fin.value, 100, 920);
        } else {
            this.font.draw(context, "SCORE: " + fin.value, 100, 920);
        }
    },
 
    // destroy function
    onDestroyEvent: function() {
        //me.input.unbindKey(me.input.KEY.ENTER);
 	}
});
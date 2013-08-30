game.GameOverScreen = me.ScreenObject.extend({
	// constructor
    init: function() {
        this.parent(true);
 
        // title screen image
        this.title = null;
        this.font = null;
    },
 
    // reset function
    onResetEvent: function() {
        if (this.title == null) {
            // init stuff if not yet done
            this.title = me.loader.getImage("game_over");
            // font to display the menu items
            this.font = new me.BitmapFont("32x32_font", 32);
        }
 
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
        this.font.draw(context, "Score: ", 100, 920);
    },
 
    // destroy function
    onDestroyEvent: function() {
        //me.input.unbindKey(me.input.KEY.ENTER);
 	}
});
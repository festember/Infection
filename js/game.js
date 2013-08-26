
/* Game namespace */
var game = {
    // Run on page load.
    "onload" : function () {
        // Initialize the video.
        if (!me.video.init("screen", 1280, 960, true, 'auto')) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }
		
		// add "#debug" to the URL to enable the debug Panel
		if (document.location.hash === "#debug") {
			window.onReady(function () {
				me.plugin.register.defer(debugPanel, "debug");
			});
		}

        // Initialize the audio.
        me.audio.init("mp3,ogg");

        // Set a callback to run when loading is complete.
        me.loader.onload = this.loaded.bind(this);
     
        // Load the resources.
        me.loader.preload(game.resources);

        // Initialize melonJS and display a loading screen.
        me.state.change(me.state.LOADING);
    },



    // Run on game resources loaded.
    "loaded" : function () {
        //me.state.set(me.state.MENU, new game.TitleScreen());
        me.state.set(me.state.PLAY, new game.PlayScreen());
        // add our player entity in the entity pool
        me.entityPool.add("mainPlayer", game.PlayerEntity);
        me.entityPool.add("zombie", game.ZombieEntity);
        me.entityPool.add("vampire", game.VampireEntity);
        me.entityPool.add("werewolf", game.WerewolfEntity);
        me.entityPool.add("converted",game.ConvertedEntity);	
             
        // enable the keyboard
        me.input.bindKey(me.input.KEY.LEFT,  "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.UP,    "up");
        me.input.bindKey(me.input.KEY.DOWN,  "down");
        me.input.bindKey(me.input.KEY.X,     "attack");
        me.input.bindKey(me.input.KEY.A,     "attract");

        me.sys.gravity = 0;
        // Start the game.
        me.state.change(me.state.PLAY);
    }
};

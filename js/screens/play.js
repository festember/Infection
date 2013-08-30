game.PlayScreen = me.ScreenObject.extend({
	/**	
	 *  action to perform on state change
	 */
	onResetEvent: function() {	
		//get the base map level
    	me.levelDirector.loadLevel("main");
     	// add a default HUD to the game mngr
		me.game.addHUD(0, 0, 1280, 960);
		
		// add a new HUD item 
		me.game.HUD.addItem("score", new game.ScoreObject(1270, 920));
		//me.game.HUD.addItem("kill", new game.ScoreObject(630, 0));
		//me.game.HUD.addItem("convRate", new game.ScoreObject(630, 30));
		
		// make sure everyhting is in the right order
		startTime = me.timer.getTime();
		endTime = undefined;
		gameTime = undefined;
		hero = me.game.getEntityByName("mainPlayer")[0];
		toggleAudio = 1;
		for(var i = 0; i < 100; i++) 
		{
			var x = Math.floor(Math.random()*2250);
			var y = Math.floor(Math.random()*2250);
			while(x > 1100 && x < 2110 && y > 0 && y < 700)
			{
				x = Math.floor(Math.random()*2250);
				y = Math.floor(Math.random()*2250);
			}
			var con = new game.ZombieEntity(x, y, heroSettings);
            me.game.add(con, 3);
		}
		for(var i = 0; i < 150; i++) 
		{
			var x = Math.floor(Math.random()*2250);
			var y = Math.floor(Math.random()*2250);
			while(x > 1100 && x < 2110 && y > 0 && y < 700)
			{
				x = Math.floor(Math.random()*2250);
				y = Math.floor(Math.random()*2250);
			}
			var con = new game.WerewolfEntity(x, y, heroSettings);
            me.game.add(con, 3);
		}
		for(var i = 0; i < 5; i++) 
		{
			var x = Math.floor(Math.random()*2250);
			var y = Math.floor(Math.random()*2250);
			while(x > 1100 && x < 2110 && y > 0 && y < 700)
			{
				x = Math.floor(Math.random()*2250);
				y = Math.floor(Math.random()*2250);
			}
			var con = new game.Blood(x, y, heroSettings);
            me.game.add(con, 3);
		}
		me.game.sort();
	},
	
	
	/**	
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
	  me.game.disableHUD();
	}
});

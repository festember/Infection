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
		hero = me.game.getEntityByName("mainPlayer")[0];
		for(var i = 0; i < 200; i++) 
		{
			var con = new game.ZombieEntity(Math.floor(Math.random()*2250), Math.floor(Math.random()*2250), heroSettings);
            me.game.add(con, 3);
		}
		for(var i = 0; i < 25; i++) 
		{
			var con = new game.Brains(Math.floor(Math.random()*2000), Math.floor(Math.random()*2000), heroSettings);
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

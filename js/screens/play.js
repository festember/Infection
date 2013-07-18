game.PlayScreen = me.ScreenObject.extend({
	/**	
	 *  action to perform on state change
	 */
	onResetEvent: function() {	
		//get the base map level
    	me.levelDirector.loadLevel("area01");
     	// add a default HUD to the game mngr
		me.game.addHUD(0, 440, 640, 32);
		
		// add a new HUD item 
		me.game.HUD.addItem("score", new game.ScoreObject(630, 0));
		
		// make sure everyhting is in the right order
		me.game.sort();
	},
	
	
	/**	
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
	  me.game.disableHUD();
	}
});

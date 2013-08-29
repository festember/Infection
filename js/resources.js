game.resources = [
    /**
     * Graphics.
     */
    // our level tileset
    {name: "area01_level_tiles",  type:"image", src: "data/img/map/area01_level_tiles.png"},
    //player sprite
    {name: "player", type:"image", src: "data/img/sprite/zombie.png"},
    //other entities
    {name: "zombie", type:"image", src: "data/img/sprite/zombie.png"},
    {name: "werewolf", type:"image", src: "data/img/sprite/werewolf.png"},
    {name: "vampire", type:"image", src: "data/img/sprite/vampire.png"},
    {name: "brain",  type:"image", src: "data/img/sprite/brain.png"},
    {name: "converted",  type:"image", src: "data/img/sprite/con.png"},
    /* 
     * Maps. 
     */
    {name: "main", type: "tmx", src: "data/map/main.tmx"},

    //music
    {name: "horror", type: "audio", src: "data/music/", channel : 1},
    // game font
    //{name: "64x64_font", type: "image", src: "data/img/font/64x64_font.png"},
    {name: "32x32_font", type: "image", src: "data/img/font/32x32_font.png"}
];
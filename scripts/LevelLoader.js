export const firstLevelDataRaw = 
`
{
    "levelFormatVersion":1,
    "name":"Home",
    "world":{
        "tiles":[
            {
                "geometry":"plane",
                "spritesheets":{
                    "textures/terrain/grassdirt-big.png"
                },
                "width":50,
                "height":50,
                "position":{
                    "x":0,
                    "y":0,
                    "z":0
                }
            },
            {
                "type":"DialogTile",
                "message":"What in the god damn? Now it's time for you to die!",
                "buttons":{
                    "message":"Oh fuck!"
                }
            }
        ],
        "entities":[

        ]
    },
    "startPosition":{
        "position":{
            "x":0,
            "y":0,
            "z":0
        },
        "rotation":{
            "x":0,
            "y":0,
            "z":0
        }
    }
}
`;

/*
this.dialog = new DialogBox({ message: message, buttons: [
    {
        message: "Oh fuck!",
        onClick: () =>
        {
            for (let i = 0; i < 10; i++)
            {
                let enemy = new Enemy(player);
                enemy.position.copy(new Vector3(MathUtility.getRandomInt(-10, 10), MathUtility.getRandomInt(-10, 10), 0));
                scene.add(enemy);
            }

            Weather.startRain();
            Weather.lightning();

            this.stopDialog();

            scene.remove(this);
            this.remove();
        }
    }
] });
*/
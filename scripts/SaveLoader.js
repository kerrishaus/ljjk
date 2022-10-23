export const saveDataRaw = 
`
{
    "version":1,
    "shop":{
        "type":1,
        "money":25,
        "maxCustomers":20,
        "timeUntilNextCustomer":14,
        "timeSinceLastCustomer":0,
        "minTimeUntilNextCustomer":7,
        "maxTimeUntilNextCustomer":20,
        "lifeSales":0,
        "lifeCustomers":0,
        "lifeReputation":0,
        "tiles":[
            {
                "type":"tomatoStand",
                "position":{
                    "x":0,
                    "y":0,
                    "z":0
                },
                "amount":0
            },
            {
                "type":"recycleBin",
                "position":{
                    "x":-9,
                    "y":9,
                    "z":0
                },
                "amount":0
            }
        ],
        "customers":[
            {
                "reputation":0,
                "position":{
                    "x":0,
                    "y":0,
                    "z":0
                },
                "rotation":{
                    "x":0,
                    "y":0,
                    "z":0
                },
                "carriedItems":[
                    {
                        "type":"tomato"
                    }
                ],
                "actions":[
                    {
                        "name":"",
                        "type":"",
                        "amount":0,
                        "container":0,
                        "position":{
                            "x":0,
                            "y":0,
                            "z":0
                        }
                    }
                ]
            }
        ],
        "employees":[
            {
                "position":{
                    "x":0,
                    "y":0,
                    "z":0.5
                },
                "rotation":{
                    "x":0,
                    "y":0,
                    "z":0
                },
                "carriedItems":[
                    {
                        "type":"tomato"
                    }
                ],
                "actions":[
                    {

                    }
                ]
            }
        ]
    },
    "player":{
        "position":{
            "x":0,
            "y":0,
            "z":0.5
        },
        "rotation":{
            "x":0,
            "y":0,
            "z":0
        },
        "carriedItems":[
            {
                "type":"tomato",
                "position":{
                    "x":0,
                    "y":0,
                    "z":0
                }
            }
        ]
    }
}
`;
```json
{
    "eris": {
        "clientOptions": {
            "disableEvents": {},
            "messageLimit": 0,
            "requestTimeout": 0,
            "restMode": true
        }
    },
    "sharder": {
        "name": "",
        "path": "",
        "shardCount": 0,
        "clusters": 0,
        "webhooks": {
            "shard": {
                "id": "your webhook id",
                "token": "your webhook token"
            },
            "cluster": {
                "id": "your webhook id",
                "token": "your webhook token"
            }
        }
    },
    "links": {
        "youtube": {}
    },
    "lavalink": {
        "nodes": [
            {
                "host": "",
                "port": 0,
                "region": "",
                "portWS": 0
            }
        ]
    },
    "webhookServer": {
        "host": "",
        "port": 0
    },
    "options": {
        "dev": true,
        "developers": [],
        "owners": [],
        "prefix": "",
        "helpCommand": {
            "title": "",
            "message": "",
            "footer": ""
        },
        "patreonCampaignID": "",
        "featureRequestChannel": "",
        "spamReportChannel": "",
        "donorPerksChannel": "",
        "errorChannel": ""
    }
}
}
```

# webhook tokens

You can obtain the webhook id by looking at its link, the number after https://discord.com/api/webhooks/ is the id, and the part after that is the token.

to create a webhook simply go to channel settings and create new webhook

# Secrets.json
```json
{
    "bot": {
        "token": "your bot token here"
    },
    "memerServices": {
        "imgenKey": "",
        "stats": "",
        "endpoints": "",
        "lavalink": "",
        "webhookServer": ""
    },
    "extServices": {
        "giphy": "",
        "boobbot": "",
        "weebsh": "",
        "mashape": "",
        "patreon": "",
        "idiot": ""
    },
    "botlists": [
        {
            "url": "",
            "token": ""
        }
    ]
}
```
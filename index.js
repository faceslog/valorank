const express = require('express');
const { request } = require('undici');
const config = require('./config.json');
const { addRole } = require('./functions/valorant');

const app = express();

app.get('/discord/callback', async (req, res) => {
    
    const code = req.query.code;

    try {

        const tokenResponse = await request('https://discord.com/api/oauth2/token', {
            method: 'POST',
            body: new URLSearchParams({
                client_id: config.clientId,
                client_secret: config.clientSecret,
                code,
                grant_type: 'authorization_code',
                redirect_uri: config.redirectUri,
                scope: 'identify',
            }).toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const oauthData = await tokenResponse.body.json();
        const accessToken = oauthData.access_token;

        const userResponse = await request('https://discord.com/api/users/@me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const userData = await userResponse.body.json();
        const userId = userData.id;
                        
        // Use the access token to fetch the user's connections
        const connectionsResponse = await request('https://discord.com/api/users/@me/connections', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        const connections = await connectionsResponse.body.json();
        
        let name, tag;
        for(let i = 0; i < connections.length; i++) {
            
            if(connections[i].type === 'riotgames') {
                // name#tag
                let fullId = connections[i].name.split('#');

                name = fullId[0];
                tag = fullId[1];         
                break;                                                             
            }
        }
        
        if(name && tag) {
            let valData = await addRole(userId, name, tag);
            res.send(`You can close this page and check discord. ${name}#${tag} - Rank: ${valData.rank}`);
        } else {
            res.status(500).send('Make sure your riot account is linked to discord !');
        }
        
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('An error occurred while processing your request.');
    }
});

app.listen(config.port, () => {
    console.log(`App listening on port: ${config.port}`);
});
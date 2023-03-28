const client = require('../bot');
const HenrikDevValorantAPI = require('unofficial-valorant-api');
const config = require('../config.json');

const VAPI = new HenrikDevValorantAPI();

function removeRole(member) {

    const roleNames = ['iron', 'bronze', 'silver', 'gold', 'platinum', 'diamond', 'ascendant', 'immortal', 'radiant'];
    let userRoles = [];

    member.roles.cache.forEach(role => {
                  
        if (roleNames.some(name => role.name.toLowerCase().includes(name))) {
            userRoles.push(role);
        }
    });

    userRoles.forEach(role => {
        member.roles.remove(role)
    });
}

exports.addRole = async function(userId, name, tag) {

    const guild = await client.guilds.fetch(config.guildId);
    const member = await guild.members.fetch(userId);

    removeRole(member);

    let account = await VAPI.getAccount({ name: name, tag: tag });

    if(account.error)
        throw new Error('An error occured while trying to fetch information about the account');
                                
    let mmr = await VAPI.getMMRHistory({region: account.data.region, name: name, tag: tag });

    if(mmr.error)
        throw new Error('An error occured trying to fetch your rank, please try again later');

    let fullRank = mmr.data[0].currenttierpatched; 
                                                        
    // iron, bronze, silver, gold, platinum, diamond, ascendant, immortal
    let baseRank = fullRank.split(' ')[0].toLowerCase();
    const role = guild.roles.cache.find(role => role.name.toLowerCase().includes(baseRank)); 

    member.roles.add(role);

    return { rank: fullRank, logo: account.data.card.wide, level: account.data.account_level };
}
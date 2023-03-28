const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('remove-rank')
        .setDescription('Remove rank from discord !'),
                        
    async execute(interaction) {

        const roleNames = ['iron', 'bronze', 'silver', 'gold', 'platinum', 'diamond', 'ascendant', 'immortal', 'radiant'];
        let userRoles = [];

        interaction.member.roles.cache.forEach(role => {
          
            if (roleNames.some(name => role.name.toLowerCase().includes(name))) {
              userRoles.push(role);
            }
        });

        userRoles.forEach(role => {
           interaction.member.roles.remove(role)
        });

        await interaction.reply(`Roles removed !`);
    },
};
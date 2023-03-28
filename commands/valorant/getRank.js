const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { oauthUrl } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('get-rank')
        .setDescription('Get your Valorant role'),
                                            
    async execute(interaction) {

        const row = new ActionRowBuilder()
        	.addComponents(
                new ButtonBuilder()
                    .setURL(oauthUrl)
                    .setLabel('Open Oauth Portal')
                    .setStyle(ButtonStyle.Link)
            );

        await interaction.reply({ content: 'Get your valorant role by clicking the button below. Remember you must have your Riot Account linked to your discord profile.', ephemeral: true, components: [row]})
    }
}

                                                    
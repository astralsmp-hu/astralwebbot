const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ]
});

const STAFF = [
  { id: '1340268125563781150', name: 'W3xou',               role: 'Founder' },
  { id: '1152967843214794816', name: 'ZazixBuilder',        role: 'Founder' },
  { id: '1413545469690249412', name: '_Rio_De_Janeiro_',    role: 'Founder' },
  { id: '826034794580279297',  name: 'atkqbk',              role: 'Owner'   },
];

app.get('/api/staff', async (req, res) => {
  try {
    const guild = client.guilds.cache.first();
    if (!guild) return res.status(503).json({ error: 'Bot not ready' });

    const result = await Promise.all(STAFF.map(async (s) => {
      try {
        const member = await guild.members.fetch(s.id);
        const presence = member.presence;
        const status = presence?.status ?? 'offline';
        const avatarURL = member.user.displayAvatarURL({ size: 128, extension: 'png' });
        return { ...s, status, avatarURL };
      } catch {
        return { ...s, status: 'offline', avatarURL: null };
      }
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

client.once('ready', () => {
  console.log(`Bot online: ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API fut: http://localhost:${PORT}`));

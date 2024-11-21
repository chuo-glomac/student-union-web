export default async function sendToDiscord(channelId: string, messageContent: string) {
    const response = await fetch(
      `https://discord.com/api/channels/${channelId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: messageContent,
        }),
      }
    );
  
    const data = await response.json();
    // console.log(data);
  
    return data;
  }
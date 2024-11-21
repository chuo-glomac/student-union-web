"use server";
import fetch from "node-fetch";

const DISCORD_API_BASE_URL = "https://discord.com/api";
const guildId = process.env.DISCORD_GUILD_ID || "";
const categoryId = "1254834575994126338";

export const inviteNewUser = async (roleName: string) => {
  const channelsResponse = await fetch(
    `${DISCORD_API_BASE_URL}/guilds/${guildId}/channels`,
    {
      method: "GET",
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
    }
  );
  const channelsData: any = await channelsResponse.json();

  let category = channelsData.find(
    (c: any) => c.id === categoryId && c.type === 4
  );
  if (!category) {
    throw new Error("Category not found");
  }

  // Create the role
  const rolesResponse = await fetch(
    `${DISCORD_API_BASE_URL}/guilds/${guildId}/roles`,
    {
      method: "GET",
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
    }
  );
  const rolesData: any = await rolesResponse.json();
  let role = rolesData.find((r: any) => r.name === roleName);
  if (!role) {
    role = await createRole(roleName);
  }

  // Create the text channel under the category
  let channel = channelsData.find(
    (c: any) =>
      c.name === roleName && c.type === 0 && c.parent_id === category.id
  );
  if (!channel) {
    channel = await createTextChannel(roleName, category.id, role.id);
  }

  // create invite link
  const { inviteLink } = await createInvite();

  return { inviteLink, role, channel };
};

async function createRole(roleName: string) {
  const response = await fetch(
    `${DISCORD_API_BASE_URL}/guilds/${guildId}/roles`,
    {
      method: "POST",
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: roleName,
        color: 3447003, // Blue color
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create role");
  }

  return response.json();
}

async function createCategory(categoryName: string) {
  const response = await fetch(
    `${DISCORD_API_BASE_URL}/guilds/${guildId}/channels`,
    {
      method: "POST",
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: categoryName,
        type: 4, // Category type
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create category");
  }

  return response.json();
}

async function createTextChannel(
  channelName: string,
  parentId: string,
  roleId: string
) {
  const response = await fetch(
    `${DISCORD_API_BASE_URL}/guilds/${guildId}/channels`,
    {
      method: "POST",
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: channelName,
        type: 0, // Text channel type
        parent_id: parentId,
        permission_overwrites: [
          {
            id: guildId,
            deny: 1024, // Deny VIEW_CHANNEL to everyone
          },
          {
            id: roleId,
            allow: 1024, // Allow VIEW_CHANNEL to the role
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create text channel");
  }

  return response.json();
}

export async function createInvite() {
  const expireDays = 7;

  const url = `https://discord.com/api/v9/channels/${process.env.DISCORD_CHANNEL_ID}/invites`;
  const expireSeconds = 86400 * expireDays;

  const options = {
    method: "POST",
    headers: {
      "Authorization": `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      max_age: expireSeconds,
      max_uses: 1,
      unique: true,
    }),
  };

  const response = await fetch(url, options);
  const data: any = await response.json();
  const { code } = data;
  const inviteLink = `https://discord.gg/${code}`

  return { inviteLink, code };
}

export async function setUserRole(invite_code: string, role: string) {

}

// export async function createRoleAndChannel(roleName: string) {
//   try {
//     const guildId = process.env.DISCORD_GUILD_ID || '';
//     const categoryId = '1254834575994126338';

//     const guild = client.guilds.cache.get(guildId);
//     if (!guild) {
//       throw new Error('Guild not found');
//     }

//     // Check if the role exists, if not, create it
//     let role = guild.roles.cache.find((r: any) => r.name === roleName);
//     if (!role) {
//       role = await guild.roles.create({
//         name: roleName,
//         // color: 'BLUE',
//       });
//     }

//     const category = guild.channels.cache.find((c: any) => c.id === categoryId && c.type === 'GUILD_CATEGORY');
//     if (!category ) {
//       throw new Error('Category not found or not a category');
//     }

//     // Check if the channel exists, if not, create it
//     let channel = guild.channels.cache.find((c: any) => c.name === roleName && c.type === 'GUILD_TEXT' && c.parentId === category.id);
//     if (!channel) {
//       channel = await guild.channels.create(roleName, {
//         type: 'GUILD_TEXT',
//         parent: category.id,
//         permissionOverwrites: [
//           {
//             id: role.id,
//             allow: ['VIEW_CHANNEL'],
//           },
//         ],
//       });
//     }

//     return { role, channel };
//   } catch (error) {
//     console.error('Error handling role and channel:', error);
//     throw error;
//   }
// }

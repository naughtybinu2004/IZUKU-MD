const moment = require('moment-timezone');
const { fetchJson, cmd, tlang, sleep } = require('../lib');
let gis = require("async-g-i-s");
const axios = require('axios');
const fetch = require('node-fetch');
const { Config, prefix } = require('../lib');

// Dictionary to store conversation state
const conversationState = {};

const triggerKeywords = ['send', 'sent', 'give', 'evhn', 'evpn', 'dpn', 'evpnko', 'dpn', 'evannako', 'එවහන්', 'එවපන්', 'දාපම්', 'දාපන්කො', 'එවනො', 'එව​කො'];

cmd({ on: "text" }, async (Void, citel) => {
  if (citel.text && !citel.isGroup) {
    // Check if the text includes any of the trigger keywords
    const isTriggered = triggerKeywords.some(keyword => citel.text.toLowerCase().includes(keyword));

    if (isTriggered) {
      try {
        const quotedMessage = citel.msg.contextInfo.quotedMessage;

        if (quotedMessage) {
          // Check if it's an image
          if (quotedMessage.imageMessage) {
            let caption = quotedMessage.imageMessage.caption || '';
            let mediaUrl = await Void.downloadAndSaveMediaMessage(quotedMessage.imageMessage);
            await Void.sendMessage(citel.chat, { image: { url: mediaUrl }, caption: caption });
          }

          // Check if it's a video
          if (quotedMessage.videoMessage) {
            let caption = quotedMessage.videoMessage.caption || '';
            let mediaUrl = await Void.downloadAndSaveMediaMessage(quotedMessage.videoMessage);
            await Void.sendMessage(citel.chat, { video: { url: mediaUrl }, caption: caption });
          }
        }
      } catch (error) {
        console.log("Error:", error);
      }
    }
  }
});

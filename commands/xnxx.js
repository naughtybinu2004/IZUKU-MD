const moment = require('moment-timezone');
const { fetchJson, cmd, tlang } = require('../lib');
let gis = require("async-g-i-s");
const axios = require('axios');
const fetch = require('node-fetch');
const { Config, prefix } = require('../lib');

const apiUrl = 'https://raganork-network.vercel.app/api/xvideos/search';
const downloadApiUrl = 'https://raganork-network.vercel.app/api/xvideos/download';

// Dictionary to store conversation state
const conversationState = {};

// Specific number to allow
const allowedNumber = '94719838879@s.whatsapp.net';

// Command definition
cmd({
    pattern: "xnxx",
    category: "search",
    desc: "Sends image of asked Movie/Series.",
    use: '<text>',
    react: '🍌',
    filename: __filename,
},
async (Void, citel, text) => {
    // Check if the sender's number matches the allowed number
    if (citel.sender !== allowedNumber) {
        return await citel.reply("You are not authorized to use this command.");
    }

    try {
        const searchApiUrl = apiUrl + '?query=' + encodeURIComponent(text);
        const searchResponse = await axios.get(searchApiUrl);

        const movies = searchResponse.data.result;

        if (movies.length > 0) {
            const movieResultsText = movies.map((movie, index) => `${index + 1}. Title: ${movie.title}\n⏰ Duration: ${movie.duration}\n`).join('\n');

            // Send the menu message and store the search result in the conversation state
            const menuMessage = await citel.reply("Here are the search results for '" + text + "' 👇\n\n" + movieResultsText);
            conversationState[citel.sender] = { menuMessageKey: menuMessage.key, movies };

        } else {
            await citel.reply("No results found for '" + text + "'. Please try a different search term.");
        }
    } catch (error) {
        console.error("Error fetching movies:", error);
        await citel.reply("Error!! Unable to fetch movie information. Please try again later.");
    }
});

cmd({ on: "text" }, async (Void, citel) => {
    // Check if the sender's number matches the allowed number
    if (citel.sender !== allowedNumber) {
        return;
    }

    if (citel.quoted && citel.quoted.text && citel.quoted.text.includes("Here are the search results for")) {
        const number = parseInt(citel.text);

        if (!isNaN(number) && number >= 1) {
            try {
                const { movies, menuMessageKey } = conversationState[citel.sender];

                if (movies && number <= movies.length) {
                    const selectedMovie = movies[number - 1];
                    const downloadApiUrlWithUrlParam = downloadApiUrl + '?url=' + encodeURIComponent(selectedMovie.url);

                    const downloadResponse = await axios.get(downloadApiUrlWithUrlParam);
                    const videoUrl = downloadResponse.data.url;

                    if (videoUrl) {
                        // Customize the caption as needed
                        const caption = "powered by nbmods";

                        // Send the video as a reply
                        let buttonMessage = {
                            video: { url: videoUrl },
                            mimetype: 'video/mp4',
                            fileName: 'downloadedVideo.mp4',
                            caption: caption,
                            headerType: 4,
                        };

                        // Send the message as a reply to the original message
                        await Void.sendMessage(citel.chat, buttonMessage, { quoted: citel });

                        // Delete the menu message
                        await Void.sendMessage(citel.chat, { delete: menuMessageKey });
                    } else {
                        await citel.reply("Error!! Unable to fetch video information. Please try again later.");
                    }

                    // Clear the conversation state after sending the video
                    delete conversationState[citel.sender];
                } else {
                    await citel.reply("Invalid menu number. Please select a number from the menu.");
                }
            } catch (error) {
                console.error("Error fetching video:", error);
                await citel.reply("Error!! Unable to fetch video information. Please try again later.");
            }
        }
    }
});

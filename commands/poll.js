const Secktor = require('../lib');

Secktor.cmd({
    pattern: "poll",
    desc: "Send a poll",
    category: "general",
    filename: __filename,
},
async (Void, citel) => {
    // Poll question and options
    const question = "Test Poll";
    const options = ["Option 1", "Option 2"];

    // Construct the poll message
    const pollMessage = `*Poll:* ${question}\n\n${options.map((option, index) => `*${index + 1}.* ${option}`).join("\n")}`;

    // Send the poll message
    return await Void.sendMessage(citel.chat, { text: pollMessage });
});

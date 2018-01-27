const { get } = require("snekfetch");
const MessageBuilder = require("../modules/MessageBuilder");
const permCheck = require("../modules/permChecker");

module.exports = async(client, msg, suffix) => {
	let account;
	try {
		account = await Accounts.findOne({ _id: msg.author.id });
		if (!account) throw new Error("Lol you dont have an account");
	} catch (err) {
		account = await Accounts.create(new Accounts({ _id: msg.author.id, balance: 0 }));
		msg.reply("You don't have an account created... Creating an account for you! Please also read for information on payment: <http://discordtel.readthedocs.io/en/latest/Payment/>");
	}
	if (account.dailyclaim) {
		return msg.reply("You already claimed your daily credits!");
	}
	let perms = await permCheck(client, msg.author.id);
	let toGive = 120;
	if (perms.boss) {
		toGive = 250;
	} else if (perms.support) {
		toGive = 200;
	}
	if (!toGive) {
		let snekres;
		try {
			snekres = await get("https://discordbots.org/api/bots/377609965554237453/votes?onlyids=true").set({ "content-type": "application/json", Authorization: process.env.DBL_ORG_TOKEN });
		} catch (err) {
			msg.reply("Could not reach discordbots.org. Please try again later");
		}
		if (snekres) {
			if (snekres.body.includes(msg.author.id)) {
				if (perms.support) {
					toGive = 190;
				} else {
					toGive = 180;
				}
			}
		}
	}
	if (toGive) {
		account.balance += toGive;
		await account.save();
		await client.api.channels.get(process.env.LOGSCHANNEL).messages.post(MessageBuilder({
			content: `:calendar: ${msg.author.tag} (${msg.author.id}) claimed ${toGive} daily credits.`,
		}));
	} else {
		msg.reply("Catastrophic Failure");
	}
};

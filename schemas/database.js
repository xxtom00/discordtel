const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const serverSchema = require("./ServerSchema");
const fouroneoneSchema = require("./fouroneoneSchema");
const numberSchema = require("./numberSchema");
const callSchema = require("./callSchema");
const phonebookSchema = require("./phonebookSchema");
const accountSchema = require("./accountSchema");
const mailboxSchema = require("./mailboxSchema");
const addToGlobal = (name, val) => {
	global[name] = val;
};
exports.initialize = url => new Promise((resolve, reject) => {
	mongoose.connect(url, {
		useMongoClient: true,
		promiseLibrary: global.Promise,
	});
	const [
		Servers,
		Fouroneone,
		Numbers,
		Calls,
		Phonebook,
		Accounts,
		Mailbox,
	] = [
		mongoose.model("servers", serverSchema),
		mongoose.model("fouroneone", fouroneoneSchema),
		mongoose.model("numbers", numberSchema),
		mongoose.model("calls", callSchema),
		mongoose.model("phonebook", phonebookSchema),
		mongoose.model("accounts", accountSchema),
		mongoose.model("mailbox", mailboxSchema),
	];
	mongoose.connection
		.on("error", err => reject(err))
		.once("open", () => {
			addToGlobal("Servers", Servers);
			addToGlobal("Fouroneone", Fouroneone);
			addToGlobal("Numbers", Numbers);
			addToGlobal("Calls", Calls);
			addToGlobal("Phonebook", Phonebook);
			addToGlobal("Accounts", Accounts);
			addToGlobal("Mailbox", Mailbox);
			addToGlobal("Database", {
				Servers, servers: Servers,
				Fouroneone, fouroneone: Fouroneone,
				Numbers, numbers: Numbers,
				Calls, calls: Calls,
				Phonebook, phonebook: Phonebook,
				Accounts, accounts: Accounts,
				Mailbox, mailbox: Mailbox,
				Raw: mongoose.connection,
			});
			resolve(global.Database);
		});
});

exports.get = exports.getConnection = () => global.Database;

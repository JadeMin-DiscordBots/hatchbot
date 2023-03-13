import userCTXM from "./context_menu/user/*.jsx";
import messageCTXM from "./context_menu/message/*.jsx";
import slashCMD from "./slash/*.jsx";
//const slash_commands = require("./slash/*.jsx");
const exports = {
	userCommands: {},
	messageCommands: {},
	commands: {}
};
const pushCommand = (type, exported) => {
	const [key, value] = [
		Object.keys(exported.default)[0],
		Object.values(exported.default)[0]
	];
	exports[type][key] = value;
};


userCTXM.forEach(exported => {
	pushCommand('userCommands', exported);
});
messageCTXM.forEach(exported => {
	pushCommand('messageCommands', exported);
});
slashCMD.forEach(exported => {
	pushCommand('commands', exported);
});
/*slash_commands.default.forEach((cmdCallback, index) => {
	const commandName = slash_commands.filenames[index].replace(/.*\/(.*)\.jsx$/gi, '$1');
	exports.commands[commandName] = cmdCallback.default;
});*/

export default exports;
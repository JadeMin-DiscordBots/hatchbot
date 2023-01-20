import ctxmMessage from "./context_menu/message/*.jsx";
import ctxmUser from "./context_menu/user/*.jsx";
const slash_commands = require(`./slash/*.jsx`);
let exports = {
	userCommands: {},
	messageCommands: {},
	commands: {}
};
const pushCommands = (cmdCallback, propName) => {
	const [key, value] = [
		Object.keys(cmdCallback.default)[0],
		Object.values(cmdCallback.default)[0]
	];
	exports[propName][key] = value;
};


ctxmUser.forEach(cmdCallback => {
	pushCommands(cmdCallback, 'userCommands');
});
ctxmMessage.forEach(cmdCallback => {
	pushCommands(cmdCallback, 'messageCommands');
});
slash_commands.default.forEach((cmdCallback, index) => {
	const commandName = slash_commands.filenames[index].replace(/.*\/(.*)\.jsx$/gi, '$1');
	exports.commands[commandName] = cmdCallback.default;
});

export default exports;
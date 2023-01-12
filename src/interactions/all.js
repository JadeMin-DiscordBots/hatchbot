import ctxmMessage from "./context_menu/message/*.jsx";
import ctxmUser from "./context_menu/user/*.jsx";
const slash_commands = require(`./slash/*.jsx`);
let result = {
	commands: {},
	userCommands: {},
	messageCommands: {}
};
const pushCommands = (callback, propName) => {
	const [key, value] = [
		Object.keys(callback.default)[0],
		Object.values(callback.default)[0]
	];
	result[propName][key] = value;
};


ctxmUser.forEach(callback => {
	pushCommands(callback, 'userCommands');
});
ctxmMessage.forEach(callback => {
	pushCommands(callback, 'messageCommands');
});
slash_commands.default.forEach((callback, index) => {
	const commandName = slash_commands.filenames[index].replace(/.*\/([가-힣a-z]*)\.jsx$/gi, '$1');
	result.commands[commandName] = callback.default;
});

export default result;
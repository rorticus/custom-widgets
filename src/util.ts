export function toggleThemeClasses(classes: any, on: boolean) {
	return Object.keys(classes).reduce((classes: any, className) => {
		classes[className] = on;
		return classes;
	}, {});
}
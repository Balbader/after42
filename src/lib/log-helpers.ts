export function message(message: string) {
	console.log('\u001B[32m%s\u001B[0m', message);
}

export function log(message: string, data: unknown) {
	console.log('\u001B[33m%s\u001B[0m', message, data);
}

export function logError(message: string, data: unknown) {
	console.log('\u001B[31m%s\u001B[0m', message, data);
}

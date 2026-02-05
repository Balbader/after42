export const message = (message: string) => {
  console.log('\u001B[32m%s\u001B[0m', message);
};

export const log = (message: string, data: any) => {
  console.log('\u001B[33m%s\u001B[0m', message, data);
};

export const logError = (message: string, data: any) => {
  console.log('\u001B[31m%s\u001B[0m', message, data);
};

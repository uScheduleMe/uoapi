export interface ErrorMessenger {
  messages: string[];
  is_log: boolean;
  prefix?: string;
}

export const newErrorMessenger = (is_log: boolean = false, prefix?: string): ErrorMessenger => {
  return {
    messages: [],
    is_log,
    prefix,
  };
};

export const logError = (messenger: ErrorMessenger, message: string): void => {
  let error_message: string = message;
  if (messenger.prefix) {
    error_message = messenger.prefix.concat(message);
  }

  messenger.messages.push(error_message);
  console.log(error_message);
};

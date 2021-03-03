import config from "config";

export const jwtSecret = (): string => config.get("jwtSecret");

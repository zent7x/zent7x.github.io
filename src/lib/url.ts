// "/" in production; "/pr-preview/pr-N/" when a pull request preview is built.
export const base = import.meta.env.BASE_URL;

export const href = (path: string) => base + path.replace(/^\//, "");

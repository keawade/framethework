export const loiter = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

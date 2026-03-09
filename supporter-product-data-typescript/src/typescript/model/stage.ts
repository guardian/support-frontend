export type Stage = "CODE" | "PROD";

export const stageFromEnvironment = (): Stage => {
  const stage = process.env.STAGE;
  if (stage !== "CODE" && stage !== "PROD") {
    throw new Error("STAGE must be set to CODE or PROD");
  }
  return stage;
};

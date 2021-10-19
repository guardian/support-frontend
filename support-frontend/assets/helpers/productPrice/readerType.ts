const Direct: "Direct" = 'Direct';
const Gift: "Gift" = 'Gift';
const Corporate: "Corporate" = 'Corporate';
export type ReaderType = typeof Direct | typeof Gift | typeof Corporate;
export { Direct, Gift, Corporate };
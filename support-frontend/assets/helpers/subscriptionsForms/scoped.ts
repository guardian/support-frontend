export type DefaultScope = string;
export type Scoped<Scope = DefaultScope> = {
	scope: Scope;
};

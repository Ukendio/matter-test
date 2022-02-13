import { component } from "@rbxts/matter";

export const Renderable = component<{ model: Model }>();
export type Renderable = ReturnType<typeof Renderable>;

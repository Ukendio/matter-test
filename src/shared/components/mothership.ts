import { component } from "@rbxts/matter";

export const Mothership = component<{ goal: Vector3; next_goal: Vector3; lasered: boolean }>();
export type Mothership = ReturnType<typeof Mothership>;

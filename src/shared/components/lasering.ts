import { component } from "@rbxts/matter";

export const Lasering = component<{ remaining_time: number; spawned?: boolean }>();
export type Lasering = ReturnType<typeof Lasering>;

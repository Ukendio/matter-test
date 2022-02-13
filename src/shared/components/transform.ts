import { component } from "@rbxts/matter";

export const Transform = component<{ cf: CFrame; do_not_reconcile?: boolean }>();
export type Transform = ReturnType<typeof Transform>;

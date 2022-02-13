import { useEvent, World } from "@rbxts/matter";
import { Workspace } from "@rbxts/services";
import { Renderable } from "shared/components/renderable";
import { Roomba } from "shared/components/roomba";

export function RoombasHurt(world: World): void {
	for (const [id, roomba, { model }] of world.query(Roomba, Renderable)) {
		for (const [_, part] of useEvent(model.PrimaryPart!, "Touched")) {
			const touched_model = part.FindFirstAncestorWhichIsA("Model");

			if (!touched_model) return;

			const humanoid = touched_model.FindFirstChildWhichIsA("Humanoid");

			if (!humanoid) return;

			humanoid.TakeDamage(5);
		}
	}
}

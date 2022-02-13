import { useEvent, World } from "@rbxts/matter";
import { Players } from "@rbxts/services";
import { Renderable } from "shared/components/renderable";
import { Target } from "shared/components/target";

export function PlayersAreTargets(world: World): void {
	Players.GetPlayers().forEach((player) => {
		for (const [_, character] of useEvent(player, "CharacterAdded")) {
			world.spawn(Target(), Renderable({ model: character }));
		}

		for (const [id] of world.query(Target).without(Renderable)) {
			world.despawn(id);
		}
	});
}

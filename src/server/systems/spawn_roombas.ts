import { World } from "@rbxts/matter";
import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { Renderable } from "shared/components/renderable";
import { Roomba } from "shared/components/roomba";
import { Transform } from "shared/components/transform";

export function SpawnRoombas(world: World): void {
	for (const [id, _] of world.query(Transform, Roomba).without(Renderable)) {
		const model = ReplicatedStorage.Assets.KillerRoomba.Clone();
		model.Parent = Workspace;
		model.PrimaryPart?.SetNetworkOwner(undefined);

		world.insert(id, Renderable({ model }));
	}
}

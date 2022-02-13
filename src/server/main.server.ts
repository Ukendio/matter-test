import { AnyComponent, AnyEntity, Loop, World } from "@rbxts/matter";
import { CollectionService, RunService } from "@rbxts/services";
import { Bind } from "shared/components/bind";
import { Spinner } from "shared/components/spinner";
import { Transform } from "shared/components/transform";
import { MothershipsSpawnRoombas } from "./systems/motherships_spawn_roombas";
import { PlayersAreTargets } from "./systems/players_are_targets";
import { RemoveMissingModels } from "./systems/remove_missing_models";
import { RoombasHurt } from "./systems/roombas_hurt";
import { RoombasMove } from "./systems/roombas_move";
import { SpawnMotherships } from "./systems/spawn_motherships";
import { SpawnRoombas } from "./systems/spawn_roombas";
import UpdateTransforms from "./systems/update_transforms";

export interface GlobalState {}

const world = new World();
const state = identity<GlobalState>({});

const loop = new Loop(world, state);
loop.scheduleSystems([
	MothershipsSpawnRoombas,
	PlayersAreTargets,
	RemoveMissingModels,
	RoombasHurt,
	RoombasMove,
	SpawnMotherships,
	SpawnRoombas,
	UpdateTransforms,
]);

loop.begin({
	default: RunService.Heartbeat,
	RenderStepped: RunService.RenderStepped,
});

const bound_tags = {
	Spinner: Spinner,
};

function spawn_bound(instance: Instance, component: () => AnyComponent) {
	const id = world.spawn(component(), Bind({ instance }), Transform({ cf: (instance as BasePart).CFrame }));
	print(instance);

	instance.SetAttribute("entityId", id);
}

for (const [tag, component] of pairs(bound_tags)) {
	CollectionService.GetTagged(tag).forEach((instance) => spawn_bound(instance, component));

	CollectionService.GetInstanceAddedSignal(tag).Connect((instance) => {
		spawn_bound(instance, component);
	});

	CollectionService.GetInstanceRemovedSignal(tag).Connect((instance) => {
		const id = instance.GetAttribute("entityId") as AnyEntity;

		if (id !== undefined) {
			world.despawn(id);
		}
	});
}

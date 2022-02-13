import { useThrottle, World } from "@rbxts/matter";
import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { Lasering } from "shared/components/lasering";
import { Mothership } from "shared/components/mothership";
import { Renderable } from "shared/components/renderable";
import { Transform } from "shared/components/transform";

export function SpawnMotherships(world: World): void {
	if (useThrottle(10)) {
		const origin = Vector3.one.mul(500);
		const spawn_pos = origin.mul(
			new Vector3(math.random(1, 2) === 1 ? 1 : -1, 1, math.random(1, 2) === 1 ? 1 : -1),
		);

		const despawn_pos = origin.mul(
			new Vector3(math.random(1, 2) === 1 ? 1 : -1, 1, math.random(1, 2) === 1 ? 1 : -1),
		);

		const goal_pos = new Vector3(math.random(-100, 100), 100, math.random(-100, 100));

		world.spawn(
			Mothership({
				goal: goal_pos,
				next_goal: despawn_pos,
				lasered: false,
			}),
			Transform({ cf: new CFrame(spawn_pos) }),
		);
	}

	for (const [id] of world.query(Transform, Mothership).without(Renderable)) {
		const model = ReplicatedStorage.Assets.Mothership.Clone();
		model.Parent = Workspace;
		model.PrimaryPart?.SetNetworkOwner(undefined!);

		world.insert(id, Renderable({ model }));
	}

	for (const [id, mothership, transform] of world.query(Mothership, Transform).without(Lasering)) {
		if (transform.cf.Position.sub(mothership.goal).Magnitude < 10) {
			if (mothership.lasered) {
				world.despawn(id);
			} else {
				world.insert(
					id,
					mothership.patch({ goal: mothership.next_goal, lasered: true }),
					Lasering({ remaining_time: 1 }),
				);
			}
		}
	}

	for (const [id, mothership, { model }] of world.query(Mothership, Renderable).without(Lasering)) {
		(model as IMothership).Roomba.AlignPosition.Position = mothership.goal;
	}
}

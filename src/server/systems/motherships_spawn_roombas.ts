import { useDeltaTime, World } from "@rbxts/matter";
import { Charge } from "shared/components/charge";
import { Lasering } from "shared/components/lasering";
import { Mothership } from "shared/components/mothership";
import { Renderable } from "shared/components/renderable";
import { Roomba } from "shared/components/roomba";
import { Transform } from "shared/components/transform";

export function MothershipsSpawnRoombas(world: World): void {
	for (const [id, model, lasering, transform] of world.query(Renderable, Lasering, Transform, Mothership)) {
		(model.model as IMothership).Beam.Transparency = 1 - lasering.remaining_time;

		let new_lasering = lasering.patch({
			remaining_time: lasering.remaining_time - useDeltaTime(),
		});

		if (!lasering.spawned) {
			const spawn_pos = new Vector3(transform.cf.Position.X, 11, transform.cf.Position.Z);

			world.spawn(Roomba(), Charge({ charge: 100 }), Transform({ cf: new CFrame(spawn_pos) }));

			new_lasering = lasering.patch({ spawned: true });
		}

		if (new_lasering.remaining_time <= 0) {
			world.remove(id, Lasering);
		}

		world.insert(id, new_lasering);
	}
}

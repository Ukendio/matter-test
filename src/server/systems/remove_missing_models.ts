import { useEvent, World } from "@rbxts/matter";
import { Renderable } from "shared/components/renderable";

export function RemoveMissingModels(world: World): void {
	for (const [id, { model }] of world.query(Renderable)) {
		for (const [_] of useEvent(model, "AncestryChanged")) {
			if (model.IsDescendantOf(game) === false) {
				world.remove(id, Renderable);
				break;
			}
		}

		if (!model.PrimaryPart) {
			world.remove(id, Renderable);
		}
	}

	for (const [_, model_record] of world.queryChanged(Renderable)) {
		if (model_record.new === undefined) {
			if (model_record.old && model_record.old.model) {
				model_record.old.model.Destroy();
			}
		}
	}
}

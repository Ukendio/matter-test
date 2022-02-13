import { World } from "@rbxts/matter";
import { Renderable } from "shared/components/renderable";
import { Transform } from "shared/components/transform";
import { RemoveMissingModels } from "./remove_missing_models";

function UpdateTransforms(world: World): void {
	for (const [_, transform_record, { model }] of world.queryChanged(Transform, Renderable)) {
		if (transform_record.new && !transform_record.new.do_not_reconcile) {
			model.SetPrimaryPartCFrame(transform_record.new.cf);
		}
	}

	for (const [_, model_record, transform] of world.queryChanged(Renderable, Transform)) {
		if (model_record.new) {
			model_record.new.model.SetPrimaryPartCFrame(transform.cf);
		}
	}

	for (const [id, { model }, transform] of world.query(Renderable, Transform)) {
		if (model.PrimaryPart?.Anchored) continue;

		const existing_cf = transform.cf;
		const current_cf = model.PrimaryPart!.CFrame;

		if (current_cf !== existing_cf) {
			world.insert(id, Transform({ cf: current_cf, do_not_reconcile: true }));
		}
	}
}

export = { system: UpdateTransforms, after: [RemoveMissingModels] };

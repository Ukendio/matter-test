import { World } from "@rbxts/matter";
import { Vec } from "@rbxts/rust-classes";
import { Charge } from "shared/components/charge";
import { Renderable } from "shared/components/renderable";
import { Roomba } from "shared/components/roomba";
import { Target } from "shared/components/target";

export function RoombasMove(world: World): void {
	const targets = Vec.vec<Vector3>();

	for (const [_, { model }] of world.query(Renderable, Target)) {
		targets.push(model.GetPrimaryPartCFrame().Position);
	}

	for (const [id, roomba, charge, render] of world.query(Roomba, Charge, Renderable)) {
		if (charge.charge <= 0) continue;

		let closest_position = undefined! as Vector3;
		let closest_distance = undefined! as number;

		const model = render.model as KillerRoomba;

		const current_position = model.GetPrimaryPartCFrame().Position;

		targets.iter().forEach((target) => {
			const distance = current_position.sub(target).Magnitude;

			if (!closest_position || distance < closest_distance) {
				closest_position = target;
				closest_distance = distance;
			}
		});

		if (closest_position) {
			const body = model.Roomba;
			let force = body.GetMass() * 20;

			if (closest_distance < 4) {
				force = 0;
			}

			const look_vector = body.CFrame.LookVector;
			const desired_look_vector = closest_position.sub(current_position).Unit;

			force = force * look_vector.Dot(desired_look_vector);
			body.VectorForce.Force = new Vector3(force, 0, 0);

			const abs_angle = math.atan2(desired_look_vector.Z, desired_look_vector.X);
			const roomba_angle = math.atan2(look_vector.Z, look_vector.X);

			let angle = math.deg(abs_angle - roomba_angle);
			angle = angle % 360;
			angle = (angle + 360) % 360;

			if (angle > 180) {
				angle -= 360;
			}

			const angular_vel = body.AssemblyAngularVelocity;

			const sign = math.sign(angle);
			const motor = math.sqrt(math.abs(angle)) * sign * -1 * 20;
			const friction = angular_vel.Y * -12;
			const torque = body.GetMass() * (motor + friction);

			body.Torque.Torque = new Vector3(0, torque, 0);
		}
	}
}

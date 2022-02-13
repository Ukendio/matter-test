declare type Battery = Model & { Part: Part };

declare type KillerRoomba = Model & {
	Knife: MeshPart;
	Roomba: MeshPart & {
		Attachment0: Attachment;
		Torque: Torque;
		VectorForce: VectorForce;
		WeldConstraint: WeldConstraint;
	};
};

declare type IMothership = Model & {
	Roomba: MeshPart & {
		Attachment0: Attachment;
		WeldConstraint: WeldConstraint;
		AlignPosition: AlignPosition;
	};
	Beam: Part;
};

interface ReplicatedStorage extends Instance {
	Assets: Folder & {
		Battery: Battery;
		KillerRoomba: KillerRoomba;
		Mothership: IMothership;
	};
}

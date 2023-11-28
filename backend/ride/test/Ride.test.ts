import Position from "../src/domain/Position";
import Ride from "../src/domain/Ride";

test("Deve testar uma ride", function () {
	const ride = Ride.create("", 0, 0, 0, 0);
	ride.accept("");
	ride.start();
	const position1 = Position.create("", -27.584905257808835, -48.545022195325124);
	ride.updatePosition(position1);
	const position2 = Position.create("", -27.496887588317275, -48.522234807851476);
	ride.updatePosition(position2);
	ride.finish();
	expect(ride.getDistance()).toBe(10);
	expect(ride.getFare()).toBe(21);
});

export default interface FareCalculator {
	calculate (distance: number): number;
}

export class NormalFareCalculator implements FareCalculator {
	FARE = 2.1;

	calculate(distance: number): number {
		return distance * this.FARE;
	}

}

export class OvernightFareCalculator implements FareCalculator {
	FARE = 5;

	calculate(distance: number): number {
		return distance * this.FARE;
	}

}

export class FareCalculatorFactory {
	static create (date: Date) {
		if (date.getHours() >= 8 && date.getHours() <= 22) return new NormalFareCalculator();
		return new OvernightFareCalculator();
	}
}

import Name from "../src/domain/Name";

// solitary
test("Deve testar um nome válido", function () {
	const name = new Name("John Doe");
	expect(name.value).toBe("John Doe");
});

test("Deve testar um nome inválido", function () {
	expect(() => new Name("John")).toThrow(new Error("Invalid name"));
});

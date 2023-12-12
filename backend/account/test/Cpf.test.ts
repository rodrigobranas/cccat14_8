import Cpf from "../src/domain/Cpf";

test.each([
	"97456321558",
	"71428793860",
	"87748248800"
])("Deve testar cpfs válidos", function (cpf: string) {
	expect(new Cpf(cpf)).toBeDefined();
});

test.each([
	"",
	undefined,
	null,
	"11111111111",
	"111",
	"11111111111111"
])("Deve testar cpfs inválidos", function (cpf: any) {
	expect(() => new Cpf(cpf)).toThrow(new Error("Invalid cpf"));
});

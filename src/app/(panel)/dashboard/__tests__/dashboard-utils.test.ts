import { totalItens, GroupWithItem } from "../dashboard-utils";

describe("totalItens", () => {
  it("retorna 0 para grupo vazio", () => {
    const group: GroupWithItem = [];
    expect(totalItens(group)).toBe(0);
  });

  it("retorna a soma dos itens de todos os grupos", () => {
    const group: GroupWithItem = [
      { item: [{ id: "1" }, { id: "2" }] },
      { item: [{ id: "3" }] },
    ] as GroupWithItem;
    expect(totalItens(group)).toBe(3);
  });

  it("retorna 0 se todos os grupos não têm itens", () => {
    const group: GroupWithItem = [
      { item: [] },
      { item: [] },
    ] as unknown as GroupWithItem;
    expect(totalItens(group)).toBe(0);
  });
});



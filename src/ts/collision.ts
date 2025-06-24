import * as ex from "excalibur";

enum Category {
    Ground = 0b0000_0001,
    Player = 0b0000_0010,
    Item = 0b0000_0100,
    Finish = 0b0000_1000,
    Fire = 0b0001_0000,
}

export const CollisionGroup = {
    Ground: new ex.CollisionGroup(
        "ground",
        Category.Ground,
        collideWith(Category.Player),
    ),
    Player: new ex.CollisionGroup(
        "player",
        Category.Player,
        collideWith(
            Category.Ground,
            Category.Finish,
            Category.Fire
        ),
    ),
    Item: new ex.CollisionGroup(
        "item",
        Category.Item,
        collideWith(Category.Player),
    ),
    Finish: new ex.CollisionGroup(
        "finish",
        Category.Finish,
        collideWith(Category.Player)
    ),
    Fire: new ex.CollisionGroup(
        "fire",
        Category.Fire,
        collideWith(Category.Player)
    ),
};

function collideWith(...categories: Category[]) {
    return categories.reduce((acc, cat) => acc | cat, 0);
}
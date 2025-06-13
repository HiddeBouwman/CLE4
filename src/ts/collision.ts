import * as ex from "excalibur";

enum Category {
    Ground = 0b0000_0001,
    Player = 0b0000_0010,
    Item = 0b0000_0100,
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
        ),
    ),
    Item: new ex.CollisionGroup(
        "item",
        Category.Item,
        collideWith(Category.Player),
    ),
};

function collideWith(...categories: Category[]) {
    return categories.reduce((acc, cat) => acc | cat, 0);
}

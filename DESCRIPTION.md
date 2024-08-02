## Types Design
```
- Actor: Stores information about a player or an enemy, including ID, name, class, health, abilities, inventory, passive abilities, and active effects.
export type Actor = {
    id: string;
    name: string;
    class: "mage" | "rogue" | "warrior" | string;
    health: number;
    maxHealth: number;
    abilities: Ability[];
    inventory: Item[];
    passive: PassiveAbility;
    currentEffects: Effect[];
};
```
```
- Ability: Stores information about an ability that can be used in or out of battle, including ID, name, type, effect, and level.
export type Ability = {
    id: string;
    name: string;
    type: "combat" | "non-combat";
    effect: Effect;
    level: number;
};
```
```
- Effect: Stores information about the effects of an ability or item, including ID, name, type, duration, and impact on the target.
export type Effect = {
    id: string;
    name: string;
    type: "poison" | "immobilize" | "weaken" | string;
    duration: number; // in turns
    impact: (target: Actor) => void;
};
```
```
- Item: Stores information about an item that can be used by an actor, including ID, name, and effects.
export type Item = {
    id: string;
    name: string;
    effect: (target: Actor) => void;
};
```
```
- PassiveAbility: Stores information about a passive ability, including ID, name, effect, and level.
export type PassiveAbility = {
    id: string;
    name: string;
    effect: (actor: Actor) => void;
    level: number;
};
```
```
- Battle: Stores information about a battle, including ID, start time, end time, player 1, player 2, whose turn it is, the winner, who fled, and the battle log.
export type Battle = {
    id: string;
    startTime: number;
    endTime?: number;
    player1: Actor;
    player2: Actor;
    whoseTurn: string;
    winner?: string;
    coward?: string;
    log: BattleLogEntry[];
};
```
```
- BattleLogEntry: Stores a log of every action in a battle, including time, actor who performed the action, the action taken, target, result, and completion status.
export type BattleLogEntry = {
    time: Date;
    actor: string;
    action: "attack" | "useAbility" | "useItem" | "flee";
    target: string;
    result: string;
    finished: boolean;
};
```
## Replayed Battle Mechanism

```
This is how to implement a replayed battle so that users can continue from the most recent state and pick up the battle where they left off.
+------------------------------------+
|          Initial State             |
|  - Player1 (health, abilities, etc)|
|  - Player2 (health, abilities, etc)|
+------------------------------------+
                 |
                 v
+------------------------------------+
|            Battle Log              |
|  - Time                            |
|  - Actor (who performs the action) |
|  - Action (attack, ability, etc)   |
|  - Target (who is attacked)        |
|  - Result                          |
|  - Status                          |
+------------------------------------+
                 |
                 v
+------------------------------------+
|         Update Actor State         |
|  - Reduce target's health          |
|  - Add effects                     |
|  - Change turn                     |
+------------------------------------+
                 |
                 v
+------------------------------------+
|        Save State to Database      |
|  - Save battle object              |
|  - Save current state              |
+------------------------------------+
                 |
                 v
+------------------------------------+
|      Reload State from Database    |
|  - Retrieve current state          |
|  - Continue battle                 |
+------------------------------------+
                 |
                 v
+------------------------------------+
|           Battle Replay            |
|  - Read log from the beginning     |
|  - Apply actions to state          |
|  - Final result                    |
+------------------------------------+
```
### Diagram Explanation for Replayed Battle Mechanism
```
- Initial State Setup:
When the battle begins, both actors (players) have an initial state that includes health, abilities, inventory, and ongoing effects.
- Battle Log:
Each action (attack, ability use, fleeing, etc.) is recorded in a log that captures details about the time, the actor performing the action, the type of action, the target, the result, and the status.
- Update Actor State:
After an action occurs, the state of the involved actors is updated. For example, if Player1 attacks Player2, Player2’s health decreases.
- Save State to Database:
The latest state of the battle and actors is saved to the database or storage after each action. This ensures that the state can be restored if the page is refreshed or the player logs in again.
- Reload State from Database:
When the page is refreshed or the player logs in again, the current state is retrieved from the database to continue the battle from the last point.
- Battle Replay:
To replay the battle, the action log is read from the beginning, and each action is applied to the initial state of the actors. This allows us to review the course of the battle.
```

## Game Enchancements:
```
1. New Abilities

- Area of Effect (AoE) Abilities: Abilities that affect more than one target in a single turn. For example, a fire attack that burns all enemies.
- Heal Abilities: Abilities to heal oneself or allies.
- Buff/Debuff Abilities: Abilities that increase (buff) or decrease (debuff) an actor's attributes, such as increasing attack or decreasing the opponent's defense.

2. New Effects
- Damage Over Time (DoT): An effect that deals continuous damage over several turns, such as poison or burn.
- Temporary Shields: An effect that grants a temporary shield that absorbs a certain amount of damage before affecting the actor's health.

3. New Battle Mechanics
- Combo Attacks: Sequential attacks that grant bonuses when performed in a specific order.
- Environmental Factors: Environmental elements that affect combat, such as terrain that provides advantages or disadvantages.

4. Leveling and Progression System
- Skill Trees: Skill trees that allow players to choose the development path for their abilities.
- Experience Points (XP) and Leveling: An XP and level system that increases base attributes and unlocks new abilities.

5. Customization and Inventory
- Equipment and Gear: Wearable items that provide attribute bonuses or additional abilities.
- Consumables: Items that can be used in battle for immediate effects, such as health or mana potions.

6. PvP and PvE Enhancements
- Ranked Matches: A ranked system for PvP battles that provides rewards based on performance.
- Dynamic NPCs: NPCs with varying AI and unique challenges that provide a more engaging PvE experience.
```
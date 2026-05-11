# Sprites Placeholder

This directory contains sprite sequences for pets.

## Structure

```
sprites/
├── cat/
│   ├── idle/      # idle_001.png, idle_002.png, ...
│   ├── happy/
│   ├── sad/
│   ├── eating/
│   ├── sleeping/
│   └── playing/
├── dog/
│   └── ...
└── ...
```

## Creating Sprites

1. Create frames as PNG files (128x128 or 256x256 recommended)
2. Name frames as: `{state}_{number}.png` (e.g., `idle_001.png`)
3. Place in corresponding state folder
4. Recommended 4 frames per animation state at 8fps

## States

- `idle` - Default idle animation
- `happy` - Pet is happy (happiness > 80)
- `sad` - Pet is sad (happiness < 20)
- `eating` - Pet eating
- `sleeping` - Pet sleeping (health < 30)
- `playing` - Pet playing
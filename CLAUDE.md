# CLAUDE.md

使用中文回答

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

Claude Pet 是一个虚拟宠物系统，目前处于**设计阶段**，核心设计文档见 `PET_SYSTEM.md`。

## 设计文档

- [PET_SYSTEM.md](PET_SYSTEM.md) - 宠物系统的完整设计规范

### 关键设计决策

1. **序列帧动画系统**: 宠物由序列帧定义，用户可替换帧文件自定义外观
2. **外观与属性解耦**: 相同的序列帧可应用于不同属性配置的宠物
3. **动作状态**: idle, happy, sad, eating, sleeping, playing

## 开发状态

项目刚刚开始设计，尚未创建实际代码。需要根据 `PET_SYSTEM.md` 规范逐步实现：

1. 先完善设计文档
2. 确定技术栈
3. 创建项目结构
4. 实现序列帧渲染系统
5. 实现宠物属性与交互系统
6. 添加数据持久化

## 目录结构（待创建）

```
pets/
├── src/
│   ├── renderer/      # 序列帧渲染
│   ├── pet/           # 宠物属性与状态
│   ├── interaction/   # 用户交互
│   └── storage/       # 数据持久化
├── assets/
│   └── sprites/       # 序列帧文件目录
└── tests/
```

---
title: CSS
lang: en-US
---

## 概述

属性：

- transform 的各种属性
- bfc
- 布局
- 花式垂直居中
- flex布局
- grid 不u

## clip-path

clip-path 用来创建各种不规则的图形，使用 clip-path 能够完成大部分的多边形或者畸形的弧形等。

- clip-path: circle(40% at 0px 0px);
  <br>
  根据元素的高度判断对应绘制相同比例的原的大小,后面可跟圆心绘制的位置(left,top)，不加位置属性效果很像 border-radios
- clip-path: ellipse(130px 140px at 10% 20%);
  <br>
  绘制宽高比例不相等的圆，ellipse(上边框原型的半径 左边框原型的半径 at 圆心在左上角的偏移值 （left,top）);
- clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
  <br>
  polygon 最常用的属性，使用两个值来表示每一个点（left，top），每两个值确定一个点，多个点确定一个面，最终生成多变图形连接

## SVG

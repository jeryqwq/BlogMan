---
title: 数据结构和算法
lang: en-US
---

## 栈

## 队列

## 链表

### 双向链表

## 树

树是一种分层数据的抽象模型，从树的根节点出发，他有左子节点以及右子节点组成，其左子节点都会比自己的父节点来得小，右子节点相比父节点会来得大,相比我们常见的数组类似，树的结构更有利与查找树中的值以及删除和移动，而数组更方便的访问具体到某个下标元素，删除移动的性能消耗会相比树的代价更大

### 节点

每个节点都有 left 和 right 属性，表明该节点的左子节点和右子节点的指针。

然后我们要实现一些基本的增删改查的方法。

- insert(key) 向树中插入新的键
- search(key)查找到某个节点并返回
- inOrderTraverse(callback) 中序遍历
- prevOrderTraverse(callback) 先序遍历
- postOrderTraverse(callback) 后序遍历
- remover(key) 删除节点
- min() 查找最小值
- max() 查找最大值

```js
// 浏览器脚本开发，使用class对象时无法动态刷新并提示对象已申明，故使用函数来实现
//节点对象
function Node(key) {
  this.key = key
  this.left = null
  this.right = null
}
//树
function Tree(compFn) {
  this.root = null //根结点
  this.count = 0 //节点数量
  this.compFn = compFn //比较函数，可传入自定义比较函数

  this.remove = key => {
    return this.removeNode(this.root, key) //传入根结点进行递归
  }
  this.removeNode = (node, key) => {
    //递归函数查找到要删除的节点
    const result = this.compFn(node.key, key) //目标key与当前node的key进行比较，进行折半查找（二分查找）
    if (result === true) {
      node.right = this.removeNode(node.right, key) //大于当前节点时往右查找并递归
      return node
    }
    if (result === false) {
      node.left = this.removeNode(node.left, key) //同理，小于则向左查找
      return node
    }
    if (result === 1) {
      //执行到此处时已经相等，找到了当前的值的节点
      if (!node.left && !node.right) {
        //如果左子节点和右子节点都不存在则直接删除
        node = null
        return node
      }
      if (node.left && !node.right) {
        //仅有左子节点存在时直接把左子节点网上上移即可
        node = node.left
        return node
      }
      if (!node.left && node.right) {
        // 仅有右子节点时同理
        node = node.right
        return node
      }
      if (node.left && node.right) {
        //左右子节点同时存在时我们只要右子节点下最小的节点的key替换掉就好
        const rightMinNode = this.getMinNode(node.right) //获取到右子节点下最小的节点
        node.key = rightMinNode.key //替换为右子树最小节点的key
        this.removeNode(node, rightMinNode.key) //再删除原有右子树最小节点
        return node
      }
    }
  }
  this.search = key => {
    return this.searchNode(this.root, key)
  }
  this.searchNode = (node, key) => {
    //查询节点
    const result = this.compFn(node.key, key) //目标key与当前node的key进行比较，进行折半查找（二分查找）
    if (result === true) {
      return this.searchNode(node.right, key) //大于当前节点时往右查找并递归
    }
    if (result === false) {
      return this.searchNode(node.left, key) //同理，小于则向左查找
    }
    if (result === 1) {
      //已经找到
      return node
    }
  }
  this.max = () => {
    return this.getMaxNode(this.root)
  }
  this.getMaxNode = node => {
    //最大值，最右侧就是最大值，递归node.right即可
    if (!node.right) {
      return node
    } else {
      return this.getMaxNode(node.right)
    }
  }
  this.min = () => {
    return this.getMinNode(this.root)
  }
  this.getMinNode = node => {
    //最小值同理，最右侧的节点，递归node.left即可
    if (!node.left) {
      return node
    } else {
      return this.getMinNode(node.left)
    }
  }
  this.insert = function(key) {
    //插入节点
    if (this.root) {
      //更节点存在时执行插入
      this.insertNode(this.root, key)
    } else {
      //没有根结点时直接设为根结点
      this.count++
      this.root = new Node(key)
    }
  }
  this.insertNode = function(node, key) {
    //插入节点迭代函数
    if (this.compFn(node.key, key)) {
      //如果插入的节点大于当前node的key
      if (!node.right) {
        //如果node的右子节点没有节点指向时
        node.right = new Node(key) //直接设置为该节点right为插入的节点
        this.count++ //树量+1
      } else {
        this.insertNode(node.right, key) //否则再次递归
      }
    } else {
      if (!node.left) {
        //同理，如果左侧子节点没有指向时插入该节点
        this.count++
        node.left = new Node(key)
      } else {
        this.insertNode(node.left, key) //递归
      }
    }
  }
  this.prevOrderTraverse = function(callback) {
    //先序遍历
    this.root && this.prevOrderTraverseNode(this.root, callback)
  }
  this.prevOrderTraverseNode = function(node, callback) {
    //迭代遍历所有的节点，具体的遍历顺序可百度对应的图片，比较好理解
    callback(node)
    node.left && this.prevOrderTraverseNode(node.left, callback)
    node.right && this.prevOrderTraverseNode(node.right, callback)
  }
  this.inOrderTraverse = function(callback) {
    //中序
    if (this.root) {
      this.inOrderTraverseNode(this.root, callback)
    }
  }
  this.inOrderTraverseNode = function(node, callback) {
    //先序😀迭代遍历所有的节点，具体的遍历顺序可百度对应的图片，比较好理解
    node.left && this.inOrderTraverseNode(node.left, callback)
    callback(node)
    node.right && this.inOrderTraverseNode(node.right, callback)
  }
}

var tree = new Tree((left, rg) => {
  if (left > rg) {
    return false
  } else if (left < rg) {
    return true
  } else {
    return 1
  }
})
tree.insert(1)
tree.insert(2)
tree.insert(3)
tree.insert(4)
tree.insert(5)
tree.insert(-1)
tree.prevOrderTraverse(node => {
  console.log(node)
})
console.log("min", tree.min())
console.log("max", tree.max())
console.log("search", tree.search(4))
console.log("remove", tree.remove(2))
```

### 自平衡(AVL)

普通的二叉搜索树(BST)存在很多问题，想上面的样子，我们就很容易发现，每次按顺序插入比他大一的 key，每次都会插入到节点的右边，而造成左边的深度远远大于右边，这样在执行插入某些特定的值时，就会引发一些性能上多余的消耗，为了解决这个问题，我们规定了 AVL-自平衡二叉搜索树，每个节点的左右两侧的紫薯的深度的差别最多为一，很好的保持的树的平衡性。

AVL 树和普通树插入搜索完全相同，然而不同之处是我们需要检查他的平衡因子，使其在每次操作时自动保持平衡，又引出了几个新的概念

#### 1.节点的高度和平衡因子

节点高度是从任意节点到其最后子节点的最高高度，在 AVL 中我们通过计算其差值来进行对应的树旋转操作，只要是树的高度之间差值为 -2，2 都算是不平衡状态，此时我们需要手动旋转树，将它“平衡”起来，即高度差值为 0。这就是平衡因子的概念了，

计算树节点的高度迭代函数：

```js
this.getNodeHegiht = node => {
  if (!node) {
    return -1
  }
  //使用迭代求出左子节点和右子节点中大的那一个数，即该节点的高度
  return (
    Math.max(this.getNodeHegiht(node.left), this.getNodeHegiht(node.right)) + 1
  )
}
```

#### 2.平衡操作(AVL 旋转)

- LL 左左 -向左单旋转

```js
this.rotationLL = node => {
  const temp = node.left
  node.left = temp.right
  temp.right = node
  node = temp
  return node
}
```

- RR -向右的单旋转

```js
this.rotationRR = node => {
  const temp = node.right
  node.right = temp.left
  temp.left = node
  node = temp
  return node
}
```

- LR 向右的双旋转（先 LL 旋转，再 RR 旋转）

```js
this.rotationLR = node => {
  node.left = this.rotationRR(node.left)
  return this.rotationLL(node)
}
```

- RL 向左的双旋转 （先 RR 旋转，再 LL 选装）

```js
this.rotationRL = node => {
  node.left = this.rotationLL(node.left)
  return this.rotationRR(node)
}
```

#### 3.AVL 修改节点插入函数

AVL 与普通搜索树很多特性是一样的，我们可以先继承搜索树，只要继承二叉搜索树然后修改插入方法即可，主要是在我们插入时检查节点的深度是否满足 AVL 要求，没有满足我们对其做对应的旋转操作。

```js
var BlanceFactor = {
  //判断旋转类型，使用symbol可不用赋值，避免赋值重复造成不必要的错误
  UNBLANCED_RIGHT: Symbol(),
  UNBLANCED_LEFT: Symbol(),
  SINGLE_UNBLANCED_RIGHT: Symbol(),
  SINGLE_UNBLANCED_LEFT: Symbol(),
  BLANCED: Symbol()
}
function AVLTree() {
  Tree.call(this)
  //继承的n种方式
  this.insert = key => {
    //修改插入方法
    if (!this.root) {
      this.root = new Node(key)
      this.count++
    } else {
      this.insertNode(this.root, key)
    }
  }
  this.insertNode = (node, key) => {
    //与二叉搜索树一致
    if (this.compFn(node.key, key) === true) {
      if (!node.right) {
        node.right = new Node(key)
        this.count++
      } else {
        this.insertNode(node.right, key)
      }
    } else if (this.compFn(node.key, key) === false) {
      if (!node.left) {
        this.count++
        node.left = new Node(key)
      } else {
        this.insertNode(node.left, key)
      }
    } else {
      //否则节点key相等则直接返回，不插入
      return node
    }
    //此处我们要获取节点深度差别来进行AVL旋转
    const nodeStatus = this.getBlanceFactor(node)
    if (nodeStatus == BlanceFactor.UNBLANCED_LEFT) {
      //LL 即差值等于2，左边比右边多两个
      console.log(node, "LL")
      if (this.compFn(node.key, key) === false) {
        //节点的key小于要插入的key
        node = this.rotationLL(node) //执行LL旋转
      } else {
        return this.rotationLR(node) //否则执行LR旋转
      }
    } else if (nodeStatus == BlanceFactor.UNBLANCED_RIGHT) {
      //同理
      console.log(node, "RR")
      if (this.compFn(node.key, key) === true) {
        node = this.rotationRR(node)
      } else {
        return this.rotationRL(node)
      }
    }
    return node
  }
  //树旋转，具体操作可以百度下AVL旋转图解更形象

  this.rotationLR = node => {
    node.left = this.rotationRR(node.left)
    return this.rotationLL(node)
  }
  this.rotationRL = node => {
    node.left = this.rotationLL(node.left)
    return this.rotationRR(node)
  }
  this.rotationRR = node => {
    const temp = node.right
    node.right = temp.left
    temp.left = node
    node = temp
    return node
  }
  this.rotationLL = node => {
    const temp = node.left
    node.left = temp.right
    temp.right = node
    node = temp
    return node
  }

  this.getBlanceFactor = node => {
    var heightDifferent =
      this.getNodeHegiht(node.left) - this.getNodeHegiht(node.right)
    switch (
      heightDifferent //返回差值对应的状态
    ) {
      case 0:
        return BlanceFactor.BLANCED
      case 1:
        return BlanceFactor.SINGLE_UNBLANCED_LEFT
      case 2:
        return BlanceFactor.UNBLANCED_LEFT
      case -1:
        return BlanceFactor.SINGLE_UNBLANCED_RIGHT
      case -2:
        return BlanceFactor.UNBLANCED_RIGHT
    }
  }
  this.getNodeHegiht = node => {
    //获取节点深度
    if (!node) {
      return -1
    }
    return (
      Math.max(this.getNodeHegiht(node.left), this.getNodeHegiht(node.right)) +
      1
    )
  }
}

var tree = new AVLTree()
tree.insert(1)

tree.insert(4)
tree.insert(5)
tree.insert(6)
tree.insert(7)
tree.insert(8)
tree.insert(9)
tree.insert(10)

// tree.insert(5);
// tree.insert(-1)
```

### 红黑树(RBTree)

自平衡树也是红黑树的一种，AVL 中插入可能会对树进行旋转，如果插入频率比较低，那么 AVL 树会比红黑树更适合。

#### 红黑树特性

- 每个节点不是红的就是黑的
- 根结点都是黑的
- 所有叶节点都是黑的
- 如果一个节点是红的，那么他两个子节点是黑的
- 相同节点的父节点或者子节点都是不同的
- 相同层次的节点的红黑属性也应该是相同的

#### 红黑树节点

```js
var COLOR = {
  RED: Symbol(),
  BLACK: Symbol()
}
function RBNode(key) {
  Node.call(this, key) //继承普通节点属性
  this.color = COLOR.RED //给个颜色
  this.parent = null //父节点
  this.isRed = () => this.color === COLOR.RED //是否为红
}
```

## 哈夫曼编码压缩原理

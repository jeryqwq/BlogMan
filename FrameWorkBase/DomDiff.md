---
title: Diff算法
lang: en-US
---
## 简介
1. 在以往的开发方式中，通过操作节点的方式达到变换节点，但这样的前提是大量的重排和重绘，导致性能的消耗，而且一般所有的DOM的更改都是可预见的且发生在相同的层级的。
2. 所以基于此类的思想，也为了节省性能消耗，开发者开始使用虚拟DOM来模拟真实的DOM，即JS对象，既然每次DOM的变化都是可以预见，那岂不是每次对比修改前后的虚拟DOM对象，可以将多个修改合并后再进行DOM层的操作（即向真实DOM打补丁），这样能防止很多性能上的问题。
3. 通过每次对两次DOM对象深度优先的算法来检查之间的差异，生成补丁diffPatcheshes对象,然后像真实DOM修改，减少了很多浏览器频繁的重绘重排操作。
4.UI场景经常频发的dom的操作大部分都是对DOM的修改，如果每次dom改变都删除旧节点，重新插入新节点浪费计算机性能
## 简易实现 
  此处的仅实现基本的diff过程， 不涉及有key的属性的情况下，涉及key我们可以单独在后面讲

```js
  
class Diff {
    constructor(oldTree, newTree) {
        //构造函数接收新旧的虚拟DOM描述对象
        this.oldTree = oldTree;
        this.newTree = newTree;
        this.patches = [];//补丁包
        this.index = 0;//记录深度遍历的索引，方便对指定的DOM打补丁
        this.work(this.oldTree, this.newTree, this.index, this.patches);   
        console.log(this.patches[5])     
    }

    work(oldTree, newTree, index, patches) {
        let currentPatch = [];//定义单节点的补丁对象数组
        if (!newTree) {//新节点不存在，该节点已经被删除，新增删除补丁对象
            currentPatch.push({
                TYPE: "DELETE",
                index: index
            })
        } else if (this.isString(oldTree) && this.isString(newTree)) {//是文本节点
            if (oldTree !== newTree) {
                currentPatch.push({//不想等的话修改新节点和存储索引
                    TYPE: "TEXT",
                    text: newTree
                });
            }
        } else if (oldTree.type === newTree.type) {//tagname相等
            let attrs = this.diffAttr(oldTree.props, newTree.props);//对比attrs属性（props）
            if (Object.keys(attrs).length > 0) {//添加补丁对象，type为attrs，说明标签参数有改变
                currentPatch.push({
                    TYPE: "ATTRS",
                    attrs
                });
            }
            this.diffChildren(oldTree.children, newTree.children, index, patches);//再次对比新旧节点的子节点们
        } else {
            currentPatch.push({//否则就是新旧节点类型不一致，直接替换老节点
                TYPE: "REPLACE",
                newTree
            });
        }
        if (currentPatch.length > 0) {
            this.patches[index] = currentPatch;//一层节点存储一个对象
        }
    }
    isString(node) {
        return Object.prototype.toString.call(node) === "[object String]"
    }
    diffChildren(oldChildren, newChildren, patches) {//diff子节点们
        oldChildren.forEach((child, i) => {//遍历调用对比单节点方法，生成指定索引下的diff对象数组
            this.work(child, newChildren[i], ++this.index, patches)
        });
        this.addInsertNode(oldChildren, newChildren);
    }
                  //todo newChildren新增节点
    addInsertNode(oldChildren,newChildren){
              if(newChildren){
              if (newChildren.length > oldChildren.length) {
                let currentPatch = [];
                for (var key in newChildren) {
                    if (key> oldChildren.length-1) {
                        let index = this.patches.length - 1;
                        currentPatch.push({
                            TYPE: "INSERT",
                            insertNode: newChildren[key]
                        })
                        this.patches.push(currentPatch);
                    }
                }
            }
        }
    }
    diffAttr(oldAttrs, newAttrs) {//节点属性对比方法
        let patches = {};

        for (var key in oldAttrs) {
            if (oldAttrs[key] !== newAttrs[key]) {//对比节点值，生成新attrs
                patches[key] = newAttrs[key];
            }
        }
        for (key in newAttrs) {
            if (!oldAttrs.hasOwnProperty(key)) {
                patches[key] = newAttrs[key];
            }
        }
        return patches;//生成属性差异对象
    }
}
let diffPatches = (oldElement, newElement) => {
    return new Diff(oldElement, newElement).patches;
}
```
##  重头戏，带key节点的diff
目前主流的diff算法有很多种，具体的收益效果也因平台和框架特性等，大家的选择不一，着重对vue2和vue3版本的diff算法做下对比和介绍，他们是如何在长列表的情况下尽可能复用更多节点，用最小的操作步数达到更新状态的功能

## Vue2 
  [源码仓库](https://github.com/vuejs/vue/blob/dev/src/core/vdom/patch.js)
  仅贴出相关代码 (404 - 474 行)
  vue2的diff不涉及算法， 就是单纯的使用双端指针去对新旧节点的头尾进行依次换位对比key，有相同则代表此次对比找到了可复用节点，否则缩小范围再次新旧vdom做对比.
  ### 双端指针

  `
    <!-- //例如有如下vdom节点 -->
    old vdom  [
      {  key: 1 , text: '文本1'}，
      {  key: 2 , text: '文本12'}，
      {  key: 3 , text: '文本13'}，
      {  key: 4 , text: '文本14'}，
      {  key: 5 , text: '文本15'}，
    ]
    <!-- 我们对节点做两次移动和增加一个新的， 所以高效的更新试图也应该是移动两个节点和新增一个，而不是新增整个列表 -->
    new vdom  [
      {  key: 1 , text: '文本1'}，
      {  key: 2 , text: '文本12'}，
      {  key: 4 , text: '文本14'}，
      {  key: 5 , text: '文本15'}，
      {  key: 3 , text: '文本13'}，
      {  key: 6 , text: '文本16'}，
    ]
    <!-- 此时使用双端指针进行diff
      创建四个变量代表新节点的开头和结尾的索引，  -->
      let oldStartIdx = 0  //旧节点开始索引
      let newStartIdx = 0  //新节点的开始索引
      let oldEndIdx = oldCh.length - 1   => 4 //就节点末尾索引
      let newEndIdx = newCh.length - 1   => 4
      <!-- 指针每次交换对比key属性，查找是否有可复用节点,直到新旧节点的开始和末尾相同，就已经找完了 -->
      while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if(旧节点开始索引没有vdom){//右移 防止
         oldStartVnode = oldCh[++oldStartIdx] // Vnode has been moved left 开始节点索引右移一位
        }else if()
        oldEndVnode = oldCh[--oldEndIdx]  结束节点左移
         if (sameVnode(oldStartVnode, newStartVnode)) //如果旧开始节点和新的结束节点索引相同
         { //打补丁
            patchVnode(oldStartVnode, newStartVnode)
         }


      }

  `
  `
    function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    let oldStartIdx = 0
    let newStartIdx = 0
    let oldEndIdx = oldCh.length - 1
    let oldStartVnode = oldCh[0]
    let oldEndVnode = oldCh[oldEndIdx]
    let newEndIdx = newCh.length - 1
    let newStartVnode = newCh[0]
    let newEndVnode = newCh[newEndIdx]
    let oldKeyToIdx, idxInOld, vnodeToMove, refElm

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    const canMove = !removeOnly

    if (process.env.NODE_ENV !== 'production') {
      checkDuplicateKeys(newCh)
    }

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx] // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx]
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
        oldStartVnode = oldCh[++oldStartIdx]
        newStartVnode = newCh[++newStartIdx]
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
        oldEndVnode = oldCh[--oldEndIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))
        oldStartVnode = oldCh[++oldStartIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
        oldEndVnode = oldCh[--oldEndIdx]
        newStartVnode = newCh[++newStartIdx]
      } else {
        if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
        idxInOld = isDef(newStartVnode.key)
          ? oldKeyToIdx[newStartVnode.key]
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
        if (isUndef(idxInOld)) { // New element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
        } else {
          vnodeToMove = oldCh[idxInOld]
          if (sameVnode(vnodeToMove, newStartVnode)) {
            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
            oldCh[idxInOld] = undefined
            canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
          }
        }
        newStartVnode = newCh[++newStartIdx]
      }
    }
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(oldCh, oldStartIdx, oldEndIdx)
    }
  }
  `
##

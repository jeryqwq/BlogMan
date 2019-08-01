---
title: Diff算法
lang: en-US
---
## 简介
1. 在以往的开发方式中，通过操作节点的方式达到变换节点，但这样的前提是大量的重排和重绘，导致性能的消耗，而且一般所有的DOM的更改都是可预见的且发生在相同的层级的。
2. 所以基于此类的思想，也为了节省性能消耗，开发者开始使用虚拟DOM来模拟真实的DOM，即JS对象，既然每次DOM的变化都是可以预见，那岂不是每次对比修改前后的虚拟DOM对象，可以将多个修改合并后再进行DOM层的操作（即向真实DOM打补丁），这样能防止很多性能上的问题。
3. 通过每次对两次DOM对象深度优先的算法来检查之间的差异，生成补丁diffPatcheshes对象,然后像真实DOM修改，减少了很多浏览器频繁的重绘重排操作。

## 简易实现
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
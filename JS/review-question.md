---
title: 刷题
lang: en-US
---
## leetCode- 简单
1. 给定一个整数数组 nums 和一个目标值 target，请你在该数组中找出和为目标值的那 两个 整数，并返回他们的数组下标。
你可以假设每种输入只会对应一个答案。但是，你不能重复利用这个数组中同样的元素。
示例:
给定 nums = [2, 7, 11, 15], target = 9
因为 nums[0] + nums[1] = 2 + 7 = 9
所以返回 [0, 1]
```JS
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    const len=nums.length;
    let i=0;
    while(i<len){
        if(nums.includes(target-nums[i])&&nums.indexOf(target-nums[i])!=i){
            return [i,nums.indexOf(target-nums[i])]
        }
        i++;
    }
    return target;
};
```
解题：

2.给出一个 32 位的有符号整数，你需要将这个整数中每位上的数字进行反转。

示例 1:

输入: 123
输出: 321
 示例 2:

输入: -123
输出: -321
示例 3:

输入: 120
输出: 21
注意:

假设我们的环境只能存储得下 32 位的有符号整数，则其数值范围为 [−231,  231 − 1]。请根据这个假设，如果反转后整数溢出那么就返回 0。
```js
/**
 * @param {number} x
 * @return {number}
 */
var reverse = function(x) {
    let code;
    var max = Math.pow(2, 31) - 1;
    var min = -Math.pow(2, 31);
    if(x<0){
      code=String(x).slice(1);
      code=code.split('').reverse().join('')
    if(min>=-Number(code)){return 0}
      return '-'+code;
    }else{
        code=String(x).split('').reverse().join('');
              if(max<Number(code)){return 0}

        return code
    }
};
```

解题：

3.罗马数字包含以下七种字符: I， V， X， L，C，D 和 M。

字符          数值
I             1
V             5
X             10
L             50
C             100
D             500
M             1000
例如， 罗马数字 2 写做 II ，即为两个并列的 1。12 写做 XII ，即为 X + II 。 27 写做  XXVII, 即为 XX + V + II 。

通常情况下，罗马数字中小的数字在大的数字的右边。但也存在特例，例如 4 不写做 IIII，而是 IV。数字 1 在数字 5 的左边，所表示的数等于大数 5 减小数 1 得到的数值 4 。同样地，数字 9 表示为 IX。这个特殊的规则只适用于以下六种情况：

I 可以放在 V (5) 和 X (10) 的左边，来表示 4 和 9。
X 可以放在 L (50) 和 C (100) 的左边，来表示 40 和 90。 
C 可以放在 D (500) 和 M (1000) 的左边，来表示 400 和 900。
给定一个罗马数字，将其转换成整数。输入确保在 1 到 3999 的范围内。
```js
/**
 * @param {string} s
 * @return {number}
 */
var romanToInt = function(s) {
    let romanObj= {'I':1, 'V':5, 'X':10, 'L':50, 'C':100, 'D':500, 'M':1000}        
    let romanArr=String(s).split('');
    let sum=0;
    romanArr.forEach((item,idx)=>{
    const current=romanObj[romanArr[idx]];
    const next=romanObj[romanArr[idx+1]];
            if(current<next){
                sum-=current;
            }else{
                sum+=current
            }
            console.log(sum)
    })
    return sum;
};
```


解题：
4.编写一个函数来查找字符串数组中的最长公共前缀。

如果不存在公共前缀，返回空字符串 ""。

示例 1:

输入: ["flower","flow","flight"]
输出: "fl"
示例 2:

输入: ["dog","racecar","car"]
输出: ""
解释: 输入不存在公共前缀。
```js
/**
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function(strs) {
    if(strs.length===0){
        return ''
    }
    var minLength = strs[0].length;
    strs.map((item,idx)=>{
        if (minLength < item.length) {
        } else {
            minLength = item.length;
        }
    }
    )
    if (minLength === 0) {
        return ''
    }
    for (let i = minLength ; i > 0; i--) {
            let res = strs.map((item,idx)=>{
                let str = strs[idx].split('').slice(0, i).join('');
                if (item.startsWith(str)) {
                    return str;
                }
            }
        )
        let prev='',result;
       let res1= !res.some(function(value,index){
              return value != res[0];
       });
        if(res1){
            return res[0];
        }
        if(1===i){
            return ''
        }
    }
};

```
5.给定一个排序数组，你需要在原地删除重复出现的元素，使得每个元素只出现一次，返回移除后数组的新长度。

不要使用额外的数组空间，你必须在原地修改输入数组并在使用 O(1) 额外空间的条件下完成。

示例 1:

给定数组 nums = [1,1,2], 

函数应该返回新的长度 2, 并且原数组 nums 的前两个元素被修改为 1, 2。 

你不需要考虑数组中超出新长度后面的元素。
示例 2:

给定 nums = [0,0,1,1,1,2,2,3,3,4],

函数应该返回新的长度 5, 并且原数组 nums 的前五个元素被修改为 0, 1, 2, 3, 4。

你不需要考虑数组中超出新长度后面的元素。
```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var removeDuplicates = function(nums) {
     let i=0;
     for(let j=1;j<nums.length;j++){
         if(nums[i]!=nums[j]){
             i++;
             nums[i]=nums[j];
         }
     }
     
    return i+1;
};
```
解题：双指针


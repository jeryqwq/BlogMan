---
title: 刷题
lang: en-US
---

## leetCode

1. 给定一个整数数组 nums  和一个目标值 target，请你在该数组中找出和为目标值的那   两个   整数，并返回他们的数组下标。
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

示例  1:

输入: 123
输出: 321
  示例 2:

输入: -123
输出: -321
示例 3:

输入: 120
输出: 21
注意:

假设我们的环境只能存储得下 32 位的有符号整数，则其数值范围为  [−231,  231 − 1]。请根据这个假设，如果反转后整数溢出那么就返回 0。

```js
/**
 * @param {number} x
 * @return {number}
 */
var reverse = function (x) {
  let code
  var max = Math.pow(2, 31) - 1
  var min = -Math.pow(2, 31)
  if (x < 0) {
    code = String(x).slice(1)
    code = code.split("").reverse().join("")
    if (min >= -Number(code)) {
      return 0
    }
    return "-" + code
  } else {
    code = String(x).split("").reverse().join("")
    if (max < Number(code)) {
      return 0
    }

    return code
  }
}
```

解题：

3.罗马数字包含以下七种字符: I， V， X， L，C，D  和  M。

字符 数值
I 1
V 5
X 10
L 50
C 100
D 500
M 1000
例如， 罗马数字 2 写做  II ，即为两个并列的 1。12 写做  XII ，即为  X + II 。 27 写做   XXVII, 即为  XX + V + II 。

通常情况下，罗马数字中小的数字在大的数字的右边。但也存在特例，例如 4 不写做  IIII，而是  IV。数字 1 在数字 5 的左边，所表示的数等于大数 5 减小数 1 得到的数值 4 。同样地，数字 9 表示为  IX。这个特殊的规则只适用于以下六种情况：

I  可以放在  V (5) 和  X (10) 的左边，来表示 4 和 9。
X  可以放在  L (50) 和  C (100) 的左边，来表示 40 和  90。 
C  可以放在  D (500) 和  M (1000) 的左边，来表示  400 和  900。
给定一个罗马数字，将其转换成整数。输入确保在 1  到 3999 的范围内。

```js
/**
 * @param {string} s
 * @return {number}
 */
var romanToInt = function (s) {
  let romanObj = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }
  let romanArr = String(s).split("")
  let sum = 0
  romanArr.forEach((item, idx) => {
    const current = romanObj[romanArr[idx]]
    const next = romanObj[romanArr[idx + 1]]
    if (current < next) {
      sum -= current
    } else {
      sum += current
    }
    console.log(sum)
  })
  return sum
}
```

解题： 4.编写一个函数来查找字符串数组中的最长公共前缀。

如果不存在公共前缀，返回空字符串  ""。

示例  1:

输入: ["flower","flow","flight"]
输出: "fl"
示例  2:

输入: ["dog","racecar","car"]
输出: ""
解释: 输入不存在公共前缀。

```js
/**
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function (strs) {
  if (strs.length === 0) {
    return ""
  }
  var minLength = strs[0].length
  strs.map((item, idx) => {
    if (minLength < item.length) {
    } else {
      minLength = item.length
    }
  })
  if (minLength === 0) {
    return ""
  }
  for (let i = minLength; i > 0; i--) {
    let res = strs.map((item, idx) => {
      let str = strs[idx].split("").slice(0, i).join("")
      if (item.startsWith(str)) {
        return str
      }
    })
    let prev = "",
      result
    let res1 = !res.some(function (value, index) {
      return value != res[0]
    })
    if (res1) {
      return res[0]
    }
    if (1 === i) {
      return ""
    }
  }
}
```

5.给定一个排序数组，你需要在原地删除重复出现的元素，使得每个元素只出现一次，返回移除后数组的新长度。

不要使用额外的数组空间，你必须在原地修改输入数组并在使用 O(1) 额外空间的条件下完成。

示例  1:

给定数组 nums = [1,1,2],

函数应该返回新的长度 2, 并且原数组 nums 的前两个元素被修改为 1, 2。

你不需要考虑数组中超出新长度后面的元素。
示例  2:

给定 nums = [0,0,1,1,1,2,2,3,3,4],

函数应该返回新的长度 5, 并且原数组 nums 的前五个元素被修改为 0, 1, 2, 3, 4。

你不需要考虑数组中超出新长度后面的元素。

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var removeDuplicates = function (nums) {
  let i = 0
  for (let j = 1; j < nums.length; j++) {
    if (nums[i] != nums[j]) {
      i++
      nums[i] = nums[j]
    }
  }

  return i + 1
}
```

解题：双指针
6

```js
var addTwoNumbers = function (l1, l2) {
  let curr1 = l1,
    curr2 = l2,
    isOver = false
  let head = new ListNode()
  let current = head
  while (curr1 || curr2) {
    let p2 = !curr2 ? 0 : curr2.val ? curr2.val : 0,
      p1 = !curr1 ? 0 : curr1.val ? curr1.val : 0
    current.next = new ListNode(dealCount(p1, p2))
    current = current.next
    curr1 && (curr1 = curr1.next)
    curr2 && (curr2 = curr2.next)
  }
  if (isOver) {
    current.next = new ListNode(1)
  }
  function dealCount(v1 = 0, v2 = 0) {
    if (isOver) {
      v1++
    }
    if (v1 + v2 >= 10) {
      isOver = true
      return v1 + v2 - 10
    } else {
      isOver = false
      return v1 + v2
    }
  }
  return head.next
}
```

7

```JS
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */

var addTwoNumbers = function(l1, l2) {
    let curr1=l1,curr2=l2,isOver=false;
    let head=new ListNode();
    let current=head
    while(curr1||curr2){
        let p2=!curr2?0:curr2.val?curr2.val:0,p1=!curr1?0:curr1.val?curr1.val:0;
        current.next=new ListNode(dealCount(p1,p2));
        current=current.next
        curr1&&(curr1=curr1.next);
        curr2&&(curr2=curr2.next);
    }
    if(isOver){
        current.next=new ListNode(1)
    }
    function dealCount(v1=0,v2=0){
        if(isOver){
            v1++;
        }
        if(v1+v2>=10){
            isOver=true;
            return v1+v2-10
        }else{
            isOver=false;
            return v1+v2;
        }
    }
    return head.next;
};
```

8

```JS
/**
 * @param {string} S
 * @return {string}
 */
 字符串压缩。利用字符重复出现的次数，编写一种方法，实现基本的字符串压缩功能。比如，字符串aabcccccaaa会变为a2b1c5a3。若“压缩”后的字符串没有变短，则返回原先的字符串。你可以假设字符串中只包含大小写英文字母（a至z）。

示例1:

 输入："aabcccccaaa"
 输出："a2b1c5a3"
示例2:

 输入："abbccd"
 输出："abbccd"
 解释："abbccd"压缩后为"a1b2c2d1"，比原字符串长度更长。

var compressString = function(S) {
    let str='',count=1;
    for(let i =0;i<S.length;i++){
        if(S[i]==S[i+1]){
            count++;
        }else{
            str+=(S[i]+count);
            count=1;
        }
    }
    if(S.length<=str.length){
        return S
    }else{
    return str

    }
};
compressString('aaaaaabbb')
```

9

```JS
/**
 * @param {number} n
 * @return {string}
 */
var countAndSay = function(n) {
    let resArr=['1'],num=1;
    for(let i=1;i<n;i++){
        let itemstr='';
        for(j=0;j<resArr[i-1].length;j++){
            const item=resArr[i-1][j];
            if(item==resArr[i-1][j+1]){
                num++;
                j++;
            }else{
                num=1
            }
            console.log(num,item)
                itemstr+=num+item;
        }
        resArr.push(itemstr);
    }
    console.log(resArr)
    return resArr[n-1]
};
countAndSay(7)
```

10

```JS
// 给你一份『词汇表』（字符串数组） words 和一张『字母表』（字符串） chars。

// 假如你可以用 chars 中的『字母』（字符）拼写出 words 中的某个『单词』（字符串），那么我们就认为你掌握了这个单词。

// 注意：每次拼写时，chars 中的每个字母都只能用一次。

// 返回词汇表 words 中你掌握的所有单词的 长度之和。

 

// 示例 1：

// 输入：words = ["cat","bt","hat","tree"], chars = "atach"
// 输出：6
// 解释：
// 可以形成字符串 "cat" 和 "hat"，所以答案是 3 + 3 = 6。
// 示例 2：

// 输入：words = ["hello","world","leetcode"], chars = "welldonehoneyr"
// 输出：10
// 解释：
// 可以形成字符串 "hello" 和 "world"，所以答案是 5 + 5 = 10。

// 来源：力扣（LeetCode）
// 链接：https://leetcode-cn.com/problems/find-words-that-can-be-formed-by-characters
// 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

/**
 * @param {string[]} words
 * @param {string} chars
 * @return {number}
 */
var countCharacters = function(words, chars) {
    let result=0
    words.forEach((item,idx)=>{
        let isItemHas=true
        let tempChart=chars;
        for(let i =0;i<item.length;i++){
            if(i===0)tempChart=chars;
            if(!tempChart.includes(item[i])){
                isItemHas=false;
            }else{
                tempChart= tempChart.replace(item[i],'');
            }
        }
        if(isItemHas){
            result+=item.length
        }
    });
   return result
};
```

11

```JS
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findMedianSortedArrays = function(nums1, nums2) {
   let arrs=nums1.concat(nums2).sort((a,b)=>a-b);
   let {length}=arrs,centerNum=length/2,floor=Math.floor(centerNum);
   let center=arrs[Math.floor(centerNum)]
   if(centerNum-floor===0){
       console.log(arrs,center,arrs[Math.floor(centerNum-1)])
       return (center+arrs[Math.floor(centerNum-1)])/2
   }else{
       return center;
   }

};
findMedianSortedArrays([1,1,1,1,1,1,1,1,1,1,4,4],
[1,3,4,4,4,4,4,4,4,4,4])
```

12

```JS
/**
 * @param {number} numRows
 * @return {number[][]}
 */
var generate = function(numRows) {
    if(numRows===0){return []}

    let temoArr=[[1],[1,1]]
        if(numRows==2){
            return temoArr
        }
        if(numRows==1){
            return [[1]]
        }
    for(let i =2;i<numRows;i++){
        let itemArr=[]
        for(let j=0;j<i+1;j++){
            if(j===0||j===i){
                itemArr.push(1)
            }else{
            itemArr.push(temoArr[i-1][j]+temoArr[i-1][j-1])
            }
        }
        temoArr.push(itemArr);
    }
    return temoArr;
};
```

13

```JS
var intToRoman = function(num) {
    const romaObj = {
        M: 1000,
        CM:900,
        D: 500,
        CD:400,
        C: 100,
        XC:90,
        L: 50,
        XL:40,
        X: 10,
        IX:9,
        V: 5,
        IV:4,
        I: 1,
    }
    let  str = '';
    while (num >= 1) {
        for (const key in romaObj) {

            if (romaObj[key] <= num) {
                num -= romaObj[key];
                str += key;
                break
            }
        }
    }
    return str
};
intToRoman(20)

```

14

```JS
/**
 * @param {string} s
 * @return {boolean}
 */
var isPalindrome = function(s) {
   let str='';
    s.toUpperCase().split('').forEach((item)=>{
       if(item>="A"&&item<='Z'||item>='0'&&item<='9') {
           str+=item
       }
    })
    let reverseStr=str.split('').reverse().join('')
    if(str===reverseStr){
        return true
    }else{
        return false
    }
};
isPalindrome("race a car")
```

15

```JS
var lengthOfLIS = function(nums) {
    let max=0;
    for (let i =0;i<nums.length;i++){
        let item=nums[i],itemNum=0;
        for(let j=i;j<nums.length;j++){
            itemMark=nums[j]
            if(item<itemMark){
                itemNum++
            }
        }
        if(itemNum>max){
            max=itemNum;
        }
    }
    return max;
};
lengthOfLIS([10,9,2,5,3,7,101,18])
```

16

```JS
/**
 * @param {string} s
 * @return {number}
 */
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
    let strObj={},count=0,itemMax=0;
    function deepCount(s,count){
           for(let i =0;i<s.length;i++){
        strObj[s[i]]?strObj[s[i]]++:strObj[s[i]]=1;
                count++;
        if(strObj[s[i]]>=2){
                count=0;
                strObj={}
              deepCount(s.slice(s.indexOf(s[i])+1,s.length),0)
              return
        }

         count>itemMax&&(itemMax=count);
    };
    }
    deepCount(s,0);

    return itemMax
};
lengthOfLongestSubstring("dvdc")
```

17

```JS

// 给定一个仅包含数字 2-9 的字符串，返回所有它能表示的字母组合。

// 给出数字到字母的映射如下（与电话按键相同）。注意 1 不对应任何字母。
var letterCombinations = function(digits) {
        if(!digits)return []

    let map={
        '2':'abc',
        '3':'def',
        '4':'ghi',
        '5':'jkl',
        '6':'mno',
        '7':'pqrs',
        '8':'tuv',
        '9':'wxyz',
    },res=[],nums=new Array(),sum=1;
   for(let i =0;i<digits.length;i++){
       nums[i]=0;
       sum*=map[digits[i]].length

   }

    function addnum(){
        let index=nums.length-1
        let cur=nums[index];
        let len=map[digits[index]].length-1
        while(cur>=len){
            nums[index]=0
            cur=nums[--index];
        };
        index>=0&&nums[index]++;
    }

    for(let i = 0;i<sum;i++){
        addnum();

        let str=''
        nums.forEach((item,idx)=>{
            str+=map[digits[idx]][item]
        })
        res.push(str);
    }
    return res
};
letterCombinations('73')
```

18

```JS

/**
 * @param {string} s
 * @return {number}
 */
var longestPalindrome = function(s) {
    let itemstr = ''
      , count = '';
      s=' '+ s+' '
    function deepStr(s) {
        itemstr = ''

        for (let i = 0; i < s.length; i++) {
            itemstr += s[i];
            console.log(s,itemstr)
            if (s.includes(itemstr.split('').reverse().join(''))) {
                if (count.length < itemstr.length && s[i] !== ' ') {
                    count = itemstr
                }
            } else {
                if (s[i] == s[i + 1]) {
                    deepStr(s.replace(itemstr.slice(0, itemstr.length - 1), ''));
                } else {
                    deepStr(s.replace(itemstr, ''));
                }
                return
            }

        }
    }
    deepStr(s);
    return count.trim();
};
longestPalindrome("caba")

```

19

```JS
var maxAreaOfIsland = function(grid) {
    let max = 0;
    for (let i = 0; i < grid.length; i++) {
        let item = grid[i];
        for (let j = 0; j < item.length; j++) {
            const sitem = item[j];
            if (sitem === 1) {
                max=Math.max(deepDfs(i,j),max)
            }
        }

    }

    function deepDfs(x, y) {
        if (x<0||x>=grid.length||y<0||y>=grid[0].length||grid[x][y]===0) {
            return 0 ;
        }
        grid[x][y]=0;
        let count=1;
        count+= deepDfs(x - 1, y);
        count+= deepDfs(x + 1, y);
        count+= deepDfs(x, y - 1);
        count+= deepDfs(x, y + 1);
        return count
    }
    return max
};
maxAreaOfIsland([[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])

```

20

```JS
/**
 * @param {number[]} A
 * @return {number}
 */
var minIncrementForUnique = function(A) {
    let arr=A.sort((a,b)=>a-b),count=0;
    console.log(arr)
    arr.forEach((item,i)=>{
           if(arr[i] <= arr[i - 1]){
                count += (arr[i - 1] - arr[i] + 1);
                arr[i] = arr[i - 1] + 1;
            }
    })
    return count
};
minIncrementForUnique([3,2,1,2,1,7])

```

21

```JS
/**
 * initialize your data structure here.
 */
var MinStack = function() {
    this.min=0;
    this.arr=[]
};

/**
 * @param {number} x
 * @return {void}
 */
MinStack.prototype.push = function(x) {
    if(this.min>x){
        this.min=x
    }
    this.arr.push(x)
};

/**
 * @return {void}
 */
MinStack.prototype.pop = function() {
   return  this.arr.splice(this.arr.length-1,1);
};

/**
 * @return {number}
 */
MinStack.prototype.top = function() {
    return this.arr[this.arr.length-1]
};

/**
 * @return {number}
 */
MinStack.prototype.getMin = function() {
    return Math.min(...this.arr)
};

/**
 * Your MinStack object will be instantiated and called as such:
 * var obj = new MinStack()
 * obj.push(x)
 * obj.pop()
 * var param_3 = obj.top()
 * var param_4 = obj.getMin()
 */
 var minStack = new MinStack();
minStack.push(-2);
minStack.push(0);
minStack.push(-3);
minStack.getMin();
minStack.pop();
minStack.top();
minStack.getMin();


```

22

```JS
var myAtoi = function(str) {
    if (str == ''||str==" ") {
        return 0
    }
    const minNum = -2147483648;
    const max=2147483647;
    str = str.split(' ');
    let res=''
    str = str.filter((item)=>item.trim())
    if(str.length==0){return 0}

    str=str[0]
    if(str.startsWith('-+')||str.startsWith('+-')){
        return 0
    }

    for(let i =0;i<str.length;i++){

        if(str[i]==='-'&&i==0){
            res+=str[i];
        }else{
            if(str[i]=='+'&&i!==0){
                break
            }
             if(str[i]>='0'&&str[i]<='9'){
            res+=str[i];
        }else{
            if(str[i]!=='+'){
                break
            }

        }
        }

    }
    const val = Number(res)
    if(!val){ return 0}
    if (res.startsWith('-')) {
        if (val <= minNum) {
            return minNum
        }
        if (val) {
            return val
        } else {
            return 0
        }
    }
    if (val) {
        if(val>=max){
        return max
        }
        return val

    } else {
        return 0
    }
};
myAtoi("-13+8");

```

23

```JS
/**
 * @param {number[]} digits
 * @return {number[]}
 */
var plusOne = function(digits) {
    let {length}=digits;
    if(length===0){return []}
        if(digits[length-1]===9){
            ~ function deepAdd(idx){
                digits[idx]=0;
                let prev=digits[idx-1];
                if(prev){
                    if(prev===9){
                        deepAdd(idx-1)
                    }else{
                        digits[idx-1]=prev+1
                    }
                }else{
                    digits.splice(0,0,1)
                }
            }(length-1)
        }else{
            digits[length-1]=digits[length-1]+1;
        }
        return digits
};
```

24

```JS
/**
 * @param {number[]} nums
 * @param {number} val
 * @return {number}
 */
var removeElement = function(nums, val) {
    let i=0;
    for(let j=0;j<nums.length;j++){
        if(val!=nums[j]){
           nums[i++]=nums[j]
        }
    }
    return i
};
removeElement([3,2,2,3],3)
```

25

```JS
/**
 * @param {number[]} nums
 * @return {number}
 */
var singleNumber = function(nums) {
    let findNum={};
    nums.forEach((item,idx)=>{
       findNum[item]?findNum[item]++:findNum[item]=1
    })
    console.log(findNum)
    for(const key in findNum){
        const item=findNum[key]
         if(item===1){
            return Number(key)
        }
    }
};
singleNumber([4,1,2,1,2])
```

26

```JS
var singleNumber = function(nums) {
    let cur=nums[0];
    while(cur){
        if(nums.length==0){return cur}
        cur=nums.shift();
        if(nums.length==1){return nums[0]}
        let idx=nums.indexOf(cur);
        if(idx===-1){
            return cur
        }
        nums.splice(nums.indexOf(cur),1);
        nums[0]&&(cur=nums[0])

    }
};
singleNumber([2,2,1])
```

27

```JS
/**
 * @param {number[]} height
 * @return {number}
 */
var trap = function(height) {
    let water=0
    function getDeep(arr){
        let max=Math.max(...arr);
        let maxIdx=arr.indexOf(max);
        console.log('--',arr,maxIdx)
        debugger
        for(let i=maxIdx;i<arr.length;i++){
            if(height[i]){
//                 console.log(arr,max-height[i])
                const val=max-height[i]
                water+= val;

            }
        }
        if(arr.length>=2){
             getDeep(arr.slice(0,maxIdx))
            getDeep(arr.slice(maxIdx+1,arr.length))
        }

    }
    getDeep(height);
    return water

};
trap([0,1,0,2,1,0,1,3,2,1,2,1,5])
// trap([2,1,0,1,3])
```

28

```JS
// 给定一个由 0 和 1 组成的矩阵，找出每个元素到最近的 0 的距离。

// 两个相邻元素间的距离为 1 。

// 示例 1:
// 输入:

// 0 0 0
// 0 1 0
// 0 0 0
// 输出:

// 0 0 0
// 0 1 0
// 0 0 0

// 来源：力扣（LeetCode）
// 链接：https://leetcode-cn.com/problems/01-matrix
// 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
/**
 * @param {number[][]} matrix
 * @return {number[][]}
 */
var updateMatrix = function(matrix) {
    matrix.forEach((item,idx)=>{
        item.forEach((item1,idx1)=>{
            if(item1===1){
                deepDFS(idx,idx1,1)
            }
        })
    })
    function deepDFS(x,y,count){
        if(x<0||x>=matrix.length||y<0||y>=matrix[0].length||matrix[x][y]===0){
            return 0;
        }
//         if(matrix[x][y]===1){
//             matrix[x][y]=count+1;
//         }
        deepDFS(x+1,y,count+1);
        deepDFS(x-1,y,count+1)
        deepDFS(x,y-1,count+1)
        deepDFS(x,y+1,count+1)
    }
    return matrix
};
updateMatrix([[0,0,0],[0,1,0],[1,1,1]])
```

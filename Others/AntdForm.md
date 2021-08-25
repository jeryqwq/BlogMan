---
title: 动手实现Antd表单组件-React
lang: en-US
---
## 前言
从零开始简易实现一个与[And Design](https://ant.design/components/form-cn/)语法一致的表单组件，包括表单格式验证，输入提示，表单数据获取，表单判断等。使用前请自行按照官方搭建好脚手架。(未使用TypeScript构建)
## Ant Design Form表单
先看看官方表单的用法
```js
import { Form, Icon, Input, Button, Checkbox } from 'antd';
class NormalLoginForm extends React.Component {
  handleSubmit = e => {//提交表单处理事件
    e.preventDefault();
    this.props.form.validateFields((err, values) => {//props传递参数验证函数，传递错误信息和表单数据值
      if (!err) {//验证成功执行
        console.log('Received values of form: ', values);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;//props传递装饰函数，函数传递
    //参数的key值和校验规则数组
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!' }],
          //校验规则，官方文档有多种，本章进实现几种，可自行添加
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
            />,//传递非受控组件，状态托管到组件代码处理
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(<Checkbox>Remember me</Checkbox>)}
          <a className="login-form-forgot" href="">
            Forgot password
          </a>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
          Or <a href="">register now!</a>
        </Form.Item>
      </Form>
    );
  }
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(NormalLoginForm);
//create函数包装NormalLoginForm组件，使用HOC（高阶组件）对原组件功能进行增强
ReactDOM.render(<WrappedNormalLoginForm />, mountNode);
```
此时一个普通的登录的表单验证就配置好了，输入时也会动态提示用户输入内容的错误信息，然后我们开始根据官方的语法来实现一波antd-Form
## 效果预览
仅实现功能验证，就不做美化了，仅供学习！！！<br>

<img :src="$withBase('./../imgs/antdform.gif')" alt="Antd表单运行预览">

## 文件目录
> Form 主文件入口<br>
>> create.js 增强组件功能，返回增强后的组件且增加props函数让原组件调用<br>
>> Form.jsx 表单项组件，挂载Item和create功能<br>
>> Item.jsx Form.Item组件，现实label和childern属性<br>
>> index.js node默认加载的入口文件 ，导出所有功能<br>

### APP.js 
create-react-app入口文件
```js
import React from 'react';
import Form from './Form';//导入简易实现的Form组件
 class App extends React.Component {
   constructor(props){
     super(props)
   }
  render() {
    //包装组件后返回props两个函数
    //getFieldDecorator（给create函数返回增强组件时让传递的第二个无状态控件转换为有状态，
    //绑定状态对应的值为第一个参数）
    //validateFields验证参数时调用，传递err和values对象
    //err不为false时传递具体的验证错误对象和错误信息
    //values传递具体的参数值对象
    const { getFieldDecorator,validateFields } = this.props.form;
    return (
      <Form>
         <Form.Item label="用户名：">
         //根据getFieldDecorator函数使用方法可推出原函数写法
         //getFieldDecorator=(key,options)=>{
         // 
         // return (input)=>{
         //     此处返回受控后的input
         //  }
         //}
          {getFieldDecorator('username',{
            rules:[{ required: true, message: 'Please input your username!' }]
          })(<input type="text" placeholder="请输入用户名"/>)}
         </Form.Item>
         <Form.Item label="密码：">
          {getFieldDecorator('password',{
            rules:[{ required: true, message: '请输入密码!' },
          {min:8,message:'请输入大于8位数密码!'},
          {max:20,message:'密码最大长度为20位!'},]
          })(<input type="password" placeholder="请输入密码"/>)}
         </Form.Item>
         <Form.Item>
           <input type="button" value="SubMit" onClick={()=>{
             //验证参数并获取到最新的状态
             validateFields((err,values)=>{
               if(!err){
                console.log('success',err,values)
               }else{
                console.log(err)
               }
             })
           }}/>
         </Form.Item>
      </Form>
    )
  }
}
export default Form.create(App);
```
### Form.jsx
装载Form方法，渲染childred
```js
import React from 'react'
import Item from './Item'
import create from './create'

export default class Form extends React.Component{
    static Item=Item;
    static create=create;
    render(){
        return(
            this.props.children
        )
    }
}
```
### Item.jsx
渲染props的label和children
```js
import React from 'react';
export default class Item extends React.Component{

    render(){
        return(
           <div>
               <label>
                    {this.props.label}
                    {this.props.children}
                </label>
           </div>
        )
    }
}
```
### create.js
主要代码处理组件，接收WrapComponent，返回增强组件---[高阶组件(HOC)](https://jeryqwq.github.io/FrameWork/React.html#高阶组件-hoc)
```js
import React from 'react';
export default function(WrapComponent){
    return class HocComponent extends React.Component{
        constructor(props){
            super(props);
            this.state={
                values:{},//存储input受控组件的值
                errTips:{}//错误信息
            }
            this.options={};//表单验证规则
        }
     
        getFieldDecorator=(key,option)=>{
    //接受非受控组件需要绑定的状态对应的key和对应的表单验证属性      
            this.options[key]=option;//验证对象挂载到this对象上
            return (input)=>{
                let props={//组件添加onchange事件
                    onChange:(event)=>{
                        this.setState({
                            values:{
                                ...this.state.values,
                                [key]:event.target.value
                            }
                        },()=>{
                          //动态检测规则
                            this.validateFields(key)
                        })
                    },//给组件绑定对应值
                    value:this.state.values[key]||''
                }
                //返回clone后并添加对应props的对象
                return <div>
                    {React.cloneElement(input,{
                    ...props
                })}
                //显示验证后的提示语
                <div style={{color:'red',fontSize:13}}>{this.state.errTips[key]&&this.state.errTips[key]}</div>
                </div>
            }
        }
        validateFields=(fn)=>{//验证函数，调用为函数时，
        //执行该函数并传递验证的错误信息和控件对应的值
            if(typeof fn==='function'){//是函数是循环遍历调用key属性检查格式
                Object.keys(this.options).forEach((item,idx)=>{//同下，
                //forEach内也不该使用异步函数，使用Promise.All
                    setTimeout(()=>{this.validateFields(item)},idx*2)
                })
                this.setState({},()=>{//参数验证不应该马上用setState操作对象，
                //多个setState时React会合并操作，导致部分操作丢失，使用局部变量就好了
                    setTimeout(() => {
                        Object.keys(this.state.errTips).length<=0?fn(false,this.state.values):fn(this.state.errTips,this.state.values);
                    }, 0);
                })
            }else{//受控组件参数改改变后通过key调用此方法
                this.options[fn].rules.forEach(item=>{
                    for (const key in item) {//便利规则
                        if (item.hasOwnProperty(key)) {
                            const element = item[key];
                            switch (key) {
                                case 'required':
                                //规则名匹配，后续同理
                                    if(element){
                                        let val=this.state.values[fn];
                                        if(val===undefined||val===''){
                                            this.setState({
                                                errTips:{
                                                    ...this.state.errTips,
                                                    [fn]:item.message
                                                }
                                            })
                                        }else{
                                            setTimeout(()=>{delete this.state.errTips[fn];},0)
                                        }
                                    }
                                    break;
                                case 'min':
                                    if(String(this.state.values[fn]).length<Number(element)){
                                     
                                        this.setState({
                                           errTips:{
                                            ...this.state.errTips,
                                            [fn]:item.message
                                           }
                                        })
                                    }else{
                                        setTimeout(()=>{delete this.state.errTips[fn];},0)
                                    }
                                    break;
                                case 'max':
                                        if(String(this.state.values[fn]).length>Number(element)){
                                            this.setState({
                                                errTips:{
                                                    ...this.state.errTips,
                                                    [fn]:item.message
                                                }
                                            })
                                        }else{
                                            setTimeout(()=>{delete this.state.errTips[fn];},0)
                                        }
                                break;
                                default:
                                    break;
                            }
                        }
                    }
                })
            }
        }
        render(){
            this.props={//props属性
                form:{
                    getFieldDecorator:this.getFieldDecorator,
                    validateFields:this.validateFields,
                }
            }
            return(
              //返回包装后的组件
                <WrapComponent {...this.props}/>
            )
        }
    }
}
```
自此，一个与antd官方语法相似的语法组件就写好了 ，后续可添加更多校验规则，发现看完官方的用法的文档，自己写的又他妈是冰山一角。仅供学习参考！！！
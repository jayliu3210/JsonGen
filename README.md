# JsonGen
Json生成器，与mongodb或Elasticsearch打交道时， 可以基于json模板和当前参数合并生成新json用于查询或插值
也可以独立使用

## 设计原则
手工编写一个大而全的json,  然后工具能依据参数自动裁剪json

## 说明
```
自动基于json模板生成有效的查询json
如果指定的参数不存在， 则移除该属性
如果某个结点内都没有值了， 则移除该结点


每个字段的值， 如果以':'开头，则表示使用表达式计算
如果要完整移除某个对象结点， 可以在对象结点内加一个 '_if' 字段来控制
```
## 使用示例
```
mongoose
const jsonGen = new require('jsonGen')();
const update = {
 $set:{
  value1:':v.value1',
  value2:':v.value2'
 },
 $inc:{
  incfield1:':v.field1 ? 1 : undefined',
 },
 $push:{
  _if:':v.allowPush',
  items:{
    field1:'value1',
    field2:':v.pushValue2'
  }
 }
}
如果
jsonGen.build(update, {});
结果为
undefined

jsonGen.build(update, {value1:22});
结果为
{
 $set:{
  value1:22
 }
}

jsonGen.build(update, {value1:22,value2:'22'});
结果为
{
 $set:{
  value1:22,
  value2:'22'
 }
}

jsonGen.build(update, {value1:22,field1:'value'});
结果为
{
 $set:{
  value1:22
 },
 $inc:{
  incfield1:1
 }
}

jsonGen.build(update, {value1:true,allowPush:'true'});
结果为
{
 $set:{
  value1:true
 },
 $push:{
  items:{
    field1:'value1'
  }
 }
}


同样适用于 Elasticsearch
如复杂用法
template = {
    index:'user',
    type:'user',
    from:':(v.p-1)*10',
    size:10,
    body:{
        query:{
            bool:{
                must:[
                    {term:{cancel_flag:0}},
                    {term:{area2:':v.city'}},
                    {term:{area3:':v.district'}},
                    {match:{text:':v.q'}},
                    {
                     _if:':v.category1||v.category2||v.category3||v.q',
                     nested:{
                        path:'categorys',
                        query:{
                          bool:{
                            must:[
                                {term:{category1:':v.category1'}},
                                {term:{category2:':v.category2'}},
                                {term:{category3:':v.category3'}},
                                {match:{text:':v.q'}}
                            ]
                        }}
                    }}
                ]
            }
        }
    }
};

```
## 高级用法
```
1 如果 ':'或 '_if' 与当前环境有冲突的， 可以使用构造参数换掉
 const jsonGen = new require('jsonGen')({protocol:':',exclusion:'_if'});
 将':'或 '_if' 换成其它值即可
 
2 工具目前仅以undefined作为失效值， 暂时不可修改， 但是如果希望有更多的失效值检测， 可以改用simplify参数覆盖.

```

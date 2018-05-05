# JsonGen
Json生成器，与mongodb或Elasticsearch打交道时， 可以基于json模板和当前参数合并生成新json用于查询或插值

## 说明
自动基于json模板生成有效的查询json
如果指定的参数不存在， 则移除该属性
如果对象和数组内没有值了， 则全移除

##使用示例
const JsonGen = require('jsonGen')();
const orginalJsonTemplate = {
    index:'user',
    type:'doc',
    from:':(v.p-1)*10',
    size:10,
    body:{
        query:{
            bool:{
                must:[
                    {match:{text:':v.q'}}
                ]
            }
        }
    }
};

jsonGen.process(orginalJsonTemplate, {p:1});
将生成
{
    index:'user',
    type:'doc',
    from:0,
    size:10
};

jsonGen.process(orginalJsonTemplate, {q:'查询参数', p:1});
将生成
{
    index:'user',
    type:'doc',
    from:0,
    size:10,
    body:{
        query:{
            bool:{
                must:[
                    {match:{text:'查询参数'}}
                ]
            }
        }
    }
};

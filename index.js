'use strict';

class JsonGen{
    constructor(opt){
        opt = Object.assign({}, opt);
        opt.protocol = opt.protocol || ':';
        opt.exclusion = opt.exclusion || '_if';
        opt.simplify = opt.simplify || this.simplify;
        opt.allowEmptyString = opt.allowEmptyString || 'true';
        this.opt = opt;
    }
    /**
     * 总入口
     * @param {*} original  原始json
     * @param {*} v 参数
     */
    build(original, v){
        return this.object(original, v);
    }
    /**
     * 如果是对象， 对象分支
     * @param {*} original 
     * @param {*} v 
     */
    object(original, v){
        let res = {};
        let keys = Object.keys(original);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            let value = original[key];
            if (key===this.opt.exclusion){
                if (typeof value!='string'||this.opt.simplify(this.evalStr(value, v))===undefined) return undefined; // _if
                continue;
            }else if (value instanceof Array){
                value = this.array(value, v);
            }else if (typeof value=='object'){
                value = this.object(value, v);
            }else if (typeof value=='string' && value.startsWith(this.opt.protocol)){
                value = this.evalStr(value, v);
            }
            value = this.opt.simplify(value);
            if (value!==undefined) res[key] = value;
        }
        return Object.keys(res).length>0 ? res : undefined;
    }
    /**
     * 如果是数组， 数组分支
     * @param {*} original 
     * @param {*} v 
     */
    array(original, v){
        let res = [];
        for (let i = 0; i < original.length; i++) {
            let value = original[i];
            if (value instanceof Array){
                value = this.array(value, v);
            }else if (typeof value=='object'){
                value = this.object(value, v);
            }else if (typeof value=='string' && value.startsWith(this.opt.protocol)){
                value = this.evalStr(value, v);
            }
            value = this.opt.simplify(value);
            if (value!==undefined) res.push(value);
        }
        return res.length>0 ? res : undefined;
    }
    /**
     * 计算参数值， 
     * @param {*} _valueStr 
     * @param {*} v 
     */
    evalStr(_valueStr, v){
        if (typeof _valueStr !='string') return _valueStr;
        if (_valueStr.startsWith(this.opt.protocol)) _valueStr = _valueStr.substr(this.opt.protocol.length);
        return eval(_valueStr);
    }
    /**
     * 重正化， 确认参数是否有效， 无效时返回 undefined
     * @param {*} value 
     */
    simplify(value){
        if (value===null || value===undefined) return undefined;
        if ((value instanceof Array) && value.length==0) return undefined;
        if (typeof value=='string' && value.trim().length==0 && !opt.allowEmptyString) return undefined;
        if (typeof value=='number' && isNaN(value)) return undefined;
        return value;
    }

}


export default JsonGen

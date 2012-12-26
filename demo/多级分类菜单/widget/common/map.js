/*
    Map Widget for Mozilla Firefox (version 1.0.19)

    Copyright 2008 Huangchao.

    This file is part of LeafLife.

    LeafLife is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License version 2 as
    published by the Free Software Foundation.

    LeafLife is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with LeafLife. If not, see <http://www.gnu.org/licenses/>.
*/
function Map()
{
    this.dict = {};  // <key, index>
    this.keyList = [];  // [key]
    this.valueList = [];  // [value]
    this.empty = [];  // [null index]
}

Map.prototype =
{
    len: 0,  // size

    put: function(key, value)
    {
        var dict = this.dict, i = dict[key], valueList = this.valueList, empty = this.empty;
        if (i == undefined)
        {
            dict[key] = i = empty.length > 0 ? empty.pop() : valueList.length;
            ++ this.len;
            this.keyList[i] = key;
        }
        valueList[i] = value;
    },

    get: function(key)
    {
        return key == undefined ? null : this.valueList[this.dict[key]];
    },

    keys: function()
    {
        var result = [], keyList = this.keyList, i = j = 0;
        for (; i < keyList.length; ++ i)
        {
            if (keyList[i] != undefined)
            {
                result[j ++] = keyList[i];
            }
        }
        return result;
    },

    values: function()  // the backup of values
    {
        var result = [], valueList = this.valueList, i = j = 0;
        for (; i < valueList.length; ++ i)
        {
            if (valueList[i] != undefined)
            {
                result[j ++] = valueList[i];
            }
        }
        return result;
    },

    remove: function(key)
    {
        var result = null, dict = this.dict, i = dict[key], valueList = this.valueList, keyList = this.keyList;
        if (i != undefined)
        {
            result = valueList[i];
            -- this.len;
            delete dict[key];
            if (! this.len && valueList.length > 100)  // shink
            {
                keyList.length = valueList.length = this.empty.length = 0;
            }
            else
            {
                delete keyList[i];
                delete valueList[i];
                if (i == valueList.length - 1)
                {
                    -- keyList.length;
                    -- valueList.length;
                }
                else
                {
                    this.empty.push(i);
                }
            }
        }
        return result;
    },

    clear: function()
    {
        this.dict = {};
        this.len = this.keyList.length = this.valueList.length = this.empty.length = 0;
    },

    size: function()
    {
        return this.len;
    },

    containsKey: function(key)
    {
        return this.dict[key] != undefined;
    },

    each: function(func, owner)
    {
        var valueList = this.valueList, i = valueList.length - 1;
        for (; i > -1; -- i)
        {
            if (valueList[i] != undefined)
            {
                func.call(owner, valueList[i]);
            }
        }
    },

    invoke: function(func)
    {
        var args = [].slice.call(arguments, 1), valueList = this.valueList, i = valueList.length - 1;
        for (; i > -1; -- i)
        {
            if (valueList[i] != undefined)
            {
                func.apply(valueList[i], args);
            }
        }
    },

    toJSONString: function()
    {
        var dict = this.dict, keys = this.keys(), i = keys.length - 1, items = [], key, val;
        for (; i >= 0; -- i)
        {
            key = keys[i];
            val = dict[key];
            if (key != undefined && val != undefined && typeof val != "function")
            {
                items[i] = leaflife.toJSONString(key) + ':' + leaflife.toJSONString(val);
            }
        }
        return '{' + items.join(',') + '}';
    }
}

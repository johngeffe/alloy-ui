/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.3.0
build: nightly
*/
YUI.add("recordset-base",function(e){var a=e.Base.create("record",e.Base,[],{_setId:function(){return e.guid();},initializer:function(){},destructor:function(){},getValue:function(f){if(f===undefined){return this.get("data");}else{return this.get("data")[f];}return null;}},{ATTRS:{id:{valueFn:"_setId"},data:{value:null}}});e.Record=a;var b=e.ArrayList,c=e.Lang,d=e.Base.create("recordset",e.Base,[],{initializer:function(){if(!this._items){this._items=[];}this.publish("add",{defaultFn:this._defAddFn});this.publish("remove",{defaultFn:this._defRemoveFn});this.publish("empty",{defaultFn:this._defEmptyFn});this.publish("update",{defaultFn:this._defUpdateFn});this._recordsetChanged();this._syncHashTable();},destructor:function(){},_defAddFn:function(k){var f=this._items.length,j=k.added,g=k.index,h=0;for(;h<j.length;h++){if(g===f){this._items.push(j[h]);}else{this._items.splice(g,0,j[h]);g++;}}},_defRemoveFn:function(f){if(f.index===0){this._items.shift();}else{if(f.index===this._items.length-1){this._items.pop();}else{this._items.splice(f.index,f.range);}}},_defEmptyFn:function(f){this._items=[];},_defUpdateFn:function(g){for(var f=0;f<g.updated.length;f++){this._items[g.index+f]=this._changeToRecord(g.updated[f]);}},_defAddHash:function(j){var h=this.get("table"),g=this.get("key"),f=0;for(;f<j.added.length;f++){h[j.added[f].get(g)]=j.added[f];}this.set("table",h);},_defRemoveHash:function(j){var h=this.get("table"),g=this.get("key"),f=0;for(;f<j.removed.length;f++){delete h[j.removed[f].get(g)];}this.set("table",h);},_defUpdateHash:function(j){var h=this.get("table"),g=this.get("key"),f=0;for(;f<j.updated.length;f++){if(j.overwritten[f]){delete h[j.overwritten[f].get(g)];}h[j.updated[f].get(g)]=j.updated[f];}this.set("table",h);},_defEmptyHash:function(){this.set("table",{});},_setHashTable:function(){var j={},h=this.get("key"),g=0;if(this._items&&this._items.length>0){var f=this._items.length;for(;g<f;g++){j[this._items[g].get(h)]=this._items[g];}}return j;},_changeToRecord:function(g){var f;if(g instanceof e.Record){f=g;}else{f=new e.Record({data:g});}return f;},_recordsetChanged:function(){this.on(["update","add","remove","empty"],function(){this.fire("change",{});});},_syncHashTable:function(){this.after("add",function(f){this._defAddHash(f);});this.after("remove",function(f){this._defRemoveHash(f);});this.after("update",function(f){this._defUpdateHash(f);});this.after("empty",function(f){this._defEmptyHash();});},getRecord:function(f){if(c.isString(f)){return this.get("table")[f];}else{if(c.isNumber(f)){return this._items[f];}}return null;},getRecordByIndex:function(f){return this._items[f];},getRecordsByIndex:function(h,g){var j=0,f=[];g=(c.isNumber(g)&&(g>0))?g:1;for(;j<g;j++){f.push(this._items[h+j]);}return f;},getLength:function(){return this.size();},getValuesByKey:function(h){var g=0,f=this._items.length,j=[];for(;g<f;g++){j.push(this._items[g].getValue(h));}return j;},add:function(k,g){var j=[],f,h=0;f=(c.isNumber(g)&&(g>-1))?g:this._items.length;if(c.isArray(k)){for(;h<k.length;h++){j[h]=this._changeToRecord(k[h]);}}else{if(c.isObject(k)){j[0]=this._changeToRecord(k);}}this.fire("add",{added:j,index:f});return this;},remove:function(g,f){var h=[];g=(g>-1)?g:(this._items.length-1);f=(f>0)?f:1;h=this._items.slice(g,(g+f));this.fire("remove",{removed:h,range:f,index:g});return this;},empty:function(){this.fire("empty",{});return this;},update:function(j,g){var k,f,h=0;f=(!(c.isArray(j)))?[j]:j;k=this._items.slice(g,g+f.length);for(;h<f.length;h++){f[h]=this._changeToRecord(f[h]);}this.fire("update",{updated:f,overwritten:k,index:g});return this;}},{ATTRS:{records:{validator:c.isArray,getter:function(){return new e.Array(this._items);},setter:function(h){var g=[];function f(i){var j;if(i instanceof e.Record){g.push(i);}else{j=new e.Record({data:i});g.push(j);}}if(h){e.Array.each(h,f);this._items=e.Array(g);}},lazyAdd:false},table:{valueFn:"_setHashTable"},key:{value:"id",readOnly:true}}});e.augment(d,b);e.Recordset=d;},"3.3.0",{requires:["base","arraylist"]});
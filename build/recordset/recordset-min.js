/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.3.0
build: nightly
*/
YUI.add("recordset-base",function(e){var a=e.Base.create("record",e.Base,[],{_setId:function(){return e.guid();},initializer:function(){},destructor:function(){},getValue:function(f){if(f===undefined){return this.get("data");}else{return this.get("data")[f];}return null;}},{ATTRS:{id:{valueFn:"_setId"},data:{value:null}}});e.Record=a;var b=e.ArrayList,c=e.Lang,d=e.Base.create("recordset",e.Base,[],{initializer:function(){if(!this._items){this._items=[];}this.publish("add",{defaultFn:this._defAddFn});this.publish("remove",{defaultFn:this._defRemoveFn});this.publish("empty",{defaultFn:this._defEmptyFn});this.publish("update",{defaultFn:this._defUpdateFn});this._recordsetChanged();this._syncHashTable();},destructor:function(){},_defAddFn:function(k){var f=this._items.length,j=k.added,g=k.index,h=0;for(;h<j.length;h++){if(g===f){this._items.push(j[h]);}else{this._items.splice(g,0,j[h]);g++;}}},_defRemoveFn:function(f){if(f.index===0){this._items.shift();}else{if(f.index===this._items.length-1){this._items.pop();}else{this._items.splice(f.index,f.range);}}},_defEmptyFn:function(f){this._items=[];},_defUpdateFn:function(g){for(var f=0;f<g.updated.length;f++){this._items[g.index+f]=this._changeToRecord(g.updated[f]);}},_defAddHash:function(j){var h=this.get("table"),g=this.get("key"),f=0;for(;f<j.added.length;f++){h[j.added[f].get(g)]=j.added[f];}this.set("table",h);},_defRemoveHash:function(j){var h=this.get("table"),g=this.get("key"),f=0;for(;f<j.removed.length;f++){delete h[j.removed[f].get(g)];}this.set("table",h);},_defUpdateHash:function(j){var h=this.get("table"),g=this.get("key"),f=0;for(;f<j.updated.length;f++){if(j.overwritten[f]){delete h[j.overwritten[f].get(g)];}h[j.updated[f].get(g)]=j.updated[f];}this.set("table",h);},_defEmptyHash:function(){this.set("table",{});},_setHashTable:function(){var j={},h=this.get("key"),g=0;if(this._items&&this._items.length>0){var f=this._items.length;for(;g<f;g++){j[this._items[g].get(h)]=this._items[g];}}return j;},_changeToRecord:function(g){var f;if(g instanceof e.Record){f=g;}else{f=new e.Record({data:g});}return f;},_recordsetChanged:function(){this.on(["update","add","remove","empty"],function(){this.fire("change",{});});},_syncHashTable:function(){this.after("add",function(f){this._defAddHash(f);});this.after("remove",function(f){this._defRemoveHash(f);});this.after("update",function(f){this._defUpdateHash(f);});this.after("empty",function(f){this._defEmptyHash();});},getRecord:function(f){if(c.isString(f)){return this.get("table")[f];}else{if(c.isNumber(f)){return this._items[f];}}return null;},getRecordByIndex:function(f){return this._items[f];},getRecordsByIndex:function(h,g){var j=0,f=[];g=(c.isNumber(g)&&(g>0))?g:1;for(;j<g;j++){f.push(this._items[h+j]);}return f;},getLength:function(){return this.size();},getValuesByKey:function(h){var g=0,f=this._items.length,j=[];for(;g<f;g++){j.push(this._items[g].getValue(h));}return j;},add:function(k,g){var j=[],f,h=0;f=(c.isNumber(g)&&(g>-1))?g:this._items.length;if(c.isArray(k)){for(;h<k.length;h++){j[h]=this._changeToRecord(k[h]);}}else{if(c.isObject(k)){j[0]=this._changeToRecord(k);}}this.fire("add",{added:j,index:f});return this;},remove:function(g,f){var h=[];g=(g>-1)?g:(this._items.length-1);f=(f>0)?f:1;h=this._items.slice(g,(g+f));this.fire("remove",{removed:h,range:f,index:g});return this;},empty:function(){this.fire("empty",{});return this;},update:function(j,g){var k,f,h=0;f=(!(c.isArray(j)))?[j]:j;k=this._items.slice(g,g+f.length);for(;h<f.length;h++){f[h]=this._changeToRecord(f[h]);}this.fire("update",{updated:f,overwritten:k,index:g});return this;}},{ATTRS:{records:{validator:c.isArray,getter:function(){return new e.Array(this._items);},setter:function(h){var g=[];function f(i){var j;if(i instanceof e.Record){g.push(i);}else{j=new e.Record({data:i});g.push(j);}}if(h){e.Array.each(h,f);this._items=e.Array(g);}},lazyAdd:false},table:{valueFn:"_setHashTable"},key:{value:"id",readOnly:true}}});e.augment(d,b);e.Recordset=d;},"3.3.0",{requires:["base","arraylist"]});YUI.add("recordset-sort",function(d){var a=d.ArraySort.compare,c=d.Lang.isValue;function b(e,f,g){b.superclass.constructor.apply(this,arguments);}d.mix(b,{NS:"sort",NAME:"recordsetSort",ATTRS:{lastSortProperties:{value:{field:undefined,desc:true,sorter:undefined},validator:function(e){return(c(e.field)&&c(e.desc)&&c(e.sorter));}},defaultSorter:{value:function(g,e,h,i){var f=a(g.getValue(h),e.getValue(h),i);if(f===0){return a(g.get("id"),e.get("id"),i);}else{return f;}}},isSorted:{value:false}}});d.extend(b,d.Plugin.Base,{initializer:function(f){var e=this,g=this.get("host");this.publish("sort",{defaultFn:d.bind("_defSortFn",this)});this.on("sort",function(){e.set("isSorted",true);});this.onHostEvent("add",function(){e.set("isSorted",false);},g);this.onHostEvent("update",function(){e.set("isSorted",false);},g);},destructor:function(e){},_defSortFn:function(f){this.get("host")._items.sort(function(g,e){return(f.sorter)(g,e,f.field,f.desc);});this.set("lastSortProperties",f);},sort:function(e,f,g){this.fire("sort",{field:e,desc:f,sorter:g||this.get("defaultSorter")});},resort:function(){var e=this.get("lastSortProperties");this.fire("sort",{field:e.field,desc:e.desc,sorter:e.sorter||this.get("defaultSorter")});},reverse:function(){this.get("host")._items.reverse();},flip:function(){var e=this.get("lastSortProperties");if(c(e.field)){this.fire("sort",{field:e.field,desc:!e.desc,sorter:e.sorter||this.get("defaultSorter")});}else{}}});d.namespace("Plugin").RecordsetSort=b;},"3.3.0",{requires:["arraysort","recordset-base","plugin"]});YUI.add("recordset-filter",function(d){var c=d.Array,b=d.Lang;function a(e){a.superclass.constructor.apply(this,arguments);}d.mix(a,{NS:"filter",NAME:"recordsetFilter",ATTRS:{}});d.extend(a,d.Plugin.Base,{initializer:function(e){},destructor:function(e){},filter:function(i,e){var h=this.get("host").get("records"),j=[],g=i;if(b.isString(i)&&b.isValue(e)){g=function(f){if(f.getValue(i)===e){return true;
}else{return false;}};}j=c.filter(h,g);return new d.Recordset({records:j});},reject:function(e){return new d.Recordset({records:c.reject(this.get("host").get("records"),e)});},grep:function(e){return new d.Recordset({records:c.grep(this.get("host").get("records"),e)});}});d.namespace("Plugin").RecordsetFilter=a;},"3.3.0",{requires:["recordset-base","array-extras","plugin"]});YUI.add("recordset-indexer",function(b){function a(c){a.superclass.constructor.apply(this,arguments);}b.mix(a,{NS:"indexer",NAME:"recordsetIndexer",ATTRS:{hashTables:{value:{}},keys:{value:{}}}});b.extend(a,b.Plugin.Base,{initializer:function(c){var d=this.get("host");this.onHostEvent("add",b.bind("_defAddHash",this),d);this.onHostEvent("remove",b.bind("_defRemoveHash",this),d);this.onHostEvent("update",b.bind("_defUpdateHash",this),d);},destructor:function(c){},_setHashTable:function(e){var f=this.get("host"),g={},d=0,c=f.getLength();for(;d<c;d++){g[f._items[d].getValue(e)]=f._items[d];}return g;},_defAddHash:function(d){var c=this.get("hashTables");b.each(c,function(e,f){b.each(d.added||d.updated,function(g){if(g.getValue(f)){e[g.getValue(f)]=g;}});});},_defRemoveHash:function(f){var d=this.get("hashTables"),c;b.each(d,function(e,g){b.each(f.removed||f.overwritten,function(h){c=h.getValue(g);if(c&&e[c]===h){delete e[c];}});});},_defUpdateHash:function(c){c.added=c.updated;c.removed=c.overwritten;this._defAddHash(c);this._defRemoveHash(c);},createTable:function(c){var d=this.get("hashTables");d[c]=this._setHashTable(c);this.set("hashTables",d);return d[c];},getTable:function(c){return this.get("hashTables")[c];}});b.namespace("Plugin").RecordsetIndexer=a;},"3.3.0",{requires:["recordset-base","plugin"]});YUI.add("recordset",function(a){},"3.3.0",{use:["recordset-base","recordset-sort","recordset-filter","recordset-indexer"]});
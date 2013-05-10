window.Cloudvisio||function(t){var e={el:"#vis",layout:"stack",container:"svg",width:"100%",height:"100%",colors:t.scale.category20c(),chart:{}};Cloudvisio=function(t){t=t||{},this.options={},this.el=t.el||e.el,t.layout=(t.layout||e.layout).toLowerCase(),t=s.extend(e,t),this.set(t),this._container()},Cloudvisio.prototype={constructor:Cloudvisio,description:function(){return"Cloudvisio running on D3"},options:{}},Cloudvisio.prototype.models=[],Cloudvisio.prototype.data=function(t,e){return e=e||{},arguments.length?(this._data=t,e.silent||(this.models=[]),this):this._data},Cloudvisio.prototype.parse=function(t){if(t=t||!1){if("undefined"!=t.length)for(var e in t)this.models.push(t[e]);else this.models.push(t);return this}},Cloudvisio.prototype.search=function(t){return RegExp(t),this},Cloudvisio.prototype.find=function(t,e){t instanceof Array&&(t=t.join("|"));var o=RegExp(t,"gi");return e.match(o)},Cloudvisio.prototype.keys=function(t){t=t||this.data();var e=[];for(var o in t){var r=Object.keys(t[o]);for(var n in r)e.indexOf(r[n])>-1||e.push(r[n])}return e},Cloudvisio.prototype.axis=function(t){if(!arguments.length)return Object.keys(this.models[0]||{});var e=this.data();for(var o in e)this.models[o]===void 0&&(this.models[o]={}),this.models[o][t]="string"==typeof e[o][t]||"number"==typeof e[o][t]?e[o][t]:"object"==typeof e[o][t]?e[o][t].value||e[o][t].name||e[o][t].title||e[o][t].id||e[o][t]:null;return this},Cloudvisio.prototype.group=function(t,e){var o=this.data();t=t.join("`").toLowerCase().split("`");for(var r in o)if(this.models[r]=this.models[r]||{},o[r][e]!==void 0){var n=""+o[r][e],i=this.find(t,n);if(i instanceof Array){var s=i.pop().toLowerCase();this.models[r]["group_"+e]=t.indexOf(s)}else this.models[r]["group_"+e]=-1}else this.models[r]["group_"+e]=-1;return this},Cloudvisio.prototype.remove=function(t){for(var e in this.models){var o=this.models[e];o[t]!==void 0&&delete this.models[e][t]}return this},Cloudvisio.prototype.type=function(t){return this.models.length&&this.models[0][t]?this._findType(t):this._findType(t,this._data)},Cloudvisio.prototype._data={},Cloudvisio.prototype.process=function(t,e){console.log(t+" : "+e)},Cloudvisio.prototype.match=function(t){return RegExp(t),this},Cloudvisio.prototype.verbalize=function(){},Cloudvisio.prototype.chart=function(t){if(!arguments.length)return this._chart;var e;if("string"==typeof t){if(e=this.charts[t]||null,null===e)return this}else if("function"==typeof t){e=t;var o=t.prototype.layout||"untitled";this.charts[o]===void 0&&(this.charts[this.options.layout]=t,this.options.layout=o)}return this._chart=new e(this),this},Cloudvisio.prototype.charts={},Cloudvisio.prototype._chart=null;var o=function(t){this.self=t,t.set(this.defaults)};o.prototype={layout:"stack",schema:{label:"string",value:"number"},defaults:{chart:{label:!1,value:!1}},constructor:o,render:function(){var e=this.self,o=1024,r=768,n=this.data(),i=t.select(e.el+" "+e.options.container).append("svg:g").attr("transform","translate(30,738)");x=t.scale.ordinal().rangeRoundBands([0,o]),y=t.scale.linear().range([0,r]);var s=t.layout.stack()(n.values);x.domain(s[0].map(function(t){return t.x})),y.domain([0,t.max(s[s.length-1],function(t){return t.y0+t.y})]);var a=i.selectAll("g.valgroup").data(s).enter().append("svg:g").attr("class","valgroup").style("fill",function(t,o){return e.color(o)}).style("stroke",function(o,r){return t.rgb(e.color(r)).darker()});a.selectAll("rect").data(function(t){return t}).enter().append("svg:rect").attr("x",function(t){return x(t.x)}).attr("y",function(t){return-y(t.y0)-y(t.y)}).attr("height",function(t){return y(t.y)}).attr("width",x.rangeBand()),i.selectAll("text").data(n.labels).enter().append("svg:text").attr("x",function(t){return x(t)+x.rangeBand()/2}).attr("y",6).attr("text-anchor","middle").attr("dy",".71em").text(function(t){return t});var l=i.selectAll("g.rule").data(y.ticks(5)).enter().append("svg:g").attr("class","rule").attr("transform",function(t){return"translate(0,"+-y(t)+")"});l.append("svg:line").attr("x2",o).style("stroke",function(t){return t?"#fff":"#000"}).style("stroke-opacity",function(t){return t?.3:null}),l.append("svg:text").attr("x",-20).attr("dy",".35em").text(t.format(",d"))},data:function(){var t=this.self,e=t.options.chart.label,o=t.options.chart.value,r=t.models.map(function(t){return t[e]}),n=t.models.map(function(t,e){return{x:e,y:t[o]}});return{labels:r,values:[n]}}},Cloudvisio.prototype.charts.stack=o;var r=t.svg.arc(),n=function(t){this.self=t,t.set(this.defaults)};n.prototype={layout:"pie",schema:{label:"string",value:"number"},defaults:{r:384,ir:0,textOffset:100,chart:{label:!1,value:!1}},constructor:n,render:function(){var e=1024,o=768,n=this.self,i=this.data(),s=t.select(n.el+" "+n.options.container).data(i).append("svg:g").attr("transform","translate("+e/2+","+o/2+")"),a=t.layout.pie().value(function(t){return t.value}).sort(function(){return null}),l=s.selectAll("g.slice").data(a).enter().append("svg:g").attr("class","slice"),u=l.append("svg:path").attr("alt",function(t){return t.data.label}).attr("d",r.innerRadius(n.options.ir).outerRadius(n.options.r)).style("fill",function(t,e){return n.color(e)});u.transition().ease("cubic").duration(2e3).attrTween("d",this.tweenPie),l.append("svg:text").style("font-size",function(t){return 15*Math.max(1,t.data.value/100)}).attr("fill","white").attr("transform",function(t){return t.innerRadius=n.options.r/2,t.outerRadius=n.options.r,"translate("+r.centroid(t)+")"}).attr("text-anchor","middle").text(function(t){return t.data.label}).style("opacity",0).transition().ease("cubic").duration(2e3).style("opacity",1)},data:function(){var t=this.self,e=[],o=t.options.chart.label,r=t.options.chart.value;return e=t.models.map(function(t){return{label:t[o],value:t[r]}}),[e]},tweenPie:function(e){e.innerRadius=0;var o=t.interpolate({startAngle:0,endAngle:0},e);return function(t){return r(o(t))}}},Cloudvisio.prototype.charts.pie=n;var i=function(t){this.self=t,t.set(this.defaults)};i.prototype={layout:"force",schema:{label:"string",value:"number"},defaults:{charge:-20,distance:30,ir:0,chart:{label:!1,value:!1}},constructor:i,render:function(){var e=this.self,o=t.select(e.el+" "+e.options.container),r=1024,n=768,i=this.data(),s=t.layout.force().charge(e.options.charge).linkDistance(e.options.distance).size([r,n]).nodes(i).links([]).start(),a=o.selectAll(".node").data(i).enter().append("circle").attr("class","node").attr("r",5).style("fill",function(t){return e.color(t.group)}).call(s.drag);a.append("title").text(function(t){return t.name}),s.on("tick",function(t){var e=6*t.alpha;i.forEach(function(t){t.x+=2&t.group+2?e:-e,t.y+=1&t.group+2?e:-e}),a.attr("cx",function(t){return t.x}).attr("cy",function(t){return t.y})})},data:function(){var t,e,o=this.self,r=o.models,n=o.keys(r);n.indexOf("id")>-1&&(t="id"),n.indexOf("title")>-1&&(t="title"),n.indexOf("label")>-1&&(t="label"),n.indexOf("name")>-1&&(t="name");for(var i in n)0===n[i].search(/group_/gi)&&(e=n[i]);var s=[];for(var a in r)s.push({name:r[a][t],group:r[a][e]});return s}},Cloudvisio.prototype.charts.force=i,Cloudvisio.prototype.render=function(e){var o=this.chart();e=e||!1,e||(t.select(this.el).html(""),this._container());var r={append:e};null!==o&&this.ready()&&o.render(r)},Cloudvisio.prototype.update=function(){},Cloudvisio.prototype.ready=function(t){if(0===this.models.length)return!1;var e,o,r,n=!0;arguments.length?(o=this._chart,r=this.options.chart,this.chart(t),e=this._chart):e=this._chart;for(var i in e.schema){var s=this.options.chart[i]||!1;if(!s){var a=e.schema[i];if(s=this._findAxis(a)){this.options.chart[i]=s;continue}n=!1}}return arguments.length&&(this._chart=o,this.options.chart=r),n},Cloudvisio.prototype.set=function(t){if(!(t instanceof Object))return this;for(var e in t)if("chart"==e){var o=this.options.chart||{},r=t[e];this.options.chart={};for(var n in r)o[n]&&o[n]!==void 0&&!r[n]&&(t[e][n]=o[n])}return s.extend(this.options,t),t.layout&&this.chart(t.layout),this},Cloudvisio.prototype._container=function(){function e(){n.attr("transform","translate("+t.event.translate+")"+" scale("+t.event.scale+")")}var o=1024,r=768,n=t.select(this.el).append(this.options.container);return n.attr({width:this.options.width,height:this.options.height}).attr("viewBox","0 0 "+o+" "+r).attr("preserveAspectRatio","xMidYMid meet").attr("pointer-events","all").call(t.behavior.zoom().on("zoom",e)),n},Cloudvisio.prototype._findAxis=function(t){var e=this.keys(this.models);if(!e)return!1;var o=s.toArray(this.options.chart);for(var r in e)if(!(o.indexOf(e[r])>-1)&&t==this._findType(e[r]))return e[r];return!1},Cloudvisio.prototype._findType=function(t,e){var o=!1;e=e||this.models;for(var r in e){var n=typeof e[r][t];if(o&&o!=n)return"mixed";o=n}return o},Cloudvisio.prototype.colors=function(t){return arguments.length?(this.options.colors=t,this):this.options.colors},Cloudvisio.prototype.color=function(t){return this.options.colors instanceof Function?this.options.colors(t):this.options.colors[t]};var s={extend:function(t,e){for(var o in e)e[o]&&e[o].constructor&&e[o].constructor===Object?(t[o]=t[o]||{},arguments.callee(t[o],e[o])):t[o]=e[o];return t},toArray:function(t){var e=[];for(var o in t)e.push(t[o]);return e}}}(window.d3);
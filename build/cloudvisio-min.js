// @name cloudvisio - 0.5.0 (Mon, 03 Jun 2013 06:34:59 GMT)
// @url https://github.com/makesites/cloudvisio
// @license Apache License, Version 2.0
window.Cloudvisio||function(t){Cloudvisio=function(t){t=t||{},this.options={},this.el=t.el||e.el,t.layout=(t.layout||e.layout).toLowerCase(),t=s.extend(e,t),this.set(t),this._container()},Cloudvisio.prototype={constructor:Cloudvisio,description:function(){return"Cloudvisio running on D3"},options:{}};var e={el:"#vis",layout:"stack",container:"svg",width:"100%",height:"100%",colors:t.scale.category20c()};Cloudvisio.prototype.set=function(t){return t instanceof Object?(s.extend(this.options,t),t.layout&&this.chart(t.layout),this):this},Cloudvisio.prototype.models=[],Cloudvisio.prototype.data=function(t,e){return e=e||{},arguments.length?(this._data=t,e.silent||(this.models=[]),this):this._data},Cloudvisio.prototype.parse=function(t){if(t=t||!1){if("undefined"!=t.length)for(var e in t)this.models.push(t[e]);else this.models.push(t);return this}},Cloudvisio.prototype.search=function(t){return RegExp(t),this},Cloudvisio.prototype.find=function(t,e){t instanceof Array&&(t=t.join("|"));var i=RegExp(t,"gi");return e.match(i)},Cloudvisio.prototype.keys=function(t){t=t||this.data();var e=[];for(var i in t){var o=Object.keys(t[i]);for(var r in o)e.indexOf(o[r])>-1||e.push(o[r])}return e},Cloudvisio.prototype.axis=function(t,e){if(!arguments.length)return Object.keys(this.models[0]||{});if(t instanceof Object)for(var i in t)this.axis(i,t[i]);var o=this.data();for(var r in o)this.models[r]===void 0&&(this.models[r]={}),this.models[r][t]=e!==void 0?e:"string"==typeof o[r][t]||"number"==typeof o[r][t]?o[r][t]:"object"==typeof o[r][t]?o[r][t].value||o[r][t].name||o[r][t].title||o[r][t].id||o[r][t]:null;return e!==void 0&&(this._axis[t]=e),this},Cloudvisio.prototype.group=function(t,e){var i=this.data();t=t.join("`").toLowerCase().split("`");for(var o in i)if(this.models[o]=this.models[o]||{},i[o][e]!==void 0){var r=i[o][e]instanceof Object?s.toArray(i[o][e]).join("|"):""+i[o][e],n=this.find(t,r);if(n instanceof Array){var a=n.pop().toLowerCase();this.models[o]["group_"+e]=t.indexOf(a)}else this.models[o]["group_"+e]=-1}else this.models[o]["group_"+e]=-1;return this._axis.group="group_"+e,this},Cloudvisio.prototype.remove=function(t){for(var e in this.models){var i=this.models[e];i[t]!==void 0&&delete this.models[e][t]}return this},Cloudvisio.prototype.type=function(t){return this.models.length&&this.models[0][t]?this._findType(t):this._findType(t,this._data)},Cloudvisio.prototype._data={},Cloudvisio.prototype._axis={},Cloudvisio.prototype._axisSchema=function(t){self._axis={};for(var e in t)self._axis.i=!1},Cloudvisio.prototype.process=function(t,e){console.log(t+" : "+e)},Cloudvisio.prototype.match=function(t){return RegExp(t),this},Cloudvisio.prototype.eq=function(){return this},Cloudvisio.prototype.gt=function(){return this},Cloudvisio.prototype.lt=function(){return this},Cloudvisio.prototype.verbalize=function(t){t=t.replace(/\+/gi," and "),t=t.replace(/>/gi," greater than "),t=t.replace(/</gi," less than "),t=t.replace(/  /gi," ")},Cloudvisio.prototype.chart=function(t){if(!arguments.length)return this._chart;var e;if("string"==typeof t){if(e=this.charts[t]||null,null===e)return this}else if("function"==typeof t){e=t;var i=t.prototype.layout||"untitled";this.charts[i]===void 0&&(this.charts[this.options.layout]=t,this.options.layout=i)}return this._chart=new e(this),this},Cloudvisio.prototype.charts={},Cloudvisio.prototype._chart=null;var i=function(t){this.self=t,t.set(this.defaults),t._axisSchema(this.schema)};i.prototype={layout:"stack",schema:{label:"string",value:"number"},defaults:{},constructor:i,render:function(){var e=this.self,i=1024,o=768,r=this.data(),n=t.select(e.el+" "+e.options.container).append("svg:g").attr("transform","translate(30,738)");x=t.scale.ordinal().rangeRoundBands([0,i]),y=t.scale.linear().range([0,o]);var s=t.layout.stack()(r.values);x.domain(s[0].map(function(t){return t.x})),y.domain([0,t.max(s[s.length-1],function(t){return t.y0+t.y})]);var a=n.selectAll("g.valgroup").data(s).enter().append("svg:g").attr("class","valgroup").style("fill",function(t,i){return e.color(i)}).style("stroke",function(i,o){return t.rgb(e.color(o)).darker()});a.selectAll("rect").data(function(t){return t}).enter().append("svg:rect").attr("x",function(t){return x(t.x)}).attr("y",function(t){return-y(t.y0)-y(t.y)}).attr("height",function(t){return y(t.y)}).attr("width",x.rangeBand()),n.selectAll("text").data(r.labels).enter().append("svg:text").attr("x",function(t){return x(t)+x.rangeBand()/2}).attr("y",6).attr("text-anchor","middle").attr("dy",".71em").text(function(t){return t});var u=n.selectAll("g.rule").data(y.ticks(5)).enter().append("svg:g").attr("class","rule").attr("transform",function(t){return"translate(0,"+-y(t)+")"});u.append("svg:line").attr("x2",i).style("stroke",function(t){return t?"#fff":"#000"}).style("stroke-opacity",function(t){return t?.3:null}),u.append("svg:text").attr("x",-20).attr("dy",".35em").text(t.format(",d"))},data:function(){var t=this.self,e=t._axis.label,i=t._axis.value,o=t.models.map(function(t){return t[e]}),r=t.models.map(function(t,e){return{x:e,y:t[i]}});return{labels:o,values:[r]}}},Cloudvisio.prototype.charts.stack=i;var o=t.svg.arc(),r=function(t){this.self=t,t.set(this.defaults),t._axisSchema(this.schema)};r.prototype={layout:"pie",schema:{label:"string",value:"number"},defaults:{r:384,ir:0,textOffset:100},constructor:r,render:function(){var e=1024,i=768,r=this.self,n=this.data(),s=t.select(r.el+" "+r.options.container).data(n).append("svg:g").attr("transform","translate("+e/2+","+i/2+")"),a=t.layout.pie().value(function(t){return t.value}).sort(function(){return null}),u=s.selectAll("g.slice").data(a).enter().append("svg:g").attr("class","slice"),l=u.append("svg:path").attr("alt",function(t){return t.data.label}).attr("d",o.innerRadius(r.options.ir).outerRadius(r.options.r)).style("fill",function(t,e){return r.color(e)});l.transition().ease("cubic").duration(2e3).attrTween("d",this.tweenPie),u.append("svg:text").style("font-size",function(t){return 15*Math.max(1,t.data.value/100)}).attr("fill","white").attr("transform",function(t){return t.innerRadius=r.options.r/2,t.outerRadius=r.options.r,"translate("+o.centroid(t)+")"}).attr("text-anchor","middle").text(function(t){return t.data.label}).style("opacity",0).transition().ease("cubic").duration(2e3).style("opacity",1)},data:function(){var t=this.self,e=[],i=t._axis.label,o=t._axis.value;return e=t.models.map(function(t){return{label:t[i],value:t[o]}}),[e]},tweenPie:function(e){e.innerRadius=0;var i=t.interpolate({startAngle:0,endAngle:0},e);return function(t){return o(i(t))}}},Cloudvisio.prototype.charts.pie=r;var n=function(t){this.self=t,t.set(this.defaults),t._axisSchema(this.schema)};n.prototype={layout:"force",schema:{label:"string",group:"number",radius:"number"},defaults:{charge:-20,distance:30,ir:0,radius:5},constructor:n,render:function(){var e=this.self,i=this,o=t.select(e.el+" "+e.options.container),r=1024,n=768,s=this.nodes=this.data(),a=t.layout.force().charge(e.options.charge).linkDistance(e.options.distance).size([r,n]).nodes(s).links([]).start();this.node=o.selectAll(".node").data(s).enter().append("circle").attr("class","node").attr("r",function(t){return t.radius}).style("fill",function(t){return e.color(t.group)}).call(a.drag),this.node.append("title").text(function(t){return t.name}),a.on("tick",function(t){i.update(t)})},data:function(){var t=this.self,e=t.models,i=t._axis.label,o=t._axis.group,r=t._axis.radius,n=[];for(var s in e)n.push({name:e[s][i],group:e[s][o],radius:isNaN(r)?e[s][r]:r});return n},update:function(e){var i=6*e.alpha;this.nodes.forEach(function(t){t.x+=2&t.group+2?i:-i,t.y+=1&t.group+2?i:-i});for(var o=t.geom.quadtree(this.nodes),r=0,n=this.nodes.length;n>++r;)o.visit(this.collide(this.nodes[r]));this.node.attr("cx",function(t){return t.x}).attr("cy",function(t){return t.y})},collide:function(t){var e=t.radius+16,i=t.x-e,o=t.x+e,r=t.y-e,n=t.y+e;return function(e,s,a,u,l){if(e.point&&e.point!==t){var c=t.x-e.point.x,d=t.y-e.point.y,p=Math.sqrt(c*c+d*d),h=t.radius+e.point.radius;h>p&&(p=.5*((p-h)/p),t.x-=c*=p,t.y-=d*=p,e.point.x+=c,e.point.y+=d)}return s>o||i>u||a>n||r>l}}},Cloudvisio.prototype.charts.force=n,Cloudvisio.prototype.render=function(e){var i=this.chart();e=e||!1,e||(t.select(this.el).html(""),this._container());var o={append:e};null!==i&&this.ready()&&i.render(o)},Cloudvisio.prototype.update=function(){},Cloudvisio.prototype.ready=function(t){if(0===this.models.length)return!1;var e,i,o,r=!0;arguments.length?(i=this._chart,o=this._axis,this.chart(t),e=this._chart):e=this._chart;for(var n in e.schema){var s=this._axis[n]||!1;if(!s){var a=e.schema[n];if(s=this._findAxis(a)){this._axis[n]=s;continue}r=!1}}return arguments.length&&(this._chart=i,this._axis=o),r},Cloudvisio.prototype._container=function(){function e(){r.attr("transform","translate("+t.event.translate+")"+" scale("+t.event.scale+")")}var i=1024,o=768,r=t.select(this.el).append(this.options.container);return r.attr({width:this.options.width,height:this.options.height}).attr("viewBox","0 0 "+i+" "+o).attr("preserveAspectRatio","xMidYMid meet").attr("pointer-events","all").call(t.behavior.zoom().on("zoom",e)),r},Cloudvisio.prototype._findAxis=function(t){var e=this.keys(this.models);if(!e)return!1;var i=s.toArray(this._axis);for(var o in e)if(!(i.indexOf(e[o])>-1)&&t==this._findType(e[o]))return e[o];return!1},Cloudvisio.prototype._findType=function(t,e){var i=!1;e=e||this.models;for(var o in e){var r=typeof e[o][t];if(i&&i!=r)return"mixed";i=r}return i},Cloudvisio.prototype.colors=function(t){return arguments.length?(this.options.colors=t,this):this.options.colors},Cloudvisio.prototype.color=function(t){return this.options.colors instanceof Function?this.options.colors(t):this.options.colors[t]};var s={extend:function(t,e){for(var i in e)e[i]&&e[i].constructor&&e[i].constructor===Object?(t[i]=t[i]||{},arguments.callee(t[i],e[i])):t[i]=e[i];return t},toArray:function(t){var e=[];for(var i in t)e.push(t[i]);return e}}}(window.d3);
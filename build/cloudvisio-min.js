// @name cloudvisio - 0.5.0 (Wed, 05 Jun 2013 11:38:31 GMT)
// @url https://github.com/makesites/cloudvisio
// @license Apache License, Version 2.0
window.Cloudvisio||function(t){Cloudvisio=function(t){t=t||{},this.options={},this.el=t.el||e.el,t.layout=(t.layout||e.layout).toLowerCase(),t=a.extend(e,t),this.set(t)},Cloudvisio.prototype={constructor:Cloudvisio,description:function(){return"Cloudvisio running on D3"},options:{}};var e={el:"#vis",layout:"stack",container:"svg",width:"100%",height:"100%",colors:t.scale.category20c(),renderErrors:!1};Cloudvisio.prototype.set=function(t){return t instanceof Object?(a.extend(this.options,t),t.layout&&this.chart(t.layout),this):this},Cloudvisio.prototype.models=[],Cloudvisio.prototype.data=function(t,e){return e=e||{},arguments.length?(this._data=t,e.silent||(this.models=[]),this):this._data},Cloudvisio.prototype.parse=function(t){if(t=t||!1){if("undefined"!=t.length)for(var e in t)this.models.push(t[e]);else this.models.push(t);return this.ready(),this}},Cloudvisio.prototype.search=function(t){return RegExp(t),this},Cloudvisio.prototype.find=function(t){if(this._selectedField){var e=this._selectedField;"boolean"==typeof t&&(t=t?"true":"false"),this.group([t],e)}},Cloudvisio.prototype.keys=function(t){t=t||this.data();var e=[];for(var i in t){var r=Object.keys(t[i]);for(var o in r)e.indexOf(r[o])>-1||e.push(r[o])}return e},Cloudvisio.prototype.axis=function(t,e){if(!arguments.length)return Object.keys(this.models[0]||{});if(t instanceof Object)for(var i in t)this.axis(i,t[i]);var r=this.data();for(var o in r)this.models[o]===void 0&&(this.models[o]={}),this.models[o][t]=e!==void 0?e:"string"==typeof r[o][t]||"number"==typeof r[o][t]?r[o][t]:"object"==typeof r[o][t]?r[o][t].value||r[o][t].name||r[o][t].title||r[o][t].id||r[o][t]:null;return e!==void 0&&(this._axis[t]=e),this},Cloudvisio.prototype.group=function(t,e){var i=this.data();t=t.join("`").toLowerCase().split("`");for(var r in i)if(this.models[r]=this.models[r]||{},i[r][e]!==void 0){var o=i[r][e]instanceof Object?a.toArray(i[r][e]).join("|"):""+i[r][e],n=this._find(t,o);if(n instanceof Array){var s=n.pop().toLowerCase();this.models[r]["group_"+e]=t.indexOf(s)}else this.models[r]["group_"+e]=-1}else this.models[r]["group_"+e]=-1;var u=this._lookupSchema("number","group_"+e);return this._axis[u]="group_"+e,this},Cloudvisio.prototype.select=function(t){var e=this.keys();return this._selectedField=e.indexOf(t)>-1?t:!1,this},Cloudvisio.prototype.remove=function(t){for(var e in this.models){var i=this.models[e];i[t]!==void 0&&delete this.models[e][t]}return this},Cloudvisio.prototype.type=function(t){return this.models.length&&this.models[0][t]?this._findType(t):this._findType(t,this._data)},Cloudvisio.prototype._data=[],Cloudvisio.prototype._axis={},Cloudvisio.prototype._selectedField=!1,Cloudvisio.prototype._axisSchema=function(t){this._axis={};for(var e in t)this._axis[e]=!1},Cloudvisio.prototype._find=function(t,e){t instanceof Array&&(t=t.join("|"));var i=RegExp(t,"gi");return e.match(i)},Cloudvisio.prototype.process=function(t,e){console.log(t+" : "+e)},Cloudvisio.prototype.match=function(t){return RegExp(t),this},Cloudvisio.prototype.eq=function(){return this},Cloudvisio.prototype.gt=function(){return this},Cloudvisio.prototype.lt=function(){return this},Cloudvisio.prototype.verbalize=function(t){t=t.replace(/\+/gi," and "),t=t.replace(/>/gi," greater than "),t=t.replace(/</gi," less than "),t=t.replace(/  /gi," ")},Cloudvisio.prototype.status=function(e){var r={},o=this.chart();e=e||!1,0===this._data.length&&(r[101]=i[101]),0===this.models.length&&(r[102]=i[102]);for(var n in this._axis){var s=this._axis[n];if(!s){var a=o.schema[n];switch(a){case"string":r[103]=i[103].replace(/_field_/gi,n);break;case"number":r[104]=i[104].replace(/_field_/gi,n)}}}if(0===Object.keys(r).length&&(r[200]=i[200]),e){var u=t.select(this.el),l='<div class="error">';l+="<p>There were the following errors:</p>",l+="<ul>";for(var c in r)l+="<li>"+r[c]+"</li>";l+="</ul>",l+="</div>",u.html(l)}return r};var i={101:"Missing source data",102:"No axis created",103:"Missing string: _field_",104:"Missing number: _field_",105:"Missing group: _field_",200:"OK"};Cloudvisio.prototype.chart=function(t){if(!arguments.length)return this._chart;var e;if("string"==typeof t){if(e=this.charts[t]||null,null===e)return this}else if("function"==typeof t){e=t;var i=t.prototype.layout||"untitled";this.charts[i]===void 0&&(this.charts[this.options.layout]=t,this.options.layout=i)}return this._chart=new e(this),this},Cloudvisio.prototype.charts={},Cloudvisio.prototype._lookupSchema=function(t,e){if(t=t||!1,e=e||!1,!t)return!1;var i=Object.keys(this._axis);if(!i)return!1;var r=this.chart().schema;if(e&&i[e]&&r[e]==t)return console.log("preferred",e),e;for(var o in r)if(r[o]==t)return o;return!1},Cloudvisio.prototype._chart=null;var r=function(t){this.self=t,t.set(this.defaults),t._axisSchema(this.schema)};r.prototype={layout:"stack",schema:{label:"string",value:"number"},defaults:{},constructor:r,render:function(){var e=this.self,i=1024,r=768,o=this.data(),n=t.select(e.el+" "+e.options.container).append("svg:g").attr("transform","translate(30,738)");x=t.scale.ordinal().rangeRoundBands([0,i]),y=t.scale.linear().range([0,r]);var s=t.layout.stack()(o.values);x.domain(s[0].map(function(t){return t.x})),y.domain([0,t.max(s[s.length-1],function(t){return t.y0+t.y})]);var a=n.selectAll("g.valgroup").data(s).enter().append("svg:g").attr("class","valgroup").style("fill",function(t,i){return e.color(i)}).style("stroke",function(i,r){return t.rgb(e.color(r)).darker()});a.selectAll("rect").data(function(t){return t}).enter().append("svg:rect").attr("x",function(t){return x(t.x)}).attr("y",function(t){return-y(t.y0)-y(t.y)}).attr("height",function(t){return y(t.y)}).attr("width",x.rangeBand()),n.selectAll("text").data(o.labels).enter().append("svg:text").attr("x",function(t){return x(t)+x.rangeBand()/2}).attr("y",6).attr("text-anchor","middle").attr("dy",".71em").text(function(t){return t});var u=n.selectAll("g.rule").data(y.ticks(5)).enter().append("svg:g").attr("class","rule").attr("transform",function(t){return"translate(0,"+-y(t)+")"});u.append("svg:line").attr("x2",i).style("stroke",function(t){return t?"#fff":"#000"}).style("stroke-opacity",function(t){return t?.3:null}),u.append("svg:text").attr("x",-20).attr("dy",".35em").text(t.format(",d"))},data:function(){var t=this.self,e=t._axis.label,i=t._axis.value,r=t.models.map(function(t){return t[e]}),o=t.models.map(function(t,e){return{x:e,y:t[i]}});return{labels:r,values:[o]}}},Cloudvisio.prototype.charts.stack=r;var o=t.svg.arc(),n=function(t){this.self=t,t.set(this.defaults),t._axisSchema(this.schema)};n.prototype={layout:"pie",schema:{label:"string",value:"number"},defaults:{r:384,ir:0,textOffset:100},constructor:n,render:function(){var e=1024,i=768,r=this.self,n=this.data(),s=t.select(r.el+" "+r.options.container).data(n).append("svg:g").attr("transform","translate("+e/2+","+i/2+")"),a=t.layout.pie().value(function(t){return t.value}).sort(function(){return null}),u=s.selectAll("g.slice").data(a).enter().append("svg:g").attr("class","slice"),l=u.append("svg:path").attr("alt",function(t){return t.data.label}).attr("d",o.innerRadius(r.options.ir).outerRadius(r.options.r)).style("fill",function(t,e){return r.color(e)});l.transition().ease("cubic").duration(2e3).attrTween("d",this.tweenPie),u.append("svg:text").style("font-size",function(t){return 15*Math.max(1,t.data.value/100)}).attr("fill","white").attr("transform",function(t){return t.innerRadius=r.options.r/2,t.outerRadius=r.options.r,"translate("+o.centroid(t)+")"}).attr("text-anchor","middle").text(function(t){return t.data.label}).style("opacity",0).transition().ease("cubic").duration(2e3).style("opacity",1)},data:function(){var t=this.self,e=[],i=t._axis.label,r=t._axis.value;return e=t.models.map(function(t){return{label:t[i],value:t[r]}}),[e]},tweenPie:function(e){e.innerRadius=0;var i=t.interpolate({startAngle:0,endAngle:0},e);return function(t){return o(i(t))}}},Cloudvisio.prototype.charts.pie=n;var s=function(t){this.self=t,t.set(this.defaults),t._axisSchema(this.schema)};s.prototype={layout:"force",schema:{label:"string",group:"number",radius:"number"},defaults:{charge:-20,distance:30,ir:0,radius:5},constructor:s,render:function(){var e=this.self,i=this,r=t.select(e.el+" "+e.options.container),o=1024,n=768,s=this.nodes=this.data(),a=t.layout.force().charge(e.options.charge).linkDistance(e.options.distance).size([o,n]).nodes(s).links([]).start();this.node=r.selectAll(".node").data(s).enter().append("circle").attr("class","node").attr("r",function(t){return t.radius}).style("fill",function(t){return e.color(t.group)}).call(a.drag),this.node.append("title").text(function(t){return t.name}),a.on("tick",function(t){i.update(t)})},data:function(){var t=this.self,e=t.models,i=t._axis.label,r=t._axis.group,o=t._axis.radius,n=[];for(var s in e)n.push({name:e[s][i],group:e[s][r],radius:isNaN(o)?e[s][o]:o});return n},update:function(e){var i=6*e.alpha;this.nodes.forEach(function(t){t.x+=2&t.group+2?i:-i,t.y+=1&t.group+2?i:-i});for(var r=t.geom.quadtree(this.nodes),o=0,n=this.nodes.length;n>++o;)r.visit(this.collide(this.nodes[o]));this.node.attr("cx",function(t){return t.x}).attr("cy",function(t){return t.y})},collide:function(t){var e=t.radius+16,i=t.x-e,r=t.x+e,o=t.y-e,n=t.y+e;return function(e,s,a,u,l){if(e.point&&e.point!==t){var c=t.x-e.point.x,d=t.y-e.point.y,h=Math.sqrt(c*c+d*d),p=t.radius+e.point.radius;p>h&&(h=.5*((h-p)/h),t.x-=c*=h,t.y-=d*=h,e.point.x+=c,e.point.y+=d)}return s>r||i>u||a>n||o>l}}},Cloudvisio.prototype.charts.force=s,Cloudvisio.prototype.render=function(t){t=t||!1;var e=this.chart();if(null!==e){var i={append:t};return this.ready()?(t||this._container(),e.render(i),this.status()):this.options.renderErrors?this.status("string"):this.status()}},Cloudvisio.prototype.update=function(){},Cloudvisio.prototype.ready=function(t){if(0===this.models.length)return!1;var e,i,r,o=!0;arguments.length?(i=this._chart,r=this._axis,this.chart(t),e=this._chart):e=this._chart;for(var n in e.schema){var s=this._axis[n]||!1;if(!s){var a=e.schema[n];if(s=this._findAxis(a)){this._axis[n]=s;continue}o=!1}}return arguments.length&&(this._chart=i,this._axis=r),o},Cloudvisio.prototype._container=function(){function e(){o.attr("transform","translate("+t.event.translate+")"+" scale("+t.event.scale+")")}var i=1024,r=768,o=t.select(this.el).html("").append(this.options.container);return o.attr({width:this.options.width,height:this.options.height}).attr("viewBox","0 0 "+i+" "+r).attr("preserveAspectRatio","xMidYMid meet").attr("pointer-events","all").call(t.behavior.zoom().on("zoom",e)),o},Cloudvisio.prototype._findAxis=function(t){var e=this.keys(this.models);if(!e)return!1;var i=a.toArray(this._axis);for(var r in e)if(!(i.indexOf(e[r])>-1)&&t==this._findType(e[r]))return e[r];return!1},Cloudvisio.prototype._findType=function(t,e){var i=!1;e=e||this.models;for(var r in e){var o=typeof e[r][t];if(i&&i!=o)return"mixed";i=o}return i},Cloudvisio.prototype.colors=function(t){return arguments.length?(this.options.colors=t,this):this.options.colors},Cloudvisio.prototype.color=function(t){return this.options.colors instanceof Function?this.options.colors(t):this.options.colors[t]};var a={extend:function(t,e){for(var i in e)e[i]&&e[i].constructor&&e[i].constructor===Object?(t[i]=t[i]||{},arguments.callee(t[i],e[i])):t[i]=e[i];return t},toArray:function(t){var e=[];for(var i in t)e.push(t[i]);return e}}}(window.d3);
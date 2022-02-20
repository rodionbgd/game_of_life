!function(){"use strict";function e(e,t){for(var i=0;i<t.length;i++){var l=t[i];l.enumerable=l.enumerable||!1,l.configurable=!0,"value"in l&&(l.writable=!0),Object.defineProperty(e,l.key,l)}}var t=function(){function t(e){var i=this;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),this.gameField=e.elem,this.height=e.height,this.width=e.width,this.allCells=Array.from(Array(this.height),(function(){return new Array(i.width).fill(0)})),this.aliveCellNumber=0}var i,l;return i=t,(l=[{key:"generateRandField",value:function(e,t,i){this.allCells=JSON.parse(JSON.stringify(i)),this.aliveCellNumber=0;for(var l=0;l<e;l+=1)for(var a=0;a<t;a+=1)Math.round(Math.random())?(this.gameField.rows[l].cells[a].classList.add("alive"),this.allCells[l][a]=1,this.aliveCellNumber+=1):(this.gameField.rows[l].cells[a].classList.remove("alive"),this.allCells[l][a]=0);return{gameField:this.gameField,allCells:this.allCells,aliveCellNumber:this.aliveCellNumber}}},{key:"generateField",value:function(){for(var e=document.createElement("tbody"),t=0;t<this.height;t+=1){for(var i=document.createElement("tr"),l=0;l<this.width;l+=1){var a=this.createCell(t,l);i.append(a)}e.append(i)}return this.gameField.append(e),{gameField:this.gameField,allCells:this.allCells,aliveCellNumber:this.aliveCellNumber}}},{key:"createCell",value:function(e,t){var i=document.createElement("td");return i.dataset.row="".concat(e),i.dataset.col="".concat(t),i.className="c c".concat(Math.floor(4*Math.random()+1)),i}}])&&e(i.prototype,l),t}();function i(e,t){for(var i=0;i<t.length;i++){var l=t[i];l.enumerable=l.enumerable||!1,l.configurable=!0,"value"in l&&(l.writable=!0),Object.defineProperty(e,l.key,l)}}var l=function(){function e(i){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.startBtn=i.startBtn,this.widthElem=i.widthElem,this.heightElem=i.heightElem,this.width=Number(i.widthElem.value)<Number(i.widthElem.min)?Number(i.widthElem.min):Number(i.widthElem.value),this.height=Number(i.heightElem.value)<Number(i.heightElem.min)?Number(i.heightElem.min):Number(i.heightElem.value),this.slider=i.slider,this.gameFieldRender=new t({elem:i.gameField,width:this.width,height:this.height});var l=this.gameFieldRender.generateField();this.interval=void 0,this.gameField=l.gameField,this.allCells=l.allCells,this.inactiveArr=JSON.parse(JSON.stringify(this.allCells)),this.aliveCellNumber=l.aliveCellNumber,this.lastSpeed=Number(this.slider.value)||50}var l,a;return l=e,a=[{key:"generateRandField",value:function(){var e=this.gameFieldRender.generateRandField(this.height,this.width,this.allCells);this.gameField=e.gameField,this.allCells=e.allCells,this.inactiveArr=JSON.parse(JSON.stringify(this.allCells)),this.aliveCellNumber=e.aliveCellNumber}},{key:"draw",value:function(e){var t=e.target;if("td"===t.tagName.toLowerCase()){var i=t.className,l=Number(t.dataset.row),a=Number(t.dataset.col);-1===i.indexOf("alive")?(t.classList.add("alive"),this.allCells[l][a]=1,this.aliveCellNumber+=1):(t.classList.toggle("alive"),this.allCells[l][a]=this.allCells[l][a]?0:1,0===this.allCells[l][a]&&(this.aliveCellNumber-=1))}}},{key:"countNeighbours",value:function(e,t){for(var i=0,l=-1;l<2;l+=1)for(var a=-1;a<2;a+=1)if(l||a){try{var r=(e+l+this.width)%this.width,s=(t+a+this.height)%this.height;1===this.allCells[r][s]&&(i+=1)}catch(e){continue}if(i>3)return i}return i}},{key:"updateCellValue",value:function(e,t){var i=this.countNeighbours(e,t);return i>3||i<2?0:0===this.allCells[e][t]&&3===i?1:this.allCells[e][t]}},{key:"renderField",value:function(e,t){var i=this;if(!Number.isNaN(e)&&!Number.isNaN(t)){if(this.height<e){var l=Array.from(Array(e-this.height),(function(){return new Array(i.width).fill(0)}));this.allCells=this.allCells.concat(l),this.inactiveArr=this.inactiveArr.concat(l);for(var a=this.height;a<e;a+=1){for(var r=document.createElement("tr"),s=0;s<this.width;s+=1){var h=this.gameFieldRender.createCell(a,s);r.append(h)}this.gameField.tBodies[0].append(r)}this.height=e}else if(this.height>e){for(var n=0;n<this.height-e;n+=1)this.aliveCellNumber-=this.allCells[e].filter((function(e){return 1===e})).length,this.gameField.rows[e].remove();this.allCells.splice(e,this.height-e),this.inactiveArr.splice(e,this.height-e),this.height=e}if(this.width<t){var d=new Array(t-this.width).fill(0);this.allCells=this.allCells.map((function(e){return e.concat(d)})),this.inactiveArr=this.inactiveArr.map((function(e){return e.concat(d)}));for(var u=0;u<this.height;u+=1)for(var c=this.width;c<t;c+=1){var m=this.gameFieldRender.createCell(u,c);this.gameField.rows[u].append(m)}this.width=t}else if(this.width>t){this.allCells.forEach((function(e){i.aliveCellNumber-=e[e.length-1],e.splice(t,i.width-t)})),this.inactiveArr.forEach((function(e){e.splice(t,i.width-t)}));for(var v=0;v<this.height;v+=1)for(var o=t;o<this.width;o+=1)this.gameField.rows[v].lastElementChild.remove();this.width=t}}}},{key:"setHeight",value:function(){Number(this.heightElem.value)<Number(this.heightElem.min)&&(this.heightElem.value=this.heightElem.min),this.renderField(Number(this.heightElem.value),this.width)}},{key:"setWidth",value:function(){Number(this.widthElem.value)<Number(this.widthElem.min)&&(this.widthElem.value=this.widthElem.min),this.renderField(this.height,Number(this.widthElem.value))}},{key:"updateGameField",value:function(e){var t=this;if(2!==e&&this.lastSpeed!==Number(this.slider.value))return this.lastSpeed=Number(this.slider.value),clearInterval(this.interval),void this.lifeCycle(4);for(var i=0;i<this.height;i+=1)for(var l=function(l){var a=t.allCells[i][l];t.inactiveArr[i][l]=t.updateCellValue(i,l);var r=t.gameField.rows[i].cells[l];if(t.inactiveArr[i][l]!==a){var s="";1===t.inactiveArr[i][l]?(2===e&&(s="new-alive"),t.aliveCellNumber+=1):(2===e&&(s="new-dead"),t.aliveCellNumber-=1),2===e&&(r.classList.add(s),setTimeout((function(){return r.classList.remove(s)}),1e3)),r.classList.toggle("alive")}},a=0;a<this.width;a+=1)l(a);this.allCells=JSON.parse(JSON.stringify(this.inactiveArr)),this.aliveCellNumber||(clearInterval(this.interval),this.startBtn.innerHTML="start")}},{key:"lifeCycle",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;if(!this.aliveCellNumber)return clearInterval(this.interval),void(this.startBtn.innerHTML="start");if(0!==e||"start"!==this.startBtn.innerHTML){if("stop"===this.startBtn.innerHTML&&1===e)return clearInterval(this.interval),void(this.startBtn.innerHTML="start");if(this.startBtn.innerHTML="stop",2===e)return this.startBtn.innerHTML="start",clearInterval(this.interval),void this.updateGameField.call(this,2);this.interval=setInterval(this.updateGameField.bind(this),10*(100-this.lastSpeed))}}}],a&&i(l.prototype,a),e}();!function(){var e=document.getElementById("gamefield"),t=document.getElementById("start"),i=document.getElementById("random"),a=document.getElementById("next"),r=document.getElementById("width"),s=document.getElementById("height"),h=document.getElementById("slider"),n=document.getElementById("tooltip");if(e&&t&&i&&a&&r&&s&&h&&n){h.value=h.getAttribute("value");var d=new l({widthElem:r,heightElem:s,startBtn:t,gameField:e,slider:h});e.addEventListener("click",d.draw.bind(d)),r.addEventListener("input",d.setWidth.bind(d)),s.addEventListener("input",d.setHeight.bind(d)),t.addEventListener("click",d.lifeCycle.bind(d,1)),i.addEventListener("click",d.generateRandField.bind(d)),a.addEventListener("click",d.lifeCycle.bind(d,2)),h.addEventListener("input",(function(){n.textContent=h.value,Number(h.value)>50?n.style.setProperty("left","calc(".concat(h.value,"%  - ").concat(Number(h.value)/100*9/2+n.clientWidth/2,"px)")):n.style.setProperty("left","calc(".concat(h.value,"%  - ").concat(n.clientWidth/2-9*(.5-Number(h.value)/50)/2,"px)"))}))}}()}();
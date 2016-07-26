function extend(dobj,nobj){
	var obj = {};
	for(var i in dobj){
		obj[i] = dobj[i];
	}
	for(var j in nobj){
		obj[j] = nobj[j];
	}
	return obj;
}

function insertValueHander(){
	var ls = localStorage.getItem('insert');
	if(ls == 'true'){
		return true;
	}
	else if(ls == 'false'){
		return false;
	}
	else{
		return true;
	}
}

/* 渲染图片style */
function renderImg(obj,options){
	obj.src = options.cover;
	obj.id="psdimg";
	obj.style.width = '100%';
	obj.style.position = 'absolute';
	obj.style.top = options.top;
	obj.style.left = options.left;
	obj.style.zIndex = '10000000000';
	obj.style.opacity = options.alpha;
	obj.style.display = options.display;
}

/* 所有的设置都进行永久化存储 */
function saveOptions(options){
	for(var key in options){
		localStorage.setItem(key,options[key]);
	}
}

/* 继承默认配置 */
function getWholeOptions(opts){
	var opts = opts || {};
	var defaultOptions = {
		cover: localStorage.getItem('cover'),//蒙层
		alpha: localStorage.getItem('alpha') || 0.3,//透明值
		left: localStorage.getItem('left') || 0,//与左边的距离,百分比
		top: localStorage.getItem('top') || 0,//与顶部的距离，百分比
		display: localStorage.getItem('display') || 'block', //是否显示
		insert: insertValueHander() //是否插入,没有设置则默认插入
	};
	return extend(defaultOptions,opts);
}

/**
* 根据条件插入图片蒙层
*/
function action(opts){
	var opts = opts || {};
	var options = getWholeOptions(opts);
	saveOptions(options);//永久化存储设置
	if(options.cover){//有蒙层信息

		var psdimg = document.getElementById('psdimg');
		if(options.insert){//允许插入

			if(psdimg){//页面中已经存在插入的蒙层，则直接改变值就好了
				renderImg(psdimg,options);
			}
			else{
				var img = new Image();
				renderImg(img,options);
				document.body.appendChild(img);
			}
		}
		else{
			if(psdimg){
				document.body.removeChild(psdimg);
			}
		}
	}
	else{//无蒙层信息
		if(Object.getOwnPropertyNames(opts).length > 0){
			alert('你还没有上传图片，请先上传图片');
		}
	}
}






//接收popup.js的消息
chrome.extension.onMessage.addListener(function(message, sender, sendResponse){
	//pop元素改变状态后，执行这里
	if(!message) return;
	var opts = message;
	action(opts);
	sendResponse(getWholeOptions(opts));
})

//页面加载进来以后就执行这里
action();

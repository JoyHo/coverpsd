function getDom(id){
  return document.getElementById(id);
}

/* 所有的设置都进行永久化存储 */
function saveOptions(options){
  for(var key in options){
    localStorage.setItem(key,options[key]);
  }
}

function sendMessage(message){
    chrome.tabs.query({active:true, currentWindow:true},function(tabs){
            chrome.tabs.sendMessage(tabs[0].id,message,function(response){
              var data = response;
              saveOptions(data);
            });
        });
}

function getItem(key){
  return localStorage.getItem(key);
}

function parsePercent(c){
    return parseInt(c.replace('%',''));
}

function getInitData(){
    var data = {
        alpha: getItem('alpha') || 0.3,
        left: getItem('left') || '0%',
        top: getItem('top') || '0%',
        display: getItem('display') || 'block',
        insert: getItem('insert') || 'true'
    };
    return data;
}


document.addEventListener('DOMContentLoaded', function () {

  var uploadBtn = getDom('upload'),
    alphaBtn = getDom('alpha'),
    disLeftBtn = getDom('disLeft'),
    disTopBtn = getDom('disTop'),
    disBlockBtn = getDom('disBlock'),
    disNoneBtn = getDom('disNone'),
    notInsertBtn = getDom('notInsert'),
    insertBtn = getDom('insert');
  //初始化按钮值
  function init(){
    var data = getInitData();
    alphaBtn.value = (data.alpha) * 100;
    disLeftBtn.value = parsePercent(data.left);
    disTopBtn.value = parsePercent(data.top);
    switch(data.display){
      case 'block':
          disBlockBtn.checked = true;
          disNoneBtn.checked = false;
          break;
      case 'none':
          disBlockBtn.checked = false;
          disNoneBtn.checked = true;
          break;
    }

    switch(data.insert){
      case 'true':
        notInsertBtn.checked = false;
        insertBtn.checked = true;
        break;
      case 'false':
        notInsertBtn.checked = true;
        insertBtn.checked = false;
        break;
    }

  }

  init();

  //文件上传按钮事件
  uploadBtn.onchange = function(){
  	var file = this.files[0];
  	if(!/image\/\w+/.test(file.type)){
        alert("请确保文件为图像类型");
        return false;
    }
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(e){
    	var result = this.result;
      sendMessage({'cover':result});
    }
  }


  //调整透明值按钮事件
  alphaBtn.onchange = function(){
      var alpha = this.value/100;
      sendMessage({'alpha':alpha});
  }

  //调整左边距离按钮事件
  disLeftBtn.onchange = function(){
      var left = this.value+'%';
      sendMessage({'left':left});
  }

  //调整顶部距离按钮事件
  disTopBtn.onchange = function(){
      var top = this.value+'%';
      sendMessage({'top':top});
  }

  //调整display
  disBlockBtn.onchange = disNoneBtn.onchange = function(){
    var display = this.value;
    sendMessage({'display':display});
  }

  //调整是否插入
  notInsertBtn.onchange = insertBtn.onchange = function(){
    var insert = this.value=='true'?true:false;
    sendMessage({'insert':insert});
  }

});
let cv, ctx, fb, btnCount; //canvas, コンストラクト, fabric管理, ボタンが押された回数

window.onload = function() {
    //canvas, コンストラクト, fabricの初期化
    cv = document.getElementById('cv');
    ctx = cv.getContext('2d');
    ctx.strokeStyle = "blue";
    fb = new fabric.Canvas('cv');
    btnCount = 0;

    //  1番目のレイヤーを作る。
    let firstButton = document.getElementById("l1");
    createLayer(firstButton);
    saveLayer(firstButton.ly);

    //canvasサイズの描画メソッド
    function fitCanvasSize() {
        //親のdivから幅と高さを引っ張ってきて代入
        let wrapper = document.getElementById('canvas-wrapper');
        let style = window.getComputedStyle(wrapper);
        fb.setWidth(parseInt(style.width));
        fb.setHeight(parseInt(style.height));
        fb.renderAll();
    }
    //ロード時とウィンドウのリサイズ時に呼び出し
    fitCanvasSize();
    window.onresize = fitCanvasSize;

    fb.on("mouse:down",function(){    
        let obj = fb.getActiveObjects()[0];
        if(obj != null){
            setValue("name", obj);
            setValue("color", obj);
        }
    });
}

//ボタンを押すと、対応するオブジェクトが複製される。
function addIcon(id){
    //アイコン数制限
    if(btnCount >= 8) {
        return;
    } else {
        btnCount++;
    }
    //作るとこ
    let icon = new fabric.Circle({
        left: 50,
        top: 50,
        fill: '#c3d9ff',
        radius: 20,
        iconNumber: btnCount
    });
    //操作制限
    icon.setControlsVisibility({
        mt: false,	// middle top
        mb: false,	// middle bottom
        ml: false,	// middle left
        mr: false,	// middle right
        bl: false,	// bottom left
        //br: false,	// bottom right
        tl: false,	// top left
        tr: false,	// top right
        mtr: false	// middle top rotete
    });
    console.log(icon);
    fb.add(icon);
    //レイヤーに座標を追加
    let button = document.getElementById("l" + getNumber());
    button.ly.setPosition(50, 50, icon.iconNumber);
}

//選択されているオブジェクトを削除する。
function deleteIcon(){
    let activeObjects = fb.getActiveObjects();

    if (activeObjects.length > 0) {
        if (confirm('選択された箇所を全て削除しますか？')) {
            activeObjects.forEach(obj => {

                //対象オブジェクトを削除
                fb.remove(obj);
                btnCount--;

                //矩形のIDとcanvas.item紐づけ用配列も削除する。
                // let arrIndex = arrayRect.indexOf(obj.id);
                // arrayRect.splice(arrIndex, 1);
            });
        }
    } else {
        alert("オブジェクトが選択されていません。");
    }
}

//選択されているオブジェクトの色を変える。
function setIconColor(){
    let icons = fb.getActiveObjects();
    if (icons.length > 0) {
        icons.forEach(icon => {
            icon.set({
                fill: document.getElementById("color").value,
              }).setCoords();
        });
    } else {
        alert("オブジェクトが選択されていません。");
    }
    fb.renderAll();
}

//選択されているオブジェクトの名前を変える。
function setIconName(){
    let icons = fb.getActiveObjects();
    if (icons.length == 1) {
    let icon = icons[0];
      icon.set({
          name: document.getElementById("name").value,
      }).setCoords();
      icon.toObject = (function(toObject) {
        return function() {
          return fabric.util.object.extend(toObject.call(this), {name: this.name});
        };
      })(icon.toObject);
    } else {
        alert("オブジェクトを1つ選択してください。");
    }
    fb.renderAll();
}

//引数で渡されたオブジェクトの衝突判定。
function checkClash(activeObject, obj){
    let xa = Math.round(activeObject.left);
    let ya = Math.round(activeObject.top);
    let xo = Math.round(obj.left);
    let yo = Math.round(obj.top);
    let aradius = Math.round(activeObject.radius);
    let oradius = Math.round(obj.radius);
  
    //三平方の定理を用いてアイコンの距離を計算
    //円の半径の和＞距離なら衝突
    let d2 = Math.pow(xo - xa, 2) + Math.pow(yo - ya, 2);
      if (d2 >= Math.pow(aradius + oradius, 2)) {
        return false;
      } else{
        return true;
      }
  }
  
  //全オブジェクトを引数で受けたpositionに動かす
  function animateObj(position){
    //衝突してない、オブジェクトは最初から
    let clash = false;
    let i = 1;
    console.log(position);
  
    //全アイコンを操作不可能にし、動かす
    fb.forEachObject(function(activeObject) {
      activeObject.selectable = false;
      let left = position[i][0];
      let top = position[i][1];
      i ++;
      //動かすメソッド(座標プロパティが変わるだけ)
      activeObject.animate({left: left, top: top}, {
        duration: 2000, //2秒かけて座標変更
        onChange: function() { //座標が変わるたびに呼び出し
          fb.requestRenderAll(); //描画
          fb.forEachObject(function(obj) {
            //もし同一のアイコンではなく、かつ衝突判定に引っ掛かったら
            if(obj !== activeObject　&& checkClash(activeObject, obj)){
              //衝突判定をtrueに、当たったアイコンを透過してアラートを表示
              clash = true;
              activeObject.set('opacity', 0.5);
              obj.set('opacity', 0.5);
              console.log("重なり");
            }
          });
        },
        onComplete: function() {
          //終わったらボタンとアイコンを操作可能にする
          animateBtn.disabled = false;
          activeObject.selectable = true;
        }
      });
    });
  }
  
  //シミュレート
  function simulate(){
    //ボタンを押せないようにする
    let animateBtn = document.getElementById('animateBtn');
    animateBtn.disabled = true;
    //レイヤーを取得、レイヤーを1にセット
    let ulElement = document.getElementById("layer");
    let chElement;
    changeLayer(1);
  
    //2.2秒ごとにレイヤーの数だけanimateを呼び出す。
    let i = 1;
    const interval = setInterval(function(){
      //レイヤー取得、動かす
      chElement = ulElement.children[i].ly;
      setNumber(chElement.layerNumber);
      animateObj(chElement);
      i ++;
      //レイヤー上限に達したら終了
      if(i>=ulElement.childElementCount){
        console.log("クリア");
        animateBtn.disabled = false;
        clearInterval(interval);
      }
      console.log(i);
    }, 2200);
  }
let cv, ctx, fb, btnCount, icon; //canvas, コンストラクト, fabric管理, ボタンが押された回数
let layerN = 1;

window.onload = function() {
    //canvas, コンストラクト, fabricの初期化
    cv = document.getElementById('cv');
    ctx = cv.getContext('2d');
    ctx.strokeStyle = "blue";
    fb = new fabric.Canvas('cv');
    
    //  1番目のレイヤーを作る。
    let firstButton = document.getElementById("l1");
    createLayer(firstButton);
    saveLayer(firstButton.ly);
    console.log("ly:"+firstButton.ly.layerNumber);

    for(i=1; i<=3; i++){
      icon = new fabric.Circle({
        left: 50,
        top: 50,
        fill: 'rgb(195,217,255)',
        radius: 25,
        iconNumber: i
      });
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
      fb.add(icon);
      firstButton.ly.setPosition(50, 50, icon.iconNumber);
    }
    console.log(firstButton.ly[1]);

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

    fb.on("mouse : down",function(){
        ctx.beginPath();
        ctx.rect(115,60,221,390);//specify bounded rectangle
        ctx.closePath();
        ctx.clip();
        ctx.save();
       });
    //now restore the context on mouse up
     
    fb.on("mouse : up",function(){
      ctx.restore();//restore the context
    });

    let count = 0;
  let a = setInterval(function(){
    console.log(count++);
    if(count > 5){　
      clearInterval(a);
    }
  }, 1000);
}

//衝突判定
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
            alert("error:重なってるよ");
          }
        });
      },
      abort: () => clash, //trueなら処理中止
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
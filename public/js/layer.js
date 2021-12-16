//レイヤー。各アイコンの座標を保持する。
class layer {
    constructor(layerNumber) {
        this.num = layerNumber;
        this[1] = null;
        this[2] = null;
        this[3] = null;
        this[4] = null;
        this[5] = null;
        this[6] = null;
        this[7] = null;
        this[8] = null;
    }
    //レイヤー番号のゲッター。
    get layerNumber() {
        return this.num;
    }
    //引数で指定されたアイコンの座標を返す。
    getPosition(iconNumber) {
        return this[iconNumber];
    }
    //引数で指定された座標を設定する。
    setPosition(x, y, iconNumber) {
        let position = [x, y];
        this[iconNumber] = position;
    }
    //引数で指定された座標を削除する。
    deletePosition(iconNumber) {
        this[iconNumber] = null;
    }
}

//レイヤー制作
function createLayer(obj) {
    let ly = new layer(obj.textContent);
    obj.ly = ly;
}

//レイヤー追加
function addLayer() {
    //
    let ulElement = document.getElementById("layer");
    let copied = ulElement.lastElementChild.cloneNode(true);
    copied.textContent = Number(copied.textContent) + 1;
    copied.id = "l" + copied.textContent;

    createLayer(copied);

    ulElement.appendChild(copied);
}

//レイヤー削除
function deleteLayer() {
    let ulElement = document.getElementById("layer");
    if (ulElement.childElementCount <= 1) {
        return;
    } else {
        ulElement.lastElementChild.remove();
    }
}
//座標保存
function saveLayer(ly) {
    fb.forEachObject(function (obj) {
        ly.setPosition(obj.left, obj.top, obj.iconNumber);
    });
}

//座標指定
function changeLayer(afterNumber) {
    let beforeNumber = getNumber();
    let beforeElement = document.getElementById("l" + beforeNumber);
    let afterElement = document.getElementById("l" + afterNumber);

    //現在位置を取得、前レイヤーに保存
    // console.log(afterElement.ly);
    saveLayer(beforeElement.ly);

    //後レイヤーに保存された位置を取得
    let afterLayer = afterElement.ly;
    //もしレイヤーにアイコン[1]の座標すら無いなら前レイヤーを参照する
    if(afterLayer.getPosition(1) == null && afterNumber != 1){
        afterLayer = document.getElementById("l" + (afterNumber-1)).ly;
    }
    //座標取得してキャンバス上に反映
    //もしnullなら初期位置
    fb.forEachObject(function (obj) {
        let position = afterLayer.getPosition(obj.iconNumber);
        if(position == null){
            position = [50, 50];
        }
        obj.left = position[0];
        obj.top = position[1];
        obj.set('opacity', 1.0);
    });

    setNumber(afterNumber);
    fb.renderAll();
}

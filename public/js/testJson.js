function jsonJoin(json_obj, ly) {
  
}

function jsonOutput(){
  // fbの内容
  let json_data = JSON.stringify(fb);
  let json_obj = JSON.parse(json_data);
  // layerの中身作成
  let ly_list = [];
  let layers = document.getElementById("layer");
  let nowNumber = getNumber();
  // layerの数だけ繰り返す
  for(let i=0; i<layers.childElementCount; i++){
    let button = layers.children[i];
    // もし今開いてるレイヤーなら保存する
    if(i+1 == nowNumber){
      saveLayer(button.ly);
    }
    ly_list.push(button.ly);
  }
  // まとめて出力
  json_obj.layer = ly_list;
  document.getElementById("jsontxt").innerHTML = JSON.stringify(json_obj);

  // HTMLのリンク要素を生成する。
  let link = document.createElement("a");
  // リンク先にJSON形式の文字列データを置いておく。
  link.href = "data:text/plain," + encodeURIComponent(JSON.stringify(json_obj));
  // 保存するJSONファイルの名前をリンクに設定する。
  let fileName = "sample.json";
  link.download = fileName;
  // ファイルを保存する。
  link.click();
}
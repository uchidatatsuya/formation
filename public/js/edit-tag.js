// レイヤーの数字を取得する
function getNumber(){
    return document.getElementById("layerNumber").textContent;
}
// レイヤーの数字を変える
function setNumber(n){
    let elm = document.getElementById("layerNumber");
    elm.textContent = n;
  }

function setValue(id, obj){
    let elm = document.getElementById(id);
    switch(id){
        case "name":
            if(obj.name != null){
                elm.value = obj.name;
            }else{
                elm.value = "";
            }
            break;
        case "color":
            elm.value = obj.fill;
            break;
        default:
            break;
    }
}
//fabric.jsを使ったお絵かき
document.addEventListener('DOMContentLoaded', function () { //windows.onloadは複数使えないので代わり

  const CANVAS_WIDTH = 1000;
  const CANVAS_HEIGHT = 1000;

  let LineWidthSave = 5; //消しゴムを使った後で元のペンサイズに戻すための記録用

  var canvas = new fabric.Canvas("canvas");
  canvas.setHeight(CANVAS_HEIGHT);
  canvas.setWidth(CANVAS_WIDTH);
  canvas.setBackgroundColor(
    "rgba(255, 255, 255, 1)",
    canvas.renderAll.bind(canvas)
  );
  canvas.isDrawingMode = true; // お絵かきモードの有効化
  canvas.freeDrawingBrush.color = "rgb(0,0,0)"; // 描画する線の色、初期値
  canvas.freeDrawingBrush.width = 5; // 描画する線の太さ

  //色選択ボタンの設定
  const selectColorBtn = document.getElementsByClassName("color");

  for (i = 0; i < selectColorBtn.length; i++) {
    selectColorBtn[i].addEventListener("click", function (e) {
      //ボタンが自分の色を取得して描画色にする
      const btnColor = window
        .getComputedStyle(this, null)
        .getPropertyValue("background-color");
      console.log(btnColor);
      canvas.freeDrawingBrush.color = btnColor; // 描画する線の色
      canvas.freeDrawingBrush.width = LineWidthSave;

      clearSelectedButton();
      this.classList.add("selected"); //選択されたボタンはボーダーを太くする
    });
  }

  const selectLineWidthBtn = document.getElementsByClassName("selectLineWidth");

  for (i = 0; i < selectLineWidthBtn.length; i++) {
    selectLineWidthBtn[i].addEventListener("click", function (e) {
      //ボタンが自分の値を取得してペンサイズにセット
      canvas.freeDrawingBrush.width = parseInt(this.value);
      LineWidthSave = parseInt(this.value);
    });
  }

  function clearSelectedButton() {
    const btn = document.getElementsByClassName("color");
    for (i = 0; i < btn.length; i++) {
      btn[i].classList.remove("selected");
    }
  }

  document.getElementById("download").addEventListener("click", function (e) {
    let canvasToDL = document.getElementById("canvas");
    let link = document.createElement("a");
    link.href = canvasToDL.toDataURL("image/png");
    link.download = "drawing.png";
    link.click();
  });

  document
    .getElementById("eraser") //消しゴムはサイズの大きい白いペン
    .addEventListener("click", function (e) {
      canvas.freeDrawingBrush.width = 40;
      canvas.freeDrawingBrush.color = "white";
    });

  document.getElementById("clear").addEventListener("click", () => {
    canvas.clear();
    canvas.setBackgroundColor(
      "rgba(255, 255, 255, 1)",
      canvas.renderAll.bind(canvas)
    );
  });

  document.getElementById("drawing").addEventListener("click", function (e) {
    if (this.checked) {
      document.getElementById("wrap-draw-area").style.display = "block";
    } else {
      document.getElementById("wrap-draw-area").style.display = "none";
    }
  });

});

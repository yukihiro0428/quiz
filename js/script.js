$(function() {
    var quizArea = $('.quiz_area'); //クイズを管理するDOMを指定
    var quiz_html = quizArea.html(); //もう一度押した時に元に戻すため初期HTMLを変数で保管
    var quiz_cnt = 0; //現在の問題数を管理
    var quiz_fin_cnt = 5; //何問で終了か設定（クイズ数以下であること）
    var quiz_success_cnt = 0; //問題の正解数
    
    //クイズの配列を設定
    //answerの選択肢の数はいくつでもOK ただし先頭を正解とすること(出題時に選択肢はシャッフルされる)
    var aryQuiz = [];
    aryQuiz.push (
        {
            question : 'この動物はな～に？',
            img: '<p><img src="img/IMG_0298-min.JPG" alt="問題文の写真"></p>',
            answer : ['ゾウ', 'キリン', 'サイ', 'ラクダ']//ゾウ
        }
        ,{
            question : 'この動物はな～に？',
            img: '<p><img src="img/IMG_0296-min.JPG" alt="問題文の写真"></p>',
            answer : ['キリン', 'ゾウ', 'ライオン', 'クマ']//キリン
        }
        ,{
            question : 'この動物はな～に？',
            img: '<p><img src="img/IMG_0303-min.JPG" alt="問題文の写真"></p>',
            answer : ['ペンギン', 'ミーアキャット', 'カメ', 'サル']//ペンギン
        }
        ,{
            question : 'この動物はな～に？',
            img: '<p><img src="img/IMG_0309-min.JPG" alt="問題文の写真"></p>',
            answer : ['クマ', 'タヌキ', 'パンダ', 'ナマケモノ']//クマ
        }
        ,{
            question : 'この動物はな～に？',
            img: '<p><img src="img/IMG_0312-min.JPG" alt="問題文の写真"></p>',
            answer : ['チーター', 'ヒョウ', 'ジャガー', 'ピューマ']//チーター
        }
    );
    
    quizReset();
    
    //音声の設定
    // 変数の初期化
    var audio = new Audio();	// Audio
    var trueaudio = "sound/true.";	// 音声パス（拡張子なし）
    var falseaudio = "sound/false.";  // 音声パス（拡張子なし）
    var canPlay = false;

    //trueの場合
    var trueEvents = function() {
        try {
            // 使用可能なファイル形式の判定、拡張子を得る
            var ext = null;
            if      (audio.canPlayType("audio/ogg") == "maybe") {ext = "ogg";}
            else if (audio.canPlayType("audio/mp3") == "maybe") {ext = "mp3";}

            // 再生可能になったら実行する関数を登録
            audio.addEventListener("canplaythrough", function() {
                // canPlay = true;
                console.log("Can Play!");
            });
            audio.src = trueaudio + ext;
        } catch(e) {
            console.log(e);
        }
        if (! canPlay) return;
        // var audio = new Audio();
        audio.currentTime = 0;
        audio.play();
    };
    
    // //falseの場合
    var falseEvents = function() {
        try {
            // 使用可能なファイル形式の判定、拡張子を得る
            var ext = null;
            if      (audio.canPlayType("audio/ogg") == "maybe") {ext = "ogg";}
            else if (audio.canPlayType("audio/mp3") == "maybe") {ext = "mp3";}

            // 再生可能になったら実行する関数を登録
            audio.addEventListener("canplaythrough", function() {
                // canPlay = true;
                console.log("Can Play!");
            });
            audio.src = falseaudio + ext;
        } catch(e) {
            console.log(e);
        } 
        if (! canPlay) return;
        audio.currentTime = 0;
        audio.play();
    };

    //音再生のon off切り替え
    quizArea.on('click', '.font-volume li', function() {
        // クリックされたタブの順番を変数に格納
        var index = $('.font-volume li').index(this);
        // クリック済みタブのデザインを設定したcssのクラスを一旦削除
        $('.font-volume li').removeClass('active');
        // クリックされたタブにクリック済みデザインを適用する
        $(this).addClass('active');
    });
    
    //onの場合、再生出来るようにする
    quizArea.on('click', '#volume-on', function() {
        canPlay = true;
    });
    //offの場合再生出来ないようにする
    quizArea.on('click', '#volume-off', function() {
        canPlay = false;
    });

    //回答を選択した後の処理
    quizArea.on('click', '.quiz_ans_area ul li', function() {
        //画面を暗くするボックスを表示（上から重ねて、結果表示中は選択肢のクリックやタップを封じる
        quizArea.find('.quiz_area_bg').show();
        //選択した回答に色を付ける
        $(this).addClass('selected');
        if($(this).data('true')){
            //正解の処理 〇を表示
            quizArea.find('.quiz_area_icon').addClass('true');
            //正解数をカウント
            quiz_success_cnt++;
            //正解音を鳴らす
            trueEvents();
        }else{
            //不正解の処理
            quizArea.find('.quiz_area_icon').addClass('false');
            //不正解音を鳴らす
            falseEvents();
        }
        setTimeout(function(){
            //表示を元に戻す
            quizArea.find('.quiz_ans_area ul li').removeClass('selected');
            quizArea.find('.quiz_area_icon').removeClass('true false');
            quizArea.find('.quiz_area_bg').hide();
            //問題のカウントを進める
            quiz_cnt++;
            if(quiz_fin_cnt > quiz_cnt){
                //次の問題を設定する
                quizShow();
            }else{
                //結果表示画面を表示
                quizResult();
            }
        }, 1500);
    });
    
    //もう一度挑戦するを押した時の処理
    quizArea.on('click', '.quiz_restart', function(){
        quizReset();
        canPlay = false;
    });
    
    //リセットを行う関数
    function quizReset(){
        quizArea.html(quiz_html); //表示を元に戻す
        quiz_cnt = 0;
        quiz_success_cnt = 0;
        aryQuiz = arrShuffle(aryQuiz); //毎回出題の順番をシャッフル
        quizShow();
    }
    
    //問題を表示する関数
    function quizShow(){
        //何問目かを表示
        quizArea.find('.quiz_no').text((quiz_cnt + 1));
        //問題文を表示
        quizArea.find('.quiz_question').text(aryQuiz[quiz_cnt]['question']);
        quizArea.find('.quiz_question').append(aryQuiz[quiz_cnt]['img']);
        //正解の回答を取得する
        var success = aryQuiz[quiz_cnt]['answer'][0];
        //現在の選択肢表示を削除する
        quizArea.find('.quiz_ans_area ul').empty();
        //問題文の選択肢をシャッフルさせる(自作関数) .concat()は参照渡し対策
        var aryHoge = arrShuffle(aryQuiz[quiz_cnt]['answer'].concat());
        //問題文の配列を繰り返し表示する
        $.each(aryHoge, function(key, value){
            var fuga = '<li>' + value + '</li>';
            //正解の場合はdata属性を付与する
            if(success === value){
                fuga = '<li data-true="1">' + value + '</li>';
            }
            quizArea.find('.quiz_ans_area ul').append(fuga);
        });
    }
    
    //結果を表示する関数
    function quizResult(){
        quizArea.find('.quiz_set').hide();
        var text = quiz_fin_cnt + '問中' + quiz_success_cnt + '問正解！';
        var persent = Math.floor(quiz_success_cnt / quiz_fin_cnt * 100); //正解率
        var text1 = '正解率は' + persent + '%でした！';
        if(quiz_fin_cnt === quiz_success_cnt){
            text1 += '<br>全問正解おめでとう！';
        }
        text1 += '<br><input type="button" value="もう一度挑戦する" class="quiz_restart p-10">';
        quizArea.find('.quiz_result').html(text1);
        quizArea.find('.quiz_result').show();
    }
    
    //配列をシャッフルする関数
    function arrShuffle(arr){
        for(i = arr.length - 1; i > 0; i--){
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = arr[i];
            arr[i] = arr[j];
            arr[j] = tmp;
        }
        return arr;
    }
});
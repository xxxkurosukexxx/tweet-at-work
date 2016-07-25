function calcLimit(obj) {
    var limit = 140 - obj.val().length, dispObj = $("#limit");
    dispObj.text(limit);
    if (limit < 0) {
        dispObj.addClass("over");
    } else {
        dispObj.removeClass("over");
    }
}

function resize() {
    window.resizeTo(720, 190);
}

window.onload = resize;
window.onresize = resize;

$(function() {
    // 本文
    var msg = $("#msg");
    msg.focus();
    // 左上の顔
    var face = $("#face");
    // リプID
    var repId = $("#repId");

    function init(){
        $.each(twitterAccount, function(){
            $("#idselect").append($("<option />").val(this).text(this));
        });
        $.each(facesConfig, function() {
            $("#faceSelect").append($("<option />").val(this).text(this));
        });
        $("#twitterid").val($("#idselect").val());
        chgColor($("#idselect").val());
    }
    init();

    // 本文入力時のEnterキーの処理
    $(document).on("keypress", "#msg", function(e) {
        if ((event.keyCode == 10 || event.keyCode == 13) && event.ctrlKey) {
            if (msg.val().replace(/\s/g, '').length > 0) {
                e.preventDefault();
                $.post(window.location.toString(), $("#form").serializeArray(), function(res) {
                    if (res.errors === undefined) {
                        msg.val('');
                        calcLimit(msg);
                        face.text("( 'ω') ok.");
                        repId.val('');
                    } else {
                        var eMsg = '';
                        res.errors.forEach(function(e) {
                            eMsg += e.code + ": " + e.message + "\n";
                        });
                        alert(eMsg);
                        face.text("( 'ω') error...");
                    }
                    return false;
                });
            }
        }
    });

    // repIdでEnterするとPOSTされてJSONが表示される不具合修正
    $(document).on("keypress", "#repId", function(e) {
        e.preventDefault();
        return false;
    });

    // 本文入力時の文字数計算処理
    msg.bind("input", function() {
        calcLimit(msg);
    });

    // clearボタン
    // 本文、リプIDをクリアする。
    $("#clearBtn").click(function() {
        msg.val('');
        calcLimit(msg);
        face.text("( 'ω') ?");
        repId.val('');
    });

    // repボタン
    // 最新のリプライを取得し、リプテキストをalert表示、本文に@ほげほげ,repIdにふがふがをセットする。
    $("#repGetBtn").click(function() {
        $.post(window.location.toString(), {
            "mode" : "repGet",
            "id"   : $("#idselect").val()
        }, function(res) {
            if (res.errors === undefined) {
                var rMsg = res[0];
                alert("\"@" + rMsg.user.screen_name + " " + rMsg.user.name + "\"\n" + rMsg.text);
                $("#repId").val(rMsg.id_str);
                msg.val("@" + rMsg.user.screen_name + " " + msg.val());
                calcLimit(msg);
            } else {
                alert("( 'ω') error...");
            }
            return false;
        });
    });

    // delボタン
    // 最新のツイートを問答無用で削除する。
    $("#delBtn").click(function() {
        $.post(window.location.toString(), {
            "mode" : "del",
            "id"   : $("#idselect").val()
        }, function(res) {
            if (res.errors === undefined) {
                alert("( 'ω') ok.");
            } else {
                alert("( 'ω') error...");
            }
            return false;
        });
    });

    // 顔文字
    // 選んだものを本文の先頭に突っ込む♂
    $("#faceSelect").change(function() {
        msg.focus();
        msg.val($(this).val() + msg.val());
        calcLimit(msg);
        $(this).val('');
    });

    // ID切替
    // 切り替えた時に色を変える（誤爆防止）
    $("#idselect").change(function() {
        msg.focus();
        chgColor($(this).val());
        $("#twitterid").val($(this).val());
    });

    function chgColor(id) {
        $("*").css("color", colorConfig[id]);
        $(".msg:focus").css("outline-color", colorConfig[id]);
    }

})

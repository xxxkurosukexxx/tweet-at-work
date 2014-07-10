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
    window.resizeTo(700, 185);
}

window.onload = resize;
window.onresize = resize;

$(function() {
    // 本文
    var msg = $("#msg");
    msg.focus();

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
        if (e.keyCode == 13) {// Enterが押された
            if (e.shiftKey) {// Shiftキーも押された
                $.noop();
            } else if (msg.val().replace(/\s/g, "").length > 0) {
                e.preventDefault();
                $.post(window.location.toString(), $("#form").serializeArray(), function(res) {
                    if (res.errors === undefined) {
                        $(".msg").val("");
                        calcLimit(msg);
                        $("#face").text("( 'ω') ok.");
                    } else {
                        var eMsg = "";
                        res.errors.forEach(function(m) {
                            eMsg += e.code + ": " + e.message + "\n";
                        });
                        alert(eMsg);
                        $("#face").text("( 'ω') error...");
                    }
                    return false;
                });
            }
        }
    });

    // 本文入力時の文字数計算処理
    msg.bind("input", function() {
        calcLimit(msg);
    });

    // clearボタン
    // 本文、リプIDをクリアする。
    $("#clearBtn").click(function() {
        $(".msg").val('');
    });

    // repボタン
    // 最新のリプライを取得し、リプテキストをalert表示、本文に@ほげほげ,repIdにふがふがをセットする。
    $("#repGetBtn").click(function() {
        $.post(window.location.toString(), {
            "mode" : "repGet",
            "id"   : $("#idselect").val()
        }, function(res) {
            if (res.errors === undefined) {
                var msg = res[0];
                alert("\"@" + msg.user.screen_name + " " + msg.user.name + "\"\n" + msg.text);
                $("#repId").val(msg.id_str);
                $("#msg").val("@" + msg.user.screen_name + " " + $("#msg").val());
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
        $(this).val("");
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


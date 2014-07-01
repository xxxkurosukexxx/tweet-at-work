<?php
    require_once ('config.inc');
    if($_SERVER["REQUEST_METHOD"] == "POST") {
        //require_once ('Services/Twitter.php');
        //require_once ('HTTP/OAuth/Consumer.php');
        require_once ('vendor/autoload.php');

        $returnArr = array();

        try {
            $twitter = new Services_Twitter();
            $id = $_POST["id"];

            // *----- oAuth -----* //
            $oauth = new HTTP_OAuth_Consumer($consumer_key, $consumer_secret, $auth_token[$id], $token_secret[$id]);
            $twitter -> setOption("use_ssl", true);
            $twitter -> setOAuth($oauth);
            // *----- oAuth -----* //

            // *----- main -----* //
            switch($_POST["mode"]) {
                case "post" :
                    $postParams = array("status" => $_POST["msg"]);
                    if(!empty($_POST["repId"])) {
                        $postParams["in_reply_to_status_id"] = $_POST["repId"];
                    }
                    $msg = $twitter -> statuses -> update($postParams);
                    break;
                case "del" :
                    $statuses = $twitter -> statuses -> user_timeline();
                    $msg = $twitter -> statuses -> destroy($statuses[0] -> id_str);
                    break;
                case "repGet" :
                    $msg = $twitter -> statuses -> mentions_timeline(array("count" => 1));
                    break;
            }
            // *----- main -----* //

            $returnArr = array(
                "status" => "OK",
                "message" => $msg
            );
        } catch(Services_Twitter_Exception $e) {
            error_log(var_export($e -> getMessage(), true));
            $returnArr = array(
                "status" => "NG",
                "message" => $e -> getMessage()
            );
        }

        header('Content-type: application/json');
        echo json_encode($returnArr);
    } else {
        header('Content-type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="ja">
    <head>
        <meta charset="utf-8">
        <script src="jquery-2.0.3.min.js"></script>
        <script src="index.js"></script>
        <title>tweet-at-work</title>
        <link href="index.css" rel="stylesheet" type="text/css" />
        <script>
            var twitterAccount = <?php echo json_encode($twitterAccount); ?>;
            var colorConfig    = <?php echo json_encode($colorConfig); ?>;
            var facesConfig    = <?php echo json_encode($facesConfig); ?>;
        </script>
    </head>
    <body>
        <span id="face">( 'ω') ?</span> <span id="limit">140</span>
        <span id="btns">
            <button id="repGetBtn" title="rep">
                rep
            </button>
            <button id="clearBtn" title="clear">
                clear
            </button>
            <button id="delBtn" title="undo">
                undo
            </button>
            <select id="faceSelect">
                <option value="">☻</option>
            </select>
            <select id="idselect">
            </select>
        </span>
        <form method="post" id="form">
            <textarea class="msg" id="msg" name="msg" rows="3" cols="80"></textarea><br />
            <label>Reply to : </label><input class="msg" id="repId" type="text" name="repId" readonly="true" />
            <input type="hidden" name="mode" value="post" />
            <input type="hidden" name="id" id="twitterid" value="" />
        </form>
    </body>
</html>
<?php
    } //GETここまで
?>

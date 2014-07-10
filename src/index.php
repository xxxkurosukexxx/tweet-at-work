<?php
    require_once ('config.inc');
    if($_SERVER["REQUEST_METHOD"] == "POST") {
        //require_once ('Services/Twitter.php');
        //require_once ('HTTP/OAuth/Consumer.php');
        require_once ('vendor/autoload.php');

        header('Content-type: application/json');

        $API_URL_BASE = "https://api.twitter.com/1.1/";
        $id = $_POST["id"];

        // *----- oAuth -----* //
        $oauth = array(
                    'oauth_access_token'        => $auth_token[$id], 
                    'oauth_access_token_secret' => $token_secret[$id],
                    'consumer_key'              => $consumer_key,
                    'consumer_secret'           => $consumer_secret,
                );
        $twitter = new TwitterAPIExchange($oauth);
        // *----- oAuth -----* //

        // *----- main -----* //
        switch($_POST["mode"]) {
            case "post" :
                $postParams = array("status" => $_POST["msg"]);
                if(!empty($_POST["repId"])) {
                    $postParams["in_reply_to_status_id"] = $_POST["repId"];
                }
                $msg = $twitter -> buildOauth($API_URL_BASE."statuses/update.json", "POST")
                                -> setPostFields($postParams)
                                -> performRequest();
                break;
            case "del" :
                $statuses = $twitter -> setGetfield("?count=1&include_rts=1&screen_name={$id}")
                                     -> buildOauth($API_URL_BASE."statuses/user_timeline.json", "GET")
                                     -> performRequest();
                $statusesObj = json_decode($statuses);
                $targetId = $statusesObj[0]->id_str;
                $postParams = array("id" => $targetId);
                $msg = $twitter -> buildOauth($API_URL_BASE."statuses/destroy/{$targetId}.json", "POST")
                                -> setPostFields($postParams)
                                -> performRequest();
                break;
            case "repGet" :
                $msg = $twitter -> setGetfield("?count=1")
                                -> buildOauth($API_URL_BASE."statuses/mentions_timeline.json", "GET")
                                -> performRequest();
                break;
        }
        // *----- main -----* //

        echo $msg;
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

tweet-at-work
=============

## これは何？
tweet専用クライアント。


## 機能？
- tweetする
    - EnterでPOST
    - Shift + Enterで改行
- リプライする
    - repボタン
- 最新の発言を消す（問答無用に削除するので取り扱い注意）
    - undoボタン
- 顔文字補助機能
    - configファイルで設定
- マルチアカウント対応
    - configファイルで設定


## 動作環境？
### サーバー側
- CentOS 6.5 x86_64
- Apache 2.2.15
- PHP 5.3.3
    - mbstring
    - Composer

### クライアント側
- Windows 7 x64
- Chrome 35.0


## インストール？
1. Twitterにアプリケーション登録する
1. 適当なディレクトリにgit cloneする
1. composer install
1. config.incを設定する
1. Apacheでアクセスできるようにする
1. **さえずる**

インストール例：
```bash
cd /usr/src
git clone https://github.com/xxxkurosukexxx/tweet-at-work
cd tweet-at-work/src
composer install
cp config.inc{.sample,}
vim config.inc
ln -s /usr/src/tweet-at-work/src /var/www/html/tweet
```

### config.inc
- $twitterAccount
  - アカウントを書く
- $consumer_key
  - API keyをコピペ
- $consumer_secret
  - API secretをコピペ
- $auth_token
  - アカウント => そのアカウントでのAccess tokenをコピペ
- $token_secret
  - アカウント => そのアカウントでのAccess token secretをコピペ
- $colorConfig
  - アカウント => そのアカウントに切替た時の画面（文字）の色をCSS方式で
- $facesConfig
  - 顔文字補助機能で使いたい顔文字（または定型文など）を適当に羅列

#### token
[jugyo/get-twitter-oauth-token](https://github.com/jugyo/get-twitter-oauth-token) とか使わせてもらうといいと思います（鼻ﾎｼﾞ


## 注意事項？
- 認証とかかけてないのでインターネットに公開される場所に置くと**危険**です。マジで。見つかると勝手に発言されたり消されたりします。
    - 適当に認証かけるとか、アクセス元の制限をするとか... **自己責任**でやってください。
- 使用の際はマジで**自己責任**でお願いします。
    - **いかなる責任も負いません**。マジで。大事なことなので何回でも言うけど、マジで。


## よくありそうな質問
- TL見れないの？
  - 見れません。
- 使いづらい
  - forkして使いやすくしてpull reqください
- アレはできないの？
  - 今あるものが全てです。forkして(ry
- バグみつけた
  - issue上げてください。気が向いたら直します。あるいはfork(ry

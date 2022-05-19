# line_replier_gas

GAS を利用して LINE の自動送信を行うスクリプト

# 利用方法

！本プログラムは自己責任でご利用をお願いします

# 開発資料

## 環境構築

本プログラムでは yarn 及び clasp を利用して開発を行っています。

必要なパッケージをインストールし、clasp に Google アカウントでログインしてください。

```
$ npm install -g @google/clasp
$ clasp login
$ yarn
$ yarn generate
```

## コマンド

ブラウザ上で Apps Script エディタを開く

```
$ yarn open
```

実装した ts ファイルを元に gs ファイルを作成し、AppsScript にアップロードする

```
$ yarn push
```

## 開発後の注意

公開用に dist/app.gs ファイルも合わせて更新するようにしてください

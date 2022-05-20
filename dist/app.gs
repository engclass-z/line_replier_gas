// Compiled using line_replier_gas 1.0.0 (TypeScript 4.6.3)
"use strict";
//import DoPost = GoogleAppsScript.Events.DoPost;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const main = () => {
    const spreadsheet = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1oYNekgQ5bqJ69QM2AfHenOZjNGH5NlukmORksPo-ooI/edit#gid=0');
    const sheet = spreadsheet.getActiveSheet();
    const range = sheet.getDataRange();
    const deleteTargetRows = [];
    // 各行を見ていく
    const beginRow = range.getLastRow() - range.getHeight() + 2; // 1行目は項目名なので2行目から
    for (let i = beginRow; i <= range.getLastRow(); i++) {
        const date = range.getCell(i, 1).getValue();
        const text = range.getCell(i, 2).getValue();
        const groupId = range.getCell(i, 3).getValue();
        // 設定された送信時刻が来たら処理
        if (date.getTime() < Date.now()) {
            // LINE 送信
            sendToLine(groupId, text);
            // 削除候補に入れる
            deleteTargetRows.push(i);
        }
    }
    // 送信が終わったあとに削除候補の行を実際に削除
    // 上から順に消すと、1行消したあとの以降の行番号が変わってしまうので、下から順に消していく
    deleteTargetRows.reverse().forEach((row) => {
        sheet.deleteRow(row);
    });
};
/**
 * LINE にテキスト送信する
 */
const sendToLine = (to, text) => {
    const { accessToken } = getScriptProperty();
    const url = 'https://api.line.me/v2/bot/message/push';
    const headers = {
        "Content-Type": "application/json; charset=UTF-8",
        'Authorization': 'Bearer ' + accessToken,
    };
    const postData = {
        to,
        messages: [
            {
                type: 'text',
                text
            }
        ]
    };
    return UrlFetchApp.fetch(url, {
        method: 'post',
        headers,
        payload: JSON.stringify(postData),
    });
};
/**
 * スクリプトプロパティから値を取得する
 * このメソッドで定義されたキーに対応する value を事前に Apps Script 上で設定して下さい。
 */
const getScriptProperty = () => {
    const props = PropertiesService.getScriptProperties();
    return {
        channelSecret: props.getProperty('CHANNEL_SECRET'),
        accessToken: props.getProperty('ACCESS_TOKEN'),
        channelId: props.getProperty('CHANNEL_ID')
    };
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const doPost = (e) => {
    // メッセージを送信するべきグループのグループ ID を webhook 経由で調べてスプレッドシートに書き込む
    // ここはもう少し工夫できそう
    const json = JSON.parse(e.postData.contents);
    const gid = json.events[0].source.groupId;
    const spreadsheet = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1oYNekgQ5bqJ69QM2AfHenOZjNGH5NlukmORksPo-ooI/edit#gid=0');
    const sheet = spreadsheet.getActiveSheet();
    sheet.getRange(1, 12).setValue(gid);
};

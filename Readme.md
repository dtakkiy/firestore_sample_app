## What is this?

FireStore sample app.

## How to use

- 特定のユーザーに紐づいた課題を「未完了」から「完了」状態に変更する

```
ts-node ./src/main update-question-status  {{ userID }}
```

- あるユーザの課題ステータスを一覧表示する

```
ts-node ./src/main get-question-status-list  {{ userID }}
```

- 特定の課題を更新する

```
ts-node ./src/main update-question  {{ questionID }} {{ title }} {{ description }}
```


- 特定の課題を削除する
```
ts-node ./src/main delete-question  {{ questionID }}
```

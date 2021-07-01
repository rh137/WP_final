# WP_final

- original repo: https://github.com/rh137/WP_final

## Members
- B06902137 資工四 徐紹軒
- B07106013 圖資三 蘇姵文

## About the Project
- 我們沒有找外掛
- 這並非其他之前專案的延伸

## How to Launch
- 假定一開始在project的根目錄：
    1. `cd backend/ && yarn install && cd ..`
    2. `cd frontend/ && yarn install && cd ..`
    3. `yarn install`
    4. `yarn build`
    5. `yarn start`
- 若project的根目錄為`/final`，做完上列步驟後必須在`/final/backend`加入`.env`，裡面應該要有：
    `MONGO_URL=mongodb+srv://<dbusername>:<password>@cluster0.tl6id.mongodb.net/finalProject?retryWrites=true&w=majority`
- 做完上列步驟後，連接`localhost:5000`應可顯示前端畫面

## 第三方套件
- 後端：mongoose, dotenv-defaults, lodash, async-lock
- 前端：antd、react-schedule-selector、react-datasheet、moment.js

## 使用說明
- 註冊：先行註冊後，若帳號未與他人重複，則可成功註冊
- 使用註冊的帳號可登入、並進入個人頁面
- 加入好友：輸入朋友之帳號，即可加入好友顯示於好友列表中
- 發起活動：填入活動的標題、敘述（選填）、日期區間與每天的時間區間，以及要邀請的好友（選填），即可發起活動
- 個人活動總覽：可從活動列表中進入任一活動，並顯示其先前的編輯記錄
- 活動約時間：
    1. 拉選或是點選自身可行時段，亦可利用重填按鈕去清除個人編輯內容。
    2. 完成編輯後欲切換至瀏覽模式則必須先點選儲存以將編輯記錄送出。
    3. 在瀏覽模式中，透過表格的數字可得知該時段的可參加人數，hover到格子尚可得知該時段的參與者（顯示於左方：Available/Unavailable）。
    4. 邀請的功能僅限於活動創建者之權限。

## 分工
- 徐紹軒：後端、API設計、部署
- 蘇姵文：前端
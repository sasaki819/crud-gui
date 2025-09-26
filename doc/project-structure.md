# プロジェクトの構成
pnpmのモノレポ構成とする。
root/
  api-server/        # APIモックサーバー
  react-generator/   # メタデータとテンプレートエンジンでReactコードを自動生成
  react-admin/       # react-adminによるローコードUI

# 各プロジェクトの概要

## api-server
- json-serverによるAPIモックサーバー。
- localhost:3123で動作する。
- json-server-extensionによりSwagger UIも提供する。
- CSVのアップロード/ダウンロードについては個別にmiddlewareとして実装する。
- middlewareで実装した箇所はSwagger UIに反映されないため、別途openapi.yamlを定義し、json-server-extension

## react-generator
- prime reactを使用したreact画面を提供。
- localhost:5173で動作する。
- api-serverが提供するAPIに対するCRUD操作＋CSVアップロード／ダウンロードUIを提供する。
- /api/配下に対するアクセスをapi-serverへプロキシする。
- 共通モジュール以外はJSONメタデータからHandlebarでソース生成する。

## react-admin
- react-adminを使用したreact画面を提供。
- localhost:5174で動作する。
- api-serverが提供するAPIに対するCRUD操作＋CSVアップロード／ダウンロードUIを提供する。
- /api/配下に対するアクセスをapi-serverへプロキシする。

## ルートscripts
プロジェクトルートでは下記のscriptを定義する
- dev:api
  - api-serverを単独で起動する
- dev:react-generator
  - react-generatorとapi-serverをconcurrentlyで同時起動し、--kill-othersオプションにより同時停止する。
- dev:react-admin
  - react-adminとapi-serverをconcurrentlyで同時起動し、--kill-othersオプションにより同時停止する。
- dev
  - api-serverとreact-generatorとreact-adminそれぞれのdevスクリプトをconcurrentlyで同時起動し、--kill-othersオプションにより同時停止する。

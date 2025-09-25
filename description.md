# 目的
Reactの画面をメタデータから自動生成するプロジェクトのPoC

# 概要
* JSONメタデータからReactの画面ソースを自動生成する
* ソースの生成にはHandlebarsを使用する
* いかにシンプルなメタデータから必要十分な画面実装を生成できるかが重要ポイント

# React画面の仕様

## React画面の概要
* サーバーサイドで管理されているDBテーブルに対してREST APIを介してアクセスする
* 対象テーブルに対してシンプルなCRUD機能を提供する
* ただし、対象テーブル毎に参照のみ(R)、参照と削除のみ(RD)、参照、登録、削除のみ(CRD)、参照、登録、更新、削除が可能(CRUD)の場合があり、JSONメタデータで指定される
* また、一部のテーブルについてはCSVによる一括ダウンロード機能を提供する場合があり、JSONメタデータで指定される
* また、一部のテーブルについてはCSVによる一括登録機能を提供する場合があり、JSONメタデータで指定される
* ルートページにアクセスするとメニューが表示され、メニューを選択すると特定テーブルに対する検索ページが表示される
* 検索ページで検索すると検索ページ内に検索結果が一覧表示され、一覧上のアイコンから明細表示画面、更新画面、削除画面にそれぞれ遷移できる
* 検索ページ上の「新規登録」ボタンから新規登録画面に遷移できる
* 新規登録、明細表示、更新、削除画面ではそれぞれ対象となる１レコードの情報が表示／編集でき、「登録」や「削除」のボタンが必要に応じて表示され、押下すると同画面内で処理完了を通知するメッセージが表示される。
* 新規登録、明細表示、更新、削除画面には「戻る」ボタンが存在し、押下すると検索ページに戻る事ができるが、この時、前回の検索結果が再表示される

## 各画面共通の仕様

### 画面の構成
* 各画面にはヘッダ、メッセージエリア、アクションエリア、コンテンツエリア、TOPへボタンが上から順に配置される

### ヘッダエリアの詳細
* ヘッダエリアは左エリア、中央エリア、右エリアが存在し、それぞれ子要素を左寄せ、中央寄せ、右寄せで表示する

#### ヘッダ左エリアの詳細
* ヘッダの左エリアには次の要素が表示される
    * アプリ名
    * メニュー画面へのリンク（ルートページの場合は非表示）

#### ヘッダ中央エリアの詳細
* ヘッダの中央エリアには次の要素が表示される
    * 現在表示しているページのタイトル

#### ヘッダ右エリアの詳細
* ヘッダの右エリアには次の要素が表示される
    * 現在ログイン中のユーザーID
    * ログアウトボタン
    * ヘルプアイコン（詳細未定のためダミーのリンクとして実装する）

### メッセージエリアの詳細
* メッセージエリアには現在表示中の画面に関する情報、警告、エラーが表示される
* メッセージエリアのメッセージは情報は緑、警告は黄色、エラーは赤く表示される
* メッセージエリアのメッセージはユーザーが×ボタンで削除することができる
* メッセージエリアに表示すべきメッセージが存在しない場合、メッセージエリアは一切のUIを提供しない（非表示またはDOM上で表示状態であってもレンダー結果として何もレンダーされない）
* 画面によっては初期表示時点でメッセージエリアにメッセージを表示する場合がある。具体的な内容はJSONメタデータで指定される。
* JSONメタデータの指定に応じて初期表示するメッセージに関しては×ボタンで削除できない物も存在する。JSONメタデータで指定される。
### アクションエリアの詳細
* アクションエリアには画面毎に異なる操作ボタンが横並びで表示される
* 画面毎の具体的な内容は以降の章で説明する

### コンテンツエリアの詳細
* コンテンツエリアには画面毎に異なる内容が表示される
* 画面毎の具体的な内容は以降の章で説明する

### TOPへボタンの詳細
* TOPへボタンはページ右下にボタンとして表示される（スクリーン右下にFloating Action Buttonとして表示しない）
* ただしページスクロールが発生していない場合は非表示とする

## 検索画面の詳細

### コンテンツエリアの詳細
* コンテンツエリアには検索フォームと検索結果を表示する（検索結果は初期非表示）

#### 検索フォームの詳細
* 検索フォームには原則として対象テーブルの主キー項目が入力できる
* 検索フォームには加えて「曖昧検索」チェックボックスが存在し、ONの場合は検索APIに「"useLike": true」オプションを付加してリクエストする
* 検索フォームには加えて「履歴を含める」チェックボックスが存在し、ONの場合は検索APIに「"includeHistory": true」オプションを付加してリクエストする
* 曖昧検索、履歴を含めるのチェックボックスのデフォルトはOFF
* 検索フォームには「リセット」ボタン、「検索」ボタンが右下に表示される
* 検索フォームの入力欄はラベルと入力部品の対を並べて表示する
* ラベルと入力部品の対は原則として横並びとし、レスポンシブに折り返して表示する
* ただし、JSONメタデータで指定された場合のみ、その入力項目から新しい行に配置する

#### 検索結果エリアの詳細
* 検索結果エリアには検索結果のレコードが表形式で表示される
* 検索結果の表には必ず一番左に「No」列を表示する（APIレスポンスには存在しないがReact側で付与する）
* 検索結果の「No」列の右には「操作」列を表示する（APIレスポンスには存在しないがReact側で付与する）
* 「操作」列には次のアクションアイコンボタンを配置する
    * 明細（該当レコードの明細表示画面に遷移する）
    * コピー（該当レコードの内容を初期入力した新規登録画面に遷移する）
    * 更新（該当レコードの更新画面に遷移する）
    * 削除（該当レコードの削除画面に遷移する）
* 検索結果の表はページネーションを行う。
* ページネーションの単位（一度に表示する件数）プルダウンから25件、50件、100件を選択できる。デフォルトは25件。
* ページネーションの単位を選択するプルダウンは検索結果の表の右上に表示する
* ページネーションのページ移動UIは検索結果の上部に表示する

### アクションエリアの詳細
* アクションエリアには次のボタンが表示される
    * 新規登録
    * CSVダウンロード（検索結果が表示されていない間は非活性）
    * 一括登録
    * 印刷（検索結果が表示されていない間は非活性）
* （補足）「検索」ボタンは検索フォームエリアに表示されるためアクションエリアには配置しない
* 「印刷」ボタンが押下された場合は表示中のページ全体を対象としてブラウザの印刷プレビュー画面を表示する
* 「一括登録」ボタンが押下された場合はモーダル画面にファイル選択UIと「キャンセル」ボタン、「送信」ボタンが表示され、ファイル選択して「送信」ボタンを押下すると一括登録APIを呼び出した後、検索画面のメッセージエリアに成否（エラーの場合はAPIから受領したエラーメッセージ）を表示する

## 新規登録画面の詳細

### コンテンツエリアの詳細
* コンテンツエリアには登録フォームを表示する
* 登録フォームには対象テーブルの全項目が入力フォームとして提示され、入力後に「登録」ボタンを押下すると登録APIを呼び出し後、メッセージエリアに成否（エラーの場合はAPIから受領したエラーメッセージ）を表示する
* ただし、一部の項目についてはDB登録時に自動設定されるため入力不可とする
* 入力不可の項目は登録フォーム上に欄は設けるが入力部品は配置しない
* 入力不可の項目はJSONメタデータで指定される
* 画面によっては入力フォームに追加の入力項目を表示する場合がある。該当するケースではJSONメタデータで指定される

### アクションエリアの詳細
* アクションエリアには次のボタンが表示される
    * 戻る

## 明細表示画面の詳細
* 明細表示画面の表示内容は原則として新規登録画面に準じる
* ただし、各データ項目は表示のみ行い、ユーザーによる入力は受け付けない
* 明細表示画面には「登録」ボタンは表示しない

## 更新画面の詳細
* 更新画面の表示内容は原則として新規登録画面に準じる
* 更新画面にも入力不可の項目が存在する場合があり、JSONメタデータで指定される

## 削除画面の詳細
* 削除画面の表示内容は原則として新規登録画面に準じる
* ただし、各データ項目は表示のみ行い、ユーザーによる入力は受け付けない
* 削除画面には「登録」ボタンの代わりに「削除」ボタンを表示する

# JSONメタデータの仕様
* JSONメタデータファイルはメニュー単位で作成される
* JSONメタデータにはfeatureフィールドとresourceフィールドを持つオブジェクトが定義される
* featureフィールドには対象テーブル単位の設定が定義される
* resourceフィールドにはデータ項目単位の設定が定義される
* 各フィールドはデフォルト値が定義されている場合がある。デフォルト設定の場合記述を省略可能とする。

## featureフィールドの仕様
* featureフィールドには次のフィールドを持つオブジェクトが定義される
    * id : リソース（対象テーブル）のID
    * name : リソースの和名（メニュー名、画面名称に利用される）
    * menu : メニューの階層構造を配列で定義する。（例：["管理","休日","市場休日"]）
    * type : "R" or "RD" or "CRD" or "CRUD"
    * hasDetailPage : 明細表示ページを持つか（boolean、デフォルトはfalse）
    * allowCopyCreate : コピー新規機能を持つか（boolean、デフォルトはtrue）
    * allowLikeSearch : 検索フォームに「曖昧検索」チェックボックスを表示するか（boolean、デフォルトはtrue）
    * hasHistory : 検索フォームに「履歴を含める」チェックボックスを表示するか（boolean、デフォルトはfalse）
    * csv : "I" or "O" or "IO" or ""（CSVダウンロード、CSV一括登録がそれぞれ可能か）（デフォルトは"O"）
    * allowPrint : 検索ページに「印刷」ボタンを表示するか（boolean、デフォルトはtrue）
    * defaultMessages : 初期表示メッセージを定義した配列。詳細は後述。初期表示メッセージが存在しない場合は省略可能

### defaultMessagesフィールドの仕様
* defaultMessagesには初期表示メッセージを定義した配列を設定する
* 各配列要素には次のフィールドを持つオブジェクトが定義される
    * level : "info" or "warn" or "error"（メッセージのタイプ）
    * page : "search" or "detail" or "create" or "update" or "delete"（表示対象画面）
    * code : メッセージコード（string）、メッセージエリアに表示する
    * message : メッセージ本文（string）、メッセージエリアに表示する
    * allowDelete : メッセージをユーザーが削除可能か（メッセージに×ボタンを表示するか）（boolean、デフォルトはtrue）

## resourceフィールドの仕様
* resourceフィールドには当該メニューに属する画面で入出力するデータ項目を定義した配列を設定する
* 各配列要素には次のフィールドを持つオブジェクトが定義される
    * id : 項目のID
    * name : リソースの和名
    * type : 後述
    * typeOptions : typeに応じた設定項目。オブジェクト型。後述。
    * allowFilter : 検索条件として入力可能か（boolean、デフォルトはfalse）
    * allowCreate : 新規登録／コピー新規登録時に入力可能か（boolean、デフォルトはtrue）
    * allowUpdate : 更新時に入力可能か（boolean、デフォルトはtrue）
    * allowDisplay : 検索結果一覧、明細表示の表示対象か（一括設定）（boolean、デフォルトはtrue）

### typeフィールドとtypeOptionsの仕様
* typeフィールドはアプリケーション開発者が必要に応じて追加可能なデータ型である
* 各typeフィールドの値はソース生成時に対応するReactコンポーネントと対応する
* 各typeは固有のオプション指定を受け付ける事ができ、オプションはtypeOptionsで定義する
* typeOptionsの設定はReactコンポーネントのpropsに対応する
* 初期セットとして下記のtypeとtypeOptionsを実装する
    * MultiText : string型。任意の文字列。テキストエリアで入力。
        * regexp : 正規表現によるフォーマット指定（デフォルトは.*）
        * maxLen : 最大桁数
        * minLen : 最小桁数
        * maxWidth : 表示時の最大桁数
        * overflow : "trim" or "wrap"（表示時に最大桁を超えている場合に「...」で省略するか折り返して複数行で表示するか）
    * Text : string型。改行を除く任意の文字列。テキストフィールドで入力。
        * regexp : 正規表現によるフォーマット指定（デフォルトは[^\n]*）
        * maxLen : 最大桁数
        * minLen : 最小桁数
        * maxWidth : 表示時の最大桁数
        * overflow : "trim" or "wrap"（表示時に最大桁を超えている場合に「...」で省略するか折り返して複数行で表示するか）
    * Code : string型。英数字のみで構成される。テキストフィールドで入力。
        * regexp : 正規表現によるフォーマット指定（デフォルトは[a-zA-Z0-9]*）
        * maxLen : 最大桁数
        * minLen : 最小桁数
    * CodeStaticList : string型。プルダウンで入力。選択肢は固定。
        * items : 選択肢の配列。各配列要素は次のフィールドを持つオブジェクト。
            * name : ユーザーに提示する選択肢名
            * value : APIと通信する際に仕様するvalue値
    * CodeDynamicList : string型。プルダウンで入力。選択肢はAPIで取得。
        * url : 選択肢取得用のAPIのURL（レスポンスにはname／valueの配列が収録される）
    * Integer : number型。整数。
        * max : 最大値
        * min : 最小値
        * comma : boolean型。表示時に3桁毎に「,」で区切って表示するか。
        * markBefore : string型。表示時に冒頭に付与する文字列。
        * markAfter : string型。表示時に末尾に付与する文字列。
    * Decimal : number型。小数。
        * max : 最大値
        * min : 最小値
        * precision : 有効桁数（整数部桁数＋小数部桁数）
        * scale : 小数部桁数
    * CodeNameStaticList : string型。英数字のみで構成されるコード値に和名を紐付けて表示。プルダウンと連動するラベルで入。選択肢は固定。
        * items : 選択肢の配列。各配列要素は次のフィールドを持つオブジェクト。
            * name : ユーザーに提示するコード値
            * value : APIと通信する際に仕様するvalue値
            * text : コード値に対応する和名
    * CodeNameDynamicList : string型。英数字のみで構成されるコード値に和名を紐付けて表示。プルダウンと連動するラベルで入力。選択肢はAPIで取得。
        * url : 選択肢取得用のAPIのURL（レスポンスにはname／value／textの配列が収録される）
    * TwoState : boolean型。ON/OFFの２状態項目。チェックボックスで入力。テキストで表示。valueはON:1、OFF:0
        * onName : ONの場合の表示テキスト。
        * offName : OFFの場合の表示テキスト。
    * Radio : number型。整数。複数の状態を持つ値。ラジオボタンで入力。テキストで表示。
        * options : 選択肢の配列。各配列要素は次のフィールドを持つオブジェクト。
            * name : ユーザーに提示する名称
            * value : APIと通信する際に仕様するvalue値
    * Date : string型。yyyymmdd形式。タイムゾーンはJST。特定の日付を表現。テキストフィールドで入力、YYYY/MM/DD形式で表示。有効日付かのバリデーションをフロントエンドで実施。
    * DateFromTo : string型のペア。日付範囲を表現。タイムゾーンはJST。入力とAPIとのIFはyyyymmdd形式。２つのテキストフィールドで入力、YYYY/MM/DD形式で表示。有効日付かのバリデーションとFrom＜=Toバリデーションをフロントエンドで実施。

# 対象テーブルについて
* テーブルの主キーはナチュラルキーによる複合キーで構築されている（サロゲートキーは存在しない）
* 全てのテーブルに共通管理項目として次のカラムが末尾に設けられている
    * 最終更新者ID(char(8))
    * 最終更新日時(datetime)
* 多くのテーブルで論理削除をサポートするため次のカラムが共通管理項目の手前に設けられている
    * 削除フラグ(int、0:未削除、1:削除済)
* 多くのテーブルで本テーブルの他に履歴テーブルがペアで存在する
    * 履歴テーブルのIDは<本テーブルのID>_HIST
    * 履歴テーブルの主キーは本テーブルの主キー＋履歴通番
    * 履歴テーブルのレコードは本テーブル更新時にDBトリガーで自動的に生成される
    * 検索フォームで「履歴を含める」チェックボックスをONにした場合、API側で検索時に履歴テーブルをUNIONする
    * 検索フォームで「履歴を含める」チェックボックスをONにした場合、検索結果には「履歴通番」列が追加表示される
    * 検索フォームで「履歴を含める」チェックボックスをONにした場合、検索結果に履歴レコード（履歴通番あり）も表示され、本テーブルレコード（履歴通番なし）とは異なる背景色で表示される

# 画面URLについて
* ソース生成時、ドメインについては意識しない実装を生成する
* パスに関してはJSONメタデータのfeature.idをベースに判断する
* http://<mydomain>/feature.id/ で検索画面を表示
* http://<mydomain>/feature.id/create で新規登録画面／コピー新規画面を表示
* http://<mydomain>/feature.id/detail?<主キー情報をクエリストリングで指定> で明細表示画面を表示
* http://<mydomain>/feature.id/update?<主キー情報をクエリストリングで指定> で更新画面を表示
* http://<mydomain>/feature.id/delete?<主キー情報をクエリストリングで指定> で削除画面を表示

# APIエンドポイントについて
* 検索は「GET https://<mydomain>/feature.id?<検索条件をクエリストリングで指定>」
* 登録は「POST https://<mydomain>/feature.id」
* 更新は「PUT https://<mydomain>/feature.id?<主キー情報をクエリストリングで指定>」
* 削除は「DELETE https://<mydomain>/feature.id?<主キー情報をクエリストリングで指定>」
* CSVダウンロードは「POST https://<mydomain>/feature.id/download」
* CSV一括登録は「POST https://<mydomain>/feature.id/upload」
* 開発環境ではhttpでアクセスする
* 実装コード上は「http(s)://<mydomain>」は記述せず、アクセスしたドメインに対してパス指定でアクセスする

# API仕様
* 全APIは原則として JSON を使用する（`Content-Type: application/json`、`Accept: application/json`）
* 例外として、CSVダウンロードは「要求はJSON、応答はCSV（ストリーム）」とする
* 例外として、CSVアップロードは「要求は multipart/form-data（ファイル本体CSV）、応答はJSON」とする
* エラー応答は共通形式のJSONで返す
    * 形式: `{ "code": "<ERROR_CODE>", "message": "<human readable>", "details": { ... } }`
* API通信中はスピーナーを表示してユーザー操作をブロックする

### 主キー指定の方針
* 本システムは複合ナチュラルキーを前提とするため、明細取得/更新/削除の主キー指定はクエリストリングで行う
  * 例: `GET /<feature.id>?k1=...&k2=...`
  * `PUT /<feature.id>?k1=...&k2=...`
  * `DELETE /<feature.id>?k1=...&k2=...`
* `Location` ヘッダの主キー表現も同様にクエリストリングで返す

## 正常時レスポンス標準形式

### 共通
* `Content-Type: application/json; charset=UTF-8`
* 成功時のJSONは原則として「データ本体＋付随情報(meta)」の形で返す
* 文字列日付は `YYYY/MM/DD`、日時は `YYYY-MM-DD HH:mm:ss`（JST）を使用

### 一覧取得（検索）
* ステータス: `200 OK`
* 形式:
```json
{
  "items": [ { /* レコード */ } ],
  "total": 123,
  "page": 1,
  "pageSize": 25,
  "sort": { "orderBy": "colA", "order": "asc" }
}
```

### 明細取得（単一）
* ステータス: `200 OK`
* 形式:
```json
{ "item": { /* レコード */ } }
```

### 登録（Create）
* ステータス: `201 Created`
* ヘッダ:
  * `Location: /<feature.id>?<主キーのクエリストリング>`（主キーが複合の場合は全キーを含める）
* 形式:
```json
{
  "id": { /* 主キー（複合可） */ },
  "item": { /* 登録後の確定値を含むレコード */ }
}
```

### 更新（Update）
* ステータス: `200 OK`
* 形式:
```json
{ "item": { /* 更新後のレコード */ } }
```

### 削除（Delete）
* ステータス: `200 OK`
* 形式:
```json
{ "deleted": true, "affected": 1 }
```

### 共通メタ情報（任意）
* 必要に応じて次を付与可（画面メッセージや制御で使用）
```json
{
  "item": { },
  "meta": {
    "warnings": [ { "code": "W001", "message": "..." } ],
    "notices": [ { "code": "N001", "message": "..." } ]
  }
}
```

## CSVダウンロード（エクスポート）
* エンドポイント: `POST /<feature.id>/download`
* リクエスト（JSON）
    * `filters`: 検索条件
    * `includeHistory`: 履歴含める（boolean, 既定 false）
    * `columns`: 出力カラム配列（未指定時は既定の出力順）
    * `orderBy`: 並び替えキー
    * `order`: `asc` | `desc`
    * `format`: 出力フォーマット（`bom`, `newline`, `delimiter`, `quote`, `null`, `date`, `datetime`）
    * `limit`: 最大出力件数（既定 100000、超過時は 400）
* レスポンス（成功）
    * ステータス: `200 OK`
    * ヘッダ:
        * `Content-Type: text/csv; charset=UTF-8`
        * `Content-Disposition: attachment; filename="<feature.id>_YYYYMMDD_HHmmss.csv"`
    * ボディ: CSV ストリーム
* エラー例（JSON）
    * `400 BAD_REQUEST`（条件不正／出力量が制限超過）
    * `500 INTERNAL_SERVER_ERROR`

## CSV一括登録（インポート）
* エンドポイント: `POST /<feature.id>/upload`
* リクエスト: `multipart/form-data`
    * フィールド:
        * `file`: CSVファイル（`text/csv` または `application/vnd.ms-excel` 許容）
        * `options`（任意, JSON文字列）
            * `hasHeader`（既定 true）: 1行目がカラム名
            * `mode`（既定 "insert"）: `"insert" | "upsert" | "replace"`
            * `validateOnly`（既定 false）: 検証のみ
            * `ignoreUnknownColumns`（既定 false）
* マッピング規則:
    * ヘッダ名は `resource[].id` と一致（既定: 大小文字を区別しない）
    * 未知カラムはエラー（`ignoreUnknownColumns: true` で無視可）
* レスポンス（成功・同期）
    * ステータス: `200 OK`
    * ボディ（JSON）:
        * `total`, `processed`, `inserted`, `updated`, `skipped`, `errors: [{ row, field, code, message }]`
* エラー例（JSON）
    * `400 BAD_REQUEST`（スキーマ不整合）
    * `409 CONFLICT`（一意制約違反 等）
    * `413 PAYLOAD_TOO_LARGE`

# CSV仕様

## 共通
* 文字コード: UTF-8（BOM 既定: true、オプションで false 可）
* 区切り文字: `,`
* 改行コード: `\n`
* 囲み文字: `"`（フィールド内に `"` を含む場合は `""` に二重化）
* ヘッダ行: 入出力ともに必須（1行目にカラム名＝`resource[].id`）
* NULL表現: 空文字（`,,`）
* 日付: `YYYY/MM/DD`
* 日時: `YYYY-MM-DD HH:mm:ss`
* 数値: 小数点は `.`、桁区切り（`,`）は出力しない（入力で含まれる場合はエラー）
* 最大件数・サイズ（同期前提）:
    * ダウンロード: 既定 100,000 行まで（超過時は `400`）
    * アップロード: 既定 20MB（超過時は `413`）

## ダウンロード（エクスポート）
* リクエストは JSON（`POST /<feature.id>/download`）
* 応答は CSV ストリーム
* ヘッダ: `Content-Disposition: attachment`（ブラウザの既定ダウンロードフォルダに自動保存）
* 推奨ファイル名: `<feature.id>_YYYYMMDD_HHmmss.csv`

## アップロード（インポート）
* リクエストは `multipart/form-data`、ファイルフィールド名は `file`
* サーバーは同期で全件処理し、集計結果・エラー詳細を JSON で返す

# 認証認可について
現時点では詳細未定のため未実装とする

# 手動生成と自動生成について
* メタデータからソースコードを生成する手段は自動生成と手動生成の２種類を用意する。
* 手動生成は標準構成で対応できない特殊機能の実装が必要な場合に利用し、ソースコードを手動で生成後に開発者が手動で機能を追加する事を意図している。
* 自動生成は生成後のカスタマイズが不要な場合に明示的な操作を必要とせずにビルドプロセス中に暗黙的にソースを生成し、そのままデプロイ＆稼働させ、生成されたコードはgit管理に含めない運用を意図している。
* ソース生成ロジックはコア部分を共通モジュールとして実装し、自動生成はviteプラグインとしてラップし、手動生成はpackage.jsonのscripts経由で実行できるラッパーを用意する。
* 手動生成、自動生成のどちらの場合でも生成されるコードの内容は同等とする。
* 自動生成対象のJSONメタデータと手動生成対象のJSONメタデータは明示的に格納フォルダを分離する。
* ソースコードの生成時に意図しない既存コードの上書きを避けるため、自動生成結果のソースと手動生成結果のソースはそれぞれ専用のフォルダ配下に出力する
* 自動生成によって出力されたソースはそのままビルド可能な構成で出力する
* 手動生成によって出力されたソースは開発者が差分確認しながら最終配置フォルダへコピーする前提とする
* ルーティング、メニュー画面についてページコンポーネント（後述）をビルド時に捜査し、ビルド時に自動生成する
* ルーティング定義、メニュー定義は自動生成、手動生成それぞれについて個別に配列形式で定義し、それをマージする固定コードで最終的に取り扱う

# フォルダ構成
```
root/
    metadata/
        dynamic/                            ※自動生成対象のメタデータ格納用
            .gitkeep
            [resource_id]_.json
            ...
        static/                             ※手動生成対象のメタデータ格納用
            .gitkeep
            [resource_id]_.json
            ...
    template/                               ※自動生成／手動生成共通のテンプレート定義（Handlebars）
        pages/
            [resource_id]_index.tsx.hbs
            [resource_id]_detail.tsx.hbs
            [resource_id]_create.tsx.hbs
            [resource_id]_update.tsx.hbs
            [resource_id]_delete.tsx.hbs
    scripts/
        generate_code.ts                    
        generate_dynamic_vite_plugin.ts     ※自動実行用のスクリプト。viteプラグインとして組み込む。root/metadata/dynamic配下を一括処理してroot/src/dynamic配下に出力する
        generate_static_cli.ts              ※手動実行用のスクリプト。package.jsonのscriptsに組み込む。root/metadata/static配下を一括処理してroot/scripts/dist配下に出力する
        dist/                               ※手動実行時の出力先
            .gitkeep
    src/
        dynamic/
            pages/
                .gitkeep
                [resource_id]/
                    index.tsx
                    detail.tsx
                    create.tsx
                    update.tsx
                    delete.tsx
            components/
                .gitkeep
                [resource_id]/
                    必要な物を配置（検索フォーム、一覧表示、ダイアログなど、リソースに固有のコンポーネント）
            hooks/
                .gitkeep
                [resource_id]/
                    必要な物を配置
            types/
                .gitkeep
                [resource_id]/
                    必要な物を配置
            services/
                .gitkeep
                [resource_id]/
                    必要な物を配置
            dynamic_routes.ts
        static/
            pages/
                .gitkeep
                [resource_id]/
                    index.tsx
                    detail.tsx
                    create.tsx
                    update.tsx
                    delete.tsx
            components/
                .gitkeep
                [resource_id]/
                    必要な物を配置（検索フォーム、一覧表示、ダイアログなど、リソースに固有のコンポーネント）
            hooks/
                .gitkeep
                [resource_id]/
                    必要な物を配置
            types/
                .gitkeep
                [resource_id]/
                    必要な物を配置
            services/
                .gitkeep
                [resource_id]/
                    必要な物を配置
            static_routes.ts
        common/
            pages/
                top.tsx
                error.tsx
                login.tsx
                changePassword.tsx
            routes/
                routes.tsx
            components/
                [resource_id]/
                    必要な物を配置（検索フォーム、一覧表示、ダイアログなど、リソースに固有のコンポーネント）
            hooks/
                [resource_id]/
                    必要な物を配置
            types/
                [resource_id]/
                    必要な物を配置
            services/
                [resource_id]/
                    必要な物を配置
            logic/
                必要な物を配置（function定義）
        App.tsx
        App.css
        main.tsx
        vite-env.d.ts
        etc...
    public/
        sorry.html
        sorry.css
        logout.html
        logout.css
        global.css
    index.html
    package.json
    vite.config.ts
    .gitignore
    .gitattributes
    etc...
```

# 技術スタック
* pnpm
* vite / vitest
* react / react-router / react-hook-form / tanstack-query / axios
* prime-react / primeicons
* zod

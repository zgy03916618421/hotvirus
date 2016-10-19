## 接口文档

###热门卡片
```bash
GET /hotvirus
```
Example:
```bash
http GET /hotvirus

{
  "head": {
    "code": 200,
    "msg": "success"
  },
  "data": [
    {
      "count": 19870,
      "vid": null
    },
    {
      "count": 1084,
      "vid": "6c60d75aff6e42f7cf20b1f03f8fe6b3"
    },
    {
      "count": 939,
      "vid": "a1dd58d17e52731fe34f269133b1069f"
    },
    {
      "count": 863,
      "vid": "1d4dee024769d13e3551a8994b0ff07f"
    },
    ...........
  ]
}
```

###卡片详情
```bash
GET /virusdetail/:vid
```
Parms

|name|required|type|located in|description|
|:----:|:--------:|:----:|:----------:|:-----------:|
|vid|true|string|params|卡片id|

Example:
```bash
http GET /virusdetail/6c60d75aff6e42f7cf20b1f03f8fe6b3

{
  "head": {
    "code": 200,
    "msg": "success"
  },
  "data": {
    "_id": "57e8c1f4c2aced002be2e698",
    "url": "http://brpublic.beautifulreading.com/af0b53d42cb49664c018919bf4cbfde0",
    "content": "有梦想就已经比世界上绝大多数人要幸运了，然而，我们不能忘记尽力去实现梦想，否则这种幸运会变成一种不幸。尽力去追梦吧，趁你还幸运着的时候！",
    "type": "img",
    "userid": "ow3LFjlJD0wJgHlAOWKtihPv9LAA",
    "vid": "6c60d75aff6e42f7cf20b1f03f8fe6b3",
    "createtime": 1474871796000
  }
}
```
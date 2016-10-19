## 接口文档

###热门卡片
```bash
GET /hotvirus
```
Params

|name|required|type|located in|description|
|:----:|:--------:|:----:|:----------:|:-----------:|
|limit|true|string|query|查询条目数|

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

###传染路径
```bash
GET /tree/:vid
```
Params

|name|required|type|located in|description|
|:----:|:--------:|:----:|:----------:|:-----------:|
|vid|true|string|params|卡片id|

Example:
```bash
http GET /tree/6c60d75aff6e42f7cf20b1f03f8fe6b3
{
  "head": {
    "code": 200,
    "msg": "success"
  },
  "data": [
    {
      "name": "ow3LFjvMxVYb7VV6zhrPyB0eWPOs",
      "children": [
        {
          "name": "ow3LFjnIQsE54d3JwiQhO7belkm0",
          "parent": "ow3LFjvMxVYb7VV6zhrPyB0eWPOs",
          "children": [
            {
              "name": "ow3LFjk9rmsueoiCKBta03hAG6D0",
              "parent": "ow3LFjnIQsE54d3JwiQhO7belkm0",
              "children": [
                {
                  "name": "ow3LFjhrlr4wYZqFI6ezTqw5qG4Y",
                  "parent": "ow3LFjk9rmsueoiCKBta03hAG6D0"
                },
                {
                  "name": "ow3LFjsXosP1j-zDmKpRHr768oxU",
                  "parent": "ow3LFjk9rmsueoiCKBta03hAG6D0",
                  "children": [
                    {
                      "name": "ow3LFjuNsfZNVCia5nXnBJQwNaA0",
                      "parent": "ow3LFjsXosP1j-zDmKpRHr768oxU"
                    },
                    {
                      "name": "ow3LFjv6dz3CBG1hTnivu5l37C14",
                      "parent": "ow3LFjsXosP1j-zDmKpRHr768oxU"
                    },
                    {
                      "name": "ow3LFjmxBPoDvoqM7ZS3y6LE0wVM",
                      "parent": "ow3LFjsXosP1j-zDmKpRHr768oxU",
                      "children": [
                        {
                          "name": "ow3LFjiOHIk4a48Xs8js2GNN3dI0",
                          "parent": "ow3LFjmxBPoDvoqM7ZS3y6LE0wVM",
                          "children": [
                            {
                              "name": "ow3LFjgQrrcq1l_pWS4BMvcD_YtU",
                              "parent": "ow3LFjiOHIk4a48Xs8js2GNN3dI0"
                            }
                          ]
                        }
                      ]
                    },
                    ..........
```

###分享路径
```bash
GET /graph/:vid
```
Params

|name|required|type|located in|description|
|:----:|:--------:|:----:|:----------:|:-----------:|
|vid|true|string|params|卡片id|

Example:
```bash
{
  "head": {
    "code": 200,
    "msg": "success"
  },
  "data": [
    {
      "source": "周光耀",
      "target": "书子",
      "label": "d56dec74d6102bff730c37f31b582bf4"
    },
    {
      "source": "书子",
      "target": "书子",
      "label": "d56dec74d6102bff730c37f31b582bf4"
    },
    {
      "source": "书子",
      "target": "书子",
      "label": "d56dec74d6102bff730c37f31b582bf4"
    },
    {
      "source": "书子",
      "target": "Haihai Fu",
      "label": "d56dec74d6102bff730c37f31b582bf4"
    },
    {
      "source": "Haihai Fu",
      "target": "海海",
      "label": "d56dec74d6102bff730c37f31b582bf4"
    },
    {
      "source": "书子",
      "target": "seatNumber_豪",
      "label": "d56dec74d6102bff730c37f31b582bf4"
    },
    {
      "source": "书子",
      "target": "莫希",
      "label": "d56dec74d6102bff730c37f31b582bf4"
    },
    ...........
```
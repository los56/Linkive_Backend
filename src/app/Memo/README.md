Memo JSON 구조
=============

```JSON
{
  "data": [
    // 1안
    {
      "type": "1",
      "value": "안녕하세요"
    },
    {
      "type": "2",
      "value": "my.png"
    },
    
    // 2안
    {
      "type": "Memo",
      "value": "안녕하세요"
    },
    {
      "type": "Image",
      "src": "my.png"
    }
  ]
}
```
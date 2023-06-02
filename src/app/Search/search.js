/**s
 * @swagger
 *  tags:
 *      name: Search
 *      description: Search APIs
 */

/**
 * @swagger
 *  /search:
 *      post:
 *          summary: 검색 기능
 *          tags: [Search]
 *          description: 검색 기능입니다.
 *          parameters:
 *              - $ref: '#/components/parameters/AccessToken'
 *              - $ref: '#/components/parameters/RefreshToken'
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              keyword:
 *                                  type: string
 *                                  description: 검색어 문자열입니다.
 *                              method:
 *                                  type: string
 *                                  description: 검색할 대상입니다.<br>title=제목, content=내용, folder=폴더 이름
 *                      example:
 *                          keyword: 여행기
 *                          method: title
 *
 *
 */
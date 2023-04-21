/**
 * @swagger
 *  tags:
 *      name: Memo
 *      description: 메모 관련 APIs
 */

/**
 * @swagger
 * /memo/create:
 *      post:
 *          summary: 새 링크 메모 생성
 *          tags: [Memo]
 *          parameters:
 *                - $ref: '#/components/parameters/AccessToken'
 *                - $ref: '#/components/parameters/RefreshToken'
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/MemoRequest'
 *          responses:
 *              "200":
 *                  description: 메모 생성에 성공했습니다.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  memo_num:
 *                                      type: number
 *                                      description: 생성된 메모의 번호입니다.
 *                              example:
 *                                  memo_num: 1
 *              "401":
 *                  description: 권한이 없거나 잘못된 인증 정보입니다.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/MessageResponse'
 *                          example:
 *                              message: Wrong Userdata
 *              "500":
 *                  description: 내부 서버 오류입니다.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/MessageResponse'
 *
 *
 */

/**
 * @swagger
 *  /memo/edit:
 *      post:
 *          summary: 메모 수정
 *          tags: [Memo]
 *          parameters:
 *              - $ref: '#/components/parameters/AccessToken'
 *              - $ref: '#/components/parameters/RefreshToken'
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/MemoRequest'
 *          responses:
 *              "200":
 *                  description: 메모가 수정되었습니다.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/MessageResponse'
 *                          example:
 *                              message: Memo edited
 *              "401":
 *                  description: 권한이 없거나 잘못된 인증 정보입니다.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/MessageResponse'
 *                          example:
 *                              message: Permission Denied
 *              "500":
 *                  description: 내부 서버 오류입니다.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/MessageResponse'
 */

/**
 * @swagger
 * /memo/delete:
 *  post:
 *      summary: 메모 삭제
 *      tags: [Memo]
 *      parameters:
 *          - $ref: '#/components/parameters/AccessToken'
 *          - $ref: '#/components/parameters/RefreshToken'
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      required:
 *                          - memo_num
 *                      memo_num:
 *                          type: number
 *                          description: 대상 메모의 번호입니다.
 *                  example:
 *                      memo_num: 1
 *      responses:
 *          "200":
 *              description: 메모가 삭제되었습니다.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/MessageResponse'
 *                      example:
 *                          message: Memo deleted
 *          "401":
 *              description: 권한이 없거나 잘못된 인증 정보입니다.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/MessageResponse'
 *                      example:
 *                          message: Permission Denied
 *          "500":
 *              description: 내부 서버 오류입니다.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/MessageResponse'
 */

/**
 * @swagger
 * /memo/:
 *  post:
 *      summary: 메모 전체 조회
 *      tags: [Memo]
 *      parameters:
 *          - $ref: '#/components/parameters/AccessToken'
 *          - $ref: '#/components/parameters/RefreshToken'
 *      responses:
 *          "200":
 *              description: 조회에 성공하여 메모의 전체 정보를 반환합니다.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              memoList:
 *                                  type: array
 *                                  items:
 *                                      $ref: '#/components/schemas/Memo'
 *          "401":
 *              description: 권한이 없거나 잘못된 인증 정보입니다.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/MessageResponse'
 *                      example:
 *                          message: Permission Denied
 *          "500":
 *              description: 내부 서버 오류입니다.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/MessageResponse'
 *
 */

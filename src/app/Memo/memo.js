/**
 * @swagger
 *  tags:
 *      name: Memo
 *      description: 메모 관련 APIs
 */

/**
 * @swagger
 * /memos/create:
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
 *  /memos/edit:
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
 * /memos/delete:
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
 * /memos/:
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

/**
 * @swagger
 * /memos/folders:
 *  post:
 *      summary: 폴더 안 메모 조회
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
 *                          - folder_num
 *                      type: object
 *                      properties:
 *                          folder_num:
 *                              type: number
 *                              description: 조회할 폴더의 번호입니다.
 *                          password:
 *                              type: string
 *                              format: password
 *                              description: (Optional) 폴더의 비밀번호입니다.
 *                  example:
 *                      folder_num: 3
 *                      password: asdf1234
 *      responses:
 *          "200":
 *              description: 조회에 성공하여 메모 리스트를 반환합니다.
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

/**
 * @swagger
 * /memos/{memos_num}:
 *  post:
 *      summary: 개별 메모 조회
 *      tags: [Memo]
 *      parameters:
 *          - $ref: '#/components/parameters/AccessToken'
 *          - $ref: '#/components/parameters/RefreshToken'
 *      responses:
 *          "200":
 *              description: 조회에 성공하여 메모의 정보를 반환합니다.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Memo'
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

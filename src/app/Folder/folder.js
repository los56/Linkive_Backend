/**
 * @swagger
 *  tags:
 *      name: Folder
 *      description: 폴더 관련 APIs
 */

/**
 * @swagger
 *  /folders/create:
 *      post:
 *          summary: 폴더 생성
 *          tags: [Folder]
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
 *                              name:
 *                                  type: string
 *                                  description: 폴더의 이름입니다.
 *                              password:
 *                                  type: string
 *                                  format: password
 *                                  description: 폴더의 비밀번호입니다.
 *                              thumbnail:
 *                                  type: string
 *                                  format: URL
 *                                  description: 폴더의 썸네일입니다.
 *                      example:
 *                          name: 내 폴더
 *                          password: 1234
 *                          thumbnail: /thumbnail.jpg
 *          responses:
 *              "200":
 *                  description: 폴더 생성에 성공했습니다.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  folder_num:
 *                                      type: number
 *                                      description: 생성된 폴더의 번호입니다.
 *                              example:
 *                                  folder_num: 1
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
 */

/**
 * @swagger
 *  /folders/edit:
 *      post:
 *          summary: 폴더 수정
 *          tags: [Folder]
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
 *                              folder_num:
 *                                  type: number
 *                                  description: 수정할 폴더의 번호입니다.
 *                              name:
 *                                  type: string
 *                                  description: 폴더의 이름입니다.
 *                              password:
 *                                  type: string
 *                                  format: password
 *                                  description: 폴더의 비밀번호입니다.
 *                              thumbnail:
 *                                  type: string
 *                                  format: URL
 *                                  description: 폴더의 썸네일입니다.
 *                      example:
 *                          name: 내 폴더
 *                          password: 1234
 *                          thumbnail: /thumbnail.jpg
 *          responses:
 *              "200":
 *                  description: 폴더 수정에 성공했습니다.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/MessageResponse'
 *                          example:
 *                              message: Folder edited
 *              "400":
 *                  description: 잘못된 폴더 번호입니다.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/MessageResponse'
 *                          example:
 *                              message: Invalid folder number
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
 */

/**
 * @swagger
 * /folders/delete:
 *  post:
 *      summary: 메모 삭제
 *      tags: [Folder]
 *      parameters:
 *          - $ref: '#/components/parameters/AccessToken'
 *          - $ref: '#/components/parameters/RefreshToken'
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      folder_num:
 *                          type: number
 *                          description: 삭제할 폴더의 번호입니다.
 *                  example:
 *                      folder_num: 1
 *      responses:
 *          "200":
 *              description: 폴더가 삭제되었습니다.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/MessageResponse'
 *                      example:
 *                          message: Folder deleted
 *          "202":
 *              description: 폴더를 삭제할 수 없습니다. 폴더에 포함된 메모가 있습니다.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/MessageResponse'
 *                      example:
 *                          message: Can't remove folder
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
 * /folders:
 *  post:
 *      summary: 폴더 전체 조회
 *      tags: [Folder]
 *      parameters:
 *          - $ref: '#/components/parameters/AccessToken'
 *          - $ref: '#/components/parameters/RefreshToken'
 *      responses:
 *          "200":
 *              description: 폴더 조회에 성공했습니다. 전체 목록을 반환합니다.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              folderList:
 *                                  type: array
 *                                  items:
 *                                      $ref: '#/components/schemas/Folder'
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
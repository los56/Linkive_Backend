/**
 * @swagger
 *  tags:
 *      name: Pagesheet
 *      description: Pagesheet APIs
 */

/**
 * @swagger
 *  /pagesheets/create:
 *      post:
 *          summary: 페이지 시트 생성
 *          tags: [Pagesheet]
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
 *                                  description: 페이지 시트의 이름입니다.
 *                              layout:
 *                                  type: array
 *                                  description: 페이지 시트 컴포넌트 순서입니다.
 *                                  items:
 *                                      type: number
 *                                      description: 컴포넌트 번호입니다. (프론트 의존, 백엔드애서는 제공 X)
 *                      example:
 *                          name: 여행
 *                          layout: ["image", "text", "image"]
 *          responses:
 *              "200":
 *                  description: 페이지 생성에 성공했습니다.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  pagesheet_num:
 *                                      type: number
 *                                      description: 생성된 페이지 시트의 번호입니다.
 *                              example:
 *                                  pagesheet_num: 1
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
 *  /pagesheets/edit:
 *      post:
 *          summary: 페이지 시트 수정
 *          tags: [Pagesheet]
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
 *                              pagesheet_num:
 *                                  type: number
 *                                  description: 수정할 페이지 시트의 번호입니다.
 *                              name:
 *                                  type: string
 *                                  description: 페이지 시트의 이름입니다.
 *                              layout:
 *                                  type: array
 *                                  description: 페이지 시트 컴포넌트 순서입니다.
 *                                  items:
 *                                      type: number
 *                                      description: 컴포넌트 번호입니다. (프론트 의존, 백엔드애서는 제공 X)
 *                      example:
 *                          pagesheet_num: 5
 *                          name: 학교
 *                          layout: ["image", "text", "text", "text"]
 *          responses:
 *              "200":
 *                  description: 폴더 수정에 성공했습니다.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/MessageResponse'
 *                          example:
 *                              message: Pagesheet edited
 *              "400":
 *                  description: 잘못된 페이지 시트 번호입니다.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/MessageResponse'
 *                          example:
 *                              message: Can't find pagesheet
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
 * /pagesheets/delete:
 *  post:
 *      summary: 페이지 시트 삭제
 *      tags: [Pagesheet]
 *      parameters:
 *          - $ref: '#/components/parameters/AccessToken'
 *          - $ref: '#/components/parameters/RefreshToken'
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      pagesheet_num:
 *                          type: number
 *                          description: 삭제할 페이지 시트의 번호입니다.
 *                  example:
 *                      pagesheet_num: 1
 *      responses:
 *          "200":
 *              description: 페이지 시트가 삭제되었습니다.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/MessageResponse'
 *                      example:
 *                          message: Pagesheet deleted
 *          "400":
 *              description: 페이지 시트를 찾을 수 없습니다.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/MessageResponse'
 *                      example:
 *                          message: Can't find pagesheet
 *          "401":
 *              description: 권한이 없거나 잘못된 인증 정보입니다.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/MessageResponse'
 *                      example:
 *                          message: Wrong userdata
 *          "500":
 *              description: 내부 서버 오류입니다.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/MessageResponse'
 */

/**
 * @swagger
 * /pagesheets:
 *  post:
 *      summary: 페이지 시트 전체 조회
 *      tags: [Pagesheet]
 *      parameters:
 *          - $ref: '#/components/parameters/AccessToken'
 *          - $ref: '#/components/parameters/RefreshToken'
 *      responses:
 *          "200":
 *              description: 페이지 시트의 목록입니다.
 *              content:
 *                  application/json:
 *                      schema:
 *
 *          "400":
 *              description: 페이지 시트를 찾을 수 없습니다.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/MessageResponse'
 *                      example:
 *                          message: Can't find pagesheet
 *          "401":
 *              description: 권한이 없거나 잘못된 인증 정보입니다.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/MessageResponse'
 *                      example:
 *                          message: Wrong userdata
 *          "500":
 *              description: 내부 서버 오류입니다.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/MessageResponse'
 */
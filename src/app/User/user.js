/**
 * @swagger
 *  tags:
 *      name: User
 *      description: User APIs
 */

/**
 * @swagger
 *  /users/login:
 *      post:
 *          summary: 로그인
 *          tags: [User]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              id:
 *                                  type: string
 *                                  description: 사용자의 아이디입니다.
 *                              password:
 *                                  type: string
 *                                  format: password
 *                                  description: 사용자의 비밀번호입니다.
 *                          example:
 *                              id: test1234
 *                              password: test1234!@
 *          responses:
 *              "200":
 *                  description: 로그인에 성공했습니다.<br/><h5>예시의 토큰은 예시로 사용할 수 없습니다.</h5 >
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  accessToken:
 *                                      type: string
 *                                      format: JWT
 *                                      description: 발급된 AccessToken 입니다.
 *                                  refreshToken:
 *                                      type: string
 *                                      format: JWT
 *                                      description: 발급된 RefreshToken 입니다.
 *                              example:
 *                                  accessToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QxMjM0IiwiZW1haWwiOiJ0ZXN0MTIzNEBleGFtcGxlLmNvbSIsIm5pY2tuYW1lIjoidGVzdGVyIiwiaWF0IjoxNjgxMjc5NjYzLCJleHAiOjE2ODEyODMyNjN9.z5ZdEap82SiWhJrRJEjY-H9xybEv9EN4N8YCelAvKAI
 *                                  refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QxMjM0IiwiZW1haWwiOiJ0ZXN0MTIzNEBleGFtcGxlLmNvbSIsIm5pY2tuYW1lIjoidGVzdDEyMzQiLCJpYXQiOjE2ODEyNzk2NjMsImV4cCI6MTY4MTg4NDQ2M30.fh-bKsm-VIrLIF3ydmIs248NofNraj6H36LHID3TGXY
 *              "40X":
 *                  description: 로그인 정보가 잘못되었습니다.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/MessageResponse'
 *                          example:
 *                              message: 비밀번호가 일치하지 않습니다.
 *
 */
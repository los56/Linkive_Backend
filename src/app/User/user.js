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
 */

/**
 * @swagger
 *  /users/signup:
 *      post:
 *          summary: 회원가입
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
 *                              email:
 *                                  type: string
 *                                  format: email
 *                                  description: 사용자의 이메일입니다.
 *                              nickname:
 *                                  type: string
 *                                  description: 사용자의 닉네임입니다.
 *                          example:
 *                              id: cs2023
 *                              password: cs1234!@
 *                              email: cs2023@gnu.ac.kr
 *                              nickname: csman
 *          responses:
 *              "201":
 *                  description: 회원가입에 성공했습니다.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/MessageResponse'
 *                          example:
 *                              message: User Created
 *              "409":
 *                  description: 아이디 또는 닉네임 중복입니다. (닉네임 중복은 제거 될 수도?)
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/MessageResponse'
 *                          example:
 *                              message: Id already exists
 *              "500":
 *                  description: 내부 서버 오류입니다.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/MessageResponse'
 *                          example:
 *                              message: Internal server error
 */

/**
 * @swagger
 *  /users/changePassword:
 *      post:
 *          summary: 비밀번호 변경
 *          tags: [User]
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
 *                              id:
 *                                  type: string
 *                                  description: 비밀번호를 변경할 대상의 아이디입니다.
 *                              newPassword:
 *                                  type: string
 *                                  format: password
 *                                  description: 변경할 비밀번호입니다.
 *                      example:
 *                          id: cs2023
 *                          newPassword: newPW1234!@
 *          responses:
 *              "200":
 *                  description: 비밀번호가 변경되었습니다.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/MessageResponse'
 *                          example:
 *                              message: Password Changed
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
 *                          example:
 *                              message: Internal server error
 */

/**
 * @swagger
 *  /users/changeUserInfo:
 *      post:
 *          summary: 회원 정보 수정
 *          tags: [User]
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
 *                              newNickname:
 *                                  type: string
 *                                  description: 변경할 닉네임입니다.
 *                              newId:
 *                                  type: string
 *                                  description: 변경할 아이디입니다.
 *                              newPassword:
 *                                  type: string
 *                                  format: password
 *                                  description: 변경할 비밀번호입니다.
 *                      example:
 *                          newNickname: csman2023
 *                          newId: newcs2023
 *                          newPassword: newCS1234!
 *          responses:
 *              "200":
 *                  description: 회원 정보가 수정되었습니다. <br/><h5>예시의 토큰은 예시로 사용할 수 없습니다.</h5 >
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
 *                                  message:
 *                                      type: string
 *                                      description: 결과 메시지입니다.
 *                              example:
 *                                  accessToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QxMjM0IiwiZW1haWwiOiJ0ZXN0MTIzNEBleGFtcGxlLmNvbSIsIm5pY2tuYW1lIjoidGVzdGVyIiwiaWF0IjoxNjgxMjc5NjYzLCJleHAiOjE2ODEyODMyNjN9.z5ZdEap82SiWhJrRJEjY-H9xybEv9EN4N8YCelAvKAI
 *                                  refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QxMjM0IiwiZW1haWwiOiJ0ZXN0MTIzNEBleGFtcGxlLmNvbSIsIm5pY2tuYW1lIjoidGVzdDEyMzQiLCJpYXQiOjE2ODEyNzk2NjMsImV4cCI6MTY4MTg4NDQ2M30.fh-bKsm-VIrLIF3ydmIs248NofNraj6H36LHID3TGXY
 *                                  message: User info changed
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
 *                          example:
 *                              message: Internal server error
 */

/**
 * @swagger
 *  /users/deleteUser:
 *      post:
 *          summary: 회원 탈퇴
 *          tags: [User]
 *          parameters:
 *              - $ref: '#/components/parameters/AccessToken'
 *              - $ref: '#/components/parameters/RefreshToken'
 *          responses:
 *              "200":
 *                  description: 계정이 삭제되었습니다.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/MessageResponse'
 *                          example:
 *                              message: User deleted
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
 *                          example:
 *                              message: Internal server error
 */


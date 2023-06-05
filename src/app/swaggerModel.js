/**
 * @swagger
 *  components:
 *      parameters:
 *          AccessToken:
 *              in: header
 *              name: Authorization
 *              schema:
 *                  type: string
 *                  format: JWT
 *              required: true
 *              description: 로그인으로 발급받은 AccessToken을 입력합니다.<br/><br/>주의점&#58; `JWT {발급받은 토큰}` 형태로 작성해야 합니다
 *          RefreshToken:
 *              in: header
 *              name: refresh-token
 *              schema:
 *                  type: string
 *                  format: JWT
 *              required: true
 *              description: 로그인으로 발급받은 RefreshToken을 입력합니다.<br/><br/>주의점&#58; AccessToken과 다르게 바로 토큰을 입력합니다.
 *      schemas:
 *          MessageResponse:
 *              type: object
 *              properties:
 *                  message:
 *                      type: string
 *                      description: 성공 여부 또는 오류 메시지 및 오류 블럭 정보입니다.
 *              example:
 *                  message: Internal server error - Block N
 *          MemoRequest:
 *              type: object
 *              required:
 *                  - link
 *                  - title
 *                  - content
 *              properties:
 *                  link:
 *                      type: string
 *                      description: 링크입니다.
 *                  title:
 *                      type: string
 *                      description: 메모의 제목입니다.
 *                  content:
 *                      type: object
 *                      properties:
 *                          arr:
 *                              type: array
 *                              description: 메모의 모듈 정보입니다. 개별 아이템의 키와 값은 형태에 따라서 달라집니다.
 *                              items:
 *                                  type: object
 *                                  properties:
 *                                      type:
 *                                          type: string
 *                                          description: 모듈의 종류 코드입니다.
 *                                      value:
 *                                          type: any
 *                                          description: 모듈의 값입니다.
 *                      example:
 *                          type: 1
 *                          value: 구글입니다
 *                  folder_num:
 *                      type: number
 *                      description: 폴더 번호입니다. (Optional)
 *              example:
 *                  link: google.com
 *                  title: 구글
 *                  content: {arr: [{type: 1, value: 구글입니다}]}
 *          Memo:
 *              type: object
 *              properties:
 *                  memo_num:
 *                      type: number
 *                      description: 메모의 번호입니다.
 *                  owner:
 *                      type: number
 *                      description: 메모의 소유자 번호입니다.
 *                  link:
 *                      type: string
 *                      description: 메모에 저장된 링크입니다.
 *                  title:
 *                      type: string
 *                      description: 메모의 제목입니다.
 *                  content:
 *                      type: object
 *                      properties:
 *                          arr:
 *                              type: array
 *                              description: 메모의 모듈 정보입니다. 개별 아이템의 키와 값은 형태에 따라서 달라집니다.
 *                              items:
 *                                  type: object
 *                                  properties:
 *                                      type:
 *                                          type: string
 *                                          description: 모듈의 종류 코드입니다.
 *                                      value:
 *                                          type: any
 *                                          description: 모듈의 값입니다.
 *                  date_created:
 *                      type: timestamp
 *                      description: 메모가 생성된 시각입니다.
 *                  folder_num:
 *                      type: number
 *                      description: 메모가 포함된 폴더의 번호입니다.
 *                  folder_name:
 *                      type: string
 *                      description : 폴더의 이름입니다. 폴더 안에 들어있는 경우에만 해당 값이 존재합니다.
 *              example:
 *                  memo_num: 1
 *                  owner: 1
 *                  link: https://google.com
 *                  title: 구글
 *                  content: {arr: [{type: 1, value: 구글입니다}]}
 *                  date_created: 2023-04-07T03:02:40.374Z
 *                  folder_num: 1
 *                  folder_name: 포털사이트
 *          Image:
 *              type: object
 *              properties:
 *                  fieldname:
 *                      type: string
 *                      description: 입력 form 필드 이름입니다.
 *                  originalname:
 *                      type: string
 *                      description: 이미지 파일의 원래 이름입니다.
 *                  encoding:
 *                      type: string
 *                      description: 이미지 파일의 인코딩 종류입니다.
 *                  mimetype:
 *                      type: string
 *                      description: 업로드된 파일의 타입입니다.
 *                  destination:
 *                      type: string
 *                      description: 파일이 업로드된 경로입니다.
 *                  filename:
 *                      type: string
 *                      description: 이미지 파일이 서버에 저장된 실제 이름입니다.
 *                  path:
 *                      type: string
 *                      description: 이미지 파일의 상대 경로입니다.
 *                  size:
 *                      type: number
 *                      description: 이미지 파일의 크기입니다.
 *              example:
 *                  fieldname: img
 *                  originalname: next.png
 *                  encoding: 7bit
 *                  mimetype: image/png
 *                  destination: static/
 *                  filename: next_1681279699394.png
 *                  path: static/next_1681279699394.png
 *                  size: 2952
 *          Folder:
 *              type: object
 *              properties:
 *                  folder_num:
 *                      type: number
 *                      description: 폴더의 고유 번호입니다.
 *                  users_num:
 *                      type: number
 *                      description: 폴더를 소유한 유저 번호입니다.
 *                  name:
 *                      type: string
 *                      description: 폴더의 이름입니다.
 *                  thumbnail:
 *                      type: string
 *                      description: 썸네일 파일명입니다.
 *                  isLocked:
 *                      type: boolean
 *                      description: 잠금 여부입니다.
 *                  memoCount:
 *                      type: number
 *                      description: 폴더에 포함된 메모의 개수입니다.
 *              example:
 *                  folder_num: 5
 *                  users_num: 2
 *                  name: 여행기
 *                  thumbnail: picture_1681279699394.png
 *                  isLocked: true
 *                  memoCount: 3
 */
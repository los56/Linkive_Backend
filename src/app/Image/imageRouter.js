/**
 * @swagger
 *  tags:
 *      name: Image
 *      description: 이미지 APIs
 *
 */


const express = require('express');
const router = express.Router();

const imageController = require('./imageController');
const { jwtAuthorization } = require('../../../middlewares/jwtAuthorization');

const upload = require('./setMulter');

/**
 * @swagger
 *  /images/upload:
 *      post:
 *          summary: 이미지를 업로드합니다.
 *          tags: [Image]
 *          parameters:
 *              - $ref: '#/components/parameters/AccessToken'
 *              - $ref: '#/components/parameters/RefreshToken'
 *          requestBody:
 *              required: true
 *              content:
 *                  multi-part/form-data:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              img:
 *                                  type: string
 *                                  format: binary
 *                                  description: 이미지 파일 데이터입니다.
 *
 *          responses:
 *              "200":
 *                  description: 이미지 업로드에 성공했습니다. 업로드 정보를 반환합니다.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Image'
 *
 */
router.post('/upload', jwtAuthorization, upload.single('img'), imageController.upload);

/**
 * @swagger
 *  /images/delete:
 *      post:
 *          summary: 이미지를 삭제합니다. (사용 불가능)
 *          tags: [Image]
 *          description: 이미지를 삭제하는 기능으로 서버에서만 요청할 수 있습니다.<br/><br/>글 삭제, 업로드 취소 등의 이벤트가 발생하였을 때 실행되도록 작업할 예정입니다.
 */
router.post('/delete', imageController.delete);

module.exports = router;
const { Router } = require('express');
const db = require('/Users/Luciana/Desktop/appStore/main/db.js');
const auth = require('/Users/Luciana/Desktop/appStore/main/auth.js');
const bodyParser = require('body-parser')

const router = Router();

router.use(bodyParser.json())
router.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

router.get('/apps/:id', auth.authenticateToken, db.getAppsByUser)
router.post('/login', db.login)
router.get('/allapps/:category', db.getAllApps)
router.post('/signIn', db.signIn)
router.post('/apps', auth.authenticateToken, db.createApp)
router.post('/buy', auth.authenticateToken, db.buy)

router.put('/apps/:id', auth.authenticateToken, db.updateApp)

router.delete('/apps/:id', auth.authenticateToken, db.deleteApp)

module.exports = router;
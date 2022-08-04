const router = express.Router()
const { isAuthenticated } = require('../middlewares/authMiddleware')

router.get('/:comment_id/replies', isAuthenticated, async (req, res) => {
    
})
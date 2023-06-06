const jwt = require("jsonwebtoken");

module.exports.authenticate = async function AuthenticateToken (req, res, next)  {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (!authHeader) {
        return res.json({ message: 'Missing token' , status: 401});
    }

    let token = authHeader.split(" ")[1]

    try {
      const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY)
      req.user = decoded
      next()
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' , data: error});
    }
}

module.exports.verifyRestaurantManager = function(req, res, next){
     // Check if the decoded token contains the necessary user information or permissions
     if (req.user.role !== 'RESTAURANT_MANAGER') {
        return res.status(403).json({ message: 'Unauthorized access' });
      }
      next()
}

module.exports.verifyClient = function (req, res, next){
    // Check if the decoded token contains the necessary user information or permissions
    if (req.user.role !== 'CLIENT') {
        return res.status(403).json({ message: 'Unauthorized access' });
    }
    next()
}
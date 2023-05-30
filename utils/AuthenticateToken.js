const jwt = require("jsonwebtoken");

export function AuthenticateToken (req, res, next)  {
    const authHeader = req.headers.get('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token == null) return res.status(401)

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) return res.status(401).json({ message: 'Invalid Token' })
        req.user = user
        next()
    })
}
const User = require('../modles/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res, next) => {
    
    const { name, email, password } = req.body;
    try{
        const existingUser = await User.findOne({ where: { email: email }});
        if(existingUser){
            // console.log('User already exists');
            return res.status(403).json({ error: "User already exists "});
        }

        bcrypt.hash(password, 10, async (err, hash) => {
            console.log(err);
            await User.create({ name, email, password: hash })
            res.status(201).json({ message: "Successfully created new user"});
        })
    }catch(err){
        res.status(500).json({ error: err.message });
    }
};

function generateAccessToken(id){
    return jwt.sign({ userId: id}, '843273bf3e1d8904e2b038c99ef055e07bbc91a822d3ca2633777fe91bdc4dd1ba30ad7b01d4d92223487a198a6abf6b476131e4f126b42000705b2e0b158b847874dd476ab901ce04ebcd6f752e9dcded31d9dfeff6383142a24a62a04cdcdde14c5ea02eb4a893e1931684bb5b8a57f556807b98fb9e7ec0b31527fa569d86b40aedb03d9ddadbc4255e9d6f1f1ec19d54ae017312fccd42755cc3dae3fe784f519558400f228c9c68633514b1b5bf4df1e33be1671f1c10ac8f7b595a0a40bc9d023049d54adb11c9730bc29a5493d7ad44ce11ba7d64928836cd32805512c1a120794209d40107e4ffe72298a50f7185cf753a0297630aeb68fb588f99db')
}

exports.loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Password is incorrect" });
        }
        
        res.status(200).json({ message: "Login successful" , token: generateAccessToken(user.id)});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


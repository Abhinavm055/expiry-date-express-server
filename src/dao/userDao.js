const User = require('../models/user');

const userDao = {
    findByEmail: async (email) => {
        const user = await User.findOne({ email });
        return user;
    },
    createUser: async (userData) => {
        const user = new User(userData);
        await user.save();
        return user;
    }
};

module.exports = userDao;

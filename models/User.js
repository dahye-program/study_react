const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxLength: 50
    },
    email: {
        type: String,
        trim: true, // space(빈칸을 없애주는 역할)
        unique: 1 // 중복 X
    },
    password: {
        type: String,
        minLength: 5
    },
    lastname: {
        type: String,
        maxLength: 50
    },
    role: { // 관리자, 일반 유저 존재
        type: Number,
        default: 0
    },
    image: String,
    token: { // 토큰 => 유효성 검증
        type: String
    },
    tokenExp: { // 토큰 유효기간
        type:Number
    }
})

const User = mongoose.model('User', userSchema)
module.exports = {User} // 다른 파일에서도 쓸 수 있게
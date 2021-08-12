const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const config = require('./config/key')

const {User} = require("./models/User")

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// application/json => json타입으로 된 데이터를 분석해서 가져올 수 있도록
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(()=> console.log('MongoDB Connected,,, '))
    .catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/register', (req, res)=> {
    // 회원가입할 때 필요한 정보들을 client에서 가져와서
    // DB에 삽입

    const user = new User(req.body)
    // save하기 전 비밀번호 암호화

    user.save((err, doc) => {
        if(err) return res.json({success: false, err})
        return res.status(200).json({success: true}) //200 => 성공
    })
})

app.post('/login', (req, res)=>{
    // 요청된 이메일 DB에 있는지 찾기
    User.findOne({ email: req.body.email}, (err, user)=>{
        if(!user){
            return res.json({
                loginSuccess: false,
                message: "없는 이메일 입니다."
            })
        }
    })
    // 요청된 이메일이 DB에 있다면 비밀번호가 맞는지 확인
    user.comparePassword(res.body.password, (err, isMatch)=>{
        if(!isMatch)
            return res.json({loginSuccess: false, message: "비밀번호가 틀렸습니다."})

        // 비밀번호가 일치하면, 토큰 생성
        user.generateToken((err, user) => {
            if(err) return res.status(400).send(err);
            // 토큰 저장 => 쿠키 or 로컬스토리지
            res.cookie("x_auth", user.token)
                .status(200)
                .json({loginSuccess: true, userId: user._id})

        })
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

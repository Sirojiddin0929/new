import 'dotenv/config'

export const config={
    jwt:{
        accessSecret:process.env.JWT_ACCESS_SECRET,
        refreshSecret:process.env.JWT_REFRESH_SECRET
    },
    app:{port:process.env.PORT},
    db:{url:process.env.MONGO_URI},
    session: {secret: process.env.session_secret}
}
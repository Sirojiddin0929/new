import {connect} from 'mongoose'
import { config } from '../config/index.js'

const db_url=config.db.url

export async function dbconnect() {
    try{
        await connect(db_url)

    }catch(error){
        throw new Error(error)
    }
    
}
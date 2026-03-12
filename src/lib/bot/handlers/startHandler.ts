import { db } from "@/lib/db"
import { sendTelegram } from "../utils"
import { showUserDashboard } from "../pages/user/dashboard"
import { showAdminDashboard } from "../pages/admin/dashboard"

export async function handleStart(chatId:number){

 const user = await db.user.findUnique({
   where:{ telegramId:String(chatId) }
 })

 if(!user){

  const authBtns={
   inline_keyboard:[
    [
     {text:"🔐 Login",callback_data:"auth_login"},
     {text:"📝 Register",callback_data:"auth_register"}
    ]
   ]
  }

  return sendTelegram(chatId,"Welcome! Please login.",authBtns)
 }

 if(user.role==="ADMIN"){
  return showAdminDashboard(chatId,user)
 }

 return showUserDashboard(chatId,user)
}
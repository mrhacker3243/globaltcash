import { showFinancePage } from "../pages/user/finance"
import { showWithdrawPage } from "../pages/user/withdrawals"

export async function handleFinanceCallbacks(chatId:number,data:string,user:any){

 if(data==="page_deposit"){
  return showFinancePage(chatId,user,"deposit")
 }

 if(data==="page_withdraw"){
  return showWithdrawPage(chatId,user)
 }

}
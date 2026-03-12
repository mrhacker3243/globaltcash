import { showPendingDeposits,viewPendingDeposit,handleDepositApproval } from "../pages/admin/deposits"

export async function handleAdminCallbacks(chatId:number,data:string){

 if(data==="admin_pending_deposits"){
   return showPendingDeposits(chatId)
 }

 if(data.startsWith("view_dep_")){
   const id=data.replace("view_dep_","")
   return viewPendingDeposit(chatId,id)
 }

 if(data.startsWith("approve_dep_")){
   const id=data.replace("approve_dep_","")
   return handleDepositApproval(chatId,id,"APPROVED")
 }

 if(data.startsWith("reject_dep_")){
   const id=data.replace("reject_dep_","")
   return handleDepositApproval(chatId,id,"REJECTED")
 }

}
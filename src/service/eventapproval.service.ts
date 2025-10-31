import { Events } from "@prisma/client";

export interface EventApprovalService {
    approveEvent(adminId:number, eventId:number, decision: 'APPROVED' | 'REJECTED', message?: string):Promise<Events>;
};
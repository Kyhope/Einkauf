import { ObjectUnsubscribedError } from 'rxjs';

export interface Person {
    personId: string;
    name: string;
    paidAmount: number;
    selfAmount: number;
    balance?: number;
    groupAmount: number;
}

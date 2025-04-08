import {atom} from "jotai/index";

export interface ApplianceInterface {
    id: string;
    power:number;
    hours:number;
}

export const applianceAtom = atom<ApplianceInterface[]>([]);
/**
 * [
 * {
 *  id:minibar,
 *  power:60,
 *  hours:6
 * },
 * {
 *  id:cellphone,
 *  power:18,
 *  hours:8
 * },
 * ]
 */
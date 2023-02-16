import {z} from 'zod'
import {UserNameAndAvatar} from '@vexl-next/domain/dist/general/UserNameAndAvatar.brand'
import E164PhoneNumber from '@vexl-next/domain/dist/general/E164PhoneNumber.brand'
import {SessionCredentials} from './SessionCredentials.brand'

export const Session = z
  .object({
    version: z.number().int().positive(),
    realUserData: UserNameAndAvatar,
    anonymizedUserData: UserNameAndAvatar,
    phoneNumber: E164PhoneNumber,
    sessionCredentials: SessionCredentials,
  })
  .brand<'Session'>()
export type Session = z.TypeOf<typeof Session>

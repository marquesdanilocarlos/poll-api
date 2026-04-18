import Account from '@/domain/Account'

export type CreateAccountInput = {
    name: string
    email: string
    password: string
}

export default interface CreateAccount {
    execute(account: CreateAccountInput): Promise<Account>
}
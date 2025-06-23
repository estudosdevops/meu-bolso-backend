import { container } from "tsyringe";

import IUserRepository from "../repositories/user/interfaces/IUserRepository";
import UserRepository from "../repositories/user/userRepository";

import IBankAccountRepository from "../repositories/bankAccount/interfaces/IBankAccountRepository";
import BankAccountRepository from "../repositories/bankAccount/BankAccountRepository";

import IBankRepository from "../repositories/bank/interfaces/IBankRepository";
import BankRepository from "../repositories/bank/BankRepository";

import IExpensesRepository from "../repositories/expenses/interfaces/IExpensesRepository";
import ExpensesRepository from "../repositories/expenses/ExpensesRepository";

// Repositories
container
    .register<IUserRepository>("IUserRepository", {
        useClass: UserRepository,
    })
    .register<IBankAccountRepository>("IBankAccountRepository", {
        useClass: BankAccountRepository,
    })
    .register<IBankRepository>("IBankRepository", {
        useClass: BankRepository,
    })
    .register<IExpensesRepository>("IExpensesRepository", {
        useClass: ExpensesRepository,
    });

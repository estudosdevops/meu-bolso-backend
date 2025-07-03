import { container } from "tsyringe";

import IUserRepository from "../repositories/user/interfaces/IUserRepository";
import UserRepository from "../repositories/user/userRepository";

import IBankAccountRepository from "../repositories/bankAccount/interfaces/IBankAccountRepository";
import BankAccountRepository from "../repositories/bankAccount/BankAccountRepository";

import IBankRepository from "../repositories/bank/interfaces/IBankRepository";
import BankRepository from "../repositories/bank/BankRepository";

import IExpensesRepository from "../repositories/expenses/interfaces/IExpensesRepository";
import ExpensesRepository from "../repositories/expenses/ExpensesRepository";

import IExpenseCategoryRepository from "../repositories/expenseCategory/interfaces/IExpenseCategoryRepository";
import ExpenseCategoryRepository from "../repositories/expenseCategory/ExpenseCategoryRepository";

import ITransactionRepository from "../repositories/transaction/interfaces/ITransactionRepository";
import { TransactionRepository } from "../repositories/transaction/TransactionRepository";

import AuthRepository from "../repositories/auth/AuthRepository";
import IAuthRepository from "../repositories/auth/interfaces/IAuthRepository";

// Repositories
container
    .register<IUserRepository>("IUserRepository", UserRepository)
    .register<IBankAccountRepository>(
        "IBankAccountRepository",
        BankAccountRepository,
    )
    .register<IBankRepository>("IBankRepository", BankRepository)
    .register<IExpensesRepository>("IExpensesRepository", ExpensesRepository)
    .register<IExpenseCategoryRepository>(
        "IExpensesCategoryRepository",
        ExpenseCategoryRepository,
    )
    .register<ITransactionRepository>(
        "ITransactionRepository",
        TransactionRepository,
    )
    .register<IAuthRepository>("IAuthRepository", AuthRepository);

// Services
import UserService from "../services/user/UserService";
import IUserService from "../services/user/interfaces/IUserService";

import IAuthService from "../services/auth/interfaces/IAuthService";
import AuthService from "../services/auth/AuthService";

import IBankService from "../services/bank/interfaces/IBankService";
import BankService from "../services/bank/BankService";

container
    .register<IUserService>("IUserService", UserService)
    .register<IAuthService>("IAuthService", AuthService)
    .register<IBankService>("IBankService", BankService);

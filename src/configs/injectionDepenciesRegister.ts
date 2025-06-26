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
    );

// Services
import UserService from "../services/user/UserService";
import IUserService from "../services/user/interfaces/IUserService";

container.register<IUserService>("IUserService", UserService);

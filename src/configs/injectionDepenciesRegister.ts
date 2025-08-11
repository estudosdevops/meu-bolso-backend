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
import TransactionRepository from "../repositories/transaction/TransactionRepository";

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

import IBankAccountService from "../services/bankAccount/interfaces/IBankAccountService";
import BankAccountService from "../services/bankAccount/BankAccountService";

import ITransactionService from "../services/transaction/interfaces/ITransactionService";
import TransactionService from "../services/transaction/TransactionService";

import IExpenseCategoryService from "../services/expense/interfaces/IExpenseCategoryService";
import ExpenseCategoryService from "../services/expense/ExpenseCategoryService";

import IExpenseService from "../services/expense/interfaces/IExpenseService";
import ExpenseService from "../services/expense/ExpenseService";

container
    .register<IUserService>("IUserService", UserService)
    .register<IAuthService>("IAuthService", AuthService)
    .register<IBankService>("IBankService", BankService)
    .register<IBankAccountService>("IBankAccountService", BankAccountService)
    .register<ITransactionService>("ITransactionService", TransactionService)
    .register<IExpenseService>("IExpenseService", ExpenseService)
    .register<IExpenseCategoryService>(
        "IExpenseCategoryService",
        ExpenseCategoryService,
    );

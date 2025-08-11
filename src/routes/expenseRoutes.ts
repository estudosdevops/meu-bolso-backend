import { container } from "tsyringe";
import { Request, Response, Router } from "express";
import { validationMiddleware } from "../middlewares/validationRequestMiddleware";

import ExpenseController from "../controllers/ExpenseController";
import ExpenseCategoryDto from "../models/expenses/ExpenseCategoryDto";
import ExpensesDto from "../models/expenses/ExpensesDto";

const router = Router();

const expenseController = container.resolve(ExpenseController);

// Categories Routes
router.get("/:userId/categories", (req: Request, res: Response) =>
    expenseController.GetAllExpensesCategory(req, res),
);

router.get("/:userId/categories/:id", (req: Request, res: Response) =>
    expenseController.GetExpenseCategoryPerId(req, res),
);

router.post(
    "/:userId/categories",
    validationMiddleware(ExpenseCategoryDto),
    (req: Request, res: Response) =>
        expenseController.CreateExpenseCategory(req, res),
);

router.put(
    "/:userId/categories/:id",
    validationMiddleware(ExpenseCategoryDto),
    (req: Request, res: Response) =>
        expenseController.UpdateExpenseCategory(req, res),
);

router.delete("/categories/:id", (req: Request, res: Response) =>
    expenseController.DeleteExpenseCategory(req, res),
);

// Expenses Routes

router.get("/all/:userId", (req: Request, res: Response) =>
    expenseController.GetAllExpenses(req, res),
);

router.get("/:userId/:id", (req: Request, res: Response) =>
    expenseController.GetExpensePerId(req, res),
);

router.post(
    "/:userId",
    validationMiddleware(ExpensesDto),
    (req: Request, res: Response) => expenseController.CreateExpense(req, res),
);

router.put(
    "/:userId/:id",
    validationMiddleware(ExpensesDto),
    (req: Request, res: Response) => expenseController.UpdateExpense(req, res),
);

router.delete("/:id", (req: Request, res: Response) =>
    expenseController.DeleteExpense(req, res),
);

export default router;

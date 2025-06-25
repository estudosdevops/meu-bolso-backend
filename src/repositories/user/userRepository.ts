import { User } from "@prisma/client";
import UserDto from "../../models/user/UserDto";
import IUserRepository from "./interfaces/IUserRepository";
import prisma from "../../configs/db/prisma";

export default class UserRepository implements IUserRepository {
    private readonly _prisma = prisma;

    async GetPerId(id: string): Promise<User | null> {
        return await this._prisma.user.findUnique({
            where: {
                id,
                active: true,
            },
        });
    }

    async GetPerMail(email: string): Promise<User | null> {
        return await this._prisma.user.findUnique({
            where: {
                email,
                active: true,
            },
        });
    }

    async Create(data: UserDto): Promise<User> {
        return await this._prisma.user.create({
            data,
        });
    }

    async Update(data: UserDto, id: string): Promise<User> {
        return await this._prisma.user.update({
            where: {
                id,
                active: true,
            },
            data: {
                ...data,
                updatedAt: Date.now().toString(),
            },
        });
    }

    async Delete(id: string): Promise<void> {
        await this._prisma.user.update({
            where: { id, active: true },
            data: {
                active: false,
                updatedAt: Date.now().toString(),
            },
        });
    }
}

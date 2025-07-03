import { User } from "@prisma/client";
import UserDto from "../../models/user/UserDto";
import IUserRepository from "./interfaces/IUserRepository";
import prisma from "../../configs/db/prisma";
import UserWithoutPassDto from "../../models/user/UserWithoutPassDto";

export default class UserRepository implements IUserRepository {
    private readonly _prisma = prisma;

    private readonly defaultBanks = [
        {
            name: "Nubank",
            ispb: "18236120",
            compe: 260,
        },
        {
            name: "Itaú",
            ispb: "60701190",
            compe: 341,
        },
    ];

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
            data: {
                name: data.name,
                cpf: data.cpf,
                email: data.email,
                auth: {
                    create: {
                        password: data.password,
                    },
                },
                banks: {
                    create: [...this.defaultBanks],
                },
            },
        });
    }

    async Update(data: UserWithoutPassDto, id: string): Promise<User> {
        return await this._prisma.user.update({
            where: {
                id,
                active: true,
            },
            data: {
                ...data,
                updatedAt: new Date(Date.now()),
            },
        });
    }

    async Delete(id: string): Promise<void> {
        await this._prisma.user.update({
            where: { id, active: true },
            data: {
                active: false,
                updatedAt: new Date(Date.now()),
            },
        });
    }
}

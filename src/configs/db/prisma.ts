import { PrismaClient } from "@prisma/client";

class Prisma extends PrismaClient {
    constructor() {
        super();
        this.Initialize();
    }

    async Initialize(): Promise<void> {
        await this.$connect();
    }
}

const prisma = new Prisma();

export default prisma;

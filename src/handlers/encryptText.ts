import { compare, hash, genSalt } from "bcrypt";

export async function encryptText(plainText: string): Promise<string> {
    const salt_rounds = 10;

    const salt = await genSalt(salt_rounds);

    return await hash(plainText, salt);
}

export async function compareTextWithHash(
    plainText: string,
    hash: string,
): Promise<boolean> {
    return await compare(plainText, hash);
}

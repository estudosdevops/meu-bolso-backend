import AuthResponse from "../../../models/auth/AuthResponse";

export default interface IAuthService {
    Login(email: string, password: string): Promise<AuthResponse>;
}

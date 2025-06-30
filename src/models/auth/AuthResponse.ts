export default class AuthResponse {
    constructor(
        public accessToken: string,
        public refreshToken: string,
        public expiration: number,
    ) {}
}

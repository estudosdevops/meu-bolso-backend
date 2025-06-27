export default class AuthResponse {
    constructor(
        public token: string,
        public refresh_token: string,
        public expiration: number,
    ) {}
}

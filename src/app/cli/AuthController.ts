import * as Auth from '../../core/auth'

export class AuthController {
    private authService: Auth.Service;
    
    constructor(authService: Auth.Service) {
        this.authService = authService;
    }
    
    public async login(username: string) {
        try {
            const res = await this.authService.login(username);
            console.log(`Hello, ${res.username}!`);
            console.log(`Your balance is $${res.balance}`);
            if (res.owedTo != "" && res.owedToAmount != 0) {
            console.log(`Owed $${res.owedToAmount} to ${res.owedTo}`);
            }
            if (res.owedFrom != "" && res.owedFromAmount != 0) {
            console.log(`Owed $${res.owedFromAmount} from ${res.owedFrom}`);
            }
        } catch (err) {
            console.error('error during login', err.message);
            throw err;
        }
    }
}
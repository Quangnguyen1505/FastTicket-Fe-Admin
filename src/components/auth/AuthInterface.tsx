interface Shop {
    id: string;
}

interface Token {
    accessToken: string;
    refreshToken: string;
}

interface UserAndToken {
    shop: Shop;
    tokens: Token;
}
  
export interface LoginResponse {
    message: string;
    metadata: UserAndToken;
    status: boolean;
}

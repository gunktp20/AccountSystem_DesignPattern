import AccessToken from "../token/accessToken.mjs";
import RefreshToken from "../token/RefreshToken.mjs";

export default class JWTFactory {
    static verifyToken(type,token) {
      switch (type) {
        case 'access':
          return new AccessToken(token);
  
        case 'refresh':
          return new RefreshToken(token);
  
      }
    }
  }
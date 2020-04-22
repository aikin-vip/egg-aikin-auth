import {OAuth2Server} from "./oauth-server";
import {Model} from "./oauth-server/lib/interfaces";

declare module 'egg' {

    interface Application {
        oauth: OAuth2Server;
    }

    interface Context {
        user: {
            uid: number,
            type: 0 | 1 | number,
            [key: string]: any
        } | undefined;
    }

    interface EggAppConfig {
        authRouter: {
            userTokenPath: string,
            adminTokenPath: string,
        },
        auth: {
            alwaysIssueNewRefreshToken?: boolean,
            accessTokenLifetime?: number,
            model?: Model,
            refreshTokenLifetime?: number;
        }
    }
}

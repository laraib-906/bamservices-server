import { Routes } from "nest-router";
import { AuthModule } from "src/server/api/auth/auth.module";
import { UserModule } from "src/server/api/user/user.module";
import { FilesModule } from "../api/files/files.module";

export const routes: Routes = [
    {
        path: '/auth',
        module: AuthModule
    },
    {
        path: '/user',
        module: UserModule 
    },
    {
        path: '/file',
        module: FilesModule 
    }
]
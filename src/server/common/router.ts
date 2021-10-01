import { Routes } from "nest-router";
import { AuthModule } from "src/server/api/auth/auth.module";
import { UserModule } from "src/server/api/user/user.module";
import { CustomerModule } from "../api/customer/customer.module";
import { PaymentModule } from "../api/payment/payment.module";

export const routes: Routes = [
    {
        path: '/auth',
        module: AuthModule
    },
    {
        path: '/user',
        module: UserModule 
    }
]
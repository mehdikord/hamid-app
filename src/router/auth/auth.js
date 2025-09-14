import Auth from "@/views/auth/Auth.vue";

const Auth_Routes = [
    {
        path : "/auth",
        name : 'auth',
        component : Auth,
        meta: { title: 'ورود به سیستم' }
    }
];

export default Auth_Routes;
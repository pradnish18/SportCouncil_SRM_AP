// Secret should be in .env but for local development we can mock
export const authConfig = {
    providers: [], // NextAuth providers go here
    pages: {
        signIn: "/admin/login",
    },
};

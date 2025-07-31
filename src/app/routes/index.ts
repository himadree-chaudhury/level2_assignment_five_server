import { Router } from "express";

export const router = Router();

const moduleRoutes = [
    {
        path: "/",
        route: 
    },
];

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
})
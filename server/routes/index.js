import userRoutes from './users.js';

const constructorMethod = (app) => {
    app.use("/user", userRoutes);

    app.use("*", (req, res) => {
        const errorMessage = `404 Error: Route not Found`;
        res.status(404).json({error: errorMessage});
    })
}

export default constructorMethod;
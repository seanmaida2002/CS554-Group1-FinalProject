import userRoutes from './users.js';
import eventRoutes from './events.js';

const constructorMethod = (app) => {
    app.use("/user", userRoutes);
    app.use("/events", eventRoutes);

    app.use("*", (req, res) => {
        const errorMessage = `404 Error: Route not Found`;
        res.status(404).json({error: errorMessage});
    })
}

export default constructorMethod;
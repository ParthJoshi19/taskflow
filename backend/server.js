import express from 'express';
import { config } from 'dotenv';
import connectDB from './db/db.js'
import cors from 'cors';
import userRoute from './routes/user.routes.js'
import taskRoute from './routes/tasks.routes.js'
import organizationRoute from './routes/organizations.routes.js'
config();
const app = express();
const PORT = process.env.PORT || 3000;

connectDB(process.env.MONGODB_URI);

app.get('/', (req, res) => {
    res.send('Hello from Express backend!');
});
app.use(express.json());
app.use(cors({
  origin: '*'
}));


app.use('/user',userRoute)
app.use('/tasks',taskRoute)
app.use('/organization',organizationRoute)
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
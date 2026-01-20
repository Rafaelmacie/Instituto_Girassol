import { app } from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT: number | string = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
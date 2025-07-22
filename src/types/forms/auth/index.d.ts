import type { InferType } from 'yup';
import type { loginFormSchema } from '~/util/forms/loginForm';

type LoginFormSchema = InferType<typeof loginFormSchema>;

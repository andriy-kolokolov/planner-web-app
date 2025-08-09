import type { InferType } from 'yup';
import type { loginFormSchema } from '~/util/forms/loginForm';
import type { registerFormSchema } from '~/util/forms/registerForm';

type LoginFormSchema = InferType<typeof loginFormSchema>;
type RegisterFormSchema = InferType<typeof registerFormSchema>;

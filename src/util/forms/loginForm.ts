import { object, string } from 'yup';
import type { LoginFormSchema } from '~/types/forms/auth';
import { useForm } from '~/composables/useForm';

export const loginFormSchema = object({
  username: string().required('Username is required'),
  password: string().required('Password is required'),
});

export const loginForm = useForm<LoginFormSchema>({
  username: '',
  password: '',
});

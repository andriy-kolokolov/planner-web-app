import { object, string } from 'yup';
import type { LoginFormSchema } from '~/types/forms/auth';
import { useForm } from '~/composables/useForm';

export const loginFormSchema = object({
  email: string().required('Email is required'),
  password: string().required('Password is required'),
});

export const loginForm = useForm<LoginFormSchema>({
  email: '',
  password: '',
});

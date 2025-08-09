import { object, string } from 'yup';
import type { RegisterFormSchema } from '~/types/forms/auth';
import { useForm } from '~/composables/useForm';

export const registerFormSchema = object({
  name: string().required('Name is required'),
  lastname: string(),
  email: string().required('Email is required'),
  password: string().required('Password is required'),
});

export const registerForm = useForm<RegisterFormSchema>({
  name: '',
  lastname: '',
  email: '',
  password: '',
});

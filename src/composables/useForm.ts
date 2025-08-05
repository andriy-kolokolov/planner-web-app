// composables/useForm.ts
import { reactive } from 'vue';
import type { AxiosError, AxiosResponse } from 'axios';

interface FormOptions<T = any> {
  resetOnSuccess?: boolean;
  forceUrlEncoded?: boolean;
  onBefore?: () => void;
  onStart?: () => void;
  onSuccess?: (response: AxiosResponse<T>) => void;
  onError?: (errors: any) => void;
  onFinish?: () => void;
}

export function useForm<T extends Record<string, any>>(initialData: T) {
  // Create a deep copy to preserve initial state
  const initialState = JSON.parse(JSON.stringify(initialData));

  // Create a reactive proxy that combines data and form methods
  const form = reactive({
    // Spread initial data directly on the form object
    ...initialData,

    // Form state
    errors: {} as Record<string, string | string[]>,
    hasErrors: false,
    processing: false,
    wasSuccessful: false,
    recentlySuccessful: false,

    // Methods
    clearErrors(...fields: string[]) {
      if (fields.length === 0) {
        this.errors = {};
        this.hasErrors = false;
      } else {
        fields.forEach((field) => delete this.errors[field]);
        this.hasErrors = Object.keys(this.errors).length > 0;
      }
    },

    setError(field: string, value: string | string[]) {
      this.errors[field] = value;
      this.hasErrors = true;
    },

    reset(...fields: (keyof T)[]) {
      if (fields.length === 0) {
        // Reset all data fields
        Object.keys(initialState).forEach((key) => {
          (this as any)[key] = initialState[key];
        });
      } else {
        fields.forEach((field) => {
          (this as any)[field] = initialState[field as string];
        });
      }
    },

    getData() {
      // Extract only the data fields (not methods or state)
      const data: any = {};
      Object.keys(initialState).forEach((key) => {
        data[key] = (this as any)[key];
      });
      return data;
    },

    // composables/useForm.ts - Updated submit method
    async submit<R = any>(
      method: 'get' | 'post' | 'put' | 'patch' | 'delete',
      url: string,
      options: FormOptions<R> = {},
    ): Promise<AxiosResponse<R> | undefined> {
      const {
        resetOnSuccess = false,
        forceUrlEncoded = false,
        onBefore,
        onStart,
        onSuccess,
        onError,
        onFinish,
      } = options;

      try {
        onBefore?.();

        this.wasSuccessful = false;
        this.recentlySuccessful = false;
        this.clearErrors();
        this.processing = true;

        onStart?.();

        const data = this.getData();
        let requestData: any = data;
        const headers: Record<string, string> = {};

        if (forceUrlEncoded) {
          const params = new URLSearchParams();
          Object.keys(data).forEach((key) => {
            if (data[key] !== null && data[key] !== undefined) {
              params.append(key, String(data[key]));
            }
          });
          requestData = params.toString();
          headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }

        const response = await useNuxtApp().$axios<R>({
          method,
          url,
          data: method !== 'get' ? requestData : undefined,
          params: method === 'get' ? data : undefined,
          headers,
        });

        this.wasSuccessful = true;
        this.recentlySuccessful = true;

        setTimeout(() => {
          this.recentlySuccessful = false;
        }, 2000);

        if (resetOnSuccess) {
          this.reset();
        }

        onSuccess?.(response);
        return response;

      } catch (error) {
        try {
          // Safely handle axios errors
          const axiosError = error as AxiosError<any>;

          if (axiosError.response?.status === 422) {
            const detail = axiosError.response.data?.detail;
            if (Array.isArray(detail)) {
              detail.forEach((err: any) => {
                const field = err.loc?.[1] || err.field;
                if (field) {
                  this.setError(field, err.msg || err.message);
                }
              });
            }
          }

          // Safely call onError callback
          if (onError) {
            onError(axiosError.response?.data || axiosError);
          } else {
            console.error('Form submission error:', error);
            // throw error;
          }
        } catch (callbackError) {
          // Handle errors in the onError callback
          console.error('Error in form error callback:', callbackError);
          console.error('Original form error:', error);
        }
      } finally {
        this.processing = false;
        onFinish?.();
      }
    },

    // Convenience methods with proper typing
    get<R = any>(url: string, options?: FormOptions<R>) {
      return this.submit<R>('get', url, options);
    },

    post<R = any>(url: string, options?: FormOptions<R>) {
      return this.submit<R>('post', url, options);
    },

    put<R = any>(url: string, options?: FormOptions<R>) {
      return this.submit<R>('put', url, options);
    },

    patch<R = any>(url: string, options?: FormOptions<R>) {
      return this.submit<R>('patch', url, options);
    },

    delete<R = any>(url: string, options?: FormOptions<R>) {
      return this.submit<R>('delete', url, options);
    },
  });

  return form;
}
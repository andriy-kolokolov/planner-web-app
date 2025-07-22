// composables/useForm.ts
import { reactive, toRaw } from 'vue';
import apiClient from '~/api/apiClient';
import type { AxiosError, AxiosResponse } from 'axios';

interface FormOptions {
  resetOnSuccess?: boolean;
  forceUrlEncoded?: boolean;
  onBefore?: () => void;
  onStart?: () => void;
  onSuccess?: (response: AxiosResponse) => void;
  onError?: (errors: any) => void;
  onFinish?: () => void;
}

interface ValidationErrors {
  [key: string]: string | string[];
}

export function useForm<T extends Record<string, any>>(initialData: T) {
  // Create a deep copy to preserve initial state
  const initialState = JSON.parse(JSON.stringify(initialData));

  // Create a reactive proxy that combines data and form methods
  const form = reactive({
    // Spread initial data directly on the form object
    ...initialData,

    // Form state
    errors: {} as ValidationErrors,
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

    async submit(
      method: 'get' | 'post' | 'put' | 'patch' | 'delete',
      url: string,
      options: FormOptions = {},
    ): Promise<AxiosResponse | undefined> {
      /**
       * Summary; if you have binary (non-alphanumeric) data
       * (or a significantly sized payload) to transmit,
       * use multipart/form-data.
       * Otherwise, use application/x-www-form-urlencoded.
       */

      const {
        resetOnSuccess = false,
        forceUrlEncoded = false, // to use with OAuth2 authentication
        onBefore,
        onStart,
        onSuccess,
        onError,
        onFinish,
      } = options;

      // Call onBefore hook
      onBefore?.();

      // Reset state
      this.wasSuccessful = false;
      this.recentlySuccessful = false;
      this.clearErrors();

      // Set processing state and call onStart
      this.processing = true;
      onStart?.();

      try {
        // Get raw data
        const data = this.getData();

        // Prepare request config
        let requestData: any = data;
        const headers: Record<string, string> = {};

        // Handle URL encoding for OAuth2
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

        const response = await apiClient({
          method,
          url,
          data: method !== 'get' ? requestData : undefined,
          params: method === 'get' ? data : undefined,
          headers,
        });

        // Handle success
        this.wasSuccessful = true;
        this.recentlySuccessful = true;

        // Clear recently successful after 2 seconds
        setTimeout(() => {
          this.recentlySuccessful = false;
        }, 2000);

        // Reset form if requested
        if (resetOnSuccess) {
          this.reset();
        }

        onSuccess?.(response);

        return response;
      } catch (error) {
        const axiosError = error as AxiosError<any>;

        // Handle validation errors (422)
        if (axiosError.response?.status === 422) {
          const detail = axiosError.response.data?.detail;

          if (Array.isArray(detail)) {
            // Handle FastAPI style errors
            detail.forEach((err: any) => {
              const field = err.loc?.[1] || err.field;
              if (field) {
                this.setError(field, err.msg || err.message);
              }
            });
          }
        }

        onError?.(axiosError.response?.data || axiosError);

        // Only throw if no error handler provided
        if (!onError) {
          throw error;
        }
      } finally {
        this.processing = false;
        onFinish?.();
      }
    },

    // Convenience methods
    get(url: string, options?: FormOptions) {
      return this.submit('get', url, options);
    },

    post(url: string, options?: FormOptions) {
      return this.submit('post', url, options);
    },

    put(url: string, options?: FormOptions) {
      return this.submit('put', url, options);
    },

    patch(url: string, options?: FormOptions) {
      return this.submit('patch', url, options);
    },

    delete(url: string, options?: FormOptions) {
      return this.submit('delete', url, options);
    },
  });

  return form;
}
